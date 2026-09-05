---
name: quick-book
description: Create a book shelf entry (src/Books/<slug>.md + books.json + banner image) from a PDF, EPUB, or MOBI file. Use when the user asks to add a book from one of these formats, e.g. "/quick-book path/to/book.pdf", "/quick-book path/to/book.epub", or "/quick-book path/to/book.mobi".
---

# Quick Book Entry Creator

Create a book entry for this portfolio site from a PDF, EPUB, or MOBI file.

## PDF extraction (pypdf)

The Read tool cannot read PDF content, so all extraction goes through the
`scripts/extract_pdf.py` helper in this skill directory. Run it from this
skill's base directory:

    python3 scripts/extract_pdf.py "<pdf-path>"                    # metadata + TOC as JSON
    python3 scripts/extract_pdf.py "<pdf-path>" --text <n>         # raw text of page n (1-based)
    python3 scripts/extract_pdf.py "<pdf-path>" --text-range <a:b> # raw text of pages a..b
    python3 scripts/extract_pdf.py "<pdf-path>" --cover <out>      # extract page-1 cover image to <out> (PNG)

- The script auto-installs `pypdf` via `python3 -m pip install --user pypdf` on first run.
- `--cover` auto-installs `Pillow` and extracts the first embedded image on page 1
  (the book cover) to a PNG, rather than rasterizing a vector render.
- Title and author are read from PDF metadata; the chapter list comes from the
  PDF bookmarks (or a heading scan when bookmarks are missing — if the output
  has `"outline_source": "scanned"`, cross-check the chapter list with the user).
- Use `--text-range` on chapter pages to read actual content before writing the
  excerpt.

## EPUB extraction (stdlib only)

EPUBs are handled by `scripts/extract_epub.py` in this skill directory. It uses
only the Python standard library (zipfile + HTML/XML parsing), so no install step
is needed. Run it from this skill's base directory:

    python3 scripts/extract_epub.py "<epub-path>"                    # metadata + TOC as JSON
    python3 scripts/extract_epub.py "<epub-path>" --text <n>         # raw text of spine chapter n (1-based)
    python3 scripts/extract_epub.py "<epub-path>" --text-range <a:b> # raw text of chapters a..b
    python3 scripts/extract_epub.py "<epub-path>" --cover <out>      # extract the cover image to <out>

- Title and author are read from the OPF package metadata.
- The chapter list comes from the EPUB3 nav document (`nav.xhtml`) or, for EPUB2,
  the NCX file (`toc.ncx`). If neither is present, chapters fall back to generic
  spine names (`Chapter 1`, ...) and a `"warning"` is emitted — cross-check the
  chapter list with the user in that case.
- `--cover` writes the manifest cover image to `<out>` preserving its original
  format (PNG/JPEG). Keep the portrait aspect ratio.
- Use `--text-range` on chapter numbers to read actual content before writing the
  excerpt.

## MOBI/AZW3 extraction (mobi / KindleUnpack)

MOBI is a proprietary PalmDB format, so `scripts/extract_mobi.py` unpacks it with
the `mobi` library — a CLI-free fork of KindleUnpack. It auto-installs the
package via `python3 -m pip install --user mobi` on first run (mirroring how
`extract_pdf.py` auto-installs `pypdf`). Run it from this skill's base directory:

    python3 scripts/extract_mobi.py "<mobi-path>"                    # metadata + TOC as JSON
    python3 scripts/extract_mobi.py "<mobi-path>" --text <n>         # raw text of chapter n (1-based)
    python3 scripts/extract_mobi.py "<mobi-path>" --text-range <a:b> # raw text of chapters a..b
    python3 scripts/extract_mobi.py "<mobi-path>" --cover <out>      # extract the cover image to <out>

- Old MOBI7 books are unpacked to an HTML file + NCX; the chapter list comes
  from the NCX (`outline_source: "ncx"`) and may include front-matter entries —
  cross-check the chapter list with the user.
- KF8/AZW3 books are unpacked to an EPUB, which is parsed by the same logic as
  `extract_epub.py`; `outline_source` reflects the EPUB's own nav/NCX source.
- DRM-protected books cannot be extracted. Kindle Print Replica (AZW4/PDF)
  MOBI files are not supported.
- `--cover` preserves the original cover format (PNG/JPEG). Keep the portrait
  aspect ratio.

## Questionnaire (strict)

Every question below is required, with a single strict answer. Ask all of them
before generating the entry — do not infer, default, or skip any, and do not
proceed until the user has answered every one.

