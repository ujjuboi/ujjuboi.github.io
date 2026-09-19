# Dated Study Schedule — Algorithms & LeetCode

Convert `src/StudyPlans/algorithms-and-leetcode.md` from 6 weekly blocks into a
concrete dated schedule (25 study days + 8 rest days, 3-on/1-rest rhythm
starting **Sun, Sep 20 2026**), update the "Currently Studying" word-tree
renderer to display dated Day/Rest nodes, and ship an all-day `.ics` invite for
the next study day (Day 1).

Note: `plan_studying_section.md` references a nonexistent `src/study-plan.md`;
the live data source is `src/StudyPlans/plans.json` → `myspace.js` word-tree.
Keep that pipeline.

## Decisions (confirmed)

- **Start date**: Day 1 = tomorrow, Sun, Sep 20 2026.
- **Rest rhythm**: 3 study days on, 1 rest day off, repeated through the plan.
- **Scope**: markdown restructure *and* renderer update (parser + word-tree show
  dated Day/Rest nodes).
- **Calendar invite**: single all-day `.ics` for the next study day only (Day 1).
- **ICS location**: `src/StudyPlans/algorithms-day1-2026-09-20.ics`, all-day
  events (no start/end time).

## 1. `src/StudyPlans/algorithms-and-leetcode.md` — restructure

Same title, 3 phases, all 49 checklist items + their `- Book:` / `- Site:`
sub-links moved **verbatim**, and the trailing `## Weekly Schedule Suggestion`
block kept. Only headings change.

New heading format:

```md
### Day 1: Sun, Sep 20 — Algorithm Foundations
### Rest Day: Wed, Sep 23 — Review & Recovery
```

Rest days carry a light non-checkbox note (e.g. `> Rest — no LeetCode. Optional:
reread the week's Grokking chapters.`) so nothing counts toward progress.

### Full 33-day sequence

Study days D1–D25 (25 study nodes), rest days R1–R8 (8 rest nodes):

**Phase 1 (Weeks 1–2 → Days 1–7)**
- D1 Sun 9/20 — Introduction to algorithms, Big-O notation
- D2 Mon 9/21 — How memory works, Selection sort
- D3 Tue 9/22 — Binary/bitwise, Array basics, String basics
- *R1 Wed 9/23*
- D4 Thu 9/24 — Recursion, Linked lists
- D5 Fri 9/25 — Arrays vs linked lists, Product of Array Except Self
- D6 Sat 9/26 — Maximum Subarray, Reverse a Linked List
- *R2 Sun 9/27*
- D7 Mon 9/28 — Counting Bits, Longest Substring

**Phase 2 (Weeks 3–4 → Days 8–15)**
- D8 Tue 9/29 — Quicksort, Hash tables
- D9 Wed 9/30 — Hash lookups, Preventing duplicates
- *R3 Thu 10/1*
- D10 Fri 10/2 — Hash cache, Search in Rotated Array
- D11 Sat 10/3 — Two Pointers (Container), Valid Anagram
- D12 Sun 10/4 — Graphs, BFS
- *R4 Mon 10/5*
- D13 Tue 10/6 — Max Product Subarray, Merge Intervals
- D14 Wed 10/7 — Merge K Sorted Lists, Number of Islands
- D15 Thu 10/8 — Clone Graph, Group Anagrams
- *R5 Fri 10/9*

**Phase 3 (Weeks 5–6 → Days 16–25)**
- D16 Sat 10/10 — Dijkstra, Greedy algorithms
- D17 Sun 10/11 — Course Schedule, Pacific Atlantic
- D18 Mon 10/12 — Longest Consecutive, Insert Interval
- *R6 Tue 10/13*
- D19 Wed 10/14 — Non-overlapping Intervals, Top K Frequent
- D20 Thu 10/15 — Dynamic Programming, Knapsack
- D21 Fri 10/16 — KNN, Climbing Stairs
- *R7 Sat 10/17*
- D22 Sun 10/18 — Coin Change, House Robber
- D23 Mon 10/19 — Longest Increasing Subsequence, Word Break
- D24 Tue 10/20 — Jump Game, Matrix
- *R8 Wed 10/21*
- D25 Thu 10/22 — Where to Go Next (wrap-up)

## 2. `scripts/myspace.js` — parser/render updates

- **`parseStudyPlan`** (`:1211`): replace the `(Week|Project)` regex with two:
  - `/^### Day\s+(\d+):\s*(.+?)\s*—\s*(.+)/` → node
    `{ kind: 'day', number, date, topic, label: 'Day ' + number + ' · ' + date, items: [] }`
  - `/^### Rest Day:\s*(.+)/` → node
    `{ kind: 'rest', date, topic, label: 'Rest Day', items: [] }`
  - Rest nodes push into `phase.weeks` (render in tree) but contribute nothing
    to `done` / `total` / `focus`. Indented `> ` and `- ` notes under rest
    headings are skipped by existing logic.
- **`renderStudyNode`** (`:1128`): for `kind === 'day'`, kicker =
  `Day N · <date>`, text = topic; for `kind === 'rest'`, add class
  `wt-leaf is-rest` (muted, no click listener — no drawer); the existing
  `is-active` / `is-complete` logic works unchanged.
- `openStudyDrawer` focus breadcrumb (`:1151`) naturally renders
  "Phase N — Day N · date".

## 3. `styles/MySpace.css`

One small addition in the `.wt-leaf` cluster (~`:1120`):
`.wt-leaf.is-rest` — muted tone via `--contentColor`/opacity, `cursor: default`,
no hover lift. All colors from existing `:root` vars.

## 4. Calendar invite — all-day `.ics` for Day 1

New file `src/StudyPlans/algorithms-day1-2026-09-20.ics`:
- `DTSTART;VALUE=DATE:20260920` / `DTEND;VALUE=DATE:20260921`
- `SUMMARY:Day 1 — Algorithm Foundations`
- `DESCRIPTION` = Day 1's checklist + Book/Site links; no invented resources.
- Plain VCALENDAR (VERSION 2.0, METHOD:PUBLISH), importable into Apple/Google
  Calendar. `plans.json` untouched since it only lists `.md` files.

## Verification

- `node --check scripts/myspace.js`.
- Open `pages/MySpace/MySpace.html` from `file://`: click the Algorithms plan →
  word-tree shows 25 Day + 8 Rest nodes; day nodes open the drawer with items;
  rest nodes are inert; focus readout shows
  "Phase 1 · Day 1 · Sun, Sep 20 — Introduction to algorithms…"; ticking a box
  in the `.md` updates progress.
- Import the `.ics` in a calendar → all-day event appears for Sep 20.

## Out of scope

- Git/branch/commit workflow (handled by the user).
- `README.md` (protected).
- Other study plans (`claude-certified-developer-foundations.md`,
  `code-architecture-system-design.md`) keep weekly structure.