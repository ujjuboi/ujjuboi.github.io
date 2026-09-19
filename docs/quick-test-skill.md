# Quick-Test Skill (`/quick-test`)

A reusable opencode skill that runs a headless Playwright browser across common responsive viewports, captures full-page screenshots of every page, and generates a PASS/FAIL report. Triggered manually by the user only.

## Implementation

| Area | Location |
|---|---|
| Skill definition | `.opencode/command/quick-test/SKILL.md` |
| Runner | `.opencode/command/quick-test/test.mjs` |
| Output | `.opencode/command/quick-test/results/` (`report.txt` + `screenshots/`) |
| Dependency | `playwright` installed under `.opencode/` (self-contained, git-ignored) |

## Behavior

- Serves the repo via a throwaway `python3 -m http.server` so relative paths/CSS/JS load (not `file://`).
- Iterates 9 viewports (4K → phone) × the 5 site pages, capturing `--full-page` screenshots via Playwright.
- Marks each page × viewport PASS (screenshot captured) or FAIL (missing/empty/CLI error), writes a `report.txt`, prints a summary table, and exits `0`/`1`.
- Read-only: never modifies site source; fixes are done separately and the test re-run.

## Conventions enforced

- `.mjs` runner files are for testing only — never committed/pushed; `.opencode/command/quick-test/test.mjs` itself is kept.
- Runs from the 720px single-breakpoint reality of the site.