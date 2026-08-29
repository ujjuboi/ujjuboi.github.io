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

> Reference this section instead of re-scanning the repo. Static portfolio site: plain HTML + external vanilla JS/CSS files. **No build system, no package manager, no dependencies** — files are served as-is via GitHub Pages. To preview locally, just open `index.html` in a browser.

## File tree

```
├── .opencode/
│   ├── skills/
│   │   └── quick-blog/
│   │       └── SKILL.md
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
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
│   ├── cv.md
│   └── study-plan.md
├── styles/
│   ├── Blog.css
│   ├── common.css
│   ├── Projects.css
│   ├── Resume.css
│   └── style.css
├── .gitignore
├── index.html
└── README.md
```

## Page inventory

| Page | CSS files | JS files | Behavior |
|---|---|---|---|
| `index.html` | `style.css` | `shared.js`, `home.js` | Time-based greeting into `#salutation`; `shared.js` (`notice()`, dropdown + footer `menuIcon` toggle via `initMenuToggle()`) |
| `pages/Blog/Blog.html` | `style.css` + `common.css` + `Blog.css` | `shared.js`, `blog.js` | Renders posts from `posts.json` manifest; `renderBlogList()` grouped by category; `showPost()`/`showBlogList()` view-swap; `toggleBlogSection()` collapsible categories; `shared.js` (`notice()`, dropdown + footer `menuIcon` toggle via `initMenuToggle()`) |
| `pages/Projects/Projects.html` | `style.css` + `common.css` + `Projects.css` | `shared.js`, `projects.js` | `toggleSection()` collapsible sections (+/- icons); LeetCode stats via third-party API (`fetchLeetCodeStats()`); GitHub repos/stats via GitHub API (`fetchGitHubStats()`); Recent activity / commit via GitHub API (`fetchRecentActivity()`); `shared.js` (`notice()`, dropdown + footer `menuIcon` toggle via `initMenuToggle()`) |
| `pages/Resume/Resume.html` | `style.css` + `common.css` + `Resume.css` | `shared.js`, `resume.js` | `shared.js` (`notice()`, dropdown + footer `menuIcon` toggle via `initMenuToggle()`) |

## Key details / conventions

- **Shared header/footer**: The `<header>` (brand + nav dropdown) and footer social-SVG block are **duplicated verbatim across pages** — any nav or footer change must be applied to every page. `.active` class marks the current page's nav link. Sub-pages use `<body class="sub-page">`; `index.html` does not.
- **Shared JS/CSS**: `scripts/shared.js` (`.notice()`, nav-dropdown logic, footer `menuIcon` toggle via `initMenuToggle()`) and `styles/common.css` are loaded by **every page**; `styles/style.css` holds the custom-property theme. Page-specific logic lives in `scripts/{home,blog,projects,resume}.js` and page CSS in `styles/{Blog,Projects,Resume}.css`. Load order: `style.css` (+ `common.css`) first, then page CSS, then `shared.js` before the page script. Put cross-page JS in `shared.js`, cross-page CSS in `common.css`.
- **Theming**: All colors and fonts come from CSS custom properties in `:root` of `style.css` (`--borderColor`, `--backgroundColor`, `--shadowColor`, `--contentColor`, `--headings`, `--poppins`, etc.). Never hardcode colors — use the variables. Fonts are imported at the top of `style.css`.
- **Layout**: `index.html` is a full-height grid hero; sub-pages use `body.sub-page` and scroll normally (they do **not** use `overflow:hidden`). Sections are often collapsible (`toggleSection()` / `toggleBlogSection()` with +/- icons). Uses `720px` breakpoint for responsive work.
- **Visual language**: Beige background, black borders, offset solid box-shadows (`--shadowColor`), rounded corners. Reuse existing patterns (`.card`, `.skill-item`, `.stat-card` styling) rather than inventing new ones.
- **Assets**: `Images/` holds shared assets: `MyImage.jpg` (hero photo) plus social/menu/signature SVGs plus `Images/Graphics/` (blog/project banner art). Footer social icons are inline SVGs in the HTML, not `<img>` tags.
- **Unbuilt routes**: All nav routes are built
- **Content source**: `src/cv.md` is the canonical CV text; `Resume.html` renders it via `scripts/resume.js`. `src/Blogs/posts.json` is the blog manifest (ordered list of `src/Blogs/*.md`); `Blog.html` renders via `scripts/blog.js`. Update the relevant source when content changes.
- **Git**: Default branch is `main`; deploys straight from repo root to GitHub Pages. Keep everything relative-pathed (`./style.css`, `../../styles/common.css`), never absolute paths.

## Latest Blog Post

- **Scaling Identity Data Ingestion: MongoDB at Enterprise Scale** (Deloitte)

## When making changes

1. New page → copy the header/footer + `<script>`/stylesheet block from an existing sub-page, keep the `pages/<Name>/<Name>.html` convention, and add `scripts/<name>.js` + `styles/<Name>.css`.
2. Cross-page JS → put it in `scripts/shared.js`; cross-page CSS → `styles/common.css`. Page-specific → the page's own file.
3. Style changes → prefer editing `style.css` variables/components over page-specific overrides.
4. Responsive changes → use the 720px breakpoint convention.
5. After edits, verify by opening the affected pages directly in a browser — there is no linter, test suite, or build step.