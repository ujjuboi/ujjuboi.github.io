# Extract Blog Posts to Markdown Files

## Current state

All 8 blog posts (title, date, excerpt, banner, category, paragraphs) live in a hardcoded inline `<script>` array in `pages/Blog/Blog.html` (~130 lines). The Resume page already uses the better pattern: content in `cv.md`, fetched at runtime by `scripts/resume.js`.

The `update-readme.yml` workflow regex-parses `const posts = [...]` from Blog.html to extract the latest post's `title` and `category` for the README.

## Approach

Move each post's paragraphs into individual markdown files under `src/Blogs/`. Keep a minimal metadata-only array in `Blog.html` (title, date, excerpt, banner, category, filename) so the README workflow still works. `blog.js` fetches markdown files at runtime via `fetch()`.

## New files

### 1. `src/Blogs/NN-slug.md` (8 files)

One file per post. Naming: `NN` = zero-padded order (newest first), `slug` = kebab-case title.

Each follows the template structure (`src/Blogs/template.md`):

```markdown
## Paragraphs

- <p>First paragraph...</p>
- <p>Second paragraph...</p>
```

Only paragraphs go in the markdown files — metadata stays in the HTML array.

| File | Post |
|---|---|
| `01-scaling-identity-data.md` | Scaling Identity Data Ingestion: MongoDB at Enterprise Scale |
| `02-teaching-machines-to-read.md` | Teaching Machines to Read Legal Documents |
| `03-teaching-ci-to-think.md` | Teaching CI to Think: Agentic Workflows on GitHub Actions |
| `04-getting-into-ai-ml-agents.md` | Getting into AI/ML Agents |
| `05-side-projects.md` | Side Projects & Building for Fun |
| `06-real-time-sensor-dashboards.md` | Real-time Sensor Dashboards w/ MQTT & WebSockets |
| `07-directory-data-analytics.md` | Directory Data Analytics and Identity Correlation at Scale |
| `08-legacy-stacks.md` | Legacy Stacks vs Modern Frameworks |

## Files to edit

### 3. `pages/Blog/Blog.html`

Replace the 130-line inline `posts` array (lines 87-217) with a minimal metadata-only array that includes a `file` field:

```javascript
const posts = [
  { file: "01-scaling-identity-data.md", title: "Scaling Identity Data Ingestion...", date: "August 22, 2026", excerpt: "...", banner: "../../Images/Graphics/MongoDB.svg", category: "Deloitte" },
  // ... 7 more entries, no paragraphs
];
```

This preserves the `update-readme.yml` regex match (`const posts = [...]`). The workflow only reads `postsArray[0].title` and `postsArray[0].category`, both present in the metadata array.

### 4. `scripts/blog.js`

Add `loadPosts()` to fetch markdown files at runtime:

```javascript
async function loadPosts() {
  for (const post of posts) {
    try {
      const res = await fetch('../../src/Blogs/' + post.file);
      if (!res.ok) throw new Error('Failed to fetch ' + post.file);
      const text = await res.text();
      post.paragraphs = parsePostMarkdown(text);
    } catch (e) {
      post.paragraphs = ['<p>Failed to load post content.</p>'];
    }
  }
}

function parsePostMarkdown(text) {
  return text.split('\n')
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2).trim());
}
```

Change initialization from synchronous to async:

```javascript
loadPosts().then(() => {
  renderBlogList();
  initMenuToggle('#blog-container');
});
```

Remove the trailing `renderBlogList(); initMenuToggle('#blog-container');` lines.

### 5. `update-readme.yml` — No changes needed

The workflow's `getLatestPost()` regex still matches the inline metadata array. It only needs `title` and `category`, both present.

## Execution order

1. Create 8 markdown files in `src/Blogs/` with post paragraphs
2. Update `pages/Blog/Blog.html` — replace inline paragraphs with minimal metadata array (add `file` field)
3. Update `scripts/blog.js` — add `loadPosts()` + `parsePostMarkdown()`, async init

## Key detail: async initialization

`blog.js` currently calls `renderBlogList()` synchronously. Since fetching markdown files is async, initialization becomes:

```javascript
loadPosts().then(() => {
  renderBlogList();
  initMenuToggle('#blog-container');
});
```

`showPost(index)` already reads `post.paragraphs` — once `loadPosts()` populates them, rendering works unchanged.

## Verification

1. Open Blog.html in browser — post cards render with correct titles/dates
2. Click a post — paragraphs load from markdown file, display correctly
3. Check browser console for 404s on markdown fetches
4. Confirm README auto-update workflow still extracts latest post title/category
