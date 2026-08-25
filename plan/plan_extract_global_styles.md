# Plan: Extract Common Styles into Global `styles/common.css`

## Problem

Massive CSS duplication across Blog.css, Resume.css, and Projects.css. The same body/section overrides, container patterns, card styles, mobile header/footer styles, and toggle/accordion patterns are copy-pasted into every page-specific file. The mobile responsive header/footer menu is repeated **4 times** across the codebase.

## Target Structure

```
styles/
├── common.css      # Shared page styles (body/section overrides, cards, mobile, etc.)
├── style.css       # Home page global styles (moved from root)
├── Blog.css        # Blog-specific styles only
├── Resume.css      # Resume-specific styles only
└── Projects.css    # Projects-specific styles only
```

## Duplicated Patterns to Extract into `common.css`

| Pattern | Current Locations | Lines |
|---------|------------------|-------|
| Body overrides (`display: block`, `overflow-y: auto`) | Blog.css:1-5, Resume.css:1-5, Projects.css:1-5 | ~15 |
| Section overrides (`min-height: 70vh`, `display: block`) | Blog.css:7-13, Resume.css:7-13, Projects.css:7-13 | ~21 |
| Container pattern (`max-width: 900px`, fadeIn) | Blog.css:15-21, Resume.css:15-21, Projects.css:15-21 | ~21 |
| Card pattern (bg, border, shadow, radius) | Blog.css `.post-card`, Projects.css `.repo-card/.stat-card/#activity-card/#research-card` | ~30 |
| Card hover lift effect | Blog.css:59-62, Projects.css:77-79, 138-141, 238-241 | ~16 |
| Section header (`.section-heading`) | Resume.css `.section-title`:69-84, Projects.css `.section-heading`:23-38 | ~30 |
| `.title-text` + `.toggle-icon` | Resume.css:96-106, Projects.css:50-60 | ~20 |
| `.section-content` base | Resume.css:108-114, Projects.css:62-65 | ~12 |
| `.card-title` + `.card-excerpt` | Blog.css:64-86, Projects.css:175-187 | ~20 |
| `.card-link` | Projects.css:189-202 | ~14 |
| Mobile body/section overrides | Blog.css:153-161, Resume.css:247-255, Projects.css:288-296 | ~27 |
| Mobile container padding | Blog.css:163-165, Resume.css:257-259, Projects.css:298-300 | ~9 |
| Mobile header/nav/menuIcon | Blog.css:210-239, Resume.css:299-330, Projects.css:319-348, style.css:325-361 | ~100+ |
| Mobile footer | Blog.css:241-249, Resume.css:332-340, Projects.css:350-358, style.css:401-409 | ~40 |

## Steps

### Step 1: Create `styles/` directory

```bash
mkdir styles
```

### Step 2: Create `styles/common.css`

Extract these sections into `common.css`:

**A. Page body/section overrides (for sub-pages):**
```css
/* Overrides for scrollable sub-pages */
body.sub-page {
  display: block;
  overflow-y: auto;
  overflow-x: hidden;
}

body.sub-page section {
  position: relative;
  height: auto;
  min-height: 70vh;
  padding: 3% 0;
  display: block;
}
```

> **Note:** Using `body.sub-page` class avoids the need to override globally scoped `body` and `section` selectors. Each sub-page HTML will add `class="sub-page"` to `<body>`. This is cleaner than repeating the same overrides.

**B. Container pattern:**
```css
.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 5%;
  animation: fadeIn ease 1s;
  animation-fill-mode: both;
}
```

> **Note:** Using `.page-container` class instead of `#blog-container` / `#resume-container` / `#projects-container`. Each page HTML gets `class="page-container"` on its wrapper div, while the ID is removed.

**C. Card pattern:**
```css
.card {
  background-color: var(--backgroundColor);
  border: 0.2rem solid var(--borderColor);
  border-radius: 0.4rem;
  padding: 1.5rem;
  box-shadow: 0.3rem 0.3rem var(--shadowColor);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-0.2rem) translateX(0.2rem);
  box-shadow: 0.45rem 0.45rem var(--shadowColor);
}
```

