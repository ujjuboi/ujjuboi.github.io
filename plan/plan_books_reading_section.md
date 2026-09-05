# Books I Am Reading Section — MySpace

A "Books I Am Reading" section on `pages/MySpace/MySpace.html`. Books live as markdown files in `src/Books/`, one `book-name.md` per book. Each book renders as a banner card with an overlaid progress bar (completed chapters + most recent chapter read); "See more →" opens a blog-style full view with the chapter details and notes.

## Decisions (confirmed)

- **Content model**: `src/Books/book-name.md` files following `src/Books/template.md` (headers `Title`, `Author`, `Excerpt`, `Banner`, `Category`, `Status` + a `## Chapters:` list of `- [ ] Name:` / `- [x] Name:` lines with indented `- note` lines).
- **Manifest**: new `src/Books/books.json` listing filenames in display order (mirrors `src/Blogs/posts.json` — static hosting cannot enumerate a folder).
- **Progress**: checked chapters ÷ total chapters. Banner shows the last checked (`[x]`) chapter as "Currently on: <chapter> · %" (falls back to "Not started" / "Finished").
- **Layout — section-positioning grid** (full-bleed, no 900px centered gutters):
  - `> 1100px`: sections sit **two-up** (2 columns). Exceptions that always take a **full row**: Books I Am Reading and LeetCode Progress (LeetCode internals laid out single-column).
  - `721–1100px`: every section takes its **own full-width row** (single column, stacked).
  - `≤ 720px`: mobile, single-column stacked; internal card grids collapse (stats 2×2, cards 1-col) with tighter padding.
- **Book card**: banner image with an overlaid bottom progress strip (track + fill using theme vars), status badge top-right, title/author/excerpt below, "See more →" link.
- **Detail view**: same-page swap like Blog's `#post-view` — "← Back to books" button, banner, title/author/category/status/excerpt, full chapter list with notes rendered via `mdInline`. `#book-N` hash + `history.replaceState`.
- **Sample content**: 3 sample books + themed SVG banners so the section renders immediately.

## New files

### 1. `src/Books/books.json`

Array of book filenames in display order.

### 2. `src/Books/*.md` (3 sample books)

1. `designing-data-intensive-applications.md` — Martin Kleppmann — System Design — **Currently Reading** (chapters with notes, 2 of 4 checked).
2. `clean-code.md` — Robert C. Martin — Software Engineering — **Read** (100%).
3. `psychology-of-money.md` — Morgan Housel — Self Help — **Interested** (0%).

### 3. `Images/Books/*.svg` (3 banner SVGs)

Simple flat SVG banners in the theme palette (`--backgroundColor` cream, `--shadowColor` green, `--borderColor` black). Named to match the book Banner headers.

## Edits to existing files

### 1. `pages/MySpace/MySpace.html`

Add a new `.myspace-section` "Books I Am Reading" (open by default: `class="section-heading active"`, content `display: block`) placed after GitHub Repositories:

- `#books-loading` placeholder (three-dot pulse, like `#blog-loading`).
- `#books-grid` — rendered book cards.
- `#books-fallback` — "No books to show" message (hidden by default).
- `#book-view` (hidden): `#book-back-btn`, `#book-banner`, `#book-title`, `#book-author`, `#book-meta` (category · status · progress), `#book-excerpt`, chapter heading, `#book-chapters`.

Container hooks on the existing sections (`#myspace-container`, per-section classes) stay as-is; MySpace.css handles placement.

### 2. `styles/MySpace.css`

- `#myspace-container.page-container` — `max-width: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;` kills the shared 900px gutter.
- `.myspace-section` spans: default `grid-column: span 1`; `.myspace-section--full` → `grid-column: 1 / -1` used by Books and LeetCode.
- Media tiers:
  - `max-width: 1100px` (and mobile inherits): all sections `grid-column: 1 / -1` (own row).
- Books grid: `repeat(auto-fill, minmax(min(100%, 260px), 1fr))`.
- `.book-card` (flex column), `.book-banner-wrap` (relative), `.book-banner` (full width, fixed `aspect-ratio`, `object-fit: cover`, bordered like `#post-banner`), `.book-status` badge (absolute top-right).
- `.book-progress` overlay strip (absolute bottom): `.book-progress-bar` track (`--contentColor`) + `.book-progress-fill` (`--linkColor`, width set inline) + `.book-progress-meta` ("Currently on: … · 40%").
- Book detail view reuses blog-like styles (`#book-banner`, `#book-title`, `.book-author`, `.book-meta`); `.book-chapter-list` with `.book-chapter` rows, check/circle marker, notes as nested list. All colors from `:root` vars — never hardcoded.
- `@media (max-width: 720px)`: stacked container, card grids collapse to 1 column, smaller type.

### 3. `scripts/myspace.js`

- `parseBook(text)` — headers via the `## Key:` pattern plus a `## Chapters:` block parser; per chapter `{ name, done, notes[] }`.
- `loadBooks()` — fetch `../../src/Books/books.json`, then each `.md`, parse, populate an array.
- `renderBooks()` — build the card grid (banner + progress overlay + status + meta + "See more →"), fade-out the loading placeholder (like `renderBlogList`).
- `showBook(index)` / `showBooksList()` — swap `#books-grid` ↔ `#book-view`, set banner/title/author/meta/excerpt, render chapters; `#book-N` hash handling.
- Render notes with existing `escapeHtml`/`mdInline` from `scripts/shared.js`.
- Kick off `loadBooks()` at the bottom with the other fetches.

## Verification

- `node --check scripts/myspace.js`.
- Open `pages/MySpace/MySpace.html` in a browser (works from `file://`).
- Run the `quick-test` skill for a responsive PASS/FAIL report across the 9 resolutions.

## Out of scope

- Git/branch/commit workflow (handled by the user).
- `README.md` (protected).
- Actual book content beyond the 3 samples (user replaces samples with real books).