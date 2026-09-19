# MySpace Page

`pages/MySpace/MySpace.html` is the personal hub page (renamed from the original Projects page). It hosts the Currently Studying, Currently Working On, LeetCode Progress, and My Library sections, built into `#myspace-container` by `scripts/myspace.js`.

## Implementation

| Area | Location |
|---|---|
| Page | `pages/MySpace/MySpace.html` |
| Styles | `styles/MySpace.css` |
| Script | `scripts/myspace.js` (formerly `scripts/projects.js`) |
| Section builders | `buildStudySection()` (`:27`), `buildActivitySection()` (`:55`), `buildLeetCodeSection()` (`:100`), `buildBooksSection()` (`:147`) |
| Section render | `renderMyspaceSections()` (`:179`), `expandSection()` (`:201`) |

### Layout model

- `#myspace-container` uses a section-grid: sections sit two-up above 1100px, except full-row exceptions (Currently Studying, LeetCode/Books). Between 721–1100px every section takes its own full-width row; ≤720px collapes to a single stacked column (`styles/MySpace.css`).
- The nav/title/IDs (`data-section`, `#myspace-container`, `.myspace-section`, `.myspace-tag`) and the `README`/workflow references were renamed from the original Projects stack.

## Special features on this page

- **Study plans** — word-tree + drawer (see `docs/studying-section.md`)
- **GitHub activity + open issues** — commit chart with issue overlay (see `docs/github-issues-activity.md`)
- **LeetCode stats + submissions** — stats grid, activity bars, recent submissions (see `docs/leetcode-submissions.md`)
- **Books** — markdown-driven library (see `docs/books-reading.md`)
- **Banner prefetch** — `prefetchMyspaceData()` (`scripts/shared.js:1241`) + `fetchCachedBannerDataUrl()` (`:1203`) warm cached repo/banner data for this page.

## Conventions honored

- Sections are collapsible via the shared `.section-heading.collapsible` + `toggleSection` pattern; `MySpace` is registered in `constants.js` (`MYSPACE_CATEGORIES`, `:96`).