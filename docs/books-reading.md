# Books I Am Reading (My Library)

MySpace's "My Library" section renders book cards loaded from markdown files in `src/Books/`, listed by the `src/Books/books.json` manifest. Each card shows a banner with a category badge and an overlaid progress strip (completed chapters ÷ total chapters); a "detail view" swaps to a full book page with all chapters and notes.

## Implementation

| Area | Location |
|---|---|
| Section builder | `buildBooksSection()` (`scripts/myspace.js:147`) |
| Section render | `renderMyspaceSections()` (`scripts/myspace.js:179`) |
| Parsing | `parseBook(text, filename)` (`scripts/myspace.js:813`) |
| Loading | `loadBooks()` (`scripts/myspace.js:895`) |
| Cards / detail | `renderBooks()` (`:935`), `showBook()` (`:993`), `showBooksList()` (`:1017`) |
| Content | `src/Books/<name>.md` + `src/Books/books.json` |

### Content model

- One markdown file per book following `src/Books/template.md`: header keys (`Title`, `Author`, `Excerpt`, `Banner`, `Category`) plus a `## Chapters:` list of `- [ ]` / `- [x]` lines with indented `- note` lines. No `Status` key — reading status is derived from the chapter checkboxes.
- `books.json` lists filenames in display order (static hosting cannot enumerate a folder).

### Behavior

- Card badge shows the book's `Category` (`parseBook` `:813`); status is derived from chapter progress: all checked → Read, some → Currently Reading, none → Interested.
- Books are sorted by category (`sortBooksByCategory()`) — Software Engineering → System Design → Novels → Self Help → Devotion — with currently-reading books first within each category.
- A **Filter** toggle opens the category menu as a floating popover anchored to the toggle (`#books-filter-menu`, `position: fixed` clamped to the viewport) so the grid never shifts; categories are parsed from `src/Books/template.md` (`**Category:**` line, `/`-separated) and only matching cards are shown (`filterBooksByCategory()`); "All Categories" restores the full grid. The menu mirrors the shared font switcher's styling.
- Progress = checked chapters ÷ total chapters; banner shows the last checked chapter as "Currently on: <chapter> · %" with "Not started"/"Finished" fallbacks.
- `#book-N` hash + `history.replaceState` deep-links into the detail view.
- Shared `renderMarkdown()` (`scripts/shared.js:115`) renders excerpts, thoughts, and chapters.

## Conventions honored

- Manifest-driven markdown loading exactly like blogs/study plans.
- `.book-progress` reuses the shared `.card`/banner visual language; all colors from `:root` vars.