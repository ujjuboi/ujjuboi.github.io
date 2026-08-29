# Plan: Fetch Open Issues & PRs in "Currently Working On" Section

## Objective
Display the user's latest open issues and pull requests across all repos inside the existing "Currently Working On" section on `pages/Projects/Projects.html`.

## Files to Modify

### 1. `pages/Projects/Projects.html` (line ~62, inside the "Currently Working On" section-content)
Add after `#activity-card` and before `#activity-fallback`:

### 2. `scripts/projects.js`
Add `async function fetchGitHubIssues()` that calls `https://api.github.com/users/ujjuboi/issues?state=open&sort=created&direction=desc`, filters for open issues/PRs, renders each as a `.repo-card card` `<a>` link with the issue title, repo name, and created date. Handle loading/fallback like `fetchGitHubStats()`.

### 3. `styles/Projects.css`
Minimal CSS for the issues grid (reuse `.repo-card`/`.card` styles already used elsewhere).

## Scope Confirmed
- All repos (user-level endpoint, not repo-specific)
- Include PRs (no `pull_request` filter)
- Open issues only (`state=open`)
- Within the existing "Currently Working On" section — no new section added
