# Currently Studying Section — MySpace

A "Currently Studying" section on `pages/MySpace/MySpace.html`, placed at the top of the page, driven by `src/study-plan.md`. Renders a roadmap.sh-inspired **vertical timeline** — one clickable node per Week/Project grouped under Phase milestones — where only each node's **title is clickable** and opens a **right-side detail drawer** over a dimmed overlay. Progress is computed at runtime by counting checked `- [x]` boxes in `src/study-plan.md`.

## Decisions (confirmed)

- **Data source**: `src/study-plan.md` fetched at runtime (same pattern as blog/books). Git-hub/ blog links live in a new `## Study Links` section; ticking `- [x]` boxes updates overall + per-week progress automatically. No HTML edits needed to update progress or links.
- **Progress**: checked items ÷ total items. Overall bar at the top; per-week mini bar inside each drawer.
- **Current focus**: the first unchecked item, shown as "Phase N · Week N — <topic>" in the summary readout; its timeline node is marked active.
- **Timeline**: one node per Week (1–12) plus per Project (1–4), grouped under 5 Phase milestone headers.
- **Drawer**: right-side fixed panel + dimmed overlay, close via × / overlay click / `Escape`; body scroll locked while open; focus moved into the drawer and restored on close. (Mirrors roadmap.sh topic-details behaviour.)
- **Section placement**: first section of `#myspace-container`, full-width row (`.myspace-section--full`) to match the Books/LeetCode layout. Open by default using the current `section-heading collapsible active` markup.
- **Reuse over reinvention**: overall progress bar reuses the `.book-progress-fill` visual language; timeline spine reuses the `Resume.css` `.timeline::before` dot/spine pattern (rethrown as `.study-*` classes in MySpace.css); drawer overlay uses the new `--bannerDim` var. All colors from `:root` vars — never hardcoded.

## Data source changes (`src/study-plan.md`)

Add a `## Study Links` section (source of the Git-hub/ blog chips):

```md
## Study Links
### GitHub
<!-- add repos here: - [name](url) -->
### Blog
<!-- add posts here: - [title](url) -->
```

Convert Phase 5 project bullets (e.g. `- Build a portfolio site …`) to `- [ ]` checkboxes so projects count toward progress and render consistently. No other content changes.

Note: this section parses the full `src/study-plan.md`. Non-phase `## ` sections (Recommended Resources, Weekly Schedule Suggestion, Study Links) are skipped. Comment lines (`<!-- … -->`) and the `## Study Links` block are excluded from progress.

## Edits to existing files

### 1. `pages/MySpace/MySpace.html`

Insert as the first child of `#myspace-container` (before "Currently Working On"), a `.myspace-section.myspace-section--full`:

- `h2.section-heading.collapsible.active` "Currently Studying" with `.toggle-icon` (collapsible via existing `toggleSection`), content `style="display: block;"`.
- `.section-content`:
  - Summary `.card`:
    - overall progress bar `#study-progress-fill` + label `#study-progress-label` (e.g. "3/76")
    - current-focus readout `#study-focus` ("Phase 1 · Week 1 — OSI Model…")
    - Git-hub/ blog chips `#study-links` (hidden when both groups empty)
  - `#study-timeline` (rendered by JS), `#study-loading` placeholder (three-dot pulse), `#study-fallback` ("Unable to load study plan").
- After `</section>` — drawer skeleton:
  ```html
  <div id="study-overlay" class="study-overlay" hidden></div>
  <aside id="study-drawer" class="study-drawer" role="dialog" aria-modal="true" aria-hidden="true">
    <button id="study-drawer-close" class="study-drawer-close" aria-label="Close details">×</button>
    <div id="study-drawer-body"></div>
  </aside>
  ```
- A short comment noting progress/links live in `src/study-plan.md`.

### 2. `styles/MySpace.css`

Only existing `:root` vars. New `.study-*` classes:

- `.study-progress-track/.study-progress-fill/.study-progress-label` — overall bar (track like `.book-progress-bar`, fill `--linkColor`, label).
- `.study-links`, `.study-chip` — link chips styled with `--linkColor`/`--borderColor`.
- `.study-timeline` (vertical spine via pseudo-element), `.study-phase-title` (milestone header), `.study-node`, `.study-node-dot`, `.study-node-btn` (clickable title in `--linkColor`, hover), `.study-node-meta` (done/total), `.study-node.is-active` (current focus marker).
- `.study-overlay` (position: fixed, inset 0, `--bannerDim`, z-index above content).
- `.study-drawer` (fixed right panel, `--backgroundColor`/`--borderColor`/`--shadowColor`, slide-in transition), `.study-drawer-close` (× button), drawer checklist item styles (done = check + line-through).
- `@media (max-width: 720px)`: drawer becomes full-width, timeline padding tightens, heading type shrinks.

### 3. `scripts/myspace.js`

- `parseStudyPlan(text)` → `{ title, phases: [{ name, weeks: [{ label, kind: 'week'|'project', items: [{ text, done }] }] }], done, total, pct, focus: { phase, label, topic }, links: { github: [], blog: [] } }`
  - Track `## Phase N:` / `### Week N:` / `### Project N:`; collect `- [x]` / `- [ ]` items.
  - Skip non-phase `## ` sections; stop at the `## Study Links` header for checklist content.
  - Parse link bullets under `### GitHub` / `### Blog`, skipping `<!-- -->` comment lines.
- `renderStudyPlan()` — `fetch('../../src/study-plan.md')` (like `loadLatestPost`/`loadBooks`), fill summary + timeline, mark the active node (first unchecked item's week), wire drawer; on error show `#study-fallback`.
- `renderStudyNode(phase, ...)` — phase milestone header + node list; node shows `▲`-style title as a `<button>` (e.g. "Week 3 · Security") with right-aligned `2/7` meta; active node gets an "in progress" marker.
- `openStudyDrawer(node)` / `closeStudyDrawer()` — fill title, phase breadcrumb, per-week mini progress bar, checklist, and Git-hub/ blog links when present; show/hide `.study-overlay`, set `aria-hidden`, lock body scroll, move focus to close button, restore focus on close.
- Close handlers: × button, overlay click, `Escape`. Close the drawer when the mobile menu opens via `initMenuToggle`.
- Call `renderStudyPlan()` during init (with the other fetches).

## Verification

- `node --check scripts/myspace.js`.
- Open `pages/MySpace/MySpace.html` in a browser (works from `file://`).
- Click through timeline nodes → drawer opens; verify × / overlay / `Escape` close; verify progress updates when a box is ticked in `src/study-plan.md`.
- Check responsive at 720px and desktop (drawer full-width on mobile).
- Optional: run the `quick-test` skill for a responsive PASS/FAIL report across the 9 resolutions; delete any verification `.mjs` after (keep `.opencode/skills/quick-test/test.mjs`).

## Out of scope

- Git/branch/commit workflow (handled by the user).
- `README.md` (protected).
- Editing `src/study-plan.md` content/topic text itself (user maintains checkboxes and study links).
