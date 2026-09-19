# Resume — Runtime CV Loader

`pages/Resume/Resume.html` renders the entire resume from `src/cv.md` at runtime, keeping the HTML shell (header, footer, nav, collapse logic) static. `src/cv.md` is the single source of truth — editing it updates the page on refresh.

## Implementation

| Area | Location |
|---|---|
| Page | `pages/Resume/Resume.html` (empty `#resume-container`) |
| Styles | `styles/Resume.css` |
| Script | `scripts/resume.js` |
| Source | `src/cv.md` (canonical resume) |

### Flow

- `loadCV()` (`scripts/resume.js:15`) fetches `../../src/cv.md`; on failure it renders a fallback message (leaving the shell intact).
- `parseCV(text)` (`scripts/shared.js:516`) converts the markdown into `{ contact, summary, experience, projects, education, skills }`.
- `renderResume()` (`scripts/resume.js:41`) builds `#resume-header`, then one collapsible `.resume-section` per category.
- Section renderers: `renderHeader()` (`:67`), `renderSummary()` (`:92`), `renderExperience()` (`:104`), `renderProjects()` (`:141`), `renderEducation()` (`:174`), `renderSkills()` (`:210`).
- Bullets render via shared `renderMarkdownBullets()` (`scripts/shared.js:147`) so inline markdown is preserved.

## Conventions honored

- Content in `src/cv.md`, fetched at runtime — no duplication in HTML.
- Collapsible sections use the shared `.section-heading` + `toggleSection` pattern.
- Note: the Professional page reuses `parseCV()` but against its own data path (`scripts/professional.js:1301` fetch, `:556` render).