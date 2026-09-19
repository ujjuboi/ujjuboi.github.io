---
name: quick-study-plan
description: Create a dated day-breakdown study plan markdown file (src/StudyPlans/<slug>.md), register its week groups in scripts/myspace.js, and append it to src/StudyPlans/plans.json, based on the src/StudyPlans/template.md structure. Use when the user wants to create a study plan by providing either a URL/link or a local file (PDF/EPUB/MOBI/etc.), then get interviewed on the details before the plan is written. Use e.g. "/quick-study-plan https://...", "/quick-study-plan path/to/book.pdf".
---

# Quick Study Plan Creator

Create a structured study plan for this portfolio site under `src/StudyPlans/`
following the conventions in `src/StudyPlans/template.md` and the existing
dated example in `src/StudyPlans/algorithms-and-leetcode.md`.

Plans use **dated day-breakdown nodes**, not numbered weeks: every study item
lives under a `### Day N:` heading carrying a real calendar date, and rest days
are `### Rest Day:` headings. Content weeks are derived in JS via a
`datedPlanWeekGroups` entry in `scripts/myspace.js`, so no `### Week N:`
headings appear in the markdown.

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

    python3 .opencode/command/quick-book/scripts/extract_pdf.py  "<path>"            # PDF metadata + TOC
    python3 .opencode/command/quick-book/scripts/extract_epub.py "<path>"            # EPUB metadata + TOC
    python3 .opencode/command/quick-book/scripts/extract_mobi.py "<path>"            # MOBI/AZW3 metadata + TOC

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

