# Projects Page Plan (Professional View)

## Overview

Create `pages/Projects/Projects.html` — a professional projects page featuring:
1. Live GitHub commit counter (public repos count)
2. Recent activity banner (latest commit from most recently updated repo)
3. Research section (latest blog post from Blog.html)
4. LeetCode stats (with graceful degradation via third-party API)

Plus: Update navbar across all pages with a CSS dropdown (Professional / mySpace). mySpace triggers an alert for now.

---

## New Files

| File | Purpose |
|---|---|
| `pages/Projects/Projects.html` | Professional projects page |
| `pages/Projects/Projects.css` | Page-specific styles + 720px breakpoint |

---

## Edits to Existing Files

### All 4 HTML files — Navbar Dropdown

Replace the Projects `<li>` with a dropdown:

**Current (e.g. `index.html:25-27`):**
```html
<li>
  <a onclick="notice()" href="#">Projects</a>
</li>
```

**New:**
```html
<li class="nav-dropdown">
  <a href="#">Projects</a>
  <ul class="dropdown">
    <li><a href="../Projects/Projects.html" target="_self">Professional</a></li>
    <li><a onclick="notice()" href="#">mySpace</a></li>
  </ul>
</li>
```

**Files to update:**
- `index.html` (line 25-27)
- `pages/Resume/Resume.html` (line 26-28)
- `pages/Blog/Blog.html` (line 20)
- `pages/Projects/Projects.html` (same structure, Professional marked `.active`)

---

## `pages/Projects/Projects.html` Structure

```
<!DOCTYPE html>
<html lang="en">
<head>
  → ../../style.css + ./Projects.css
  → title: "Projects - Ujjwal Verma"
</head>
<body>
  <span id="menuIcon">&lt;</span>
  <header>
    → nav with dropdown (Professional .active)
  </header>

  <section data-section="projects">
    <div id="projects-container">

      ┌─ #github-stats ─────────────────────────────┐
      │  section-heading: "GitHub Activity"          │
      │  #github-stats-content                       │
      │    └─ .stat-card                             │
      │         ├─ #commit-count (stat-number)       │
      │         └─ "Public Repos" (stat-label)       │
      └──────────────────────────────────────────────┘

      ┌─ #recent-activity ──────────────────────────┐
      │  section-heading: "Currently Working On"     │
      │  #activity-card (.post-card, hidden)         │
      │    ├─ #repo-name (.card-title)               │
      │    ├─ #commit-message (.card-excerpt)        │
      │    └─ #commit-link (.card-link)              │
      │  #activity-fallback (hidden, shown on error) │
      └──────────────────────────────────────────────┘

      ┌─ #research-section ─────────────────────────┐
      │  section-heading: "Latest from the Blog"     │
      │  #research-card (.post-card)                 │
      │    ├─ img#research-banner                    │
      │    ├─ h3#research-title                      │
      │    ├─ p#research-date                        │
      │    ├─ p#research-excerpt                     │
      │    └─ a#research-link → Blog.html            │
      └──────────────────────────────────────────────┘

      ┌─ #leetcode-section ─────────────────────────┐
      │  section-heading: "LeetCode Progress"        │
      │  #leetcode-content                           │
      │    ├─ .leetcode-stats-grid (4 stat-cards)   │
      │    │    ├─ #lc-solved / "Solved"             │
      │    │    ├─ #lc-easy / "Easy"                 │
      │    │    ├─ #lc-medium / "Medium"             │
      │    │    └─ #lc-hard / "Hard"                 │
      │    └─ #lc-recent                             │
      │         ├─ "Last active: X days"             │
      │         └─ "Ranking: X"                      │
      │  → link to https://leetcode.com/ujjuboi/    │
      │  #lc-fallback (hidden, shown on error)       │
      └──────────────────────────────────────────────┘

    </div>
  </section>

  <footer> → identical to other pages </footer>
</body>
</html>
```

---

## `pages/Projects/Projects.css`

### Overrides (same pattern as Blog.css / Resume.css)
```css
body { display: block; overflow-y: auto; overflow-x: hidden; }
section { position: relative; height: auto; min-height: 70vh; padding: 3% 0; display: block; }
```

### Container
```css
#projects-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 5%;
  animation: fadeIn ease 1s;
  animation-fill-mode: both;
}
```

