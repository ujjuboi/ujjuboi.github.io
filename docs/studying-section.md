# Currently Studying — Study Plans

The "Currently Studying" section renders each study plan from `src/StudyPlans/` as a roadmap-style **word tree** (phases → weeks → days). Plans use **dated day/rest schedules**: `### Day N:` study nodes and `### Rest Day:` nodes on a 3-study + 1-rest rhythm, grouped into week overview leaves derived in JS. Clicking a week leaf drills down into its dated days; clicking a day leaf opens a right-side **detail drawer** over a dimmed overlay. Progress is computed at runtime from checked `- [x]` boxes.

## Implementation

| Area | Location |
|---|---|
| Section builder | `buildStudySection()` (`scripts/myspace.js:27`) |
| Loading | `loadStudyPlans()` (`scripts/myspace.js:1520`) — fetches `src/StudyPlans/plans.json`, parses each `.md`, then applies week groups |
| Parsing | `parseStudyPlan(text)` (`scripts/shared.js:652`) — shared, parses dated Day/Rest headings |
| Week grouping | `datedPlanWeekGroups` (`scripts/shared.js:813`) + `applyDatedWeekGroups(plan, fileName)` (`shared.js:885`) |
| Rendering | `renderStudyPlans()` (`:1548`), `showStudyPlan()` (`:1603`), `buildWordTree()` (`:1345`) |
| Node render | `renderStudyNode(phase, node, isActive, plan, treeEl)` (`scripts/myspace.js:1276`) |
| Week drill-down | `openWeekDetail()` (`:1415`), `closeWeekDetail()` (`:1492`) |
| Day drawer | `openStudyDrawer()` (`:1195`), `closeStudyDrawer()` (`:1174`), `initStudyDrawerHandlers()` (`:1652`) |
| Content | `src/StudyPlans/<slug>.md` + `src/StudyPlans/plans.json` |

## Manifest & plan structure

- `plans.json` lists plan filenames in display order.
- Each plan: `# Study Plan: <title>`, `## Phase N: <name>` → `### Day N: <Weekday>, <Mon> <Day> — <topic>` study nodes and `### Rest Day: <Weekday>, <Mon> <Day> — Review & Recovery` nodes → `- [ ]` / `- [x]` checklist items with indented `- Book:` / `- Site:` / `- Video:` sub-links.
- Days run on consecutive calendar dates in a 3-study + 1-rest rhythm; rest nodes contribute nothing to progress.
- Week grouping is derived in `scripts/shared.js:813` (`datedPlanWeekGroups`: plan filename → `{ week, topic, lastDay }` entries) — the markdown carries no `### Week N:` headings.

## Behavior

- Overall progress (%) bar plus per-node `done/total` meta; the **focus** readout is the first unchecked item, and its node is marked active (`is-active`).
- Overview shows one week leaf per content week (`Week N · topic · done/total`); clicking it drills the tree in place to its dated Day/Rest cascade, where rest leaves are inert (`is-rest`) and day leaves open the drawer.
- The week root carries a "Back to plan" strip; clicking it collapses back to the phase overview.
- Drawer shows title, phase breadcrumb, checklist with inline links, and the active day scrolled into view; closes via × / overlay click / `Escape`, locks body scroll, and restores focus.
- `#plan-N` hash deep-links to a plan's detail view.

## Conventions honored

- Manifest-driven markdown fetch; shared drawer/overlay visuals from `:root` vars; reusable `.card`/progress-bar styling. Parser and week-grouping helpers live in `scripts/shared.js` and are reused only from the MySpace page script.