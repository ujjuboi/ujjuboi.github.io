# Professional Page — Markdown Preview Mode Plan

> **Scope:** `pages/Professional/Professional.html` + `scripts/professional.js` + `styles/Professional.css`.
> Follows up on `plan_professional_recruiter_page.md`: the page is now an IDE-style file explorer
> (sidebar folders Experience / Projects / Skills / Latest Posts, each file a tab + sidebar entry).
> This plan adds a rendered **Markdown Preview** per file, the way VS Code lets you toggle between
> source and rendered preview.

## Overview

Every file in the explorer currently opens in a "raw source" presentation (comment line like
`// Experience/swe-2.md`, monospace Consolas, syntax-colored tokens, a fake JS array for skills).
The goal:

1. Each file opens in a **readable, rendered Markdown Preview** by default.
2. A **Preview ↔ Source** segmented toggle per panel switches between rendered preview and the
   syntax-highlighted raw markdown (VS Code style).
3. **Skills files are converted from a fake JS array (`const frontend = [...]`) to real markdown**
   (heading + `- item` bullets); their preview renders skill **tag chips**.
4. Blog post files get a preview rendering their full paragraphs (parsed from the already-fetched
   `.md` text), not just the excerpt card.

Decisions confirmed with the user:
- Default mode when opening a file: **Preview** (readable).
- Skills files: **yes** to preview, rendered as a tag list, and the source changed from JS array to
  markdown.

## Current architecture (as of the latest changes)

- `scripts/professional.js`:
  - `renderExperience()` (:548) — one `.editor-view` per job: `.editor-comment`, `.editor-title`,
    `.editor-meta`, `ul.editor-bullets` (plain `textContent` + token highlight).
  - `renderProjects()` (:624) — comment, title, tag meta, `.editor-excerpt`.
  - `renderSkills()` (:685) — comment + `.skills-code` fake JS array (`const <short> = [...];`);
    `makeSpan()` is only used here.
  - `renderBlogCard()` (:883) — comment, title, meta, excerpt, CTA link; in `loadBlogPosts()` (:759)
    the full post text is fetched but only headers are parsed.
  - `createEditorPanel()` (:859) — returns `{ tabs, views, activeTab }`.
  - Folder/file tree: `registerSectionFolder()` / `registerDirectoryEntry()` use `tabRefs`
    `{ label, fileName, tab, view, editor }` to bind sidebar entries to editor tabs.
  - Token highlighting run in `renderProfessional()` (:526) on `.editor-bullets, .editor-excerpt, .skills-code`.
- No preview/toggle code exists yet.

## Changes

### 1. `scripts/professional.js` — markdown engine + per-file preview

- **Inline markdown renderer** (no deps, no build system):
  - `mdInline(text)` → escape HTML first, then transform:
    - `` `code` `` → `<code>…</code>`
    - `**bold**` → `<strong>…</strong>`
    - `*italic*` → `<em>…</em>`
    - `[text](url)` → `<a href target="_blank" rel="noopener">` (scheme whitelist: `http`, `https`, `mailto`, `#`).
- **Source/Preview split per `.editor-view`**: keep all existing source nodes, add a hidden sibling
  `div.editor-preview`:
  - **Experience**: preview = role heading + company · date meta + `<ul>` of bullets rendered via
    `mdInline` (readable `•` markers, justified).
  - **Projects**: preview = name + tag + rendered description paragraph.
  - **Skills**: **rewrite source to markdown** — comment + `.editor-title` + `ul.editor-bullets`
    (`- item` lines). Remove `.skills-code` construction and `makeSpan()`. Preview = category heading
    + tag chips (`span.tag` per skill).
  - **Blog**: add `parsePostParagraphs(text)` (mirror of `blog.js:parsePostBody`) in
    `loadBlogPosts()`; preview = title + `category · date` meta + paragraphs + the existing CTA link.
- **Mode toggle** `addPreviewToggle(panel)`:
  - Segmented **Preview | Source** control pinned to the right of the panel's tab bar.
  - Toggles `is-preview` class on the panel (shared across all files in that panel).
  - `aria-pressed` / labels; **default = Preview** (panel gets the class at build time).
  - Wire into Experience, Projects, Skills, and Latest Posts (blog panel wired after posts load).
- **`createEditorPanel()`**: wrap `.editor-tabs` in a flex row (`editor-tabsbar` = scrolling tabs +
  right-aligned modebar) so the toggle doesn't break horizontal tab scrolling; return the modebar ref.
- **Highlight**: update the loop at :526 — drop `.skills-code`, add `.editor-preview` so tech
  names/numbers keep accent colors in preview too (existing `textNodesIn`/`highlightTokens` already
  skip `a` and token spans).

### 2. `styles/Professional.css`

- **Modebar**: segmented-control styles (VS Code-like active segment), right-aligned in the tab bar.
- **Mode visibility**: `.editor-panel.is-preview` hides `.editor-comment`, `.editor-bullets`,
  (former) `.skills-code`; shows `.editor-preview`. `.editor-title` / `.editor-meta` stay visible in
  both modes.
- **Preview typography** (readable, not "source"):
  - Real sans stack with `system-ui` fallback — note `--poppins` and `--headings` are remapped to
    Consolas on `body.pro-page`, so preview overrides with its own font-family.
  - Max-width ~70ch, `line-height: 1.7`, `h3`/headings in accent color, `•` list markers, `strong`,
    `<code>` chips (muted background + mono), `a` link color + underline-on-hover.
  - Skill **tag chips** (`span.tag`).
  - `clamp()` responsive sizing inside the existing `@media (max-width: 720px)` block.
- **Remove** now-unused `.skills-code` / `.skills-code-line` rules.

### 3. `src/cv.md` (light pass)

- Add tasteful inline markdown so previews show structure:
  - `**bold**` on key results, `` `code` `` on tech, e.g. `` `S3 + MongoDB GridFS` ``,
    `**100K → 400K**`, `**1,500 records/sec**`.
  - Parser-safe: `parseCV()` only treats a full `**…**` line as a role; bullets start with `- ` and
    are untouched.

## Unchanged

- `pages/Professional/Professional.html` (all chrome is injected by JS).
- Sidebar / folder logic, banner, `highlightTokens` core, blog fetch flow.
- No new files; no dependencies.

## Conventions honored

- Relative paths only (`../../…`). No build system, no package manager, no dependencies.
- Reuse existing helpers/patterns (`escapeHtml`, `textNodesIn`, `highlightTokens`, `tabRefs`).
- 720px breakpoint for responsive work.

## Execution order

1. `scripts/professional.js`: `mdInline()` + `parsePostParagraphs()` + `createEditorPanel()` layout.
2. `scripts/professional.js`: per-view preview nodes (Experience → Projects → Skills conversion →
   Blog).
3. `scripts/professional.js`: `addPreviewToggle()` wiring, default Preview, highlight loop update.
4. `styles/Professional.css`: modebar + preview typography + tag chips + responsive + remove
   `.skills-code`.
5. `src/cv.md`: light markdown pass.
6. Verify by opening `pages/Professional/Professional.html` in a browser (no build step):
   - Each sidebar file opens in readable Preview by default.
   - Toggle switches to syntax-highlighted raw Source and back.
   - Skills files show markdown source + chip preview (no more JS array).
   - Blog files show full paragraphs in preview.
   - Mobile (<720px) remains usable; modebar doesn't break tab scrolling.