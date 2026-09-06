---
name: quick-study-plan
description: Create a study plan markdown file (src/StudyPlans/<slug>.md + plans.json update) based on the src/StudyPlans/template.md structure. Use when the user wants to create a study plan by providing either a URL/link or a local file (PDF/EPUB/MOBI/etc.), then get interviewed on the details before the plan is written. Use e.g. "/quick-study-plan https://...", "/quick-study-plan path/to/book.pdf".
---

# Quick Study Plan Creator

Create a structured study plan for this portfolio site under `src/StudyPlans/`
following the conventions in `src/StudyPlans/template.md` and the existing
example in `src/StudyPlans/networking.md`.

The user provides either a **link** (URL) or a **local file** that describes or
contains the subject to study. If it's a file, reuse the extraction scripts from
the `quick-book` skill to pull the source's metadata and table of contents.
Then **interview the user** to fill in the plan details before writing the file.

## Source extraction

### If the user provides a link (URL)
- Fetch the page content with the `webfetch` tool.
- Use it to understand the subject, its chapters/modules, and any named
  resources (books, sites, courses) that appear inside it. Do not invent
  resources that are not present in the fetched content.
- The fetched content is a starting reference only; the final plan is shaped by
  the questionnaire below.

### If the user provides a local file
Reuse the extraction helpers from the `quick-book` skill's `scripts/` directory
(this skill calls them by absolute path, so they work regardless of cwd):

    python3 .opencode/skills/quick-book/scripts/extract_pdf.py  "<path>"            # PDF metadata + TOC
    python3 .opencode/skills/quick-book/scripts/extract_epub.py "<path>"            # EPUB metadata + TOC
    python3 .opencode/skills/quick-book/scripts/extract_mobi.py "<path>"            # MOBI/AZW3 metadata + TOC

- PDF/EPUB/MOBI scripts themselves auto-install any needed Python package on
  first run.
- For other formats (e.g. text, markdown, plain files), read the file directly
  with the Read tool.
- The extracted outline (chapters/parts/modules) is used as the backbone of the
  study plan's phases/weeks. If the extraction returns an
  `"outline_source": "scanned"` or a `"warning"`, or if chapters look
  incomplete, cross-check the outline with the user before building the plan.
- Use `--text-range` on relevant pages/chapters only if you need to read actual
  content to understand the subject matter.

## Interview (strict)

Ask all of the following before generating the file. Do not infer, default, or
skip any question. Gather the answers conversationally, then write the plan.

1. **Subject title** — The title for the plan (e.g. "Networking, Browsers,
   HTML Servers & GitHub Pages"). Derive from the link/file when helpful, but
   let the user confirm.
2. **Phases** — How the subject should be grouped (e.g. "Networking
   Fundamentals", "HTML & Web Standards", "Browser Architecture"). Confirm or
   help the user define the phase titles. Default to ~4 phases if not specified
   (the last may be hands-on projects).
3. **Weeks & topics** — Roughly 4 weeks per phase is the template convention.
   For each week, confirm the week topic and the concrete tasks/topics to study.
   The tasks come from the source content or from the user's goal.
4. **Resources** — Optional. For any topic that maps to a real book, site, or
   video, attach the proper sub-link under the task:
   - `- Book: "[Book Title]" by Author Name`
   - `- Site: [Resource Name](https://example.com)`
   - `- Video: [Video Title](https://example.com)`
   Only include resources the user confirms or that appear in the source.
5. **Hands-on projects** — Whether the plan should include a project phase (the
   template ships a "Phase: Hands-On Projects" with 4 projects). Confirm the
   projects and their milestone tasks.
6. **Weekly schedule suggestion** — Whether to include the default weekly
   schedule block (3h theory / 2h coding / 1h review / weekend milestone), or a
   custom schedule.
7. **Checkbox state** — All tasks are written `[ ]` (unchecked) for a new plan.
   Only mark `[x]` if the user says they have already completed an item.

> Notes are intentionally **not** part of the questionnaire. The user may add
> personal notes to the markdown file manually after it is created.

## Workflow

1. Confirm the **input** (link or file path) and run the appropriate extraction
   above.
2. Run the **strict interview** above and collect every answer.
3. **Read `src/StudyPlans/template.md`** as the structure reference and
   `src/StudyPlans/networking.md` as the style example.
4. **Generate the plan** as `src/StudyPlans/<slug>.md`:
   - Slug: kebab-case derived from the subject title (e.g.
     `networking`, `system-design`, `databases`). Must match the convention in
     `src/StudyPlans/plans.json`.
   - Follow the template's structure: `# Study Plan: <title>`, `## Phase N:
     <phase>`, `### Week N: <topic>`, tasks as `- [ ] ...`, projects as
     `### Project N: ...`, and the trailing `## Weekly Schedule Suggestion`.
   - Tasks under weeks should be concise, non-redundant, and derived from the
     source content and the interview.
5. **Read `src/StudyPlans/plans.json`** — the new filename will be appended
   (keep existing order).
6. **Update `src/StudyPlans/plans.json`** by appending the new filename.
7. **Confirm** by showing the user the created file path and the number of
   phases/weeks.

## Rules

- Never hardcode colors, fonts, or page CSS — study plans are pure markdown.
- Follow `src/StudyPlans/template.md`; do not invent a different structure.
- Tasks and chapters must come from the source content or the user's interview,
  never guessed.
- All new tasks are `[ ]` unless the user explicitly says they are done.
- Resources (Book/Site/Video) use the exact sub-link formats from the template.
- Use the `quick-book` scripts only for file-based extraction, never to write
  the plan.
- Never modify existing entries in `plans.json` — only append.
- Do NOT update `README.md` (protected) or the study-plan page HTML unless asked.
- Reuse the exact `## Weekly Schedule Suggestion` block from the template or
  replace it only with schedule values the user provides.

Base directory for this skill:
/Users/Admin/Documents/Study/portfolio/twice/.opencode/skills/quick-study-plan
Relative paths in this skill (e.g. references to `../quick-book/scripts/`) are
relative to this base directory.
