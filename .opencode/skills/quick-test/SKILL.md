---
name: quick-test
description: Run headless Playwright at 9 responsive resolutions against every portfolio page, assert DOM layout rules (overflow, clipping, overlaps, mobile breakpoint), capture full-page screenshots, and print a PASS/FAIL report.
---

# Quick Test — Headless Responsive Layout Checks

Run headless Playwright at 9 common responsive viewports against all 5 portfolio pages, asserting real DOM geometry rules per page × viewport, capturing screenshots as a visual aid, and producing a PASS/FAIL table alongside a plain-text report.

> **Note:** Running this skill **empties the `results/` directory first** (both `report.md` and `screenshots/`), then runs the test fresh.

## Workflow

1. **Install dependencies** — run `npm install` in `.opencode/` to install `playwright`. If browsers are missing, run `npx playwright install chromium`.
2. **Run the test script** — execute `node .opencode/skills/quick-test/test.mjs`. This first **clears `results/`** (deleting any prior `report.md` and screenshots), then serves the project and asserts layout rules.
3. **Review the output** — the script prints a per-page × per-viewport PASS/FAIL table with rule-violation details, writes `results/report.md`, and saves full-page PNG screenshots to `results/screenshots/`. Exit code `0` = all pass, `1` = failures.

## Pages Tested (5)

| # | Page | URL path |
|---|------|----------|
| 1 | Home | `/` |
| 2 | Resume | `/pages/Resume/Resume.html` |
| 3 | Blog | `/pages/Blog/Blog.html` |
| 4 | Professional | `/pages/Professional/Professional.html` |
| 5 | MySpace | `/pages/MySpace/MySpace.html` |

## Viewports Tested (9)

| Name | W × H | Device |
|---|---|---|
| 4K | 2560 × 1440 | 4K monitor @1.5x scaling |
| 16-inch laptop | 1920 × 1200 | MacBook Pro 16" |
| 15-inch laptop | 1440 × 900 | 15" laptop |
| 13-inch laptop | 1280 × 800 | MacBook Air 13" |
| tablet-landscape | 1024 × 768 | iPad landscape |
| tablet-portrait | 768 × 1024 | iPad portrait |
| mobile-large | 430 × 932 | iPhone Pro Max |
| mobile | 390 × 844 | iPhone 14/15 |
| mobile-small | 375 × 667 | iPhone SE |

## How It Works

- A throwaway Node `http` server is started on `127.0.0.1:8123` rooted at the project dir (so relative CSS/JS/image paths resolve — not `file://`). It is closed on exit.
- For every page × viewport, a headless Chromium (Playwright) loads the page, waits for async content (blog fetch, images, `document.fonts.ready`) until `scrollHeight` stabilizes, then runs DOM assertions.
- A test-case is **PASS** only if every assertion passes; otherwise **FAIL** with a list of rule violations.

## Checks Performed (per page × viewport)

1. **No horizontal overflow (X)** — any visible element whose right edge exceeds the viewport width is a violation. Only the outermost overflowing element per branch is reported, so one root cause = one line.
2. **No vertical clipping (Y)** — if the page cannot scroll (`body overflow:hidden` and/or `scrollHeight <= viewport height`), then any visible element extending past the viewport bottom is unreachable content and a violation. Scrollable pages are exempt (below-fold content is reachable).
3. **No stacked fixed/sticky layers** — if two `position:fixed`/`sticky` elements overlap, it signals full-screen layers fighting for the viewport (e.g. an overlay covering the page). Reported per pair.
4. **Fixed vs content coverage (summarized)** — fixed/sticky elements that cover N other visible elements are counted (an intentional header/overlay is expected; a full-page fixed layer covering everything is not).
5. **Mobile breakpoint activates (width ≤ 720px, sub-pages only)** — `#menuIcon` must be visible and `header` hidden by default; clicking `#menuIcon` must reveal the header (`display:block`). The Home page intentionally keeps its header on mobile, so only the X/Y checks apply there.

The layout is considered broken only if a rule above fails — screenshots alone cannot prove any of this.

## Output

- `results/report.md` — Markdown PASS/FAIL table with per-case violation details + summary
- `results/screenshots/<page>_<viewport>.png` — one full-page PNG per test case (45 total), for visual review alongside the numeric checks

## Rules

- **Read-only** — never modify any site HTML/CSS/JS files.
- The script evaluates real DOM geometry; screenshots are captured as a visual aid, not the source of truth.
- If a test fails, fix the underlying issue separately and re-run the skill.
- All artifacts live under `.opencode/` (runtime tools and results are git-ignored).
- Playwright downloads Chromium on first run (~80 MB); subsequent runs use the cached binary.
