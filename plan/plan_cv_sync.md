# CV Sync Script Plan

A Node.js script that parses `cv.md` and regenerates the resume content sections in `pages/Resume/Resume.html`, keeping the HTML shell (header, footer, script) intact.

## Problem

`cv.md` and `Resume.html` are manually kept in sync. When the CV is updated, the HTML must be edited separately — error-prone and tedious.

## Solution

A single `sync-cv.js` script at the repo root that:
1. Reads `cv.md`
2. Parses sections (Professional Summary, Work Experience, Projects, Education, Skills)
3. Reads `pages/Resume/Resume.html`
4. Replaces only the `<section data-section="resume">` content with generated HTML
5. Writes the file back

## Decisions

- **Runtime**: Node.js (no dependencies — uses only `fs` and `path`)
- **Trigger**: Manual (`node sync-cv.js`) or via GitHub Actions on push to `cv.md`
- **Parsing**: Line-by-line regex, not a markdown library — keeps it dependency-free
- **Output**: Only the inner content of `#resume-container` is replaced; header, footer, `<script>`, and `<header>` nav are untouched
- **HTML shell preservation**: The script uses marker comments or targets `#resume-container` innerHTML specifically

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

## Script outline (`sync-cv.js`)

```javascript
// 1. Read cv.md
// 2. Parse into structured object:
//    { contact: {...}, summary: string, experience: [{company, role, date, bullets[]}], projects: [{name, tag, desc}], education: [{degree, school, cgpa, dates}], skills: [{category, items: []}] }
// 3. Read Resume.html
// 4. Generate HTML string from parsed data
// 5. Replace content between markers or via regex targeting #resume-container innerHTML
// 6. Write back to Resume.html
```

### Parsing logic

- **Contact block**: Lines 2-7 of cv.md (`**Location:**`, `**Email:**`, etc.)
- **Sections**: Split on `## ` headers
- **Work Experience**: Split on `### ` sub-headers; bold line = role; next line = date; `- ` lines = bullets
- **Skills**: `- **Category:** item1, item2` → split on `:**` for category, split items on `, `
- **Projects**: `- **Name** (Tag) -- Description`
- **Education**: `- Degree, School (CGPA) Dates`

### Replacement strategy

Use regex to find the content between `<div id="resume-container">` and its closing `</div>` (the outermost one), or use marker comments:

```html
<!-- SYNC_START -->
...generated content...
<!-- SYNC_END -->
```

Insert markers once; subsequent runs replace between them.

## Files

| File | Action |
|---|---|
| `sync-cv.js` | **Create** — the sync script |
| `pages/Resume/Resume.html` | **Edit once** — add `<!-- SYNC_START -->` / `<!-- SYNC_END -->` markers around `#resume-container` content |
| `cv.md` | **Unchanged** — remains source of truth |
| `.github/workflows/sync-cv.yml` | **Create** (optional) — GitHub Action that runs `node sync-cv.js` on push to `cv.md` and commits the result |

## Execution order

1. Add `<!-- SYNC_START -->` / `<!-- SYNC_END -->` markers to `Resume.html`
2. Create `sync-cv.js` with parsing + generation logic
3. Test: run `node sync-cv.js`, diff output against current `Resume.html`
4. (Optional) Create `.github/workflows/sync-cv.yml` for auto-sync on push

## Verification

1. Run `node sync-cv.js`
2. Open `pages/Resume/Resume.html` in browser — should look identical to current
3. Edit `cv.md` (add a bullet, change a date), re-run, verify change appears
4. Ensure header/footer/script are untouched