**D. Section heading (unified):**
```css
.section-heading {
  font-family: var(--headings);
  font-size: 1.6rem;
  color: var(--backgroundColor);
  padding: 1.2% 2%;
  background-color: var(--shadowColor);
  border: 0.2rem solid var(--borderColor);
  border-radius: 0.4rem;
  margin-bottom: 2%;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0.3rem 0.3rem var(--shadowColor);
}

.section-heading:hover {
  transform: translateX(0.5%);
  box-shadow: 0.5rem 0.5rem var(--shadowColor);
}

.section-heading.active {
  color: var(--borderColor);
  background-color: var(--contentColor);
}

.title-text {
  flex: 1;
}

.toggle-icon {
  font-size: 1.4rem;
  font-weight: bold;
  transition: transform 0.3s ease;
  min-width: 2rem;
  text-align: center;
}
```

**E. Section content base:**
```css
.section-content {
  animation: fadeIn ease 0.5s;
}
```

**F. Card title and excerpt:**
```css
.card-title {
  font-family: var(--headings);
  color: var(--shadowColor);
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
}

.card-excerpt {
  font-size: 1rem;
  color: var(--borderColor);
  line-height: 1.6;
  margin: 0;
}
```

**G. Card link:**
```css
.card-link {
  display: inline-block;
  margin-top: 0.8rem;
  color: var(--linkColor);
  text-decoration: none;
  border-bottom: 0.1rem solid var(--linkColor);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.card-link:hover {
  color: var(--linkHover);
  border-bottom-color: var(--linkHover);
}
```

**H. Mobile responsive styles (single source of truth):**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 720px) {
  body.sub-page {
    overflow-y: auto;
  }

  body.sub-page section {
    min-height: auto;
    padding: 10% 2% 30%;
  }

  .page-container {
    padding: 0 3%;
  }

  header {
    display: none;
    z-index: 10;
    overflow-y: auto;
    max-height: 90vh;
    padding-top: 15%;
    text-align: center;
    flex-direction: column;
    justify-content: space-around;
    background-color: var(--contentColor);
    right: 3%;
    height: 75vh;
    width: 91vw;
  }

  header nav ul {
    height: 80%;
    width: 80%;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }

  #menuIcon {
    top: 0%;
    right: 4%;
    cursor: pointer;
    visibility: visible;
    position: absolute;
    color: var(--shadowColor);
    font-size: 2.5rem;
  }

  footer {
    transition: height 0.2s linear, bottom 0.2s linear;
    text-align: left;
    font-size: 0.7rem;
    height: 18vh;
    width: 100%;
    position: absolute;
    bottom: 4%;
  }
}
```

### Step 3: Move and refactor `style.css` → `styles/style.css`

- Keep ALL current `style.css` content (it stays as the home page stylesheet)
- Remove `@keyframes fadeIn` (moved to `common.css`)
- Remove mobile header/nav/menuIcon/footer styles that are now in `common.css`
- Keep mobile `#hero`, `#myImage`, `#info`, `#signature` styles (home-page specific)
- Remove the `header` and `footer` mobile rules (now in `common.css`)
- Remove `header nav ul` mobile rule (now in `common.css`)
- Remove `#menuIcon` mobile rule (now in `common.css`)

**From `style.css` `@media (max-width: 720px)`, KEEP only:**
- `body { display: block; overflow: hidden; }` (home page mobile)
- `#hero` styles
- `#hero p` styles
- `#myImage` styles
- `.active` styles
- `header nav ul li :hover` styles
- `header nav ul li a` styles
- `.dropdown` styles
- `footer h1` styles
- `footer #footer_nav li svg` styles
- `footer #footer_nav li:hover svg` styles

**REMOVE from `style.css` `@media (max-width: 720px)`:**
- `header { display: none; ... }` block
- `header nav ul { height: 80%; ... }` block
- `#menuIcon { ... }` block
- `footer { transition: height... }` block

### Step 4: Move and refactor `Blog.css` → `styles/Blog.css`

