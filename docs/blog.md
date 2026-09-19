# Blog Feature

The blog page (`pages/Blog/Blog.html`) renders a grid of post cards; clicking a card swaps to a full post view with banner and markdown paragraphs, without a page reload. Post content lives as markdown files in `src/Blogs/`, listed by the `src/Blogs/posts.json` manifest.

## Implementation

| Area | Location |
|---|---|
| Page | `pages/Blog/Blog.html` |
| Styles | `styles/Blog.css` |
| Script | `scripts/blog.js` |
| Content manifest | `src/Blogs/posts.json` |
| Posts | `src/Blogs/NN-slug-title.md` (zero-padded order, newest first) |

### View swap

- `renderBlogList()` (`scripts/blog.js:62`) builds the card grid from metadata in `src/Blogs/posts.json`.
- `showPost(index)` (`scripts/blog.js:102`) hides the grid, shows `#post-view`, fills banner/title/date/paragraphs; `showBlogList()` restores the grid.
- Shared `renderPostCard()` / `renderPostContent()` helpers in `scripts/shared.js:282` / `:342` render cards and the post body (markdown-aware).

### Markdown loading

- `loadPosts()` (`scripts/blog.js:9`) fetches `posts.json`, then each post `.md`, parses body via `parsePostBody()` (`scripts/shared.js:416`).
- `parsePostHeaders()` (`scripts/shared.js:384`) reads the top metadata block of each post file.

## Conventions honored

- Content in `src/` markdown, fetched at runtime; no content in HTML.
- Card classes, view swap, and 720px responsive follow the shared component pattern.