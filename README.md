# BlowGrrr
Making my own dynamic blogging website!
<a href="https://ujjuboi.github.io/">Check It Out!</a>

## Main Objectives:
* Learn Model View Control Framework
* HTML Semantics
* CSS & SASS media queries
* JavaScript & Responsiveness

---

# Project Map (for AI agents)

> Reference this section instead of re-scanning the repo. Static portfolio site: plain HTML/CSS + inline vanilla JS. **No build system, no package manager, no dependencies** — files are served as-is via GitHub Pages. To preview locally, just open `index.html` in a browser.

## File tree

```
├── index.html        Home page (entry point)
├── style.css         Global stylesheet (theme tokens live here)
├── Resume.html       Resume page
├── Resume.css        Resume-specific styles (720px breakpoint)
├── cv.md             CV content in Markdown (source of truth for Resume.html text)
├── Images/           Shared assets (see below)
└── plan/
    └── plan_blog.md  Approved plan for upcoming Blog feature (Blog.html + Blog.css)
```

## Page inventory

| Page | Loads | Inline `<script>` does |
|---|---|---|
| `index.html` | `style.css` | Time-based greeting into `#salutation`; redirects to `Mobile/mobile.html` when `screen.width <= 500`; `notice()` alert for unbuilt nav links (Blog/Projects); theme-select + menu-icon logic |
| `Resume.html` | `style.css` + `Resume.css` | `toggleSection()` collapsible sections (+/- icons); `notice()` alerts; same theme-select + menu-icon logic |
| `Mobile/mobile.html` | `Mobile/mobile.css` | Legacy; redirect target from index.html |

## Key details / conventions

- **Shared header/footer**: The `<header>` (brand + nav) and footer social-SVG block are **duplicated verbatim across pages** — any nav or footer change must be applied to every page (`index.html`, `Resume.html`; future `Blog.html`). `.active` class marks the current page's nav link.
- **Theming**: All colors and fonts come from CSS custom properties in `:root` of `style.css` (`--borderColor`, `--backgroundColor`, `--shadowColor`, `--contentColor`, `--headings`, `--poppins`, etc.). Never hardcode colors — use the variables. Fonts are imported at the top of `style.css`.
- **Layout**: `body` is a CSS grid (`15vh / 60vh / 28vh`) with `overflow: hidden` on desktop pages. Pages that need scrolling must override this (e.g., planned `Blog.css` sets `body { display:block; overflow-y:auto }`). Resume.css uses a `720px` breakpoint — match it for new responsive work.
- **Visual language**: Beige background, black borders, offset solid box-shadows (`--shadowColor`), rounded corners. Reuse existing patterns (`.skill-item` styling) rather than inventing new ones.
- **Assets**: `Images/` holds shared assets: `MyImage.jpg` (hero photo) plus social/menu/signature SVGs. Footer social icons are inline SVGs in the HTML, not `<img>` tags. `Mobile/Graphics/*` belongs exclusively to the legacy mobile site — don't reference it from desktop pages and don't reuse it for new features.
- **Unbuilt routes**: Blog and Projects nav links currently call `notice()` ("Under Development!"). Blog is planned per `plan/plan_blog.md`: single-file `Blog.html` + `Blog.css`, same header/footer, hardcoded posts array, view-swap navigation, banners from existing SVG assets.
- **Content source**: `cv.md` is the canonical CV text; `Resume.html` renders a subset of it. Update both when resume content changes.
- **Git**: Default branch is `main`; deploys straight from repo root to GitHub Pages. Keep everything relative-pathed (`./style.css`, not absolute paths).

## When making changes

1. New page → copy the header/footer structure from `Resume.html`, add its own CSS file, link `style.css` first.
2. Style changes → prefer editing `style.css` variables/components over page-specific overrides.
3. Responsive changes → use the 720px breakpoint convention; leave `Mobile/` untouched (it's legacy).
4. After edits, verify by opening the affected pages directly in a browser — there is no linter, test suite, or build step.
