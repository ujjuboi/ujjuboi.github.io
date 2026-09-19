# Shared Styles & Theming (`styles/styles.css`)

The single source of truth for theme colors, fonts, typography scale, and shared component classes, loaded by every page. Page CSS files (`styles/{Home,Blog,MySpace,Professional,Resume}.css`) hold only page-specific layout.

## Implementation

| Area | Location |
|---|---|
| Theme vars | `:root { ... }` — `styles/styles.css` (e.g. `--borderColor`, `--backgroundColor`, `--shadowColor`, `--contentColor`, `--linkColor`, `--headings`, `--poppins`) |
| Font themes | `[data-font-theme='sans'|'ebook'|'scholarly']` blocks — `styles/styles.css` |
| Shared components | `.card`, `.section-heading` (+ `.collapsible`/`.active`/`.static`), `.title-text`, `.toggle-icon`, `.card-title`, `.card-excerpt`, `.card-date`, `.card-link`, `.skill-item`, `.stat-card` |
| Sub-page layout | `body.sub-page`, `body.sub-page section`, `.page-container` — `styles/styles.css:64`/`:72`/`:78` |
| Animation | `@keyframes fadeIn` (`:59`) |
| Responsive | `@media (max-width: 720px)` — `styles/styles.css:218` |

## Conventions enforced

- **Never hardcode colors/fonts** — always use `:root` vars or font-theme selectors.
- **Reuse component classes** (`.card`, `.section-heading`, `.skill-item`, `.stat-card`) before inventing new ones.
- Extend shared styles in `styles/styles.css`; page CSS holds page-specific overrides only.
- All interactive cards carry `box-shadow`, hover animation, and `cursor: pointer`.
- Responsive work uses the **720px** breakpoint convention.

## History

The shared-style extraction consolidated repeated body/section/container card/heading/mobile-header rules that were copy-pasted across the page stylesheets.