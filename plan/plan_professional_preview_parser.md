# Professional Page — Markdown Preview Parser Plan

> **Scope:** `pages/Professional/Professional.html` + `scripts/professional.js` + `styles/Professional.css`.
> Follows up on `plan_professional_markdown_preview.md`. The Professional page's tab/sidebar UI is
> already an IDE-style file explorer (Experience / Projects / Skills / Latest Posts). This plan
> replaces the preview-view markdown renderer with a proper parser (vendored **Marked.js**) so the
> **preview** renders the raw `src/professionalResume.md` (single source of truth) including its
> **emojis, tables, and images**. Everything else — VS Code aesthetic, tabs, sidebar, Source view,
> blog, banner — stays identical.

## Scope (confirmed with the user)

- The change is **ONLY the preview view** in the Professional page.
- The VS Code aesthetic and all other functionality (tabs, sidebar, Source view, blog, banner)
  remain exactly the same.
- The page fetches **`src/professionalResume.md`** (not `src/cv.md`) as its single source of truth.
- **Token highlighting is removed.** Special text is marked explicitly in the markdown itself, not
  auto-detected by a token regex map.
- `parseCV()` gets **minimal internal fixes** so tabs/Source still populate from the new file's
  format — no change to how those are rendered.
- `scripts/resume.js` + `pages/Resume/*` stay pointed at `src/cv.md` and are **unaffected**.

## Current architecture (relevant parts)

- `scripts/professional.js`:
  - `loadCV()` (`:314`) fetches `../../src/cv.md` (`:316`).
  - `parseCV()` (`:224`) extracts `{ summary, experience, projects, skills }` and powers tabs/Source.
  - Preview-only markdown currently uses a hand-rolled engine:
    - `mdInline()` (`:7`) and `mdBlock()` (`:26`) — used **only** by the preview path.
    - `renderExperience()` (`:746`) reconstructs markdown from `job.bullets`,
      `preview.innerHTML = mdBlock(lines.join('\n'))`.
    - `renderProjects()` (`:815`) builds `preview.innerHTML = mdInline(proj.desc)`.
    - `renderSkills()` (`:878`) builds `.editor-preview` tag chips.
  - Token highlighting: `TOKEN_MAP` (`:100`), `TOKEN_RE var` (`:125`), `NUM_RE` (`:130`),
    `applyRegexToNode` (`:132`), `textNodesIn` (`:157`), `highlightTokens` (`:171`); applied to
    `.editor-bullets, .editor-excerpt` in `renderProfessional()` (`:623`).
- `styles/Professional.css`: token color classes `.tk-kw/.tk-co/.tk-role/.tk-num/.tk-fn/.tk-lg`
  (`:372-406`); preview typography `.editor-preview` (`:957-1110`).
- `pages/Professional/Professional.html`: loads only `../../scripts/professional.js` (`:59`).

## The new source file — `src/professionalResume.md`

Fetched and rendered directly. Notable content affecting the plan:
- Emoji-prefixed section headers: `## 📋 Professional Summary`, `## 💼 Work Experience`,
  `## 🚀 Projects`, `## 🛠️ Skills`.
- Emoji-prefixed subheadings: `#### 📥 Ingestion Architecture`, `#### ⚡ Performance Optimization`, etc.
- **GFM tables** (Metrics, Capabilities, Skills).
- **Inline HTML `<img>`** tags pointing at `../Images/Graphics/*.svg` located **between/inside**
  jobs (e.g. MongoDB.svg, GithubActions.svg, ActiveDirectory.svg, SensorData.svg).
- **Bold**, **fenced inline code** (`` `S3 + MongoDB GridFS` ``), **`---`** horizontal rules.
- Projects use `### 📡 Sensor Data Communication` headings + `**Open Source** | ...` meta + paragraph
  (NOT the old `- **Name** (Tag) -- Desc` bullets).
- Skills use a **table**, not `- **Category:** items` bullets.

Two things this file surfaces that the current code gets wrong:
1. **Parser bug:** inline `<img>` before a job's role/date (DDPX job, `:76`) is treated as the date
   by the loose `else if (t && !job.date)` branch (`:267`). Date detection must require a
   date-shaped string.
2. **Image path resolution:** rendered `<img src="../Images/...">` resolves relative to the page
   URL (`pages/Professional/`), so `../Images/Graphics/x.svg` → `pages/Images/...` which does not
   exist. Assets live at `Images/Graphics/` (page-relative `../../Images/Graphics/...`). Rewrite at
   render time so the md stays the clean source of truth.

## Changes

### 1. Vendor Marked.js — `scripts/lib/marked.min.js` (NEW)
- Add the Marked UMD build as `scripts/lib/marked.min.js` to keep the project's no-CDN,
  relative-path convention. Exposes a global `marked`.

### 2. `pages/Professional/Professional.html`
- Load Marked before `professional.js` (`:59`):
  ```html
  <script src="../../scripts/lib/marked.min.js"></script>
  <script src="../../scripts/professional.js"></script>
  ```

### 3. `scripts/professional.js`

**a) Point fetch at the new source (`:316`):**
```js
fetch('../../src/professionalResume.md')
```

