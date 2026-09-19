# Mobile Removal & Responsive Design

The legacy `Mobile/` site and its screen-width redirect were removed; the main site is now natively responsive with a single **720px** breakpoint. Below/equal 720px the desktop header hides and an off-canvas hamburger menu (`#menuIcon`) appears, toggled by tapping the footer.

## Implementation

| Area | Location |
|---|---|
| Responsive rules | `@media (max-width: 720px)` — `styles/styles.css:218`, plus per-page in `styles/{Home,Blog,MySpace,Professional,Resume}.css` |
| Menu toggle | `initMenuToggle(contentSelector, restoreDisplay)` — `scripts/shared.js:9` |
| Mobile drawer | parent `#menuIcon` overlay + footer tap-to-restore (per page cargo) |
| Home hero on phones | `styles/Home.css` mobile overrides (photo hidden, centered single-screen layout) |

## Behavior

- Hamburger (`#menuIcon`) opens the full-screen `header` menu; tapping the footer icon closes it and restores the page content.
- `initMenuToggle` accepts a `restoreDisplay` arg (`'flex'` for the home hero, `'block'` for sub-pages).
- Header overlay is capped (`max-height: 90vh`, `overflow-y: auto`) so tall menus scroll on small screens.
- No `Mobile/` directory or redirect remains; no `window.innerWidth` gating (CSS-only show/hide of `#menuIcon`).

## Conventions enforced

- Single source of truth for responsive layout = the 720px breakpoint.
- Sub-page scrolling via `body.sub-page` (normal flow, no `overflow: hidden`) while the home hero stays a locked full-screen grid.