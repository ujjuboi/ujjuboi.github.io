# Extract Inline Scripts to `scripts/` Folder

Move all `<script>` blocks from HTML files into separate JS files under a new `scripts/` directory, then link them with `<script src="...">` tags.

## Current inline scripts

| File | Lines | What it contains |
|---|---|---|
| `index.html` | 90-132 | `setGreet()`, `notice()`, menu-icon toggle (hero) |
| `pages/Resume/Resume.html` | 275-315 | `notice()`, `toggleSection()`, menu-icon toggle (resume-container) |
| `pages/Blog/Blog.html` | 84-384 | `notice()`, `posts[]` array (210 lines), `renderBlogList()`, `showPost()`, `showBlogList()`, theme logic (`darkTheme`, `colorTheme`, `lightTheme`, `replace`), menu-icon toggle (blog-container) |
| `pages/Projects/Projects.html` | 165-330 | `notice()`, `toggleSection()`, GitHub/LeetCode data fetching (cached `fetch()` calls), `renderResearch()`, latest post data (hardcoded), menu-icon toggle (projects-container) |

## Duplicated code

- **`notice()`** — identical in all 4 files
- **Menu-icon toggle** — same pattern in all 4 files, only the content element differs (`#hero`, `#resume-container`, `#blog-container`, `#projects-container`)
- **`toggleSection()`** — appears in Resume.html and Projects.html with a minor behavioral difference (`content.style.display = 'block'` vs `''`)
- **Theme logic** — only in Blog.html, but uses classes (`DarkTheme`, `ColorTheme`, `WhiteTheme`) that aren't defined in any HTML; likely dead code or missing from scope
- **Runtime data fetching** — Projects.html uses `cachedFetch()` with GitHub and LeetCode APIs; Blog.html keeps its posts array hardcoded for the README auto-update workflow

## New files

### 1. `scripts/shared.js`

Common functions used across all pages:

```javascript
// notice() — alert for unbuilt nav links
function notice() { alert("Under Development!"); }

// Menu-icon toggle — accepts the main content element to show/hide
function initMenuToggle(contentSelector) {
  var footer = document.querySelector('footer');
  var menuIcon = document.getElementById('menuIcon');
  var header = document.querySelector('header');
  var content = document.querySelector(contentSelector);

  menuIcon.addEventListener('click', function() {
    menuIcon.style.display = "none";
    header.style.display = "block";
    content.style.display = "none";
    footer.style.height = "10vh";
    footer.style.bottom = "1%";
  });

  footer.addEventListener('click', function() {
    menuIcon.style.display = "block";
    footer.style.height = "18vh";
    footer.style.bottom = "4%";
    header.style.display = "none";
    content.style.display = "block";  // or "flex" for index.html hero
  });
}
```

### 2. `scripts/home.js`

Index-specific logic:

```javascript
// Time-based greeting
(function() {
  var hour = new Date().getHours();
  var greeting;
  if (6 <= hour && hour < 12) greeting = "Good Morning!";
  else if (12 <= hour && hour < 17) greeting = "Good Afternoon!";
  else if (17 <= hour && hour < 22) greeting = "Good Evening!";
  else greeting = "Good Evening, You should be in bed by now!";
  document.getElementById("salutation").innerHTML = greeting;
})();

// Menu toggle — hero uses "flex" not "block"
initMenuToggle('#hero');
// Override footer click to show flex
document.querySelector('footer').addEventListener('click', function() {
  document.getElementById('hero').style.display = "flex";
});
```

Note: `index.html` hero uses `display: "flex"` on restore, not `"block"`. The `initMenuToggle` helper needs a parameter or the home script overrides the footer handler.

### 3. `scripts/resume.js`

Resume-specific logic:

```javascript
function toggleSection(header) {
  var content = header.nextElementSibling;
  var icon = header.querySelector('.toggle-icon');
  if (content.style.display === 'none') {
    content.style.display = 'block';
    icon.textContent = '-';
  } else {
    content.style.display = 'none';
    icon.textContent = '+';
  }
  header.classList.toggle('active');
}

initMenuToggle('#resume-container');
```

### 4. `scripts/blog.js`

Blog-specific logic (rendering + theme; `posts` array stays inline to keep the README auto-update workflow working):

```javascript
const categories = ['Deloitte', 'Personal Projects', 'Research'];

function renderBlogList() { ... }
function showPost(index) { ... }
function showBlogList() { ... }

// Theme functions (move as-is)
function darkTheme() { ... }
function colorTheme() { ... }
function lightTheme() { ... }
function replace() { ... }

// Mobile menu + theme toggle (Blog.html specific)
// ... move the window.innerWidth <= 720 block

// Initialize
renderBlogList();
initMenuToggle('#blog-container');
```

