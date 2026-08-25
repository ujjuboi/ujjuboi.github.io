# CV Runtime Loader Plan

Client-side JavaScript that fetches `cv.md` at runtime and renders the resume into `pages/Resume/Resume.html`, keeping the HTML shell (header, footer, nav, toggle logic) intact. Follows the same pattern as `pages/Blog/Blog.html`.

## Problem

`cv.md` and `Resume.html` are manually kept in sync. When the CV is updated, the HTML must be edited separately — error-prone and tedious.

## Solution

A `<script>` block inside `Resume.html` that:
1. Fetches `cv.md` from the repo root at page load via `fetch('../../cv.md')`
2. Parses the markdown into a structured object (contact, summary, experience, projects, education, skills)
3. Renders the parsed data into `#resume-container` using DOM manipulation
4. The HTML shell (header, footer, nav, theme logic) stays static — only `#resume-container` innerHTML is replaced

## Decisions

- **Runtime**: Client-side JavaScript in the browser (no build step, no Node.js)
- **Data source**: `cv.md` fetched at runtime via `fetch()` — single source of truth, no duplication
- **Pattern**: Same approach as Blog.html — static shell + JS-rendered content
- **Parsing**: Line-by-line string parsing in JS, no markdown library — keeps it dependency-free
- **Output**: Only `#resume-container` innerHTML is replaced by JS; header, footer, `<script>`, and `<header>` nav are untouched
- **Fallback**: If fetch fails, show an error message in the container

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

## Script outline (inline `<script>` in Resume.html)

```javascript
// 1. Fetch cv.md at page load
async function loadCV() {
  try {
    const res = await fetch('../../cv.md');
    const text = await res.text();
    const data = parseCV(text);
    renderResume(data);
  } catch (e) {
    document.getElementById('resume-container').innerHTML = '<p>Failed to load CV data.</p>';
  }
}

// 2. Parse into structured object:
//    { contact: {...}, summary: string, experience: [{company, role, date, bullets[]}],
//      projects: [{name, tag, desc}], education: [{degree, school, cgpa, dates}],
//      skills: [{category, items: []}] }
function parseCV(text) { ... }

// 3. Render parsed data into #resume-container via DOM manipulation
function renderResume(data) {
  const container = document.getElementById('resume-container');
  container.innerHTML = '';
  container.appendChild(renderHeader(data.contact));
  container.appendChild(renderSection('Professional Summary', renderSummary(data.summary), true));
  container.appendChild(renderSection('Work Experience', renderExperience(data.experience), false));
  container.appendChild(renderSection('Projects', renderProjects(data.projects), false));
  container.appendChild(renderSection('Education', renderEducation(data.education), false));
  container.appendChild(renderSection('Skills', renderSkills(data.skills), false));
}

// 4. Call loadCV() at the end of the script
```

### Parsing logic

Same line-by-line approach, but in browser JS:

- **Contact block**: Lines 2-7 of cv.md (`**Location:**`, `**Email:**`, etc.)
- **Sections**: Split on `## ` headers
- **Work Experience**: Split on `### ` sub-headers; bold line = role; next line = date; `- ` lines = bullets
- **Skills**: `- **Category:** item1, item2` → split on `:**` for category, split items on `, `
- **Projects**: `- **Name** (Tag) -- Description`
- **Education**: `- Degree, School (CGPA) Dates`

### Rendering helpers

Each section gets a helper function that returns a DOM element:

- `renderHeader(contact)` → `#resume-header` div with contact links
- `renderSection(title, contentEl, active)` → `.resume-section` div with toggle header and collapsible content
- `renderSummary(text)` → `<p>` element
- `renderExperience(jobs)` → `.job` divs with `h3`, `h4`, `p.job-date`, `ul > li`
- `renderProjects(projects)` → `.project` divs with `h3` + `.project-tag`, `p`
- `renderEducation(items)` → `.education` divs with `h3`, `p`, `p.job-date`
- `renderSkills(categories)` → `.skills-grid` > `.skill-category` divs

## Files

| File | Action |
|---|---|
| `pages/Resume/Resume.html` | **Edit** — empty `#resume-container`, add inline `<script>` with fetch/parse/render logic |
| `pages/Resume/Resume.css` | **Unchanged** — existing styles already match the generated HTML structure |
| `cv.md` | **Unchanged** — remains source of truth, fetched at runtime |

## Execution order

1. Empty the hardcoded content inside `#resume-container` in `Resume.html` (keep the div itself)
2. Add the `loadCV()` script block inside `<script>` in `Resume.html`
3. Implement parsing functions (`parseCV` and section-specific parsers)
4. Implement rendering functions (DOM manipulation helpers)
5. Test: open `Resume.html` in browser — should look identical to current
6. Edit `cv.md`, refresh — change should appear immediately


