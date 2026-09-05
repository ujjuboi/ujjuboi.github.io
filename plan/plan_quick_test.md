# Create `/quick-test` skill — headless responsive layout testing

Create a reusable opencode skill that runs a headless Playwright browser via the **CLI**, opens every page of this portfolio at a set of common responsive resolutions, captures full-page screenshots, and generates a PASS/FAIL report with failure summary.

## Context

- This is a **static HTML/CSS/vanilla-JS** site (no package.json at root, no build step, no test tooling). Pages are served as-is via GitHub Pages.
- The site's only responsive breakpoint is `@media (max-width: 720px)` (used across all 6 stylesheets). Below/equal 720px: the desktop `header` is hidden and an off-canvas hamburger menu (`#menuIcon`) appears; `scripts/shared.js` (`initMenuToggle`) toggles `header` / `#menuIcon` / content / `footer`.
- Skills live in `.opencode/skills/<name>/SKILL.md`, sharing a convention: YAML frontmatter (`name`, `description`) + a Markdown body with numbered Workflow + Rules sections (per `quick-blog`).
- `.opencode/.gitignore` already ignores `node_modules`, `package.json`, `package-lock.json`, `bun.lock`. There is a `.opencode/package.json` currently holding only `@opencode-ai/plugin`.

## Approach: CLI-only Playwright

Use `playwright` CLI (`npx playwright screenshot`) instead of the Node.js API. This keeps the skill simple, shell-native, and avoids maintaining a custom `.mjs` runner. The CLI takes screenshots; a lightweight shell script orchestrates the loop and generates the report.

**CLI command used per page × viewport:**
```bash
npx playwright screenshot --viewport-size="<W>,<H>" --full-page --wait-for-timeout=1000 http://127.0.0.1:<PORT>/<path> <output.png>
```

**JS-based checks are not possible via the CLI** — the skill focuses on screenshot capture for visual review plus a checklist file the user can inspect manually.

## Resolutions (9 viewports, from 2026 responsive-design research)

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

## Pages (5)

- `index.html`, `pages/Blog/Blog.html`, `pages/Professional/Professional.html`, `pages/Resume/Resume.html`, `pages/MySpace/MySpace.html`

## Files to add

1. **`.opencode/package.json`** — add `playwright` to `dependencies` (keeps the testing tool self-contained in `.opencode/`).
2. **`.opencode/skills/quick-test/SKILL.md`** — skill definition (frontmatter + workflow + rules).
3. **`.opencode/skills/quick-test/test.sh`** — the shell script that runs the CLI-based test.
4. **`.opencode/skills/quick-test/results/`** — output dir for `report.txt` + `screenshots/`.

## Test script (`test.sh`) behavior

- **Serving**: start a throwaway `python3 -m http.server 127.0.0.1:<port>` rooted at the project dir (so relative paths/CSS/JS load, not `file://`). Capture the PID to kill it on exit.
- **Per page × viewport** (nested loop over PAGES × VIEWPORTS):
  - Run `npx playwright screenshot --viewport-size="<W>,<H>" --full-page --wait-for-timeout=1000 http://127.0.0.1:<port>/<path> <output.png>`.
  - If the CLI exits non-zero or the output PNG is missing/empty → mark as FAIL.
  - Mark as PASS if the screenshot was captured successfully.
- **Reporting**: print a per-page × per-viewport PASS/FAIL table (also written to `results/report.txt`), a failure summary with screenshot paths, and exit `process.exit(0/1)`.
- **Cleanup**: kill the background HTTP server on exit.

## Skill definition (`SKILL.md`) contents

- Frontmatter: `name: quick-test`; `description` mentioning running a headless Playwright CLI across common responsive resolutions and capturing full-page screenshots.
- Workflow:
  1. `npm install` in `.opencode/` (installs `playwright`); if browsers missing, `npx playwright install chromium`.
  2. Run `bash .opencode/skills/quick-test/test.sh`.
  3. Present PASS/FAIL table; exit code 0 = all pass, 1 = failures; point to least one screenshot per failing page/viewport.
- Rules: read-only — never modify site source; fix issues separately and re-run; keep everything under `.opencode/` (git-ignored runtime artifacts).

## Verification

- Run the script once end-to-end and confirm it launches Chromium via CLI, produces the PASS/FAIL report, and writes screenshots.
- Confirm results dir + screenshots are created and `report.txt` reflects each page/viewport.
- Note: playwright downloads a matching Chromium build on first run (may take a minute).

## Out of scope

- No changes to any site HTML/CSS/JS (this skill is a read-only reporting tool).
- No CI wiring; the skill is invoked manually via `/quick-test`.
- No JavaScript-based layout checks (overflow/overlap/mobile-breakpoint) — the CLI does not support runtime JS evaluation; screenshots serve as the visual review mechanism.