1. **File path** — Must point to an existing `.pdf`, `.epub`, or `.mobi`/`.azw3` file. No default.
2. **Title** — Show the user the title extracted from the file; they must confirm or correct it.
3. **Author** — Show the user the author extracted from the file; they must confirm or correct it.
4. **Category** — One of exactly: `Software Engineering`, `System Design`, `Novels`, `Self Help`, `Devotion`.
5. **Already read?** — Strictly Yes or No. Yes → `Status: Read` and every chapter `[x]`. No → `Status: Interested` and every chapter `[ ]`.

Notes are intentionally **not** part of the questionnaire; the user adds
personal notes to the markdown file manually after it is created.

## Workflow

1. **Run the strict questionnaire** (above) and collect every answer.
2. **Extract book info**:
   - PDF: `python3 scripts/extract_pdf.py "<pdf-path>"` → JSON with metadata (`title`, `author`) and `outline` (chapter list).
   - EPUB: `python3 scripts/extract_epub.py "<epub-path>"` → JSON with metadata (`title`, `creator`) and `outline`.
   - MOBI/AZW3: `python3 scripts/extract_mobi.py "<mobi-path>"` → JSON with metadata (`title`, `creator`) and `outline`.
   - Use `--text-range` on chapter pages/numbers as needed to read content and inform the excerpt.
3. **Capture the book cover** as the banner at `Images/Books/<slug>.png`:
   - Slug: kebab-case derived from the title (e.g., `clean-code`, `designing-data-intensive-applications`).
   - Extract the real cover from the source with `python3 scripts/extract_pdf.py "<pdf-path>" --cover <out>`, `python3 scripts/extract_epub.py "<epub-path>" --cover <out>`, or `python3 scripts/extract_mobi.py "<mobi-path>" --cover <out>`.
   - Keep the **portrait** aspect ratio (downscale to a sensible width, e.g. ~400px) — the book detail
     view displays the cover as a tall left column, so do NOT crop it to a 4:1 landscape strip.
   - Do not create an artificial SVG banner when a real cover image is available.
4. **Read `src/Books/books.json`** — the new filename will be prepended (newest first).
5. **Generate the book entry** as `src/Books/<slug>.md`:
   - Use the template at `src/Books/template.md` as the structure reference.
   - Excerpt: a single sentence (under 200 chars) summarizing the book's core premise.
   - Thoughts: leave the `## Thoughts:` field empty for now; the user adds personal thoughts
     to the file manually after creation (rendered as a paragraph in the UI).
   - Chapters: the extracted outline, each as `- [x] Chapter Name` / `- [ ] Chapter Name` (no
     trailing colon); the checkbox state follows the Read? answer (all `[x]` or all `[ ]`).
     Chapter names only drive the progress bar — do not add notes under chapters.
6. **Update `src/Books/books.json`** by prepending the new filename.
7. **Confirm** by showing the user the created file path, banner path, and chapter count.

## Template Reference

```
## Title: <title>

## Author: <author>

## Excerpt: <one-line summary under 200 chars>

## Thoughts: <paragraph of personal thoughts about the book>

## Banner: ../../Images/Books/<slug>.png

## Category: <Software Engineering|System Design|Novels|Self Help|Devotion>

## Status: <Read|Currently Reading|Interested>

## Chapters:

- [x] Chapter Name
- [x] Chapter Name
- [ ] Chapter Name
```

> Thoughts are **not** generated by this skill. The user adds a `## Thoughts:`
> paragraph manually after creation. It is rendered as a standalone paragraph in
> the book detail view. The chapter list is used only to compute the progress
> bar — chapters carry no per-chapter notes.

## Rules

- The source file (PDF, EPUB, or MOBI/AZW3) must exist at the provided path.
- Title, author, and chapters must come from the pypdf/epub/mobi extraction, never guessed.
- Banner is saved to `Images/Books/<slug>.png` with a kebab-case slug matching the `.md` entry, using the portrait cover extracted from the source file.
- If the `"outline_source"` is `scanned` (PDF) or the output carries a `"warning"` (EPUB/MOBI), cross-check the chapter list with the user before writing it.
- Excerpt must be a single sentence under 200 chars.
- Use first person for personal thoughts in the `## Thoughts:` section.
- Never modify existing entries in `books.json` — only prepend the new entry.
- The strict questionnaire always applies; there are no optional questions.
- If the PDF is encrypted or cannot be parsed after retrying, the EPUB is invalid, or the MOBI is DRM-protected/unparseable, inform the user and ask them to provide title/author/chapters manually.

Base directory for this skill: /Users/Admin/Documents/Study/portfolio/once/.opencode/skills/quick-book
Relative paths in this skill (e.g., scripts/, reference/) are relative to this base directory.