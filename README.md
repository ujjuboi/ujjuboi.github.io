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
├── .opencode/
│   └── skills/
│       └── quick-blog/
│           └── SKILL.md
├── Images/
│   ├── Graphics/
│   │   ├── ActiveDirectory.svg
│   │   ├── GithubActions.svg
│   │   ├── LegalDocuments.svg
│   │   ├── Mind.svg
│   │   ├── MongoDB.svg
│   │   ├── Movie.svg
│   │   ├── php.png
│   │   └── SensorData.svg
│   ├── email 1.svg
│   ├── github 1.svg
│   ├── linkedin 1.svg
│   ├── Menu  1.svg
│   ├── MyImage.jpg
│   └── Signature 1.svg
├── pages/
│   ├── Blog/
│   │   └── Blog.html
│   ├── Projects/
│   │   └── Projects.html
│   └── Resume/
│       └── Resume.html
├── scripts/
│   ├── blog.js
│   ├── home.js
│   ├── projects.js
│   ├── resume.js
│   └── shared.js
├── src/
│   ├── Blogs/
│   │   ├── 01-scaling-identity-data.md
│   │   ├── 02-teaching-machines-to-read.md
│   │   ├── 03-teaching-ci-to-think.md
│   │   ├── 04-getting-into-ai-ml-agents.md
│   │   ├── 05-side-projects.md
│   │   ├── 06-real-time-sensor-dashboards.md
│   │   ├── 07-directory-data-analytics.md
│   │   ├── 08-legacy-stacks.md
│   │   ├── posts.json
│   │   └── template.md
│   └── cv.md
├── styles/
│   ├── Blog.css
│   ├── Home.css
│   ├── Projects.css
│   ├── Resume.css
│   └── styles.css
├── .gitignore
├── index.html
└── README.md
```

## Page inventory

| Page | Loads | Inline `<script>` does |
|---|---|---|
| `index.html` | `style.css` | Time-based greeting into `#salutation`; `notice()` alerts for unbuilt nav links; menu-icon logic |
| `pages/Blog/Blog.html` | `style.css` | `notice()` alerts for unbuilt nav links; menu-icon logic |
| `pages/Projects/Projects.html` | `style.css` | `notice()` alerts for unbuilt nav links; `toggleSection()` collapsible sections (+/- icons); LeetCode stats via third-party API; menu-icon logic |
| `pages/Resume/Resume.html` | `style.css` | `notice()` alerts for unbuilt nav links; menu-icon logic |

## Key details / conventions

- **Shared header/footer**: The `<header>` (brand + nav) and footer social-SVG block are **duplicated verbatim across pages** — any nav or footer change must be applied to every page. `.active` class marks the current page's nav link.
- **Theming**: All colors and fonts come from CSS custom properties in `:root` of `style.css` (`--borderColor`, `--backgroundColor`, `--shadowColor`, `--contentColor`, `--headings`, `--poppins`, etc.). Never hardcode colors — use the variables. Fonts are imported at the top of `style.css`.
- **Layout**: `body` is a CSS grid (`15vh / 60vh / 28vh`) with `overflow: hidden` on desktop pages. Pages that need scrolling must override this (e.g., `Blog.css` sets `body { display:block; overflow-y:auto }`). Uses `720px` breakpoint for responsive work.
- **Visual language**: Beige background, black borders, offset solid box-shadows (`--shadowColor`), rounded corners. Reuse existing patterns (`.skill-item` styling) rather than inventing new ones.
- **Assets**: `Images/` holds shared assets: `MyImage.jpg` (hero photo) plus social/menu/signature SVGs. Footer social icons are inline SVGs in the HTML, not `<img>` tags.
- **Unbuilt routes**: `../../index.html`, `../Resume/Resume.html`, `../Blog/Blog.html`, `../Projects/Projects.html`, `./Blog.html` currently call `notice()` ("Under Development!")
- **Content source**: `cv.md` is the canonical CV text; `Resume.html` renders a subset of it. Update both when resume content changes.
- **Git**: Default branch is `main`; deploys straight from repo root to GitHub Pages. Keep everything relative-pathed (`./style.css`, not absolute paths).

## Latest Blog Post

- **Scaling Identity Data Ingestion: MongoDB at Enterprise Scale** (Deloitte)

## When making changes

1. New page → copy the header/footer structure from an existing page, add its own CSS file, link `style.css` first.
2. Style changes → prefer editing `style.css` variables/components over page-specific overrides.
3. Responsive changes → use the 720px breakpoint convention.
4. After edits, verify by opening the affected pages directly in a browser — there is no linter, test suite, or build step.