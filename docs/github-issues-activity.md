# GitHub Activity — Commit Chart with Open-Issues Overlay

The "Currently Working On" section plots commit history for tracked repos as a themed line chart and overlays open issues (solid) and closed issues (dashed), so the user can see work-in-progress at a glance. Data comes from the GitHub REST API via the shared cached-fetch helper.

## Implementation

| Area | Location |
|---|---|
| Section builder | `buildActivitySection()` (`scripts/myspace.js:55`) |
| Data fetch | `fetchCurrentProject()` (`scripts/myspace.js:727`), `renderCommitCard()` (`:694`) |
| Chart render | `renderCommitChart(commits, openIssues, closedIssues)` (`scripts/myspace.js:510`) |
| Tooltips | `buildCommitTooltip()` (`:663`), `buildIssueTooltip()` (`:681`) |
| API helpers | `fetchCommitHistory()` (`scripts/shared.js:1083`), `fetchIssueHistory()` (`:1132`), `fetchOpenIssues()` (`:1168`) |
| Caching | `cachedFetch()` (`scripts/shared.js:990`) |

## Behavior

- Repos to track come from `CURRENT_PROJECT_REPOS` (`scripts/constants.js:65`); chart window from `COMMIT_CHART_MONTHS` (`:70`), `offsetMonthKey()`/`commitsCoverChartWindow()` at `shared.js:1052`/`:1066`.
- The commit line is drawn with the theme color; open issues render solid red, closed issues dashed blue, per month (`renderCommitChart`).
- Loading/fallback states: `showCurrentProjectFallback()` (`:716`) and `.lc-activity-state` placeholders.
- Open-issue overlay degrades independently — the chart still renders when issue data is unavailable.

## Conventions honored

- GitHub API URL from `GITHUB_API_BASE` (`scripts/constants.js:29`); 30-min (API) / persistent (banner) cache TTL via `CACHE_TTL`/`cachedFetch`.