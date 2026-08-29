# Rename "Projects" → "MySpace" (MySpace page stack only)

Rename the `pages/Projects/Projects.html` section to `MySpace` — directory, files, UI (nav + title), and code (IDs/classes/JS/CSS). The unrelated "Projects" CV section (`resume.js`/`Resume.css`) and the blog "Personal Projects" category are **out of scope** and left untouched.

## Files to rename
- `pages/Projects/` directory → `pages/MySpace/`
- `pages/Projects/Projects.html` → `pages/MySpace/MySpace.html`
- `scripts/projects.js` → `scripts/myspace.js`
- `styles/Projects.css` → `styles/MySpace.css`

## 1. `pages/MySpace/MySpace.html`
- CSS link `../../styles/Projects.css` → `../../styles/MySpace.css`
- `<title>Projects - Ujjwal Verma</title>` → `<title>MySpace - Ujjwal Verma</title>`
- **Nav**: replace the dropdown
  ```html
  <li class="nav-dropdown">
    <a href="#">Projects</a>
    <ul class="dropdown">
      <li><a href="./Projects.html" target="_self" class="active">Professional</a></li>
      <li><a onclick="notice()" href="#">mySpace</a></li>
    </ul>
  </li>
  ```
  with a single direct link (this page):
  ```html
  <li><a href="./MySpace.html" target="_self" class="active">MySpace</a></li>
  ```
  (dropdown + `mySpace` notice item removed; `.active` moves to the single link)
- `data-section="projects"` → `data-section="myspace"`
- `id="projects-container"` → `id="myspace-container"`
- `class="projects-section"` (×4) → `class="myspace-section"`
- `class="project-tag"` (line 44, activity card) → `class="myspace-tag"`
- Script `../../scripts/projects.js` → `../../scripts/myspace.js`

## 2. `scripts/myspace.js` (renamed from `scripts/projects.js`)
- `tagSpan.className = 'project-tag'` → `'myspace-tag'`
- `initMenuToggle('#projects-container')` → `initMenuToggle('#myspace-container')`

## 3. `styles/MySpace.css` (renamed from `styles/Projects.css`)
- Change the `.project-tag` selector (line 82) → `.myspace-tag`

## 4. Nav in the other 3 HTML pages (index.html, Blog.html, Resume.html)
Each currently has the dropdown `Projects ▸ [Professional][mySpace]`. Replace with a single direct link (no `.active` — that belongs to the current page):
- `index.html`: `<li><a href="pages/MySpace/MySpace.html" target="_self">MySpace</a></li>`
- `pages/Blog/Blog.html` and `pages/Resume/Resume.html`:
  `<li><a href="../MySpace/MySpace.html" target="_self">MySpace</a></li>`

## 5. `.github/workflows/update-readme.yml`
- Lines 98 & 106 (`getLeetcodeApi` / `getGitHubUser`): `pages/Projects/Projects.html` → `pages/MySpace/MySpace.html`
- Line 121 (`detectNoticeRoutes` file list): same rename
- Line 271 (Shared JS/CSS text): `scripts/{home,blog,projects,resume}.js` → `scripts/{home,blog,myspace,resume}.js`; `styles/{Blog,Projects,Resume}.css` → `styles/{Blog,MySpace,Resume}.css`

## 6. `README.md`
- File tree: `Projects/Projects.html` → `MySpace/MySpace.html`; `projects.js` → `myspace.js`; `Projects.css` → `MySpace.css`
- Page inventory row for the Projects page: `pages/Projects/Projects.html`, `Projects.css`, `projects.js` → updated names
- Key details: `scripts/{home,blog,projects,resume}.js` and `styles/{Blog,Projects,Resume}.css` → updated
- "Unbuilt routes" line: `mySpace currently call notice()` → since mySpace becomes a real route, change to `All nav routes are built`

## 7. Untouched (out of scope)
- CV "Projects" section in `scripts/resume.js` / `styles/Resume.css`
- "Personal Projects" blog category in `scripts/blog.js`
- Historical `plan/*.md` planning documents

## Verification
- `git status` + `grep` to confirm no stale refs remain (outside `plan/` docs) for: `pages/Projects`, `Projects.html`, `scripts/projects.js`, `styles/Projects.css`
- Open the renamed page plus each nav link to confirm routing still works (no build/test step; manual browser check)
