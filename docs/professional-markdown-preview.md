# Professional Markdown Preview (Preview | Source)

Each file in the Professional page explorer opens in a readable **Markdown Preview** by default, with a VS Code-style **Preview | Source** segmented toggle in the editor panel's modebar. The preview renders headings, lists, bold/italic, inline code, and links without leaving the panel.

## Implementation

| Area | Location |
|---|---|
| Modebar | `createEditorPanel()` builds `.editor-tabsbar` + `.editor-modebar` (`scripts/professional.js:1039`) |
| Toggle | `addPreviewToggle(panel, modebar)` (`scripts/professional.js:1069`) |
| Preview nodes | `.editor-preview` divs created per view (Experience `:740`, Projects `:864`, Skills `:981`) |
| Inline markdown | `mdInline()` (`scripts/professional.js`), `mdBlock()` (`:7`); shared `mdInline`/`renderMarkdown` in `scripts/shared.js:89`/`:115`; vendored Marked in `scripts/lib/marked.min.js` |
| Styles | `.editor-preview`, `.editor-modebar`, `.editor-panel.is-preview` in `styles/Professional.css` |

## Behavior

- Default state: `is-preview` class on the panel — Source chrome (`.editor-comment`, `.editor-bullets`, `.editor-excerpt`) is hidden, `.editor-preview` shown (`styles/Professional.css:929`).
- Toggle buttons set `aria-pressed` and flip the `is-preview` class panel-wide (all files in that folder share one modebar).
- Modebar placement is responsive — moved into the mobile activity bar on narrow viewports (`refreshModebarVisibility()`, `placeModebar()`).
- Skills views render as tag chips; blog posts render full paragraphs in preview.

## Conventions honored

- No dependencies added at runtime beyond the vendored `marked.min.js`; everything path-relative.
- Mobile re-layout via the shared 720px breakpoint.