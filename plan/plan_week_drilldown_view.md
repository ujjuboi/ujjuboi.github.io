# Week Drill-Down View for Dated Study Plans

The dated schedule (`algorithms-and-leetcode.md`) renders every day/rest node as a
word-tree leaf (33 nodes across 3 branches) — too crowded. Introduce a week level
in the overview (Phase → Week leaves) and drill into a week to reveal its days.

## Decisions (confirmed)

- **Week grouping source**: `origin/main`'s weekly structure (`git show
  origin/main:src/StudyPlans/algorithms-and-leetcode.md`) — its 6 week topics and
  item-to-day mapping define week boundaries. Verified 1:1 against the dated
  items (all 50 checklists match).
- **Week mapping**: 4-day rhythm (3 study + 1 rest). Each phase = 2 weeks,
  matching the plan doc's Weeks 1–2 / 3–4 / 5–6.
- **Implementation**: weeks derived **in JS** — no content edits to `src/` (keeps
  the `quick-study-plan` publishing pipeline and dated plan untouched).
- **Return UX**: the week-root itself is clickable to collapse back to the phase
  overview (drill-down is in-place). The detail week root carries an inverted
  `.wt-back` header strip reading "Back to plan" so the collapse target is
  unmistakable; root click / Enter both collapse.

### Verified day→week mapping (study-day caps: 3, 7, 11, 15, 19, 25)

| Week | Topic (origin/main) | Dated nodes |
|---|---|---|
| 1 | Algorithm Basics & Sorting | D1, D2, D3 + R1 |
| 2 | Recursion & Data Structures | D4, D5, D6, D7 + R2 |
| 3 | Quicksort & Hash Tables | D8, D9, D10, D11 + R3 |
| 4 | Graphs & BFS | D12, D13, D14, D15 + R4, R5 |
| 5 | Shortest Path & Greedy | D16, D17, D18, D19 + R6 |
| 6 | Dynamic Programming & KNN | D20, D21, D22, D23, D24, D25 + R7, R8 |

Rest days keep their calendar position inside the week they fall in.

## 1. `scripts/myspace.js`

- **New top-level const** `datedPlanWeekGroups` mapping plan filename → week list
  (`{ week, topic, lastDay }` for weeks 1–6 per the table above). Page-agnostic
  parser data stays local to myspace.js (not `constants.js`); only one plan uses it.
- **`applyDatedWeekGroups(plan, fileName)`** — called from `loadStudyPlans` right
  after `parseStudyPlan` (pass `file` through). When the map matches and a phase
  has day/rest leaves, rebuild `phase.weeks` into week nodes:
  `{ kind: 'week', number, topic, label: 'Week N · <topic>', children: [day/rest nodes], items: <flattened child items for progress math> }`,
  cutting at `lastDay` (study-day count, rest days ride along).
- **`renderStudyNode`** (`:1273`):
  - Week nodes derive `done/total` from aggregated `items`.
  - Week click → `openWeekDetail(plan, phase, week, treeEl)` instead of the drawer;
    add `is-week`/`is-expandable` class + `aria-expanded`.
  - Day/rest leaf logic unchanged and reused for the detail view; day drawer
    breadcrumb stays `Phase N — Day N · date`.
- **`openWeekDetail` / `closeWeekDetail`** — swap `#study-tree` content:
  - Build detail branch: week rendered as `.wt-root is-expandable` carrying the
    `.wt-back` "Back to plan" strip, leaves = `renderStudyNode(phase, dayNode, isActive)`.
  - Animate in: root fades/scales in; each leaf gets `--leaf-index` and a
    staggered fade/slide-up; active day `scrollIntoView({ behavior: 'smooth', block: 'center' })`.
  - Collapse: quick fade-out of the detail (approx 0.15s), then re-append
    `buildWordTree(plan)` fading in.
- **`buildWordTree`** (`:1506`): `isActive` for week leaves = focus day's label is
  inside that week's `children` (`plan.focus.label` matches a child day label) or
  equals the week label. Other plans' weeks (nodes with `items`, no `children`)
  keep their existing drawer behavior. Note: the per-phase `.wt-branch-line`
  badge is removed for **all** plans (its CSS slot is repurposed for the
  expandable-root / back-strip styles).

## 2. `scripts/constants.js`

- Add `.wt-root.is-expandable` to `TAPPED_MOMENTARY_SELECTOR` (`:197`).

## 3. `styles/MySpace.css`

- `.wt-leaf.is-week`: reuse `.wt-leaf` border/shadow/hover; add a `›` chevron via
  `::after`, rotated on hover.
- `.wt-root.is-expandable`: `cursor: pointer`, hover lift + shadow, link-color
  border-top accent (mirrors leaf affordance), applied on a row of the existing
  `.wt-root` defaults.
- Keyframes `wt-root-in`, `wt-leaf-in` (fade + translateY); stagger via
  `animation-delay: calc(var(--leaf-index) * 45ms)`.
- Mobile (≤720px) tap overrides for `.wt-root.is-expandable:hover` / `.tapped`.
- Global accepted tweaks: `.wt-leaf.is-rest` opacity `0.6 → 0.85` (rest nodes on
  all plans) and the `.wt-branch-line` badge removal above.
- All colors/typography from existing `:root` custom properties — no hardcodes.

## Out of scope / untouched

- `src/StudyPlans/*.md`, `plans.json` — no content edits.
- Other plans' rendering behavior (unchanged).
- `README.md` (protected); git workflow (handled by user).

## Verification

- `node --check scripts/myspace.js scripts/constants.js`.
- Open `pages/MySpace/MySpace.html` from `file://` → Algorithms plan:
  - Overview shows 6 week leaves (`Week N · topic · done/total`) — not 33 day leaves.
  - Week 1 click → week becomes root, day/rest leaves cascade in staggered;
    rest leaves inert; day leaves open the drawer with items.
  - Week-root click → animates back to the phase overview.
  - Focus readout + ticking a box in the `.md` still updates progress.
- Claude-certified & code-architecture plans: weeks still open the drawer,
  unchanged.