1. **Subject title** — The title for the plan (e.g. "Algorithms & LeetCode:
   Grokking Algorithms + Blind-75"). Derive from the link/file when helpful,
   but let the user confirm.
2. **Start date** — The calendar date of Day 1 (the first study day). Default
   to tomorrow if the user has no preference; confirm the date explicitly.
3. **Phases** — How the subject should be grouped (e.g. "Algorithm
   Foundations", "Core Algorithms", "Intermediate Problems"). Confirm or help
   the user define the phase titles. Default to ~4 phases if not specified
   (the last may be hands-on projects).
4. **Content weeks & topics** — The plan's content weeks, each ~3 consecutive
   study days worth of material. Roughly 2–4 weeks per phase is the
   convention. For each week, confirm the week topic and the concrete
   tasks/topics to study. The tasks come from the source content or from the
   user's goal.
5. **Resources** — Optional. For any topic that maps to a real book, site, or
   video, attach the proper sub-link under the task:
   - `- Book: "[Book Title]" by Author Name`
   - `- Site: [Resource Name](https://example.com)`
   - `- Video: [Video Title](https://example.com)`
   Only include resources the user confirms or that appear in the source.
6. **Hands-on projects** — Whether the plan should include a project phase
   (the template ships a "Phase: Hands-On Projects"). In the dated format,
   projects are dated study days whose heading topic starts with `Project:`.
   Confirm the projects and their milestone tasks.
7. **Weekly schedule suggestion** — Whether to include the default weekly
   schedule block (3h theory / 2h coding / 1h review / rest days free), or a
   custom schedule.
8. **Checkbox state** — All tasks are written `[ ]` (unchecked) for a new plan.
   Only mark `[x]` if the user says they have already completed an item.
9. **Day-1 calendar invite (.ics)** — Whether to also generate a small `.ics`
   file for Day 1 (convention: `src/StudyPlans/<slug>-day1-<YYYY-MM-DD>.ics`,
   see `algorithms-day1-2026-09-20.ics`). Default yes when a real study
   subject is involved.

> Notes are intentionally **not** part of the questionnaire. The user may add
> personal notes to the markdown file manually after it is created.

## Workflow

1. Confirm the **input** (link or file path) and run the appropriate extraction
   above.
2. Run the **strict interview** above and collect every answer.
3. **Read `scripts/myspace.js`** (`datedPlanWeekGroups`, ~line 1508) and
   `src/StudyPlans/plans.json` to learn the existing plan keys/format.
4. **Read `src/StudyPlans/template.md`** as the structure reference and
   `src/StudyPlans/algorithms-and-leetcode.md` as the dated style example
   (or `code-architecture-system-design.md` for a plan with a project phase).
5. **Generate the plan** as `src/StudyPlans/<slug>.md`:
   - Slug: kebab-case derived from the subject title (e.g. `algorithms`,
     `system-design`, `databases`). Must match the convention in
     `src/StudyPlans/plans.json`.
   - Follow the template: `# Study Plan: <title>`, `## Phase N: <phase>`,
     `### Day N: <Weekday>, <Mon> <D> — <day topic>`, tasks as `- [ ] ...`,
     `### Rest Day: <Weekday>, <Mon> <D> — Review & Recovery` with the
     `> Rest — ...` note, and the trailing `## Weekly Schedule Suggestion`.
   - **Dating**: Day 1 lands on the confirmed start date; days then run on
     **consecutive calendar dates** in a **3-study + 1-rest rhythm**: three
     study days, then one rest day, repeating. Every 4th calendar day is a
     rest day. Formatted as short weekday + short month + day, e.g.
     `Sun, Sep 20`. Day numbers continue across phases and never reset.
   - **Content weeks**: each content week ~3 study days; split its tasks
     across those days (1–3 tasks per study day, matching the example files).
   - **Projects**: dated study days as well, heading topic `Project: <name>`.
   - Tasks under days should be concise, non-redundant, and derived from the
     source content and the interview.
6. **Add the `datedPlanWeekGroups` entry** in `scripts/myspace.js` — append a
   new keyed array after the existing entries (never edit existing keys/weeks):
   - Key = the plan filename (e.g. `'<slug>.md'`).
   - Value = array of one object per content week:
     `{ week: N, topic: '<week topic>', lastDay: <highest day number> }`.
   - `week` numbers run 1..N across the whole plan (phases and project days
     included, never restarting per phase); `topic` is that week's content
     topic; `lastDay` is the last study-day number assigned to that week's
     content (matching the days written in the markdown).
7. Append the new filename to `src/StudyPlans/plans.json` (keep existing
   order).
8. If the user confirmed the Day-1 `.ics`, create
   `src/StudyPlans/<slug>-day1-<YYYY-MM-DD>.ics` for Day 1 (all-day event,
   `DTSTART;VALUE=DATE`, `SUMMARY:Day 1 — <day topic>`, `UID` unique to this
   plan; mirror `algorithms-day1-2026-09-20.ics`).
9. **Verify**: run `node --check scripts/myspace.js` after editing the JS.
   Catch any date/weekday mistakes (e.g. a `## Phase` starting on a rest day)
   by re-reading the generated markdown.
10. **Confirm** by showing the user the created file path, the number of
    phases/weeks and days, the start date, and the `.ics` path if created.

## Rules

- Never hardcode colors, fonts, or page CSS — study plans are pure markdown.
- Follow `src/StudyPlans/template.md`; do not invent a different structure.
- The markdown file must contain **no `### Week N:` or `### Project N:`**
  headings — weeks and projects are dated days; week grouping lives only in
  `datedPlanWeekGroups` in `scripts/myspace.js`.
- Use **real calendar dates** with the correct weekday abbreviation (Sun, Mon,
  Tue, Wed, Thu, Fri, Sat) and month abbreviation (Jan–Dec). Verify every
  date's weekday matches the actual calendar.
- Keep the 3-study + 1-rest rhythm on consecutive dates; a phase may never
  begin on a rest day.
- Tasks and chapters must come from the source content or the user's interview,
  never guessed.
- All new tasks are `[ ]` unless the user explicitly says they are done.
- Resources (Book/Site/Video) use the exact sub-link formats from the template.
- Use the `quick-book` scripts only for file-based extraction, never to write
  the plan.
- Never modify existing entries in `plans.json` or `datedPlanWeekGroups` —
  only append.
- Do NOT update `README.md` (protected) or the study-plan page HTML unless asked.
- Reuse the exact `## Weekly Schedule Suggestion` block from the template or
  replace it only with schedule values the user provides.

Relative paths in this skill (e.g. references to `../quick-book/scripts/`) are
relative to this base directory.