**REMOVE:**
- Lines 1-5: body overrides
- Lines 7-13: section overrides
- Lines 15-21: `#blog-container` (replace with `.page-container` usage)
- Lines 39-51: `.post-card` base (card pattern moved to `.card` in common.css)
- Lines 59-62: `.post-card:hover` (moved to `.card:hover`)
- Lines 64-70: `.card-title` (moved to common.css)
- Lines 81-86: `.card-excerpt` (moved to common.css)
- Lines 153-161: mobile body/section overrides
- Lines 163-165: mobile container padding
- Lines 210-249: mobile header/nav/menuIcon/footer (entire block)

**KEEP (page-specific only):**
- Lines 23-27: `#blog-list` grid layout
- Lines 29-31: `.blog-section` min-width
- Lines 33-37: `.post-grid` layout
- Lines 47-48: `.post-card` animation + stagger delays (add `.card` class in HTML)
- Lines 49-50: `.post-card` flex-specific overrides (display: flex, flex-direction: column)
- Lines 53-57: `.post-card:nth-child` stagger delays
- Lines 72-79: `.card-date` (unique to blog)
- Lines 88-90: `#post-view`
- Lines 92-111: `#back-btn` and hover
- Lines 113-122: `#post-banner`
- Lines 124-130: `#post-title`
- Lines 132-139: `#post-date`
- Lines 141-144: `#post-content`
- Lines 146-151: `.post-paragraph`
- Mobile: Blog-specific font size overrides only

**HTML change:** Add `class="sub-page"` to `<body>`, add `class="page-container"` to `#blog-container` wrapper, add `class="card"` to `.post-card` elements (or keep `.post-card` and have it extend `.card`).

### Step 5: Move and refactor `Resume.css` → `styles/Resume.css`

**REMOVE:**
- Lines 1-5: body overrides
- Lines 7-13: section overrides
- Lines 15-21: `#resume-container` (replace with `.page-container`)
- Lines 69-84: `.section-title` base (moved to `.section-heading` in common.css)
- Lines 86-89: `.section-title:hover` (moved to common.css)
- Lines 96-98: `.title-text` (moved to common.css)
- Lines 100-106: `.toggle-icon` (moved to common.css)
- Lines 108-114: `.section-content` base (moved to common.css)
- Lines 247-255: mobile body/section overrides
- Lines 257-259: mobile container padding
- Lines 299-340: mobile header/nav/menuIcon/footer

**RENAME:** All `.section-title` → `.section-heading` in both CSS and HTML

**KEEP (page-specific only):**
- Lines 23-28: `#resume-header`
- Lines 30-36: `#resume-header h1`
- Lines 38-55: `.resume-contact` and links
- Lines 57-67: `.resume-section` and stagger delays
- Lines 91-94: `.section-heading.active` (already in common.css, but verify)
- Lines 116-120: `.section-content p` (line-height override)
- Lines 122-170: `.job*` styles
- Lines 172-195: `.project*`, `.project-tag` styles
- Lines 197-206: `.education*` styles
- Lines 208-226: `.skills-grid`, `.skill-category*`, `.skills-wrapper`
- Lines 228-245: `.skill-item*` styles
- Mobile: Resume-specific font size overrides only

**HTML changes in `Resume.html`:**
- Add `class="sub-page"` to `<body>`
- Add `class="page-container"` to `#resume-container`
- Rename `.section-title` → `.section-heading` in all accordion headers

### Step 6: Move and refactor `Projects.css` → `styles/Projects.css`

**REMOVE:**
- Lines 1-5: body overrides
- Lines 7-13: section overrides
- Lines 15-21: `#projects-container` (replace with `.page-container`)
- Lines 23-38: `.section-heading` base (moved to common.css)
- Lines 40-43: `.section-heading:hover` (moved to common.css)
- Lines 45-48: `.section-heading.active` (moved to common.css)
- Lines 50-52: `.title-text` (moved to common.css)
- Lines 54-60: `.toggle-icon` (moved to common.css)
- Lines 62-65: `.section-content` base (moved to common.css)
- Lines 67-75: `.stat-card` base (card pattern in common.css)
- Lines 77-79: `.stat-card:hover` (moved to common.css)
- Lines 127-136: `.repo-card` base (card pattern in common.css)
- Lines 138-141: `.repo-card:hover` (moved to common.css)
- Lines 166-173: `#activity-card` base (card pattern in common.css)
- Lines 175-180: `.card-title` (moved to common.css)
- Lines 182-187: `.card-excerpt` (moved to common.css)
- Lines 189-202: `.card-link` and hover (moved to common.css)
- Lines 228-236: `#research-card` base (card pattern in common.css)
- Lines 238-241: `#research-card:hover` (moved to common.css)
- Lines 288-296: mobile body/section overrides
- Lines 298-300: mobile container padding
- Lines 319-358: mobile header/nav/menuIcon/footer