> **Note**: The GitHub Actions workflow (`update-readme.yml`) parses the `posts` array directly from `Blog.html` source (line 62: `content.match(/const posts\s*=\s*\[([\s\S]*?)\];/)`). Keeping the array inline avoids breaking that automation.

### 5. `scripts/projects.js`

Projects-specific logic (runtime API fetching, caching, latest post rendering):

```javascript
function toggleSection(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector('.toggle-icon');
  if (content.style.display === 'none') {
    content.style.display = '';
    icon.textContent = '-';
  } else {
    content.style.display = 'none';
    icon.textContent = '+';
  }
  header.classList.toggle('active');
}

const CACHE_TTL = 30 * 60 * 1000;

async function cachedFetch(url) {
  const cacheKey = 'gh_cache_' + url;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, ts } = JSON.parse(cached);
    if (Date.now() - ts < CACHE_TTL) return data;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() }));
  return data;
}

async function fetchGitHubStats() { ... }
async function fetchRecentActivity() { ... }
async function fetchLeetCodeStats() { ... }

const latestPost = { ... }; // hardcoded "Latest from Blog" card

function renderResearch() { ... }

// Initialize
fetchGitHubStats();
fetchRecentActivity();
fetchLeetCodeStats();
renderResearch();
initMenuToggle('#projects-container');
```

## HTML changes

Each HTML file gets a `<script src="...">` tag replacing the inline block:

| File | Before | After |
|---|---|---|
| `index.html` | `<script>...inline...</script>` | `<script src="./scripts/shared.js"></script>` then `<script src="./scripts/home.js"></script>` |
| `pages/Resume/Resume.html` | `<script>...inline...</script>` | `<script src="../../scripts/shared.js"></script>` then `<script src="../../scripts/resume.js"></script>` |
| `pages/Blog/Blog.html` | `<script>...inline...</script>` | `<script src="../../scripts/shared.js"></script>` then `<script src="../../scripts/blog.js"></script>` |
| `pages/Projects/Projects.html` | `<script>...inline...</script>` | `<script src="../../scripts/shared.js"></script>` then `<script src="../../scripts/projects.js"></script>` |

Script load order matters: `shared.js` first (defines `notice`, `initMenuToggle`), then page-specific script.

## `initMenuToggle` — flex vs block issue

`index.html` footer click restores `hero.style.display = "flex"`, but Resume/Blog restore `"block"`. Two options:

**Option A (recommended)**: Add a `restoreDisplay` parameter:
```javascript
function initMenuToggle(contentSelector, restoreDisplay) {
  restoreDisplay = restoreDisplay || 'block';
  // ... footer click sets content.style.display = restoreDisplay;
}
```
Then: `initMenuToggle('#hero', 'flex')` in home.js, `initMenuToggle('#resume-container')` in resume.js.

**Option B**: Let each page script override the footer handler after calling `initMenuToggle`.

## Execution order

1. Create `scripts/` directory
2. Create `scripts/shared.js` with `notice()` + `initMenuToggle()`
3. Create `scripts/home.js` with greeting + menu init
4. Create `scripts/resume.js` with `toggleSection()` + menu init
5. Create `scripts/blog.js` with rendering, theme, menu init (keep `posts` array inline)
6. Create `scripts/projects.js` with data fetching, caching, menu init
7. Update `index.html` — remove inline `<script>`, add two `<script src>` tags
8. Update `pages/Resume/Resume.html` — same
9. Update `pages/Blog/Blog.html` — same
10. Update `pages/Projects/Projects.html` — same

## Files touched

| File | Action |
|---|---|
| `scripts/shared.js` | **Create** |
| `scripts/home.js` | **Create** |
| `scripts/resume.js` | **Create** |
| `scripts/blog.js` | **Create** |
| `scripts/projects.js` | **Create** |
| `index.html` | **Edit** — replace `<script>` block with `<script src>` tags |
| `pages/Resume/Resume.html` | **Edit** — replace `<script>` block with `<script src>` tags |
| `pages/Blog/Blog.html` | **Edit** — replace `<script>` block with `<script src>` tags (keep `posts` array inline) |
| `pages/Projects/Projects.html` | **Edit** — replace `<script>` block with `<script src>` tags |
| `README.md` | **Edit** — update file tree + page inventory |

<!-- ## Verification

1. Open each page in browser — behavior must be identical to before
2. Test: greeting appears on index, toggleSection works on Resume/Projects, blog cards render on Blog, GitHub/LeetCode stats load on Projects
3. Test: menu-icon toggle works on all 4 pages
4. Test: notice() fires on mySpace link on all 4 pages
5. Confirm README auto-update workflow still parses `posts` from Blog.html
6. Check browser console for 404s or errors -->
