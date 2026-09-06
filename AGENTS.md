# opencode.md — Project Norms

Static portfolio site. Plain HTML + external vanilla JS/CSS. **No build system, no package manager, no dependencies** — files are served as-is via GitHub Pages. Preview locally by opening `index.html` in a browser.

## File structure

| Asset | Convention | Example |
|---|---|---|
| Page | `pages/<Name>/<Name>.html` (PascalCase, matching folder) | `pages/Blog/Blog.html` |
| Page CSS | `styles/<Name>.css` (PascalCase, matching page) | `styles/Blog.css` |
| Page JS | `scripts/<name>.js` (lowercase, matching page) | `scripts/blog.js` |
| Shared JS | `scripts/shared.js` | — |
| Shared theme/components | `styles/styles.css` (custom properties + shared classes) | — |
| Blog post | `src/Blogs/NN-slug-title.md` (zero-padded number + kebab slug) | `08-legacy-stacks.md` |
| Study plan | `src/StudyPlans/<slug>.md` + `src/StudyPlans/plans.json` (plan manifest) | `networking.md` |
| Content source | `src/cv.md` (canonical resume), `src/Blogs/posts.json` (blog manifest) | — |

## HTML

- Use **semantic** HTML (header, nav, section, footer, etc.).
- Use **relative paths only** (`./`, `../`, `../../`) — never absolute paths.
- Load order on sub-pages: shared `styles/styles.css` first, then page CSS; `scripts/shared.js` before the page script.
- The `<header>` (brand + nav) and footer social-SVG blocks are **duplicated verbatim across every page** — apply any nav/footer change to all pages. `.active` marks the current page's nav link. Sub-pages use `<body class="sub-page">`; `index.html` does not.
- Attribute values use double quotes.

## JavaScript

- **`const` by default**; `let` only when reassignment is required. Never use `var` in new code.
- **JSDoc-style comment on every function** (top-level and nested callbacks).
  ```js
  /**
   * Renders the list of posts grouped by category.
   */
  function renderBlogList() { ... }
  ```
- Use single quotes for strings.
- In all JS files under `scripts/`, never use abbreviated names for variables, functions, or other identifiers — always use descriptive, full names (e.g. `postCount` not `pc`, `renderBlogList` not `rbl`).
- Cross-page logic goes in `scripts/shared.js`; page-specific logic in the page's own script (e.g. `scripts/blog.js`). Never duplicate shared helpers per page.
- Use `fetch()` with relative paths; the site must work when opened from `file://` and GitHub Pages.

### Standardized page-script form

Every page script follows the same shape; mirror it rather than inventing a
new structure:

1. **Hardcoded `const` array(s)** at the top describing display/config data —
   labels, categories, and any content structure that must not change. Declared
   as a literal array (e.g. `categories = [...]` in `blog.js` / `resume.js`).
   `let`/mutation is only allowed when the script genuinely reassigns a value.
2. **`const` array(s) populated by `fetch`** that hold parsed content loaded
   from a source manifest (e.g. `posts`, `books`, `studyPlans`, `sections`).
3. **Loading via manifest** — never enumerate files or hardcode content in the
   script. A `loadX()` async function fetches the area's manifest JSON (e.g.
   `src/Blogs/posts.json`, `src/Books/books.json`, `src/StudyPlans/plans.json`,
   `src/cv.md`), iterates the returned filenames, fetches each markdown, and
   parses it into the content array:
   ```js
   async function loadBooks() {
     const res = await fetch('../../src/Books/books.json');
     const filenames = await res.json();
     for (const file of filenames) {
       const mdRes = await fetch('../../src/Books/' + file);
       const text = await mdRes.text();
       books.push(parseBook(text, file));
     }
   }
   ```
4. **Rendering** — a `renderX()` function converts the loaded arrays into DOM,
   usually via shared collapsible `Section` components; tuck parsing helpers
   (`parseBook`, `parseStudyPlan`, `parseCV`) in the same script.
5. **Bootstrap** — call the loader(s), then render, honoring any incoming
   `#hash` deep-link after load resolves:
   ```js
   Promise.all([loadBooks(), loadStudyPlans()]).then(() => {
     renderBooks();
     renderStudyPlans();
     if (window.location.hash.startsWith('#book-')) { ... }
   });
   ```

## CSS

- **Never hardcode colors or typography.** All colors/fonts come from CSS custom properties in `:root` of `styles/styles.css` (`--borderColor`, `--backgroundColor`, `--shadowColor`, `--contentColor`, `--headings`, `--poppins`, etc.).
- **Reuse existing component classes** (`.card`, `.section-heading`, `.skill-item`, `.stat-card`) rather than inventing new ones.
- Shared/cross-page styles extend `styles/styles.css`; page CSS files hold only page-specific layout.
- Responsive breakpoint convention: **720px**.
- Selectors use lowercase kebab-case (`.post-grid`, `.card-title`).

## Verification

- No linter, test suite, or build step exists.
- Run `node --check` on any modified JS file to catch syntax errors.
- Manually verify by opening the affected page(s) in a browser.
- `.mjs` files expect for `.opencode/skills/quick-test/test.mjs` are used only for testing — never commit or push them. Delete after testing is done. DO NOT DELETE `.opencode/skills/quick-test/test.mjs`.

## Out of scope

- **Git/branch/commit workflow**: handled by the user.
- **README.md**: protected — never edit.
- **Skills in `.opencode/`** (`quick-blog`, `quick-book`, `quick-study-plan`): all content publishing. Use the relevant skill; do not reinvent its workflow.
- **quick-test** (`.opencode/skills/quick-test`): triggered **manually by the user only** — never invoked by the AI on its own.