# Blog Feature Plan

Simple hardcoded blog for the portfolio site: a blog page listing post cards; clicking a card opens a banner image with the post content below, vertically scrollable.

## Decisions (confirmed)

- **Navigation**: Same-page view swap — card grid hides, post view shows with a back button. Single file, no reload.
- **Sample content**: 5 hardcoded posts.
- **Mobile**: Responsive `Blog.css` only (720px breakpoint, like Resume.css). Legacy `Mobile/` folder untouched.
- **Assets**: Reuse existing `Images/Graphics/*` banners. No external dependencies, no backend.

## New files

### 1. `Blog.html`

- Same `<header>` nav structure as Resume.html — Blog marked `.active`, Home/Resume links wired, footer SVGs identical.
- `#blog-list` view: vertical column of post cards (title, date, excerpt).
- `#post-view` (hidden): "← Back to posts" button, full-width banner `<img>`, post title/date, hardcoded paragraphs.
- Hardcoded JS array of posts: `{ title, date, excerpt, banner, paragraphs[] }`.
- Click handler swaps views (`display` toggle) and scrolls to top; back button restores the list.

### 2. `Blog.css`

- `body { display:block; overflow-y:auto }` override (global style.css locks `overflow:hidden`).
- `.blog-container`: max-width 900px centered, fadeIn animation (matches `#resume-container`).
- Post cards: beige `--backgroundColor`, black border, offset `--shadowColor` box-shadow, hover lift — mirrors `.skill-item` styling.
- Card titles in `--headings` font with `--shadowColor`; dates muted green.
- Post banner: full-width, black border, offset shadow, rounded corners.
- Body text black on beige (~19:1 AAA); all colors from root CSS variables.
- `@media (max-width: 720px)`: stacked cards, smaller type, fluid banner.

## Sample posts

| Banner | Topic |
|---|---|
| `SensorData.svg` | Real-time sensor dashboards w/ MQTT & WebSockets |
| `Mind.svg` | Getting into AI/ML agents |
| `LegalDocuments.svg` | Identity governance lessons |
| `Movie.svg` | Side projects & building for fun |
| `php.png` | Legacy stacks vs modern frameworks |

## Edits to existing files

- **`index.html`**: Blog nav link → `href="./Blog.html"` (drop `notice()` alert).
- **`Resume.html`**: same change with `target="_self"`.