### Section headings (reuse `.section-title` pattern from Resume.css)
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
  box-shadow: 0.3rem 0.3rem var(--shadowColor);
}
```

### Stat cards (mirror `.skill-item` styling)
```css
.stat-card {
  background-color: var(--backgroundColor);
  border: 0.2rem solid var(--borderColor);
  border-radius: 0.4rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0.3rem 0.3rem var(--shadowColor);
  transition: all 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-0.2rem) translateX(0.2rem);
  box-shadow: 0.45rem 0.45rem var(--shadowColor);
}
.stat-number {
  display: block;
  font-family: var(--headings);
  font-size: 2.5rem;
  color: var(--shadowColor);
  margin-bottom: 0.5rem;
}
.stat-label {
  display: block;
  font-size: 0.9rem;
  color: var(--borderColor);
  opacity: 0.8;
}
```

### Activity card (mirror Blog's `.post-card`)
```css
#activity-card {
  background-color: var(--backgroundColor);
  border: 0.2rem solid var(--borderColor);
  border-radius: 0.4rem;
  padding: 1.5rem;
  box-shadow: 0.3rem 0.3rem var(--shadowColor);
}
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

### LeetCode grid
```css
.leetcode-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
#lc-recent {
  text-align: center;
  font-size: 0.95rem;
  color: var(--shadowColor);
}
#lc-recent p { margin: 0.3rem 0; }
```

### Research card (single card, mirrors Blog's `.post-card`)
```css
#research-card {
  background-color: var(--backgroundColor);
  border: 0.2rem solid var(--borderColor);
  border-radius: 0.4rem;
  padding: 1.5rem;
  box-shadow: 0.3rem 0.3rem var(--shadowColor);
  transition: all 0.2s ease;
}
#research-card:hover {
  transform: translateY(-0.2rem) translateX(0.2rem);
  box-shadow: 0.45rem 0.45rem var(--shadowColor);
}
#research-banner {
  width: 100%;
  max-height: 300px;
  border: 0.15rem solid var(--borderColor);
  border-radius: 0.3rem;
  margin-bottom: 1rem;
  padding: 1%;
}
#research-title {
  font-family: var(--headings);
  color: var(--shadowColor);
  font-size: 1.4rem;
  margin: 0 0 0.5rem 0;
}
#research-date {
  color: var(--shadowColor);
  font-size: 0.9rem;
  margin: 0 0 0.8rem 0;
  opacity: 0.85;
}
#research-excerpt {
  font-size: 1rem;
  color: var(--borderColor);
  line-height: 1.6;
  margin: 0;
}
#research-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--linkColor);
  text-decoration: none;
  border-bottom: 0.1rem solid var(--linkColor);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}
#research-link:hover {
  color: var(--linkHover);
  border-bottom-color: var(--linkHover);
}
```

### Dropdown (desktop: CSS hover, mobile: inline)
```css
.nav-dropdown { position: relative; }

.dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 140px;
  background-color: var(--backgroundColor);
  border: 0.2rem solid var(--borderColor);
  border-radius: 0.3rem;
  box-shadow: 0.3rem 0.3rem var(--shadowColor);
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
  z-index: 100;
}

.nav-dropdown:hover .dropdown { display: block; }

.dropdown li a {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: var(--shadowColor);
  text-decoration: none;
  transition: background-color 0.15s ease;
}
.dropdown li a:hover {
  background-color: var(--contentColor);
  border-bottom: none;
}
```

### Fallback message
```css
.stats-section > p:last-child {
  text-align: center;
  color: var(--shadowColor);
  font-style: italic;
}
```

### 720px breakpoint
```css
@media (max-width: 720px) {
  body { overflow-y: auto; }
  section { min-height: auto; padding: 10% 2% 30%; }
  #projects-container { padding: 0 3%; }
  .section-heading { font-size: 1.2rem; padding: 2% 3%; }
  .stat-number { font-size: 1.8rem; }
  .leetcode-stats-grid { grid-template-columns: repeat(2, 1fr); }

  /* Dropdown becomes inline under Projects in hamburger menu */
  .dropdown {
    position: static;
    display: block;
    border: none;
    box-shadow: none;
    padding: 0 0 0 1.5rem;
    margin: 0.3rem 0;
  }
  .dropdown li a { font-size: 1rem; padding: 0.3rem 0; }

  /* Same mobile header pattern as other pages */
  header { display: none; padding-top: 15%; text-align: center;
    flex-direction: column; justify-content: space-around;
    background-color: var(--contentColor); right: 3%;
    height: 75vh; width: 91vw; z-index: 10; }
  header nav ul { height: 80%; width: 80%; flex-direction: column;
    align-items: center; justify-content: space-evenly; }
  #menuIcon { top: 0%; right: 4%; cursor: pointer; visibility: visible;
    position: absolute; color: var(--shadowColor); font-size: 2.5rem; }
  footer { transition: height 0.2s linear, bottom 0.2s linear;
    text-align: left; font-size: 0.7rem; height: 18vh;
    width: 100%; position: absolute; bottom: 4%; }
}
```

---

## JavaScript (inline `<script>`)

