---
name: quick-blog
description: Create a blog post from bullet points, following the project's template and conventions.
---

# Quick Blog Post Creator

Create a blog post for this portfolio site from user-provided bullet points.

## Workflow

1. **Gather input** from the user:
   - Ask for the blog title
   - Ask for bullet points (key topics/ideas to cover)
   - Ask for the category: `Deloitte`, `Personal Projects`, or `Research`
   - Ask for a banner image path (default: `../../Images/Graphics/<topic>.svg`)

2. **Determine the next post number** by reading `src/Blogs/posts.json` and finding the highest existing number.

3. **Generate the blog post** as a markdown file in `src/Blogs/` following the template format:
   - Filename format: `XX-slug-title.md` (e.g., `09-my-new-post.md`)
   - Use the template at `src/Blogs/template.md` as the structure reference
   - Paragraphs are plain text blocks separated by a blank line (no `<p>` tags, no `- ` prefix)
   - **Minimum 500 words total across all paragraphs** — expand on the user's bullet points with detail, context, and technical depth
   - Date should be the current date formatted as `Month DD, YYYY`
   - Excerpt should be a single sentence (under 160 chars) summarizing the post

4. **Update `src/Blogs/posts.json`** by prepending the new filename to the array (newest first).

5. **Confirm** by showing the user the created file path and word count.

## Template Reference

```
# title of the post

**Date:** <Month DD, YYYY>

**Excerpt:** <one-line summary under 160 chars>

**Banner:** ../../Images/Graphics/<image>.svg

**Category:** <Deloitte|Personal Projects|Research>

First paragraph with at least 100 words of content...

Second paragraph...
```

## Rules

- Each blank-line-separated block of text is one paragraph
- Paragraphs should be substantive — no filler or fluff
- Use technical language appropriate to the topic
- Write in first person, matching the tone of existing posts
- The total word count across all paragraphs must be >= 500 words
- Never modify existing posts in `posts.json` — only prepend the new entry
