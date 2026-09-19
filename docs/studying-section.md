# Currently Studying — Study Plans

The "Currently Studying" section renders each study plan from `src/StudyPlans/` as a roadmap-style **word tree** (phases → weeks/projects). Clicking a leaf opens a right-side **detail drawer** over a dimmed overlay. Progress is computed at runtime from checked `- [x]` boxes.

## Implementation

| Area | Location |
|---|---|
| Section builder | `buildStudySection()` (`scripts/myspace.js:27`) |
| Loading | `loadStudyPlans()` (`scripts/myspace.js:1370`) — fetches `src/StudyPlans/plans.json`, then each `.md` |
| Parsing | `parseStudyPlan(text)` (`scripts/myspace.js:1169`) |
| Rendering | `renderStudyPlans()` (`:1397`), `showStudyPlan()` (`:1452`), `buildWordTree()` (`:1301`) |
| Node render | `renderStudyNode(phase, node, isActive)` (`scripts/myspace.js:1128`) |
| Drawer | `openStudyDrawer()` (`:1050`), `closeStudyDrawer()` (`:1029`), `initStudyDrawerHandlers()` (`:1501`) |
| Content | `src/StudyPlans/<slug>.md` + `src/StudyPlans/plans.json` |

## Manifest & plan structure

- `plans.json` lists plan filenames in display order.
- Each plan: `# Study Plan: <title>`, `## Phase N: <name>` → `### Week N: <topic>` / `### Project N: <name>` → `- [ ]` / `- [x]` checklist items with indented `- Book:` / `- Site:` / `- Video:` sub-links.

## Behavior

- Overall progress (%) bar plus per-node `done/total` meta; the **focus** readout is the first unchecked item, and its node is marked active (`is-active`).
- Drawer shows title, phase breadcrumb, checklist with inline links; closes via × / overlay click / `Escape`, locks body scroll, and restores focus.
- `#plan-N` hash deep-links to a plan's detail view.
- Note: data is parsed from `src/StudyPlans/*.md` (a `### Day N:` variant also exists — see `plan_dated_study_schedule` for conversion work).

## Conventions honored

- Manifest-driven markdown fetch; shared drawer/overlay visuals from `:root` vars; reusable `.card`/progress-bar styling.