### 1. `notice()` — mySpace alert
```javascript
function notice() {
  alert("Under Development!");
}
```

### 2. `fetchGitHubStats()` — commit counter
```javascript
async function fetchGitHubStats() {
  try {
    const response = await fetch('https://api.github.com/users/ujjuboi');
    const data = await response.json();
    document.getElementById('commit-count').textContent = data.public_repos;
  } catch (error) {
    console.error('GitHub stats error:', error);
    document.getElementById('github-stats-content').style.display = 'none';
  }
}
```

### 3. `fetchRecentActivity()` — latest commit banner
```javascript
async function fetchRecentActivity() {
  try {
    const reposRes = await fetch('https://api.github.com/users/ujjuboi/repos?sort=updated&per_page=1');
    const repos = await reposRes.json();
    if (repos.length === 0) return;

    const latestRepo = repos[0];
    const commitsRes = await fetch(`https://api.github.com/repos/ujjuboi/${latestRepo.name}/commits?per_page=1`);
    const commits = await commitsRes.json();
    if (commits.length === 0) return;

    const commit = commits[0];
    document.getElementById('repo-name').textContent = latestRepo.name;
    document.getElementById('commit-message').textContent = commit.commit.message;
    document.getElementById('commit-link').href = commit.html_url;
    document.getElementById('activity-card').style.display = 'block';
  } catch (error) {
    console.error('Recent activity error:', error);
    document.getElementById('activity-fallback').style.display = 'block';
  }
}
```

### 4. `fetchLeetCodeStats()` — with graceful degradation
```javascript
async function fetchLeetCodeStats() {
  try {
    const response = await fetch('https://leetcode-stats.tashif.codes/ujjuboi');
    const data = await response.json();

    if (data.status === 'success') {
      document.getElementById('lc-solved').textContent = data.totalSolved;
      document.getElementById('lc-easy').textContent = data.easySolved;
      document.getElementById('lc-medium').textContent = data.mediumSolved;
      document.getElementById('lc-hard').textContent = data.hardSolved;
      document.getElementById('lc-active-days').textContent = data.data.totalActiveDays;
      document.getElementById('lc-ranking').textContent = data.ranking.toLocaleString();
    } else {
      throw new Error('API returned error');
    }
  } catch (error) {
    console.error('LeetCode stats error:', error);
    document.getElementById('leetcode-content').style.display = 'none';
    document.getElementById('lc-fallback').style.display = 'block';
  }
}
```

### 5. `renderResearch()` — latest blog post from Blog.html
```javascript
// Latest post data (synced with pages/Blog/Blog.html posts[0])
const latestPost = {
  title: "Scaling Identity Data Ingestion: MongoDB at Enterprise Scale",
  date: "August 22, 2026",
  excerpt: "How we optimized a data ingestion pipeline to process 18M group memberships in 4 hours — from 10 to 1,500 records/sec.",
  banner: "../../Images/Graphics/MongoDB.svg",
  link: "../Blog/Blog.html"
};

function renderResearch() {
  document.getElementById('research-banner').src = latestPost.banner;
  document.getElementById('research-banner').alt = latestPost.title;
  document.getElementById('research-title').textContent = latestPost.title;
  document.getElementById('research-date').textContent = latestPost.date;
  document.getElementById('research-excerpt').textContent = latestPost.excerpt;
  document.getElementById('research-link').href = latestPost.link;
}
```

### 6. Mobile menu toggle (same pattern as other pages)
```javascript
var footer = document.querySelector('footer');
var menuIcon = document.getElementById('menuIcon');
var header = document.querySelector('header');
var projectsContainer = document.getElementById('projects-container');

menuIcon.addEventListener('click', () => {
  menuIcon.style.display = "none";
  header.style.display = "block";
  projectsContainer.style.display = "none";
  footer.style.height = "10vh";
  footer.style.bottom = "1%";
});

footer.addEventListener('click', () => {
  menuIcon.style.display = "block";
  footer.style.height = "18vh";
  footer.style.bottom = "4%";
  header.style.display = "none";
  projectsContainer.style.display = "block";
});
```

### 7. Initialize on load
```javascript
fetchGitHubStats();
fetchRecentActivity();
fetchLeetCodeStats();
renderResearch();
```

---

## Execution Order

1. Create `pages/Projects/Projects.css`
2. Create `pages/Projects/Projects.html` (full HTML + inline JS)
3. Update navbar in `index.html` (replace Projects `<li>` with dropdown)
4. Update navbar in `pages/Resume/Resume.html`
5. Update navbar in `pages/Blog/Blog.html`
6. Update `README.md` file tree (add Projects files)
7. Manual browser test: open each page, verify dropdown hover on desktop, hamburger on mobile
