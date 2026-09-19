# Professional Recruiter Page

`pages/Professional/Professional.html` is a standalone, IDE-style recruiter page: a launch banner with animated eyes, a sidebar file explorer (Experience / Projects / Skills / Latest Posts) where each file opens as an editor tab with a **Preview** view, plus a timeline summary, project cards, and the two latest blog posts.

## Implementation

| Area | Location |
|---|---|
| Page | `pages/Professional/Professional.html` |
| Styles | `styles/Professional.css` |
| Script | `scripts/professional.js` (fetches `src/cv.md` at `:1301`) |
| Banner/eye tracking | see `docs/eye-tracking-banner.md` |
| Preview / Source toggle | see `docs/professional-markdown-preview.md` |

### Structue

- **Sidebar + tabs**: `registerSectionFolder()` (`:444`), `registerDirectoryEntry()` (`:410`), `createEditorPanel()` (`:1039`), `selectEditorFile()` (`:1116`). Folders: Experience, Projects, Skills, Latest Posts.
- **Renderers**: `renderProfessional()` (`:556`), `renderExperience()` (`:605`), `renderProjects()` (`:793`), `renderSkills()` (`:909`), `renderSection()` (`:582`).
- **Active-state sync**: `setActiveFolderHeader()` (`:346`), `setActiveTreeItem()` (`:362`), `activateSection()` (`:386`).

## Behavior

- Clicking a sidebar file activates its editor view; the active item tracks which panel/file is open.
- Preview mode renders readable markdown (see `docs/professional-markdown-preview.md`); Source mode shows `.editor-comment`/`.editor-bullets` raw content.
- Modebars move into an activity bar on mobile (`refreshModebarVisibility()` `:102`, `placeModebar()` `:127`, `setupModebarPlacement()` `:138`).

## Conventions honored

- Reuses `parseCV()` from `scripts/shared.js`; theme vars from `styles/styles.css`; 720px mobile breakpoint.