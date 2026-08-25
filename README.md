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
├── index.html                    Home page (entry point)
├── style.css                     Global stylesheet (theme tokens live here)
├── cv.md                         CV content in Markdown (source of truth for Resume.html text)
├── Images/
│   ├── MyImage.jpg               Hero photo
│   ├── Signature 1.svg           Signature asset
│   ├── Menu  1.svg               Mobile menu icon
│   ├── linkedin 1.svg            LinkedIn icon
│   ├── email 1.svg               Email icon
│   ├── github 1.svg              GitHub icon
│   └── Graphics/                 Blog post banners
│       ├── ActiveDirectory.svg
│       ├── GithubActions.svg
│       ├── LegalDocuments.svg
│       ├── Mind.svg
│       ├── MongoDB.svg
│       ├── Movie.svg
│       ├── SensorData.svg
│       └── php.png
├── pages/
│   ├── Resume/
│   │   ├── Resume.html           Resume page
│   │   └── Resume.css            Resume-specific styles (720px breakpoint)
    ├── Blog/
    │   ├── Blog.html             Blog page (posts + view-swap)
    │   └── Blog.css              Blog-specific styles (720px breakpoint)
    └── Projects/
        ├── Projects.html         Projects page (GitHub stats, activity, LeetCode)
        └── Projects.css          Projects-specific styles (720px breakpoint)
└── plan/
    ├── plan_blog.md              Approved plan for Blog feature
    ├── plan_project_professional.md  Approved plan for Projects page
    └── plan_remove_mobile.md     Plan for removing legacy mobile site
```

## Page inventory

| Page | Loads | Inline `<script>` does |
|---|---|---|
| `index.html` | `style.css` | Time-based greeting into `#salutation`; redirects to `Mobile/mobile.html` when `screen.width <= 500`; `notice()` alert for unbuilt nav links (Projects); menu-icon logic |
| `pages/Resume/Resume.html` | `style.css` + `Resume.css` | `toggleSection()` collapsible sections (+/- icons); `notice()` alerts; menu-icon logic |
| `pages/Blog/Blog.html` | `style.css` + `Blog.css` | Hardcoded `posts[]` array; `renderBlogList()` grouped by category; `showPost()`/`showBlogList()` view-swap; theme-select + menu-icon logic |
| `pages/Projects/Projects.html` | `style.css` + `Projects.css` | GitHub stats + recent activity; LeetCode stats (graceful degradation); latest blog post; menu-icon logic |

## Key details / conventions

- **Shared header/footer**: The `<header>` (brand + nav) and footer social-SVG block are **duplicated verbatim across pages** — any nav or footer change must be applied to every page (`index.html`, `pages/Resume/Resume.html`, `pages/Blog/Blog.html`). `.active` class marks the current page's nav link.
- **Theming**: All colors and fonts come from CSS custom properties in `:root` of `style.css` (`--borderColor`, `--backgroundColor`, `--shadowColor`, `--contentColor`, `--headings`, `--poppins`, etc.). Never hardcode colors — use the variables. Fonts are imported at the top of `style.css`.
- **Layout**: `body` is a CSS grid (`15vh / 60vh / 28vh`) with `overflow: hidden` on desktop pages. Pages that need scrolling must override this (e.g., planned `Blog.css` sets `body { display:block; overflow-y:auto }`). Resume.css uses a `720px` breakpoint — match it for new responsive work.
- **Visual language**: Beige background, black borders, offset solid box-shadows (`--shadowColor`), rounded corners. Reuse existing patterns (`.skill-item` styling) rather than inventing new ones.
- **Assets**: `Images/` holds shared assets: `MyImage.jpg` (hero photo) plus social/menu/signature SVGs. Footer social icons are inline SVGs in the HTML, not `<img>` tags. `Mobile/Graphics/*` belongs exclusively to the legacy mobile site — don't reference it from desktop pages and don't reuse it for new features.
- **Unbuilt routes**: Projects is built per `plan/plan_project_professional.md`: Professional page with GitHub stats and LeetCode, plus mySpace nav link that calls `notice()` ("Under Development!"). Blog is built per `plan/plan_blog.md`: single-file `Blog.html` + `Blog.css`, same header/footer, hardcoded posts array, view-swap navigation, banners from existing SVG assets.
- **Content source**: `cv.md` is the canonical CV text; `Resume.html` renders a subset of it. Update both when resume content changes.
- **Git**: Default branch is `main`; deploys straight from repo root to GitHub Pages. Keep everything relative-pathed (`./style.css`, not absolute paths).

## When making changes

1. New page → copy the header/footer structure from `Resume.html`, add its own CSS file, link `style.css` first.
2. Style changes → prefer editing `style.css` variables/components over page-specific overrides.
3. Responsive changes → use the 720px breakpoint convention; leave `Mobile/` untouched (it's legacy).
4. After edits, verify by opening the affected pages directly in a browser — there is no linter, test suite, or build step.