**KEEP (page-specific only):**
- Lines 82-88: `.stat-number`
- Lines 90-95: `.stat-label`
- Lines 97-101: `#github-repos-grid`
- Lines 103-110: `.loading-placeholder`
- Lines 112-125: `.dot*` + `@keyframes dotPulse`
- Lines 144-148: `.repo-card-name`
- Lines 150-157: `.repo-card-desc`
- Lines 159-164: `.repo-card-lang`
- Lines 204-209: `.leetcode-stats-grid`
- Lines 211-226: `#lc-recent`, `#lc-recent p`, `#lc-fallback`
- Lines 243-249: `#research-banner`
- Lines 251-256: `#research-title`
- Lines 258-263: `#research-date`
- Lines 265-270: `#research-excerpt`
- Lines 272-285: `#research-link` and hover
- Mobile: Projects-specific font/grid overrides only

**HTML changes in `Projects.html`:**
- Add `class="sub-page"` to `<body>`
- Add `class="page-container"` to `#projects-container`
- Add `class="card"` to `.stat-card`, `.repo-card`, `#activity-card`, `#research-card` (or have them extend `.card`)

### Step 7: Update all HTML files

| File | Changes |
|------|---------|
| `index.html` | Change `./style.css` → `./styles/style.css` |
| `pages/Blog/Blog.html` | Change `../../style.css` → `../../styles/style.css`, add `<link>` for `../../styles/common.css`, change `./Blog.css` → `../../styles/Blog.css`, add `class="sub-page"` to `<body>`, add `class="page-container"` to `#blog-container` |
| `pages/Resume/Resume.html` | Change `../../style.css` → `../../styles/style.css`, add `<link>` for `../../styles/common.css`, change `./Resume.css` → `../../styles/Resume.css`, add `class="sub-page"` to `<body>`, add `class="page-container"` to `#resume-container`, rename `.section-title` → `.section-heading` |
| `pages/Projects/Projects.html` | Change `../../style.css` → `../../styles/style.css`, add `<link>` for `../../styles/common.css`, change `./Projects.css` → `../../styles/Projects.css`, add `class="sub-page"` to `<body>`, add `class="page-container"` to `#projects-container` |

### Step 8: Delete old CSS files

```bash
rm style.css
rm pages/Blog/Blog.css
rm pages/Resume/Resume.css
rm pages/Projects/Projects.css
```

## Files to Create/Modify

| Action | File |
|--------|------|
| **CREATE** | `styles/common.css` |
| **CREATE** | `styles/style.css` (moved from root, refactored) |
| **CREATE** | `styles/Blog.css` (moved, refactored) |
| **CREATE** | `styles/Resume.css` (moved, refactored) |
| **CREATE** | `styles/Projects.css` (moved, refactored) |
| **MODIFY** | `index.html` (update stylesheet path) |
| **MODIFY** | `pages/Blog/Blog.html` (update paths, add classes) |
| **MODIFY** | `pages/Resume/Resume.html` (update paths, add classes, rename selectors) |
| **MODIFY** | `pages/Projects/Projects.html` (update paths, add classes) |
| **DELETE** | `style.css` |
| **DELETE** | `pages/Blog/Blog.css` |
| **DELETE** | `pages/Resume/Resume.css` |
| **DELETE** | `pages/Projects/Projects.css` |

## Verification

1. Open `index.html` in browser - home page should look identical
2. Open each sub-page - layout, styles, animations, mobile responsiveness should all be identical
3. Test mobile menu toggle on each page
4. Test accordion toggle on Resume and Projects
5. Verify no CSS 404s in browser console
6. Verify `@keyframes fadeIn` works on all pages (defined in common.css, used everywhere)
