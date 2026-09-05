import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const ROOT = '/Users/Admin/Documents/Study/portfolio/once';
const server = http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    const ext = path.extname(filePath);
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.md': 'text/plain' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
    res.end(data);
  });
});
await new Promise(r => server.listen(8132, r));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let pageErrors = [];
page.on('pageerror', err => pageErrors.push(err.message));
await page.goto('http://127.0.0.1:8132/pages/MySpace/MySpace.html');
await page.waitForFunction(() => document.querySelectorAll('.book-card').length >= 3, null, { timeout: 8000 });
await page.waitForTimeout(1500);
console.log('card count:', await page.locator('.book-card').count());
console.log('page errors:', JSON.stringify(pageErrors));
const r = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.book-card')).map(c => ({
    alt: c.querySelector('.book-banner').alt,
    meta: c.querySelector('.book-progress-meta').textContent
  }));
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
await new Promise(r => server.close(r));