**b) Remove token highlighting entirely:**
- Delete `TOKEN_MAP` (`:100-123`), `TOKEN_RE var` (`:125-128`), `NUM_RE` (`:130`),
  `applyRegexToNode` (`:132-155`), `textNodesIn` (`:157-169`), `highlightTokens` (`:171-178`).
- Delete the highlighting loop in `renderProfessional()` (`:623-625`).

**c) Marked provider + image-path rewrite:**
```js
if (typeof marked !== 'undefined') {
  marked.setOptions({ gfm: true, breaks: false, headerIds: false, mangle: false });
}
function renderMarkdown(md) {
  if (typeof marked !== 'undefined') {
    return marked.parse(String(md || '')).replace(/src="\.\.\/Images\//g, 'src="../../Images/');
  }
  return escapeHtml(String(md || ''));
}
```

**d) `parseCV()` (`:224-312`) — minimal internal fixes** so `data.summary/experience/projects/skills`
still populate tabs/Source from the new file (no tab/Source UI change):
- **Section-name matching** (`:234/:242/:278/:294`): strip a leading emoji from `## ` headers
  before comparing (e.g. `## 📋 Professional Summary` → `Professional Summary`). Use a small strip
  of common emoji ranges / leading non-word char (Unicode-safe where possible, else
  `replace(/^[^\w\s]+/, '')`).
- **Work Experience date detection** (`:267`): require a date-shaped string so an inline `<img>`
  line (or any other line) is not captured as the date:
  ```js
  } else if (t && !job.date && /^[A-Za-z]{3,10}\s+\d{4}/.test(t)) {
    job.date = t;
    job.sortKey = parseStartSortKey(t);
  }
  ```
- **Capture `rawMd` for each job**: per `### ` job, collect every non-empty line belonging to it
  (subheadings, bullets, sub-bullets, tables, `<img>`, `---`) into `job.rawMd`, excluding the
  `### company`, `**role**`, and date lines (rendered by `.editor-title`/`.editor-meta`).
- **Projects** (`:278-291`): new format uses `### 📡 Name` headings + `**Open Source** | ...` meta +
  paragraph. Parse `name` (heading minus emoji), `tag` (from the `**...** | ...` line), `desc`
  (following paragraph); store the full block in `proj.rawMd`. Replace the old
  `- **Name** (Tag) -- Desc` bullet parsing.
- **Skills** (`:294-306`): new format is a **table** (`| Category | Technologies |`). Parse data
  rows into `category`/`items`; store raw rows in `cat.rawMd`.

**e) Render the preview from raw markdown (preview-only):**
- `renderExperience()` (`:746`): `preview.innerHTML = renderMarkdown(job.rawMd.join('\n'));`
- `renderProjects()` (`:815`): `preview.innerHTML = renderMarkdown(proj.rawMd.join('\n'));`
- `renderSkills()` (`:878-886`): render the table via `renderMarkdown(cat.rawMd.join('\n'))`,
  replacing the chip preview.
- `mdInline()`/`mdBlock()` (`:7-89`): no longer used once the above are in place → remove them
  (only the preview used them).

### 4. `styles/Professional.css`
- **Remove** the `.tk-*` block (`:372-406`).
- **Extend `.editor-preview`** so Marked output matches the reference look (dark theme):
  - **table / th / td** — borders, header background, zebra striping.
  - **img** — `max-width:100%; height:auto; display:block`. SVGs already carry inline
    width/height/styles from the markdown; do not override their `object-fit`/`background`.
  - **pre / code** — muted background, padding, rounded corners, `overflow-x:auto` for fenced blocks.
  - **blockquote**, **p** bottom margin, **hr**, emoji-friendly heading spacing.
- Keep existing heading/list/strong/`a`/inline-code rules in `.editor-preview`.

## Unchanged

- `src/professionalResume.md` (single source of truth; authored with emojis/tables/images).
- `scripts/resume.js` + `pages/Resume/*` (still read `src/cv.md`).
- Tabs, sidebar, Source view (`.editor-comment/.editor-title/.editor-meta/.editor-bullets`),
  banner, blog loading.

## Conventions honored

- Relative paths only (`../../…`). No package manager, no CDN at runtime (Marked vendored).
- No build step.

## Execution order

1. Vendor `scripts/lib/marked.min.js`.
2. `pages/Professional/Professional.html`: add the Marked `<script>` tag.
3. `scripts/professional.js`: fetch → `professionalResume.md`; remove token-highlight code;
   add `renderMarkdown`; minimal `parseCV()` fixes; capture `rawMd`; render previews via
   `renderMarkdown`; remove `mdInline`/`mdBlock`.
4. `styles/Professional.css`: remove `.tk-*`; style tables/img/pre/blockquote/p/hr in `.editor-preview`.
5. Verify by opening `pages/Professional/Professional.html` in a browser (no build step):
   - Tabs/sidebar/Source populate identically (roles, companies, dates, sort order).
   - Each tab's **Preview** renders the raw markdown via Marked: emojis in headings, the metrics /
     capabilities / skills **tables**, the inline `<img>` SVGs (MongoDB, GithubActions,
     ActiveDirectory, SensorData resolve), bold, fenced code, `---` rules.
   - Token auto-coloring is gone; Source view shows plain bullets.
   - Resume page untouched and still works from `src/cv.md`.
   - No console errors; Marked lib loads.
