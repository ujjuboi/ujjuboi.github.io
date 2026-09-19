# LeetCode Progress — Stats, Activity, Recent Submissions

The "LeetCode Progress" section shows a solved/easy/medium/hard stats grid, a submission-calendar activity heatmap, and a combined "Recent Submissions & Activity" card with proportional activity bars and the latest submissions list.

## Implementation

| Area | Location |
|---|---|
| Section builder | `buildLeetCodeSection()` (`scripts/myspace.js:100`) |
| Stats fetch | `fetchLeetCodeStats()` (`scripts/myspace.js:772`) |
| Activity heatmap | `renderLeetCodeActivity()` (`:214`), `fetchLeetCodeActivity()` (`:296`) |
| Submissions | `renderRecentSubmissions()` (`:357`), `fetchRecentSubmissions()` (`:389`) |
| Markup | `#lc-submissions-card`, `#lc-activity`, `#lc-submissions` (built by section builder) |

## Data sources (all CORS-safe)

- Stats: `LEETCODE_STATS_BASE` (`scripts/constants.js:39`) — tashif API returns total/easy/medium/hard solved.
- Heatmap: `LEETCODE_HEATMAP_URL` (`constants.js:44`) — `submissionCalendar` day→count map rendered as the activity heatmap.
- Recent submissions: `LEETCODE_SUBMISSIONS_URL` (`constants.js:49`) — leetpulse API (`{ title, titleSlug, timestamp, statusDisplay, lang }`).

## Behavior

- Each submission links to `LEETCODE_PROBLEM_BASE + titleSlug` (`scripts/constants.js:59`) with a status badge (`Accepted`/`Wrong Answer`), language, and relative time.
- HTML-escape via shared `escapeHtml()` (`scripts/shared.js:73`); failures hide only the new card — the existing stats grid stays intact.
- Fallback messages render for empty/error states (`.lc-submission-empty`, `.lc-activity-state.lc-error`).

## Conventions honored

- API URLs + profile/problem bases centralized in `scripts/constants.js`.
- Activity bars/badges colored from `:root` vars in `styles/MySpace.css`; 720px mobile collapse.