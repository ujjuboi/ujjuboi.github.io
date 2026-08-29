# Plan: LeetCode Recent Submissions & Activity Card

## Objective
Add a single combined "Recent Submissions & Activity" card to the LeetCode section on `pages/Projects/Projects.html`, showing daily submission activity (from `submissionCalendar`) and the user's recent submissions.

## Data Sources (verified working + CORS-safe)
- **Recent submissions:** `https://alfa-leetcode-api.onrender.com/ujjuboi/submission?limit=10` returns `{ title, titleSlug, timestamp, statusDisplay (Accepted/Wrong Answer), lang }` with `access-control-allow-origin: *`.
- **Detailed submission activity:** `submissionCalendar` already inside the existing tashif response (`data.submissionCalendar`: `{ unixDayTimestamp: submissionCount }`).

> Note: LeetCode's own GraphQL endpoint (`https://leetcode.com/graphql`) has no CORS headers, so direct browser fetch is blocked. `recentSubmissions` is not part of the tashif API — hence the alfa API for the list.

## Design Decision (confirmed)
One combined card (not two separate cards): activity bars on top, recent-submissions list below.

## Files to Modify

### 1. `pages/Projects/Projects.html` (inside `#leetcode-content`, after `#lc-profile-link`)
Add:

```html
<div id="lc-submissions-card" class="card" style="display: none;">
  <h3 class="card-title">Recent Submissions &amp; Activity</h3>
  <div class="lc-activity" id="lc-activity"></div>
  <ul class="lc-submission-list" id="lc-submissions"></ul>
</div>
```

### 2. `scripts/projects.js` (in `fetchLeetCodeStats()`)
- Reuse existing `data.submissionCalendar` to render the last ~14 active days as proportional-height bars in `#lc-activity`.
- Add `async function fetchRecentSubmissions()` calling `cachedFetch('https://alfa-leetcode-api.onrender.com/ujjuboi/submission?limit=10')`, rendering each item as:
  - Problem title linking to `https://leetcode.com/problems/{titleSlug}`
  - Status badge (`Accepted` / `Wrong Answer` / other)
  - Language
  - Relative time ("3d ago")
- HTML-escape all strings.
- Wrap in try/catch: failures hide only the new card; existing stats stay intact.

### 3. `styles/Projects.css`
- `.lc-activity`: flex row of bars, heights proportional to submission count, colors from `--linkColor`/`--shadowColor`.
- `.lc-submission-list`: separators, hover state.
- Status badge colors (Accepted, Wrong Answer, other muted).
- Mobile tweak under the existing `720px` media query.

## Out of Scope
- No changes to the existing stats grid, "Total active days", "Ranking", or profile link.
- No auth/rate-limit handling beyond the existing `cachedFetch` 30-min TTL.