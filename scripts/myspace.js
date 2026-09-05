/**
 * In-memory cache TTL (30 minutes) for external API responses.
 */
const CACHE_TTL = 30 * 60 * 1000;

/**
 * Renders the LeetCode activity bar chart into the submissions card.
 *
 * @param {Object|string} submissionCalendar Day-timestamp to submissions map (or JSON string).
 * @returns {boolean} Whether activity rendered successfully.
 */
function renderLeetCodeActivity(submissionCalendar) {
  const container = document.getElementById('lc-activity');
  if (!container) return false;

  if (typeof submissionCalendar === 'string' && submissionCalendar) {
    try {
      submissionCalendar = JSON.parse(submissionCalendar);
    } catch (e) {
      submissionCalendar = null;
    }
  }
  if (!submissionCalendar || typeof submissionCalendar !== 'object') return false;

  const days = Object.entries(submissionCalendar)
    .map(([ts, count]) => ({ ts: Number(ts) * 1000, count: Number(count) || 0 }))
    .filter(d => d.count > 0)
    .sort((a, b) => a.ts - b.ts);

  if (days.length === 0) return false;

  const card = document.getElementById('lc-submissions-card');
  if (card) card.style.display = 'block';

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthMap = new Map();
  days.forEach(d => {
    const date = new Date(d.ts);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const entry = monthMap.get(key) || { ts: d.ts, count: 0, date };
    entry.ts = Math.min(entry.ts, d.ts);
    entry.count += d.count;
    monthMap.set(key, entry);
  });

  const months = Array.from(monthMap.values()).sort((a, b) => a.ts - b.ts);

  const total = months.reduce((sum, m) => sum + m.count, 0);
  const max = Math.max(...months.map(m => m.count));

  const cols = months.map(m => {
    const height = max > 0 ? Math.max(8, (m.count / max) * 100) : 8;
    const filledPct = total > 0 ? Math.round((m.count / total) * 100) : 0;
    const label = `${monthNames[m.date.getMonth()]} ${m.date.getFullYear()}`;

    return `
      <div class="lc-col">
        <div class="lc-bar" style="height:${height}%;"></div>
        <span class="lc-col-label">${monthNames[m.date.getMonth()]} ${String(m.date.getFullYear()).slice(2)}</span>
        <div class="lc-tooltip" role="tooltip">
          <span class="lc-tooltip-date">${label}</span>
          <span class="lc-tooltip-count">${m.count} submission${m.count === 1 ? '' : 's'}</span>
          <span class="lc-tooltip-meter"><span style="width:${filledPct}%"></span></span>
          <span class="lc-tooltip-max"><em>${filledPct}%</em> of total submissions</span>
        </div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="lc-activity-chart">
      <div class="lc-yaxis">
        <span class="lc-axis-label lc-axis-label-y">Problems</span>
      </div>
      <div class="lc-plot">
        <div class="lc-total">${total} total submissions</div>
        <div class="lc-activity-bars">${cols}</div>
      </div>
    </div>
  `;
  return true;
}

/**
 * Fetches and renders the LeetCode submission activity heatmap.
 */
async function fetchLeetCodeActivity() {
  const container = document.getElementById('lc-activity');
  const card = document.getElementById('lc-submissions-card');
  if (!container) return;

  /**
   * Shows the loading state inside the activity card.
   */
  const showLoading = () => {
    if (card) card.style.display = 'block';
    container.innerHTML = `
      <div class="lc-activity-state lc-loading">
        <span class="lc-spinner"></span>
        <span>Loading activity<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span></span>
      </div>`;
  };

  /**
   * Shows an error state inside the activity card.
   *
   * @param {string} message Error text to display.
   */
  const showError = (message) => {
    if (card) card.style.display = 'block';
    container.innerHTML = `
      <div class="lc-activity-state lc-error" role="alert">
        <span class="lc-error-icon">!</span>
        <span class="lc-error-text">${escapeHtml(message)}</span>
      </div>`;
  };

  showLoading();
  try {
    const data = await cachedFetch('https://leetcode-stats.tashif.codes/ujjuboi/heatmap');
    const calendar = {};
    const days = data && (data.dailyContributions || data.data?.dailyContributions);
    if (!Array.isArray(days) || days.length === 0) {
      throw new Error('No activity data available');
    }
    days.forEach(day => {
      if (day && Number(day.count) > 0) {
        calendar[day.timestamp] = Number(day.count);
      }
    });
    if (Object.keys(calendar).length === 0) {
      throw new Error('No activity data available');
    }
    if (!renderLeetCodeActivity(calendar)) {
      showError('No activity data available.');
    }
  } catch (error) {
    console.error('LeetCode activity error:', error);
    showError('Unable to load activity data. Please try again later.');
  }
}

/**
 * Renders the recent LeetCode submissions list.
 *
 * @param {Object[]} submissions Recent submission objects.
 */
function renderRecentSubmissions(submissions) {
  const list = document.getElementById('lc-submissions');
  if (!list || !Array.isArray(submissions) || submissions.length === 0) return;

  const now = Date.now();
  const items = submissions.map(s => {
    const title = escapeHtml(s.title);
    const slug = escapeHtml(s.titleSlug);
    const status = escapeHtml(s.statusDisplay || 'Other');
    const lang = escapeHtml(s.lang || '');
    const seconds = Number(s.timestamp);
    const ms = seconds > 1e12 ? seconds : seconds * 1000;
    const diff = Math.max(0, now - ms);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    const time = minutes < 60 ? `${minutes}m ago` : hours < 24 ? `${hours}h ago` : `${days}d ago`;

    return `<li class="lc-submission">
      <a class="lc-submission-title" href="https://leetcode.com/problems/${slug}/" target="_blank">${title}</a>
      <span class="lc-submission-status is-${(status || '').toLowerCase().replace(/[^a-z0-9]/g, '')}">${status}</span>
      <span class="lc-submission-lang">${lang}</span>
      <span class="lc-submission-time">${time}</span>
    </li>`;
  }).join('');

  list.innerHTML = items;
}

/**
 * Fetches and renders recent LeetCode submissions.
 */
async function fetchRecentSubmissions() {
  const list = document.getElementById('lc-submissions');
  if (!list) return;
  try {
    const data = await cachedFetch('https://leetpulse-api.vercel.app/api/leetcode/submission/ujjuboi?limit=5');
    const submissions = data && (data.recentSubmissions || data.submission || data.submissions);
    if (Array.isArray(submissions) && submissions.length > 0) {
      renderRecentSubmissions(submissions);
    } else {
      list.innerHTML = '<li class="lc-submission-empty">No recent submissions found.</li>';
    }
  } catch (error) {
    console.error('LeetCode submissions error:', error);
    list.innerHTML = '<li class="lc-submission-empty">Unable to load recent submissions.</li>';
  }
}

/**
 * Fetches JSON with a localStorage cache, storing each URL for CACHE_TTL milliseconds.
 *
 * @param {string} url Endpoint to fetch.
 * @returns {Promise<Object>} The parsed JSON response.
 */
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

/**
 * Fetches and renders the user's most recently updated GitHub repositories.
 */
async function fetchGitHubStats() {
  try {
    const repos = await cachedFetch('https://api.github.com/users/ujjuboi/repos?sort=updated&per_page=6');
    if (!Array.isArray(repos) || repos.length === 0) throw new Error('No repos');

    const grid = document.getElementById('github-repos-grid');

    /**
     * Builds one repository card, preferring its README's first paragraph as the description.
     *
     * @param {Object} repo Repository object from the GitHub API.
     * @returns {Promise<HTMLElement>} The completed card element.
     */
    const buildCard = async (repo) => {
      let description = repo.description || '';
      try {
        const readmeData = await cachedFetch(`https://api.github.com/repos/ujjuboi/${repo.name}/readme`);
        const decoded = atob(readmeData.content);
        const lines = decoded.split('\n').filter(l => l.trim());
        const firstParagraph = lines.find(l => !l.startsWith('#') && !l.startsWith('!') && !l.startsWith('[') && l.length > 10);
        if (firstParagraph) description = firstParagraph.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
      } catch (e) { /* use repo description as fallback */ }

      if (description.length > 120) description = description.slice(0, 117) + '...';

      const card = document.createElement('a');
      card.className = 'repo-card card';
      card.href = repo.html_url;
      card.target = '_blank';
      card.innerHTML = `
        <h3 class="repo-card-name">${repo.name}</h3>
        <p class="repo-card-desc">${description || 'No description available.'}</p>
        <span class="repo-card-lang">${repo.language || ''}</span>
      `;
      return card;
    };

    const cards = await Promise.all(repos.map(buildCard));

    cards.forEach(c => grid.appendChild(c));
    document.getElementById('github-loading').style.display = 'none';
  } catch (error) {
    console.error('GitHub stats error:', error);
    document.getElementById('github-loading').style.display = 'none';
    document.getElementById('github-repos-grid').style.display = 'none';
    document.getElementById('github-fallback').style.display = 'block';
  }
}

/**
 * Whether recent-activity widgets have loaded data successfully.
 */
let recentActivityOk = false;
let gitHubIssuesOk = false;

/**
 * Shows the activity fallback message only when every activity widget failed.
 */
function syncActivityFallback() {
  const fallback = document.getElementById('activity-fallback');
  if (!recentActivityOk && !gitHubIssuesOk) {
    fallback.style.display = 'block';
  } else {
    fallback.style.display = 'none';
  }
}

/**
 * Fetches the most recent commit authored by the user and displays it as the current activity.
 */
async function fetchRecentActivity() {
  try {
    const repos = await cachedFetch('https://api.github.com/users/ujjuboi/repos?sort=updated&per_page=1');
    if (repos.length === 0) {
      syncActivityFallback();
      return;
    }

    const latestRepo = repos[0];
    const commits = await cachedFetch(`https://api.github.com/repos/ujjuboi/${latestRepo.name}/commits?per_page=10`);
    const userCommit = commits.find(c => c.author && c.author.login === 'ujjuboi');
    if (!userCommit) {
      syncActivityFallback();
      return;
    }

    const commit = userCommit;
    document.getElementById('repo-name').textContent = latestRepo.name;
    document.getElementById('commit-message').textContent = commit.commit.message;
    document.getElementById('commit-link').href = commit.html_url;
    document.getElementById('activity-card').style.display = 'block';
    recentActivityOk = true;
    syncActivityFallback();
  } catch (error) {
    console.error('Recent activity error:', error);
    syncActivityFallback();
  }
}

/**
 * Fetches and renders the LeetCode solve statistics and recent activity.
 */
async function fetchLeetCodeStats() {
  try {
    const data = await cachedFetch('https://leetcode-stats.tashif.codes/ujjuboi');

    if (data.status === 'success') {
      document.getElementById('leetcode-loading').style.display = 'none';
      document.getElementById('leetcode-grid').style.display = '';
      document.getElementById('lc-recent').style.display = '';
      document.getElementById('lc-profile-link').style.display = '';
      document.getElementById('lc-solved').textContent = data.totalSolved;
      document.getElementById('lc-easy').textContent = data.easySolved;
      document.getElementById('lc-medium').textContent = data.mediumSolved;
      document.getElementById('lc-hard').textContent = data.hardSolved;
      const lcActiveDays = document.getElementById('lc-total-active-days');
      lcActiveDays.textContent = `Total active days: ${data.data.totalActiveDays} days`;
      document.getElementById('lc-ranking').textContent = `Ranking: ${data.ranking.toLocaleString()}`;
      fetchLeetCodeActivity();
      fetchRecentSubmissions();
    } else {
      throw new Error('API returned error');
    }
  } catch (error) {
    console.error('LeetCode stats error:', error);
    document.getElementById('leetcode-loading').style.display = 'none';
    document.getElementById('leetcode-content').style.display = 'none';
    document.getElementById('lc-fallback').style.display = 'block';
  }
}

/**
 * Loads the newest blog post from the manifest and shows it in the research card.
 */
async function loadLatestPost() {
  try {
    const manifestRes = await fetch('../../src/Blogs/posts.json');
    if (!manifestRes.ok) throw new Error('Failed to fetch posts.json');
    const filenames = await manifestRes.json();
    if (filenames.length === 0) return;

    const mdRes = await fetch('../../src/Blogs/' + filenames[0]);
    if (!mdRes.ok) throw new Error('Failed to fetch ' + filenames[0]);
    const text = await mdRes.text();
    const meta = parsePostHeaders(text);

    document.getElementById('research-banner').src = meta.banner || '';
    document.getElementById('research-banner').alt = meta.title || '';
    document.getElementById('research-title').textContent = meta.title || '';
    document.getElementById('research-date').textContent = meta.date || '';
    document.getElementById('research-excerpt').textContent = meta.excerpt || '';
    document.getElementById('research-link').href = '../Blog/Blog.html#post-0';
    document.getElementById('research-card').style.display = 'block';
  } catch (e) {
    console.error('Failed to load latest post:', e);
  }
}

/**
 * Fetches and renders the user's open issues and pull requests.
 */
async function fetchGitHubIssues() {
  try {
    const data = await cachedFetch('https://api.github.com/search/issues?q=author:ujjuboi+state:open&sort=created&order=desc&per_page=10');
    const items = data && Array.isArray(data.items) ? data.items : null;
    if (!items || items.length === 0) throw new Error('No open issues');

    const grid = document.getElementById('issues-grid');
    document.getElementById('issues-loading').style.display = '';

    const cards = items.slice(0, 6).map((item) => {
      const isPR = item.pull_request !== undefined;
      const repoName = (item.repository_url || '').replace('https://api.github.com/repos/', '');
      const card = document.createElement('a');
      card.className = 'post-card card';
      card.href = item.html_url;
      card.target = '_blank';
      const tag = isPR ? 'PR' : 'Issue';
      const created = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const title = document.createElement('h3');
      title.className = 'card-title';
      const tagSpan = document.createElement('span');
      tagSpan.className = 'myspace-tag';
      tagSpan.textContent = tag;
      const titleText = document.createElement('span');
      titleText.textContent = item.title;
      title.appendChild(titleText);
      title.appendChild(tagSpan);

      const date = document.createElement('p');
      date.className = 'card-date';
      date.textContent = `${repoName} · ${created}`;

      let excerpt = (item.body || '').replace(/[#*`>\[\]()!-]/g, ' ').replace(/\s+/g, ' ').trim();
      if (excerpt.length > 120) excerpt = excerpt.slice(0, 117) + '...';
      const excerptP = document.createElement('p');
      excerptP.className = 'card-excerpt';
      excerptP.textContent = excerpt;

      const link = document.createElement('span');
      link.className = 'card-link';
      link.textContent = 'View on GitHub →';

      card.appendChild(title);
      card.appendChild(date);
      card.appendChild(excerptP);
      card.appendChild(link);
      return card;
    });

    grid.style.display = '';
    cards.forEach(c => grid.appendChild(c));
    document.getElementById('issues-loading').style.display = 'none';
    gitHubIssuesOk = true;
    syncActivityFallback();
  } catch (error) {
    console.error('GitHub issues error:', error);
    document.getElementById('issues-loading').style.display = 'none';
    document.getElementById('issues-grid').style.display = 'none';
    syncActivityFallback();
  }
}

fetchGitHubStats();
fetchRecentActivity();
fetchLeetCodeStats();
loadLatestPost();
fetchGitHubIssues();
initMenuToggle('#myspace-container');