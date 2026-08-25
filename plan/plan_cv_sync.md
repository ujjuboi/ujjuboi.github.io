# CV Sync — Runtime Fetch Plan

Resume.html fetches `cv.md` at runtime, parses the markdown, and renders the resume DOM dynamically — same pattern as Blog.html's `posts` array + `renderBlogList()`.

## Problem

`cv.md` and `Resume.html` are manually kept in sync. When the CV is updated, the HTML must be edited separately — error-prone and tedious.

## Solution

Add JavaScript to `pages/Resume/Resume.html` that:
1. Fetches `cv.md` from the repo root at page load
2. Parses markdown sections into structured data
3. Renders the resume DOM into `#resume-container`
4. cv.md stays as the single source of truth — no build step needed

## Decisions

- **Runtime**: Browser JS (no build step, no dependencies)
- **Fetch path**: `../../cv.md` (relative from `pages/Resume/` to repo root)
- **Parsing**: Line-by-line regex — same as the original plan, no markdown library
- **HTML shell**: Header, footer, `<script>`, `<header>` nav are untouched — only `#resume-container` innerHTML is rendered by JS
- **Pattern**: Mirrors Blog.html where `posts` array → `renderBlogList()` generates DOM

## cv.md → HTML mapping

| cv.md section | HTML output |
|---|---|
| Header lines (Location, Email, LinkedIn, Portfolio, GitHub) | `#resume-header .resume-contact` with `<span>` and `<a>` tags |
| `## Professional Summary` → paragraph | `.resume-section` with `h2.section-title` + `p` inside `.section-content` |
| `## Work Experience` → `### Company` blocks | `.resume-section` with `.job` divs: `h3` company, `h4` role, `p.job-date`, `ul > li` bullets |
| `## Projects` → `- **Name** (tag) -- desc` | `.resume-section` with `.project` divs: `h3` name + `.project-tag`, `p` description |
| `## Education` → `- Degree, School (CGPA) dates` | `.resume-section` with `.education` div: `h3` degree, `p` school, `p.job-date` dates+CGPA |
| `## Skills` → `- **Category:** items` | `.resume-section` with `.skills-grid` > `.skill-category`: `h3` category, `.skills-wrapper` > `.skill-item` spans |

## HTML structure to generate

```
<div id="resume-container">
  <div id="resume-header">
    <p class="resume-contact">
      <span>Delhi, 110076</span> |
      <a href="mailto:...">email</a> |
      <a href="..." target="_blank">LinkedIn</a> |
      <a href="..." target="_blank">GitHub</a>
    </p>
  </div>

  <div class="resume-section">
    <h2 class="section-title [active]" onclick="toggleSection(this)">
      <span class="title-text">Section Name</span>
      <span class="toggle-icon">[-/+]</span>
    </h2>
    <div class="section-content" style="display: [block/none];">
      ...content...
    </div>
  </div>
  ...more sections...
</div>
```

- First section (Professional Summary): `active` class, `display: block`, icon `-`
- All other sections: no `active`, `display: none`, icon `+`

## Resume.html changes

### Remove from HTML
All hardcoded content inside `<div id="resume-container">` — contact header, all `.resume-section` divs. Replace with an empty container:

```html
<div id="resume-container">
  <p id="cv-loading">Loading resume...</p>
</div>
```

### Add to `<script>`
Three functions:

```javascript
async function fetchCV() {
  const res = await fetch('../../cv.md');
  const text = await res.text();
  return parseCV(text);
}

function parseCV(md) {
  // Returns: { contact: {...}, summary: string, experience: [{company, role, date, bullets[]}],
  //            projects: [{name, tag, desc}], education: [{degree, school, cgpa, dates}],
  //            skills: [{category, items: []}] }
}

function renderResume(data) {
  // Builds DOM from parsed data, injects into #resume-container
}
```

Call chain on load:
```javascript
fetchCV().then(renderResume);
```

### Parsing logic (same as before, just runs in browser)

- **Contact block**: Lines 2-7 of cv.md (`**Location:**`, `**Email:**`, etc.)
- **Sections**: Split on `## ` headers
- **Work Experience**: Split on `### ` sub-headers; bold line = role; next line = date; `- ` lines = bullets
- **Skills**: `- **Category:** item1, item2` → split on `:**` for category, split items on `, `
- **Projects**: `- **Name** (Tag) -- Description`
- **Education**: `- Degree, School (CGPA) Dates`

### Render logic

```javascript
function renderResume(data) {
  const container = document.getElementById('resume-container');
  container.innerHTML = '';

  // 1. Build #resume-header with contact links
  // 2. For each section (Summary, Experience, Projects, Education, Skills):
  //    - Create .resume-section div
  //    - Create h2.section-title with toggle
  //    - Create .section-content with section-specific inner HTML
  //    - First section gets 'active' class, display:block, icon '-'
  //    - Rest get display:none, icon '+'
  // 3. Append all to container
}
```

## Files

| File | Action |
|---|---|
| `pages/Resume/Resume.html` | **Edit** — remove hardcoded resume content, add fetch/parse/render JS |
| `cv.md` | **Unchanged** — remains source of truth |
| `sync-cv.js` | **Not needed** — no build step |

## Execution order

1. Empty `#resume-container` in Resume.html, add loading indicator
2. Add `fetchCV()`, `parseCV()`, `renderResume()` functions to `<script>`
3. Add `fetchCV().then(renderResume)` call
4. Test: open Resume.html in browser, verify it renders identical to current
5. Edit cv.md, reload — verify changes appear

## Verification

1. Open `pages/Resume/Resume.html` in browser — should look identical to current
2. Edit `cv.md` (add a bullet, change a date), reload page — verify change appears
3. Ensure header/footer/script/nav are untouched
4. Test with slow network — loading indicator should show until render completes
