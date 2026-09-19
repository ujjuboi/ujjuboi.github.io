# Shared Scripts & Constants

Central site configuration and cross-page JavaScript live in `scripts/constants.js` and `scripts/shared.js`, loaded by every page before the page-specific script. The vendored Marked library (`scripts/lib/marked.min.js`) provides markdown rendering.

## Implementation

| Area | Location |
|---|---|
| Config constants | `scripts/constants.js` |
| Shared functions | `scripts/shared.js` |
| Markdown lib | `scripts/lib/marked.min.js` (vendored Marked, exposes global `marked`) |

### `scripts/constants.js` (single source of truth)

- GitHub credentials/URLs: `GITHUB_USERNAME` (`:9`), `GITHUB_API_BASE` (`:29`), `GITHUB_RAW_BASE` (`:34`), `CURRENT_PROJECT_REPOS` (`:65`), `COMMIT_CHART_MONTHS` (`:70`).
- LeetCode: `LEETCODE_USERNAME` (`:14`), `LEETCODE_STATS_BASE` (`:39`), `LEETCODE_HEATMAP_URL` (`:44`), `LEETCODE_SUBMISSIONS_URL` (`:49`), `LEETCODE_PROFILE_URL` (`:54`), `LEETCODE_PROBLEM_BASE` (`:59`).
- Cache/labels/themes: `CACHE_TTL` (`:75`), `MONTH_NAMES` (`:101`), `FONT_THEMES` (`:111`), `PROFILES`/`PROFILE_INFO` (`:116`/`:127`), `FOOTER_LINKS` (`:220`), tap selectors (`:174`/`:187`).

### `scripts/shared.js`

- `initMenuToggle(contentSelector, restoreDisplay)` (`:9`) — footer/menu-icon hamburger swap.
- `escapeHtml()` (`:73`), `mdInline()` (`:89`), `renderMarkdown()` (`:115`), `renderInlineMarkdown()` (`:130`), `renderMarkdownBullets()` (`:147`).
- `parsePostHeaders()`/`parsePostBody()` (`:384`/`:416`), `parseCV()` (`:516`).
- `initFontSwitcher()` (`:650`), `buildProfilesStrip()` (`:809`), `buildSiteFooter()`/`initSiteFooter()` (`:847`/`:879`), `initTouchInteraction()` (`:895`).
- API + cache: `cachedFetch()` (`:990`), `fetchCommitHistory()` (`:1083`), `fetchIssueHistory()` (`:1132`), `fetchOpenIssues()` (`:1168`), `fetchCachedBannerDataUrl()` (`:1203`), `prefetchMyspaceData()` (`:1241`).

## Conventions enforced

- `const` by default; single quotes; descriptive full-name identifiers; JSDoc-style comments on every function.
- Never redeclare constants from `constants.js` in page scripts.
- All fetches use relative paths so the site works from `file://` and GitHub Pages.