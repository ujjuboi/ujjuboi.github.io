import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join, resolve, dirname } from 'node:path';
import { rm, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '../../..');
const RESULTS_DIR = join(__dirname, 'results');
const SCREENSHOTS_DIR = join(RESULTS_DIR, 'screenshots');
const REPORT_FILE = join(RESULTS_DIR, 'report.md');

const PORT = 8123;
const BASE = `http://127.0.0.1:${PORT}`;

const VIEWPORTS = [
  { name: '4K', w: 2560, h: 1440 },
  { name: '16inch-laptop', w: 1920, h: 1200 },
  { name: '15inch-laptop', w: 1440, h: 900 },
  { name: '13inch-laptop', w: 1280, h: 800 },
  { name: 'tablet-landscape', w: 1024, h: 768 },
  { name: 'tablet-portrait', w: 768, h: 1024 },
  { name: 'mobile-large', w: 430, h: 932 },
  { name: 'mobile', w: 390, h: 844 },
  { name: 'mobile-small', w: 375, h: 667 },
];

const PAGES = [
  { name: 'index.html', path: '/' },
  { name: 'Blog.html', path: '/pages/Blog/Blog.html' },
  { name: 'Resume.html', path: '/pages/Resume/Resume.html' },
  { name: 'Professional.html', path: '/pages/Professional/Professional.html' },
  { name: 'MySpace.html', path: '/pages/MySpace/MySpace.html' },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.json': 'application/json',
};

function startServer(port) {
  return new Promise((resolveServer) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url, `http://127.0.0.1:${port}`);
        let pathname = decodeURIComponent(url.pathname);
        if (pathname === '/') pathname = '/index.html';
        const filePath = join(PROJECT_ROOT, pathname);
        if (!filePath.startsWith(PROJECT_ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
        res.end(data);
      } catch { res.writeHead(404); res.end('Not Found'); }
    });
    server.listen(port, '127.0.0.1', () => resolveServer(server));
  });
}

// Wait for async content (blog posts, images, fonts) and a settle buffer so
// measurements are stable instead of a magic timer.
async function settlePage(pg) {
  // If there is a blog loading placeholder, wait until it is removed.
  try {
    await pg.waitForSelector('#blog-loading', { state: 'detached', timeout: 5000 }).catch(() => {});
  } catch { /* not a blog page */ }
  await pg.evaluate(() => document.fonts && document.fonts.ready);
  // Re-measure until the document height stabilizes, up to ~12s.
  for (let i = 0; i < 24; i++) {
    const before = await pg.evaluate(() => document.documentElement.scrollHeight);
    await pg.waitForTimeout(250);
    const after = await pg.evaluate(() => document.documentElement.scrollHeight);
    if (Math.abs(after - before) <= 1) break;
  }
  await pg.evaluate(() => window.scrollTo(0, 0));
}

