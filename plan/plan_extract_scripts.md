# Extract Inline Scripts to `scripts/` Folder

Move all `<script>` blocks from HTML files into separate JS files under a new `scripts/` directory, then link them with `<script src="...">` tags.

## Current inline scripts

| File | Lines | What it contains |
|---|---|---|
| `index.html` | 86-128 | `setGreet()`, `notice()`, menu-icon toggle (hero) |
| `pages/Resume/Resume.html` | 271-311 | `notice()`, `toggleSection()`, menu-icon toggle (resume-container) |
| `pages/Blog/Blog.html` | 78-378 | `notice()`, `posts[]` array (210 lines), `renderBlogList()`, `showPost()`, `showBlogList()`, theme logic (`darkTheme`, `colorTheme`, `lightTheme`, `replace`), menu-icon toggle (blog-container) |

## Duplicated code

- **`notice()`** — identical in all 3 files
- **Menu-icon toggle** — same pattern in all 3 files, only the content element differs (`#hero`, `#resume-container`, `#blog-container`)
- **Theme logic** — only in Blog.html, but uses classes (`DarkTheme`, `ColorTheme`, `WhiteTheme`) that aren't defined in any HTML; likely dead code or missing from scope

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

Blog-specific logic (posts data + rendering + theme):

```javascript
var posts = [ ... ]; // entire posts array (moved as-is)
var categories = ['Deloitte', 'Personal Projects', 'Research'];

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

## HTML changes

Each HTML file gets a `<script src="...">` tag replacing the inline block:

| File | Before | After |
|---|---|---|
| `index.html` | `<script>...inline...</script>` | `<script src="./scripts/shared.js"></script>` then `<script src="./scripts/home.js"></script>` |
| `pages/Resume/Resume.html` | `<script>...inline...</script>` | `<script src="../../scripts/shared.js"></script>` then `<script src="../../scripts/resume.js"></script>` |
| `pages/Blog/Blog.html` | `<script>...inline...</script>` | `<script src="../../scripts/shared.js"></script>` then `<script src="../../scripts/blog.js"></script>` |

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
5. Create `scripts/blog.js` with posts, rendering, theme, menu init
6. Update `index.html` — remove inline `<script>`, add two `<script src>` tags
7. Update `pages/Resume/Resume.html` — same
8. Update `pages/Blog/Blog.html` — same

## Files touched

| File | Action |
|---|---|
| `scripts/shared.js` | **Create** |
| `scripts/home.js` | **Create** |
| `scripts/resume.js` | **Create** |
| `scripts/blog.js` | **Create** |
| `index.html` | **Edit** — replace `<script>` block with `<script src>` tags |
| `pages/Resume/Resume.html` | **Edit** — replace `<script>` block with `<script src>` tags |
| `pages/Blog/Blog.html` | **Edit** — replace `<script>` block with `<script src>` tags |
| `README.md` | **Edit** — update file tree + page inventory |

## Verification

1. Open each page in browser — behavior must be identical to before
2. Test: greeting appears on index, toggleSection works on Resume, blog cards render on Blog
3. Test: menu-icon toggle works on all 3 pages
4. Test: notice() fires on Projects link on all 3 pages
5. Check browser console for 404s or errors
