# Professional Recruiter One-Page Site Plan

> **Note:** This supersedes the older `plan_project_professional.md`, which described a different,
> now-outdated approach (a "Projects" page with a navbar dropdown, later renamed to MySpace).
> Reference `README.md` for repo conventions rather than stale plans.

## Overview

Create a **single standalone HTML page** to show recruiters a professional version of the
portfolio. It is a bare-bones, one-page resume site:

1. **Hero banner** with a write-up (headline + intro). No photo, no signature.
2. **Resume** as a visual vertical **timeline** (work experience, from `src/cv.md`).
3. **Projects** section — from `src/cv.md` Projects section (Sensor Data Communication).
4. **Two latest blog posts** by date with excerpts (linked to the existing Blog page).

It is **not linked** from any nav menu and **not** the default page — only reachable by typing
the URL manually.

## File location

```
pages/Professional/Professional.html
```

## Architecture decision

Per user request, the page **reuses existing sources**:

- Fetches `../../src/cv.md` (canonical CV) and renders experience/projects/summary.
- Fetches `../../src/Blogs/posts.json` + the two newest `.md` files for the latest blog cards.
- Loads the existing theme CSS (`Home.css` + `styles.css`) so styling stays consistent.
- New page-specific CSS lives in `../../styles/Professional.css`.
- New page-specific JS lives in `../../scripts/professional.js`.

Tradeoff: because content is fetched, the page must be served (GitHub Pages or a local server).
`file://` may block `fetch` in some browsers. Fallback option if needed: inline the content.

## New files

| File | Purpose |
|---|---|
| `pages/Professional/Professional.html` | The standalone recruiter page |
| `styles/Professional.css` | Page styles: hero, timeline, projects, blog cards, 720px responsive |
| `scripts/professional.js` | Fetch + render CV and blog data into the page |

## Page structure (`Professional.html`)

```
<!DOCTYPE html>
<html lang="en">
<head>
  → ../../styles/Home.css, ../../styles/styles.css, ../../styles/Professional.css
  → <title>Professional</title>
</head>
<body class="sub-page">   <!-- sub-page: normal page scroll, not the locked hero grid -->

  <!-- HERO BANNER (no photo, no signature) -->
  <header class="pro-hero">
    <h1>Ujjwal Verma</h1>
    <p class="role">Software Engineer II at Deloitte</p>
    <p class="tagline">Enterprise applications + AI-powered workflows...</p>
    <p class="contact">email · LinkedIn · GitHub</p>
  </header>

  <section>
    <div id="pro-container" class="page-container">

      ┌─ #summary ────────────────────────────────┐
      │  Recent experience at a glance (from CV)   │
      └────────────────────────────────────────────┘

      ┌─ #timeline (Resume) ─────────────────────┐
      │  Vertical timeline of .job cards:         │
      │   role / company · date / bullets         │
      └────────────────────────────────────────────┘

      ┌─ #projects ──────────────────────────────┐
      │  .project cards (from CV)                 │
      └────────────────────────────────────────────┘

      ┌─ #blog (2 latest posts) ─────────────────┐
      │  .post-card: title · category · date ·    │
      │  excerpt · Read more → Blog.html#post-X   │
      └────────────────────────────────────────────┘
    </div>
  </section>

  <footer> → GitHub / LinkedIn / Email social SVGs (reused from Resume.html) </footer>

  <script src="../../scripts/shared.js"></script>
  <script src="../../scripts/professional.js"></script>
</body>
</html>
```

## Hero banner (final spec)

- **Name** (Raleway heading) + **role** line + a short intro "write" in the same tone as the
  existing `index.html` hero text + contact links.
- **No photo.** **No signature.** Centered layout.

## `scripts/professional.js`

Reuse the parsing patterns already in the repo:

- `parseCV()` / section renderers — adapted from `scripts/resume.js` (fetch `../../src/cv.md`).
- `parsePostHeaders()` — adapted from `scripts/blog.js` (fetch `../../src/Blogs/posts.json`,
  then read first two files by manifest order, which is date-ordered newest-first; latest two
  are currently `01-scaling-identity-data.md` (Aug 22, 2026) and `02-teaching-machines-to-read.md`
  (Aug 10, 2026)).

No linter/tests exist — verify by opening the page in a browser.

## `styles/Professional.css`

- Reuse theme vars from `Home.css` (`--borderColor`, `--backgroundColor`, `--shadowColor`,
  `--contentColor`, `--headings`, `--poppins`). No hardcoded colors.
- **Timeline**: vertical line, left-aligned job nodes with date badges, matching the black-border +
  offset-shadow visual language.
- Blog cards mirror the existing `.card` / `.post-card` patterns.
- Responsive rules at the **720px breakpoint** convention.
- Reuse `.card`, `.skill-item`, `.stat-card` patterns rather than inventing new ones.

## Conventions honored

- Relative paths only (`../../src/...`, `../../styles/...`, `../../scripts/...`), never absolute.
- Default branch `main`, deploys from repo root to GitHub Pages.
- No build system, no package manager, no dependencies.

## Execution order

1. Create `styles/Professional.css`
2. Create `scripts/professional.js`
3. Create `pages/Professional/Professional.html`
4. Open `pages/Professional/Professional.html` in a browser to verify:
   - Hero renders (no photo/signature)
   - CV fetch renders summary, timeline, projects
   - Blog fetch renders 2 latest cards with excerpts
   - 720px responsive layout is correct

## Implementation notes (review fixes applied)

- The hero uses a dedicated `body.pro-page` class instead of `body.sub-page`, and the hero is a
  `div.pro-hero` (not a `<header>`). This avoids the `15vh` first grid row on the `sub-page`
  layout and the mobile `header { height: 75vh }` override, preventing hero overflow.
- A `Summary` section (from the CV `Professional Summary`) is rendered above Experience.
- Blog-load failures degrade gracefully: an inline `.blog-error` note is shown inside the
  "Latest Posts" section; the already-rendered resume is never wiped (unlike calling
  `showError`, which replaces the whole container).
- The blog loading placeholder is inserted into the grid after it exists (takes the grid as an
  argument), fixing the earlier no-op.
- Blog cards show `category · date` in a `.card-meta` line.