async function evaluateChecks(pg) {
  return pg.evaluate(() => {
    const doc = document.documentElement;
    const vw = doc.clientWidth;
    const vh = doc.clientHeight;
    const bodyOverflow = getComputedStyle(document.body).overflowY;
    // The document itself is scrollable unless html/body clamp overflow.
    const docYClamped = getComputedStyle(document.documentElement).overflowY === 'hidden'
      || bodyOverflow === 'hidden';

    // helper: is element visually rendered?
    const visible = (el) => {
      const st = getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden' || st.visibility === 'collapse') return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };

    const label = (el) => {
      const cls = (el.className && el.className.toString) ? el.className.toString().trim() : '';
      return el.id ? `#${el.id}` : el.tagName.toLowerCase() + (cls ? `.${cls.replace(/\s+/g, '.')}` : '');
    };

    const elements = Array.from(document.querySelectorAll('body *')).filter(visible);

    // --- 1. Horizontal overflow (document level) ---
    // Per web.dev: users scroll vertically, never horizontally. What matters is
    // whether the *page* itself needs horizontal scroll. Elements that are wider
    // than the viewport but contained/scrollable inside an ancestor (marquees,
    // horizontally-scrolling tab bars) are legitimately sized and are reported
    // only as advisory diagnostics, not failures.
    const docOverflowX = doc.scrollWidth > vw + 1;
    const overflowing = elements.filter(el => el.getBoundingClientRect().right > vw + 1);
    const topX = overflowing.filter(el => !overflowing.some(o => o !== el && o.contains(el)));
    const overflowX = topX.map(el => ({
      el: label(el),
      over: Math.round(el.getBoundingClientRect().right - vw),
    })).sort((a, b) => b.over - a.over);
    const xPass = !docOverflowX;

    // --- 2. Vertical reachability (not "page must scroll") ---
    // An element extending below the viewport is only a real problem if it is
    // unreachable — i.e. no ancestor overflow container can scroll to reveal it.
    // A deliberately locked app-shell (fixed, internal scroll panes) is fine as
    // long as its content is scrollable somewhere.
    const canElementScroll = (el) => {
      let cur = el.parentElement;
      while (cur) {
        const st = getComputedStyle(cur);
        const oy = st.overflowY || st.overflow;
        if ((oy === 'auto' || oy === 'scroll') && cur.scrollHeight > cur.clientHeight + 1) return true;
        if (st.overflow === 'hidden' && cur.scrollHeight > cur.clientHeight + 1) return false;
        cur = cur.parentElement;
      }
      return doc.scrollHeight > vh + 1 && !docYClamped;
    };
    const past = elements.filter(el => el.getBoundingClientRect().bottom > vh + 2);
    const topY = past.filter(el => !past.some(o => o !== el && o.contains(el)));
    const unreachable = topY.filter(el => !canElementScroll(el));
    const clippedEls = unreachable.map(el => ({
      el: label(el),
      over: Math.round(el.getBoundingClientRect().bottom - vh),
    })).sort((a, b) => b.over - a.over);
    const yPass = clippedEls.length === 0;

    // --- 3. Fixed/sticky element collisions ---
    // Treat deliberate full-viewport layers (landing overlays, full-screen app
    // panels) as acceptable stacking, not collisions. Only persistent chrome that
    // unfairly covers other *visible* content is a real problem.
    const isFullViewportOverlay = (el) => {
      if (getComputedStyle(el).position !== 'fixed') return false;
      const r = el.getBoundingClientRect();
      return r.width >= vw - 1 && r.height >= vh - 1;
    };
    const fixedSticky = elements.filter(el => {
      const p = getComputedStyle(el).position;
      return (p === 'fixed' || p === 'sticky') && !isFullViewportOverlay(el);
    });
    // 3a. fixed/sticky vs fixed/sticky (strongest signal: stacked overlapping chrome)
    const fixedOverlaps = [];
    for (let i = 0; i < fixedSticky.length; i++) {
      for (let j = i + 1; j < fixedSticky.length; j++) {
        const a = fixedSticky[i].getBoundingClientRect();
        const b = fixedSticky[j].getBoundingClientRect();
        const xo = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
        const yo = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        if (xo > 1 && yo > 1) {
          fixedOverlaps.push({
            a: label(fixedSticky[i]), b: label(fixedSticky[j]),
            overX: Math.round(xo), overY: Math.round(yo),
          });
        }
      }
    }
    const fixedPass = fixedOverlaps.length === 0;

    // 3b. fixed/sticky vs content: count only (a fixed header/overlay may legitimately
    // cover content, so just summarize rather than enumerate every descendant).
    const overlapCount = { total: 0, worst: [] };
    for (const fs of fixedSticky) {
      const a = fs.getBoundingClientRect();
      let hit = 0;
      let worstHit = null;
      for (const other of elements) {
        if (other === fs || fs.contains(other) || other.contains(fs)) continue;
        const b = other.getBoundingClientRect();
        const xo = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
        const yo = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        if (xo > 1 && yo > 1) {
          hit++;
          if (!worstHit || (xo * yo) > (worstHit.overX * worstHit.overY)) {
            worstHit = { el: label(other), overX: Math.round(xo), overY: Math.round(yo) };
          }
        }
      }
      if (hit > 0) {
        overlapCount.total += hit;
        overlapCount.worst.push({ el: label(fs), hits: hit, worst: worstHit });
      }
    }

    // --- 4. Mobile breakpoint (width <= 720) ---
    // Professional uses its own app-shell nav, so the hamburger check only applies
    // to pages that actually have the header/#menuIcon system.
    const menuIcon = document.getElementById('menuIcon');
    const header = document.querySelector('header');
    const supportsMenuSystem = !!(menuIcon || header);
    const iconVisible = menuIcon ? getComputedStyle(menuIcon).visibility === 'visible' && menuIcon.getClientRects().length > 0 : false;
    const headerHidden = header ? getComputedStyle(header).display === 'none' : true;

    return {
      xPass, yPass, fixedPass, overlapCount,
      xOffenders: overflowX, yOffenders: clippedEls, fixedPairs: fixedOverlaps,
      doc: { scrollWidth: doc.scrollWidth, clientWidth: vw, scrollHeight: doc.scrollHeight, clientHeight: vh, bodyOverflow, docYClamped },
      breakpoint: { iconVisible, headerHidden, supportsMenuSystem },
    };
  });
}

async function run() {
  await rm(RESULTS_DIR, { recursive: true, force: true });
  await mkdir(SCREENSHOTS_DIR, { recursive: true });
  const server = await startServer(PORT);
  let failures = 0;
  let total = 0;
  const rows = [];
  const browser = await chromium.launch();

  for (const page of PAGES) {
    for (const vp of VIEWPORTS) {
      total++;
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
      const pg = await ctx.newPage();
      const safe = `${page.name.replace('.html', '')}_${vp.name}`;
      const outFile = join(SCREENSHOTS_DIR, `${safe}.png`);

      try {
        await pg.goto(`${BASE}${page.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await settlePage(pg);
        const checks = await evaluateChecks(pg);

        const problems = [];

        // Horizontal overflow is judged at the document level (web.dev: users never
        // scroll horizontally). Outermost overflowing elements are reported only as
        // context when the document itself is too wide — contained/scrollable inner
        // elements (marquees, tab bars) do not fail on their own.
        if (!checks.xPass) {
          problems.push(`page has horizontal overflow (scrollWidth ${checks.doc.scrollWidth} > viewport ${checks.doc.clientWidth}px)`);
          for (const o of checks.xOffenders.slice(0, 4)) problems.push(`  X-overflow "${o.el}" extends ${o.over}px past right edge`);
        }
        if (!checks.yPass) {
          for (const o of checks.yOffenders.slice(0, 4)) problems.push(`unreachable: "${o.el}" extends ${o.over}px below viewport with no scrollable container`);
        }
        if (!checks.fixedPass) {
          const f = checks.fixedPairs.slice(0, 3);
          for (const o of f) problems.push(`fixed overlap: "${o.a}" collides with "${o.b}" (${o.overX}x${o.overY}px)`);
        }
        if (checks.overlapCount.total > 0) {
          for (const w of checks.overlapCount.worst.slice(0, 3)) {
            problems.push(`fixed overlap: "${w.el}" overlaps ${w.hits} other elements (worst: "${w.worst.el}" ${w.worst.overX}x${w.worst.overY}px)`);
          }
        }

        // Breakpoint check only for sub-pages with the standard header/#menuIcon
        // nav system (index/Home keeps its header by design; Professional uses its
        // own app-shell nav). Pages without that nav system are skipped.
        if (vp.w <= 720 && page.path !== '/' && checks.breakpoint.supportsMenuSystem) {
          if (!checks.breakpoint.iconVisible) problems.push('mobile breakpoint: #menuIcon not visible');
          if (!checks.breakpoint.headerHidden) problems.push('mobile breakpoint: header not hidden by default');
          if (checks.breakpoint.iconVisible && !checks.breakpoint.headerHidden) {
            // If the breakpoint is active, verify the toggle actually works.
            const works = await pg.evaluate(() => {
              const icon = document.getElementById('menuIcon');
              const header = document.querySelector('header');
              icon.click();
              return getComputedStyle(header).display;
            });
            if (works !== 'block') problems.push(`mobile breakpoint: clicking #menuIcon did not reveal header (display=${works})`);
          }
        }

        await pg.screenshot({ path: outFile, fullPage: true });

        const status = problems.length === 0 ? 'PASS' : 'FAIL';
        if (status === 'FAIL') failures++;
        rows.push({ name: page.name, vp: vp.name, status, problems });
      } catch (e) {
        failures++;
        rows.push({ name: page.name, vp: vp.name, status: 'FAIL', problems: [`page error: ${e.message.split('\n')[0]}`] });
      }
      await ctx.close();
    }
  }

  await browser.close();
  server.close();

  let report = '# Quick-Test Responsive Layout Report\n\n';
  report += '| Page | Viewport | Status |\n';
  report += '|---|---|---|\n';
  for (const r of rows) {
    report += `| ${r.name} | ${r.vp} | ${r.status} |\n`;
  }
  const passes = total - failures;
  report += `\n**Summary:** ${passes}/${total} PASS  |  ${failures}/${total} FAIL\n\n`;
  report += '## Failures\n\n';
  const failedRows = rows.filter((r) => r.status === 'FAIL');
  if (!failedRows.length) {
    report += 'None — all pages pass at every viewport.\n';
  }
  const byPage = new Map();
  for (const r of failedRows) {
    if (!byPage.has(r.name)) byPage.set(r.name, []);
    byPage.get(r.name).push(r);
  }
  for (const [page, items] of byPage) {
    report += `### ${page}\n\n`;
    for (const r of items) {
      report += `- **${r.vp}**\n`;
      for (const p of r.problems) report += `  - ${p}\n`;
    }
    report += '\n';
  }
  await writeFile(REPORT_FILE, report);

  console.log('Page                   Viewport             Status');
  console.log('--------------------------------------------------');
  for (const r of rows) {
    console.log(`${r.name.padEnd(22)} ${r.vp.padEnd(20)} ${r.status}`);
    for (const p of r.problems) console.log(`  -> ${p}`);
  }
  console.log('--------------------------------------------------');
  console.log(`SUMMARY: ${passes}/${total} PASS  |  ${failures}/${total} FAIL`);
  console.log(`Report: ${REPORT_FILE}`);
  console.log(`Screenshots: ${SCREENSHOTS_DIR}`);

  process.exitCode = failures > 0 ? 1 : 0;
}

run().catch((e) => { console.error('Fatal:', e); process.exit(1); });
