/**
 * Cache TTL (6 hours) for external API responses.
 */
const CACHE_TTL = 6 * 60 * 60 * 1000;

/**
 * Candidate repos for the "Currently Working On" section.
 * The first repo that loads successfully is displayed.
 */
const currentProjectRepos = ['ujjuboi/jobhunt'];

/**
 * How many trailing months of commit activity the chart shows.
 */
const commitChartMonths = 6;

/**
 * Month names used for chart axis and tooltip labels.
 */
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * MySpace sections, shown as collapsible blocks in order.
 * The first section starts expanded; the rest start collapsed.
 */
const categories = ['Currently Studying', 'Currently Working On', 'LeetCode Progress', 'My Library'];

/**
 * Staged section content for each category, populated by stageSections().
 */
const sections = [];

/**
 * Rendered Section instances, keyed by category label.
 */
const sectionInstances = {};

/**
 * Stages each section's widget shells. The shells have no data dependency,
 * so this runs synchronously at startup.
 */
function stageSections() {
  sections.push({ category: 'Currently Studying', full: true, content: buildStudySection() });
  sections.push({ category: 'Currently Working On', content: buildActivitySection() });
  sections.push({ category: 'LeetCode Progress', content: buildLeetCodeSection() });
  sections.push({ category: 'My Library', full: true, content: buildBooksSection() });
}

/**
 * Builds the study plan section's widget markup.
 *
 * @returns {string} Inner HTML for the section content.
 */
function buildStudySection() {
  return `
<div id="study-loading" class="loading-placeholder">
  Loading study plans<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span>
</div>
<div id="study-plans-grid"></div>
<div id="study-fallback" style="display: none; text-align: center; color: var(--shadowColor); font-style: italic;">
  Unable to load study plans
</div>
<div id="study-plan-view" style="display: none;">
  <button id="study-plan-back-btn" type="button" onclick="showStudyPlansList()">← Back to study plans</button>
  <div class="study-summary">
    <h3 class="study-title" id="study-title"></h3>
    <div class="study-progress-track">
      <div class="study-progress-fill" id="study-progress-fill" style="width: 0%"></div>
      <span class="study-progress-label" id="study-progress-label">0/0</span>
    </div>
    <div class="study-focus" id="study-focus"></div>
  </div>
  <div id="study-tree" class="word-tree"></div>
</div>`;
}

/**
 * Builds the currently-working-on section's widget markup.
 *
 * @returns {string} Inner HTML for the section content.
 */
function buildActivitySection() {
  return `
<div class="loading-placeholder" id="project-loading">
  Loading latest project<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span>
</div>
<div id="project-card" class="project-card card" style="display: none;">
  <div class="project-banner-wrap">
    <img id="project-banner" class="project-banner" alt="">
    <div id="project-banner-fallback" class="project-banner-fallback"></div>
  </div>
  <div class="project-card-body">
    <h3 class="card-title" id="project-title"></h3>
    <p class="card-excerpt" id="project-excerpt"></p>
    <a id="project-link" class="card-link" href="#" target="_blank" rel="noopener">View on GitHub →</a>
  </div>
</div>
<div id="project-fallback" class="myspace-fallback" style="display: none;">
  Unable to fetch the current project
</div>
<div id="commit-card" class="card" style="display: none;">
  <h3 class="card-title">Commit Activity</h3>
  <div class="lc-activity" id="commit-activity">
    <div class="lc-activity-state lc-loading">
      <span class="lc-spinner"></span>
      <span>Loading commit history<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span></span>
    </div>
  </div>
</div>
<div id="commit-fallback" class="myspace-fallback" style="display: none;">
  Unable to fetch commit history
</div>`;
}

/**
 * Builds the LeetCode progress section's widget markup.
 *
 * @returns {string} Inner HTML for the section content.
 */
function buildLeetCodeSection() {
  return `
<div id="leetcode-content">
  <div class="loading-placeholder" id="leetcode-loading">
    Fetching data<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span>
  </div>
  <div class="leetcode-stats-grid" id="leetcode-grid" style="display: none;">
    <div class="stat-card card">
      <span id="lc-solved" class="stat-number">--</span>
      <span class="stat-label">Solved</span>
    </div>
    <div class="stat-card card">
      <span id="lc-easy" class="stat-number">--</span>
      <span class="stat-label">Easy</span>
    </div>
    <div class="stat-card card">
      <span id="lc-medium" class="stat-number">--</span>
      <span class="stat-label">Medium</span>
    </div>
    <div class="stat-card card">
      <span id="lc-hard" class="stat-number">--</span>
      <span class="stat-label">Hard</span>
    </div>
  </div>
  <div id="lc-submissions-card" class="card" style="display: none;">
    <h3 class="card-title">Recent Submissions &amp; Activity</h3>
    <div class="lc-activity" id="lc-activity"></div>
    <ul class="lc-submission-list" id="lc-submissions"></ul>
  </div>
  <div id="lc-recent" style="display: none;">
    <p id="lc-total-active-days">Total active days: -- days ago</p>
    <p id="lc-ranking">Ranking: --</p>
    <p id="lc-link">
      <a id="lc-profile-link" class="card-link" href="https://leetcode.com/ujjuboi/" target="_blank" style="display: none;">View LeetCode Profile →</a>
    </p>
  </div>
</div>
<div id="lc-fallback" style="display: none; text-align: center; color: var(--shadowColor); font-style: italic;">
  Unable to fetch LeetCode stats
</div>`;
}

/**
 * Builds the My Library section's widget markup.
 *
 * @returns {string} Inner HTML for the section content.
 */
function buildBooksSection() {
  return `
<div id="books-loading" class="loading-placeholder">
  Loading books<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span>
</div>
<div id="books-grid"></div>
<div id="books-fallback" style="display: none; text-align: center; color: var(--shadowColor); font-style: italic;">
  No books to show
</div>
<div id="book-view" style="display: none;">
  <button id="book-back-btn" onclick="showBooksList()">← Back to books</button>
  <div class="book-detail">
    <div class="book-detail-cover">
      <img id="book-banner" src="" alt="Book cover">
    </div>
    <div class="book-detail-main">
      <div class="book-detail-content">
        <h1 id="book-title"></h1>
        <p id="book-author"></p>
        <p id="book-meta"></p>
        <div id="book-excerpt"></div>
        <div id="book-thoughts"></div>
      </div>
    </div>
  </div>
</div>`;
}

/**
 * Renders each category as a shared collapsible section.
 * The first category starts expanded; the rest start collapsed.
 */
function renderMyspaceSections() {
  const container = document.getElementById('myspace-sections');
  if (!container) return;
  container.innerHTML = '';

  categories.forEach((category, index) => {
    const match = sections.find(section => section.category === category);
    if (!match) return;
    sectionInstances[category] = new Section({
      title: category,
      content: match.content,
      className: 'myspace-section' + (match.full ? ' myspace-section--full' : ''),
      expanded: index === 0
    }).addTo(container);
  });
}

/**
 * Expands the section for the given category so its content is visible.
 *
 * @param {string} category The category label whose section to expand.
 */
function expandSection(category) {
  const section = sectionInstances[category];
  if (section && !section.isExpanded) {
    section.expand();
  }
}

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
    } catch (error) {
      submissionCalendar = null;
    }
  }
  if (!submissionCalendar || typeof submissionCalendar !== 'object') return false;

  const days = Object.entries(submissionCalendar)
    .map(([timestamp, count]) => ({ timestamp: Number(timestamp) * 1000, count: Number(count) || 0 }))
    .filter(day => day.count > 0)
    .sort((firstDay, secondDay) => firstDay.timestamp - secondDay.timestamp);

  if (days.length === 0) return false;

  const card = document.getElementById('lc-submissions-card');
  if (card) card.style.display = 'block';

  const monthMap = new Map();
  days.forEach(day => {
    const date = new Date(day.timestamp);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const entry = monthMap.get(key) || { timestamp: day.timestamp, count: 0, date };
    entry.timestamp = Math.min(entry.timestamp, day.timestamp);
    entry.count += day.count;
    monthMap.set(key, entry);
  });

  const months = Array.from(monthMap.values()).sort((firstMonth, secondMonth) => firstMonth.timestamp - secondMonth.timestamp);

  const total = months.reduce((sum, month) => sum + month.count, 0);
  const max = Math.max(...months.map(month => month.count));

  const chartData = months.map(month => {
    const height = max > 0 ? Math.max(8, (month.count / max) * 100) : 8;
    const filledPct = total > 0 ? Math.round((month.count / total) * 100) : 0;
    const label = `${monthNames[month.date.getMonth()]} ${month.date.getFullYear()}`;
    const shortLabel = `${monthNames[month.date.getMonth()]} ${String(month.date.getFullYear()).slice(2)}`;

    return {
      height,
      shortLabel,
      content: `
        <span class="lc-tooltip-date">${label}</span>
        <span class="lc-tooltip-count">${month.count} submission${month.count === 1 ? '' : 's'}</span>
        <span class="lc-tooltip-meter"><span style="width:${filledPct}%"></span></span>
        <span class="lc-tooltip-max"><em>${filledPct}%</em> of total submissions</span>`
    };
  });

  container.innerHTML = `
    <div class="lc-activity-chart">
      <div class="lc-yaxis">
        <span class="lc-axis-label lc-axis-label-y">Problems</span>
      </div>
      <div class="lc-plot">
        <div class="lc-total">${total} total submissions</div>
        <div class="lc-activity-bars">${chartData.map(dataPoint => `
          <div class="lc-col">
            <div class="lc-bar" style="height:${dataPoint.height}%;"></div>
            <span class="lc-col-label">${dataPoint.shortLabel}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  `;

  const tooltip = new Tooltip();
  container.querySelectorAll('.lc-col').forEach((col, colIndex) => {
    tooltip.attach(col, chartData[colIndex].content);
  });
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
  const items = submissions.map(submission => {
    const title = escapeHtml(submission.title);
    const slug = escapeHtml(submission.titleSlug);
    const status = escapeHtml(submission.statusDisplay || 'Other');
    const lang = escapeHtml(submission.lang || '');
    const seconds = Number(submission.timestamp);
    const milliseconds = seconds > 1e12 ? seconds : seconds * 1000;
    const diff = Math.max(0, now - milliseconds);
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
 * On network or rate-limit failure, falls back to the last cached copy so widgets
 * still render instead of showing error states.
 *
 * @param {string} url Endpoint to fetch.
 * @returns {Promise<Object>} The parsed JSON response (fresh or stale).
 */
async function cachedFetch(url) {
  const cacheKey = 'gh_cache_' + url;
  const cached = localStorage.getItem(cacheKey);
  let staleData = null;
  if (cached) {
    const parsed = JSON.parse(cached);
    staleData = parsed.data;
    if (typeof parsed.cachedAt === 'number' && Date.now() - parsed.cachedAt < CACHE_TTL) return parsed.data;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify({ data, cachedAt: Date.now() }));
    return data;
  } catch (error) {
    if (staleData !== null) return staleData;
    throw error;
  }
}

/**
 * Extracts the project title from the first top-level heading in a README.
 *
 * @param {string} readmeText Raw README markdown source.
 * @param {string} fallbackName Repo name used when no heading is present.
 * @returns {string} The project display title.
 */
function parseProjectTitle(readmeText, fallbackName) {
  const heading = readmeText.match(/^\s*#\s+(.+?)\s*$/m);
  return heading ? heading[1].trim() : fallbackName;
}

/**
 * Extracts the first non-heading paragraph from a README as an excerpt.
 *
 * @param {string} readmeText Raw README markdown source.
 * @returns {string} The cleanly stripped project excerpt text.
 */
function parseProjectExcerpt(readmeText) {
  const lines = readmeText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#') || trimmed.startsWith('!') || trimmed.startsWith('-') || trimmed.startsWith('* ') || trimmed.startsWith('>') || trimmed.startsWith('```')) continue;
    if (trimmed.startsWith('[![')) continue;
    if (trimmed.length < 12) continue;
    const excerpt = trimmed
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[`*_~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!excerpt) continue;
    return excerpt.length > 160 ? excerpt.slice(0, 157) + '...' : excerpt;
  }
  return '';
}

/**
 * Extracts the first image URL from a README, resolving relative paths
 * against the repo's raw content base.
 *
 * @param {string} readmeText Raw README markdown source.
 * @param {string} repoFullName Owner/repo identifier.
 * @param {string} branch Default branch used to resolve relative paths.
 * @returns {string|null} Absolute image URL, or null when the README has none.
 */
function parseProjectBanner(readmeText, repoFullName, branch) {
  const markdownImage = readmeText.match(/!\[[^\]]*\]\(([^)]+)\)/);
  let source = markdownImage ? markdownImage[1] : null;
  if (!source) {
    const imageTag = readmeText.match(/<img[^>]+src=["']([^"']+)["']/i);
    source = imageTag ? imageTag[1] : null;
  }
  if (!source) return null;
  if (source.startsWith('http') || source.startsWith('data:')) return source;
  const rawBase = 'https://raw.githubusercontent.com/' + repoFullName + '/' + branch + '/';
  return rawBase + source.replace(/^\/+/, '');
}

/**
 * Renders the project banner image, showing the themed placeholder when
 * the README has no usable image.
 *
 * @param {Object} repo Repo object from the GitHub API.
 * @param {string} repoFullName Owner/repo identifier.
 * @param {string} readmeText Raw README markdown source.
 * @param {string} branch Default branch used to resolve image paths.
 */
function renderProjectBanner(repo, repoFullName, readmeText, branch) {
  const image = document.getElementById('project-banner');
  const placeholder = document.getElementById('project-banner-fallback');
  placeholder.textContent = repo.name;

  image.style.display = 'none';
  placeholder.style.display = 'flex';

  const bannerUrl = parseProjectBanner(readmeText, repoFullName, branch);
  if (!bannerUrl) return;

  image.addEventListener('load', () => {
    image.style.display = 'block';
    placeholder.style.display = 'none';
  });
  image.addEventListener('error', () => {
    image.style.display = 'none';
    placeholder.style.display = 'flex';
  });
  image.src = bannerUrl;
  image.alt = repo.name + ' banner';
}

/**
 * Renders the commit chart caption, polyline, points, and month labels.
 *
 * @param {Object[]} commits Raw commit objects from the GitHub API.
 */
function renderCommitChart(commits) {
  const container = document.getElementById('commit-activity');
  if (!container) return;

  const monthTotals = new Map();
  let lastMonthKey = null;
  commits.forEach(commit => {
    const date = commit && commit.commit && commit.commit.author && commit.commit.author.date;
    if (!date) return;
    const key = date.slice(0, 7);
    monthTotals.set(key, (monthTotals.get(key) || 0) + 1);
    if (!lastMonthKey || key > lastMonthKey) lastMonthKey = key;
  });

  if (!lastMonthKey) {
    container.innerHTML = '<div class="lc-activity-state lc-error" role="alert"><span class="lc-error-icon">!</span><span class="lc-error-text">No commit activity found.</span></div>';
    return;
  }

  const endYear = Number(lastMonthKey.slice(0, 4));
  const endMonthIndex = Number(lastMonthKey.slice(5, 7)) - 1;

  const chartMonths = [];
  for (let offset = commitChartMonths - 1; offset >= 0; offset--) {
    const date = new Date(endYear, endMonthIndex - offset, 1);
    const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    chartMonths.push({ key, count: monthTotals.get(key) || 0, date });
  }

  const total = chartMonths.reduce((sum, month) => sum + month.count, 0);
  if (total === 0) {
    container.innerHTML = '<div class="lc-activity-state" role="status"><span class="lc-error-text">No commit activity in the recent months.</span></div>';
    return;
  }
  const maxCount = Math.max(...chartMonths.map(month => month.count), 1);

  const viewBoxWidth = 500;
  const viewBoxHeight = 200;
  const baselineY = 185;
  const topY = 12;
  const pointCount = chartMonths.length;
  const xAt = index => ((index + 0.5) / pointCount) * viewBoxWidth;
  const yAt = count => baselineY - (count / maxCount) * (baselineY - topY);

  const chartPoints = chartMonths.map((month, index) => ({ x: xAt(index), y: yAt(month.count), month }));
  const polylinePoints = chartPoints.map(point => point.x.toFixed(1) + ',' + point.y.toFixed(1)).join(' ');

  const pointMarkup = chartPoints.map((point, index) => {
    const isEmpty = point.month.count === 0;
    const isEdge = index === 0 || index === pointCount - 1;
    const className = 'commit-point' + (isEmpty ? ' commit-point--empty' : '') + (isEdge ? ' commit-point--edge' : '');
    return `<circle class="${className}" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="4"></circle>`;
  }).join('');

  const rangeStart = chartMonths[0].date;
  const rangeEnd = chartMonths[pointCount - 1].date;
  const rangeLabel = monthNames[rangeStart.getMonth()] + ' ' + rangeStart.getFullYear() + ' \u2013 ' + monthNames[rangeEnd.getMonth()] + ' ' + rangeEnd.getFullYear();

  container.innerHTML = `
    <div class="commit-activity-chart">
      <div class="lc-yaxis">
        <span class="lc-axis-label lc-axis-label-y">Commits</span>
      </div>
      <div class="commit-plot">
        <div class="lc-total">${total} commits \u00b7 ${rangeLabel}</div>
        <div class="commit-chart-wrap">
          <svg class="commit-chart-svg" viewBox="0 0 ${viewBoxWidth} ${viewBoxHeight}" role="img" aria-label="Commits per month">
            <line class="commit-baseline" x1="${xAt(0)}" y1="${baselineY}" x2="${xAt(pointCount - 1)}" y2="${baselineY}"></line>
            <polyline class="commit-line" points="${polylinePoints}"></polyline>
            ${pointMarkup}
          </svg>
          <div class="commit-labels">${chartMonths.map(month => `<span class="commit-label">${monthNames[month.date.getMonth()]} ${String(month.date.getFullYear()).slice(2)}</span>`).join('')}</div>
        </div>
      </div>
    </div>
  `;

  const tooltip = new Tooltip();
  container.querySelectorAll('.commit-point').forEach((point, index) => {
    tooltip.attach(point, buildCommitTooltip(chartPoints[index].month, total));
  });
}

/**
 * Builds the tooltip markup for one month in the commit chart.
 *
 * @param {Object} month Chart month with count and date.
 * @param {number} totalCount Total commits across the shown window.
 * @returns {string} Inner HTML for the tooltip.
 */
function buildCommitTooltip(month, totalCount) {
  const label = monthNames[month.date.getMonth()] + ' ' + month.date.getFullYear();
  const filledPct = totalCount > 0 ? Math.round((month.count / totalCount) * 100) : 0;
  return `
    <span class="lc-tooltip-date">${label}</span>
    <span class="lc-tooltip-count">${month.count} commit${month.count === 1 ? '' : 's'}</span>
    <span class="lc-tooltip-meter"><span style="width:${filledPct}%"></span></span>
    <span class="lc-tooltip-max"><em>${filledPct}%</em> of recent commits</span>`;
}

/**
 * Fetches the full commit history of the featured repo across API pages.
 *
 * @param {string} repoFullName Owner/repo identifier.
 * @returns {Promise<Object[]>} Flat list of commit objects.
 */
async function fetchCommitHistory(repoFullName) {
  const commits = [];
  for (let page = 1; page <= 5; page++) {
    const data = await cachedFetch(`https://api.github.com/repos/${repoFullName}/commits?per_page=100&page=${page}`);
    if (!Array.isArray(data) || data.length === 0) break;
    commits.push(...data);
    if (data.length < 100) break;
  }
  if (commits.length === 0) throw new Error('No commits');
  return commits;
}

/**
 * Loads and renders the commit line chart into the commit card.
 *
 * @param {string} repoFullName Owner/repo identifier.
 */
async function renderCommitCard(repoFullName) {
  try {
    const commits = await fetchCommitHistory(repoFullName);
    renderCommitChart(commits);
    document.getElementById('commit-card').style.display = '';
    document.getElementById('commit-fallback').style.display = 'none';
  } catch (error) {
    console.error('Commit history error:', error);
    document.getElementById('commit-card').style.display = 'none';
    document.getElementById('commit-fallback').style.display = 'block';
  }
}

/**
 * Hides the loading and content states, showing the section fallback.
 */
function showCurrentProjectFallback() {
  document.getElementById('project-loading').style.display = 'none';
  document.getElementById('project-card').style.display = 'none';
  document.getElementById('commit-card').style.display = 'none';
  document.getElementById('project-fallback').style.display = 'block';
}

/**
 * Fetches the featured project's repo, README metadata, and commit chart.
 * Tries each candidate repo until one loads successfully.
 */
async function fetchCurrentProject() {
  for (const repoFullName of currentProjectRepos) {
    try {
      const repo = await cachedFetch(`https://api.github.com/repos/${repoFullName}`);
      if (!repo || !repo.name) throw new Error('Repo not found');
      const branch = repo.default_branch || 'main';

      let readmeText = '';
      try {
        const readmeData = await cachedFetch(`https://api.github.com/repos/${repoFullName}/readme`);
        if (readmeData && readmeData.content) {
          const readmeBytes = Uint8Array.from(atob(readmeData.content), character => character.charCodeAt(0));
          readmeText = new TextDecoder('utf-8').decode(readmeBytes).replace(/\r\n/g, '\n');
        }
      } catch (error) {
        readmeText = '';
      }

      document.getElementById('project-loading').style.display = 'none';
      document.getElementById('project-card').style.display = '';
      document.getElementById('project-title').textContent = parseProjectTitle(readmeText, repo.name);
      document.getElementById('project-excerpt').textContent = parseProjectExcerpt(readmeText) || (repo.description || '');
      document.getElementById('project-link').href = repo.html_url;
      renderProjectBanner(repo, repoFullName, readmeText, branch);

      await renderCommitCard(repoFullName);
      document.getElementById('project-fallback').style.display = 'none';
      return;
    } catch (error) {
      console.error('Current project error:', error);
    }
  }
  showCurrentProjectFallback();
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
 * Parsed books loaded from the manifest.
 */
const books = [];

/**
 * Parses a book markdown file into a structured object.
 *
 * @param {string} text Raw markdown source.
 * @param {string} filename The filename (used as book key).
 * @returns {Object|null} Parsed book object or null on failure.
 */
function parseBook(text, filename) {
  const meta = parsePostHeaders(text);
  const lines = text.split('\n');
  let inChapters = false;
  const chapterLines = [];

  for (const line of lines) {
    if (inChapters) {
      if (line.startsWith('## ')) {
        inChapters = false;
        continue;
      }
      chapterLines.push(line);
      continue;
    }

    if (line.startsWith('## Chapters:')) {
      inChapters = true;
      continue;
    }
  }

  const chapters = [];
  let currentChapter = null;

  for (const line of chapterLines) {
    const trimmed = line.trim();

    const chapterMatch = trimmed.match(/^-\s+\[([ x])\]\s+(.+?):?\s*$/);
    if (chapterMatch) {
      if (currentChapter) {
        chapters.push(currentChapter);
      }
      currentChapter = {
        name: chapterMatch[2].trim(),
        done: chapterMatch[1] === 'x'
      };
    }
  }

  if (currentChapter) {
    chapters.push(currentChapter);
  }

  const totalChapters = chapters.length;
  const doneChapters = chapters.filter(chapter => chapter.done).length;
  const progress = totalChapters > 0 ? Math.round((doneChapters / totalChapters) * 100) : 0;

  let status = meta.status || 'Interested';
  let progressText = 'Not started';

  if (status === 'Read' || progress >= 100) {
    status = 'Read';
    progressText = 'Finished';
  } else if (progress > 0) {
    status = 'Currently Reading';
    const nextUp = chapters.find(chapter => !chapter.done);
    if (nextUp) {
      progressText = 'Currently on: ' + nextUp.name + ' · ' + progress + '%';
    } else {
      progressText = progress + '%';
    }
  }

  return {
    title: meta.title || filename.replace(/\.md$/, ''),
    author: meta.author || '',
    excerpt: meta.excerpt || '',
    thoughts: meta.thoughts || '',
    banner: meta.banner || '',
    category: meta.category || '',
    status: status,
    progress: progress,
    progressText: progressText,
    chapters: chapters,
    filename: filename
  };
}

/**
 * Loads all books from the manifest and parses each markdown file.
 */
async function loadBooks() {
  try {
    const response = await fetch('../../src/Books/books.json');
    if (!response.ok) throw new Error('Failed to fetch books.json');
    const filenames = await response.json();

    for (const file of filenames) {
      try {
        const markdownResponse = await fetch('../../src/Books/' + file);
        if (!markdownResponse.ok) throw new Error('Failed to fetch ' + file);
        const text = await markdownResponse.text();
        const book = parseBook(text, file);
        if (book) {
          books.push(book);
        }
      } catch (error) {
        console.error('Error loading book:', file, error);
      }
    }
  } catch (error) {
    console.error('Error loading books manifest:', error);
  }
}

/**
 * Sorts the books by status: Currently Reading, then Interested, then Read.
 * Items within the same status keep their current (manifest) order.
 */
function sortBooksByStatus() {
  const order = { 'Currently Reading': 0, 'Interested': 1, 'Read': 2 };
  books.sort((firstBook, secondBook) => {
    const firstBookOrder = order[firstBook.status] !== undefined ? order[firstBook.status] : 2;
    const secondBookOrder = order[secondBook.status] !== undefined ? order[secondBook.status] : 2;
    return firstBookOrder - secondBookOrder;
  });
}

/**
 * Renders the list of book cards into the books grid.
 */
function renderBooks() {
  sortBooksByStatus();
  const container = document.getElementById('books-grid');
  container.innerHTML = '';

  const loading = document.getElementById('books-loading');
  if (loading) {
    loading.classList.add('fade-out');
    loading.addEventListener('animationend', () => loading.remove(), { once: true });
  }

  const fallback = document.getElementById('books-fallback');
  const grid = document.createElement('div');
  grid.className = 'books-grid';

  if (books.length === 0) {
    fallback.style.display = 'block';
    return;
  }

  fallback.style.display = 'none';

  books.forEach((book, index) => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.onclick = () => showBook(index);

    const statusBadge = book.status === 'Read'
      ? '<span class="book-status">✓ ' + escapeHtml(book.status) + '</span>'
      : book.progress > 0
        ? '<span class="book-status">Currently Reading</span>'
        : '<span class="book-status">Interested</span>';

    card.innerHTML = `
      <div class="book-banner-wrap">
        <img class="book-banner" src="${escapeHtml(book.banner)}" alt="${escapeHtml(book.title)} banner">
        ${statusBadge}
        <div class="book-progress">
          <div class="book-progress-bar">
            <div class="book-progress-fill" style="width: ${book.progress}%"></div>
            <span class="book-progress-pct">${book.progress}%</span>
          </div>
        </div>
      </div>
      <div class="book-progress-meta">${escapeHtml(book.progressText)}</div>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

/**
 * Shows a single book's full detail view by index.
 *
 * @param {number} index Index of the book in the books array.
 */
function showBook(index) {
  const book = books[index];
  if (!book) return;

  document.getElementById('books-grid').style.display = 'none';
  const bookView = document.getElementById('book-view');
  bookView.style.display = 'block';

  document.getElementById('book-banner').src = book.banner;
  document.getElementById('book-banner').alt = book.title + ' banner';
  document.getElementById('book-title').textContent = book.title;
  document.getElementById('book-author').textContent = book.author;
  document.getElementById('book-meta').textContent =
    book.category + ' · ' + book.status + ' · ' + book.progressText;
  document.getElementById('book-excerpt').innerHTML = renderMarkdown(book.excerpt);
  document.getElementById('book-thoughts').innerHTML = renderMarkdown(book.thoughts);

  history.replaceState(null, '', '#book-' + index);
  bookView.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Returns to the books list and clears the book hash from the URL.
 */
function showBooksList() {
  document.getElementById('book-view').style.display = 'none';
  document.getElementById('books-grid').style.removeProperty('display');
  history.replaceState(null, '', window.location.pathname);
  document.getElementById('books-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Closes the study plan drawer, restores body scroll, and returns focus to the trigger node.
 *
 * @param {HTMLElement} [previousFocus] Element to restore focus to on close.
 */
function closeStudyDrawer(previousFocus) {
  const drawer = document.getElementById('study-drawer');
  const overlay = document.getElementById('study-overlay');

  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('is-visible');
  overlay.hidden = true;
  document.body.style.overflow = '';

  if (previousFocus) {
    setTimeout(() => previousFocus.focus(), 100);
  }
}

/**
 * Opens the study plan drawer with node details, showing overlay and locking body scroll.
 *
 * @param {Object} node Parsed study node object.
 * @param {HTMLElement} triggerBtn The button that opened the drawer (for focus restoration).
 */
function openStudyDrawer(node, triggerBtn) {
  const drawer = document.getElementById('study-drawer');
  const overlay = document.getElementById('study-overlay');
  const body = document.getElementById('study-drawer-body');

  if (!node || !body) return;

  let html = '';

  html += '<p class="drawer-breadcrumb">' + mdInline(node.phaseBreadCrumb) + '</p>';
  html += '<h2 class="drawer-title">' + mdInline(node.title) + '</h2>';

  if (node.items && node.items.length > 0) {
    const done = node.items.filter(item => item.done).length;
    const total = node.items.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    html += '<div class="drawer-mini-progress">';
    html += '<div class="drawer-mini-progress-track">';
    html += '<div class="drawer-mini-progress-fill" style="width: ' + pct + '%"></div>';
    html += '</div>';
    html += '<span class="drawer-mini-progress-label">' + done + '/' + total + ' (' + pct + '%)</span>';
    html += '</div>';
  }

  if (node.items && node.items.length > 0) {
    html += '<ul class="drawer-checklist">';
    for (const item of node.items) {
      const doneClass = item.done ? 'is-done' : '';
      const mark = item.done ? '&#10003;' : '&#9744;';
      html += '<li class="drawer-checklist-item ' + doneClass + '">';
      html += '<span class="check-mark">' + mark + '</span>';
      html += '<span class="drawer-item-main">';
      html += mdInline(item.text);
      if (item.subs && item.subs.length > 0) {
        html += '<span class="drawer-item-subs">';
        for (const sub of item.subs) {
          if (sub.url) {
            const linkLabel = sub.label ? mdInline(sub.label) + ': ' : '';
            html += '<a class="drawer-item-sub" href="' + escapeHtml(sub.url) + '" target="_blank" rel="noopener">' + linkLabel + mdInline(sub.text) + '</a>';
          } else {
            html += '<span class="drawer-item-sub">' + mdInline(sub.text) + '</span>';
          }
        }
        html += '</span>';
      }
      html += '</span>';
      html += '</li>';
    }
    html += '</ul>';
  }

  body.innerHTML = html;

  overlay.hidden = false;
  requestAnimationFrame(() => {
    overlay.classList.add('is-visible');
  });

  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('study-drawer-close');
  if (closeBtn) closeBtn.focus();

  window._studyDrawerPreviousFocus = triggerBtn;
}

/**
 * Renders a single study leaf (week or project) as a word-tree subnode.
 * The leaf is clickable and opens the drawer; phase roots never render here.
 *
 * @param {Object} phase Phase object containing this node.
 * @param {Object} node Node object (week or project).
 * @param {boolean} isActive Whether this is the current focus node.
 * @returns {HTMLElement} The completed leaf button.
 */
function renderStudyNode(phase, node, isActive) {
  const done = node.items ? node.items.filter(item => item.done).length : 0;
  const total = node.items ? node.items.length : 0;
  const isComplete = total > 0 && done === total;

  const leafEl = document.createElement('button');
  leafEl.type = 'button';
  leafEl.className = 'wt-leaf' + (isActive ? ' is-active' : '') + (isComplete ? ' is-complete' : '');

  const kicker = document.createElement('span');
  kicker.className = 'wt-leaf-kicker';
  const wordLabel = (node.kind === 'project' ? 'Project ' : 'Week ') + node.number;
  kicker.textContent = wordLabel + (total > 0 ? ' · ' + done + '/' + total : '');

  const text = document.createElement('span');
  text.className = 'wt-leaf-text';
  text.innerHTML = mdInline(node.topic || node.label);

  leafEl.appendChild(kicker);
  leafEl.appendChild(text);

  leafEl.addEventListener('click', () => {
    const phaseNum = phase.name ? phase.name.replace(/^Phase\s+/, '') : '';
    const phaseBreadcrumb = 'Phase ' + phaseNum + ' — ' + node.label;

    openStudyDrawer({
      title: node.label,
      phaseBreadCrumb: phaseBreadcrumb,
      items: node.items || []
    }, leafEl);
  });

  return leafEl;
}

/**
 * Parses the raw study plan markdown into structured data.
 *
 * @param {string} text Raw markdown source.
 * @returns {Object} Parsed study plan with phases, progress, and focus.
 */
function parseStudyPlan(text) {
  const lines = text.split('\n');
  const result = {
    title: '',
    phases: [],
    done: 0,
    total: 0,
    pct: 0,
    focus: null
  };

  let currentPhase = null;
  let currentGroup = null;
  let currentItem = null;
  let phaseNum = 0;
  let titleParsed = false;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (!titleParsed && line.startsWith('# ')) {
      result.title = line.slice(2).trim();
      titleParsed = true;
      continue;
    }

    const phaseMatch = line.match(/^## Phase (\d+):\s*(.+)/);
    if (phaseMatch) {
      phaseNum = parseInt(phaseMatch[1], 10);
      currentPhase = {
        name: 'Phase ' + phaseNum,
        label: phaseMatch[2].trim(),
        weeks: []
      };
      result.phases.push(currentPhase);
      currentGroup = null;
      currentItem = null;
      continue;
    }

    if (!currentPhase) continue;

    const weekMatch = line.match(/^### (Week|Project)\s+(\d+):\s*(.+)/);
    if (weekMatch) {
      const kind = weekMatch[1].toLowerCase();
      const num = weekMatch[2];
      const label = weekMatch[3].trim();
      currentGroup = {
        label: label.charAt(0).toUpperCase() + label.slice(1) + ' ' + (kind === 'week' ? '· Week ' + num : '· Project ' + num),
        topic: label.charAt(0).toUpperCase() + label.slice(1),
        kind: kind,
        number: num,
        items: []
      };
      currentPhase.weeks.push(currentGroup);
      currentItem = null;
      continue;
    }

    if (!currentGroup) continue;

    const subLink = line.match(/^\s+-\s+(.+?):\s*\[([^\]]+)\]\(([^)]+)\)\s*$/);
    if (subLink) {
      if (currentItem) {
        currentItem.subs.push({
          label: subLink[1].trim(),
          text: subLink[2].trim(),
          url: subLink[3].trim()
        });
      }
      continue;
    }

    const subText = line.match(/^\s+-\s+(.+)$/);
    if (subText && !line.trim().startsWith('- [')) {
      if (currentItem) {
        currentItem.subs.push({ label: '', text: subText[1].trim(), url: null });
      }
      continue;
    }

    if (line.match(/^- \[x\]/)) {
      const itemText = line.replace(/^- \[x\]\s*/, '').trim();
      currentItem = { text: itemText, done: true, subs: [] };
      currentGroup.items.push(currentItem);
      result.done++;
      result.total++;
    } else if (line.match(/^- \[ \]/)) {
      const itemText = line.replace(/^- \[ \]\s*/, '').trim();
      currentItem = { text: itemText, done: false, subs: [] };
      currentGroup.items.push(currentItem);
      result.total++;

      if (!result.focus) {
        result.focus = {
          phase: currentPhase.name,
          label: currentGroup.label,
          topic: itemText
        };
      }
    }
  }

  result.pct = result.total > 0 ? Math.round((result.done / result.total) * 100) : 0;

  if (!result.focus && result.total > 0 && result.done === result.total) {
    const lastGroup = result.phases[result.phases.length - 1];
    if (lastGroup && lastGroup.weeks.length > 0) {
      const lastWeek = lastGroup.weeks[lastGroup.weeks.length - 1];
      result.focus = {
        phase: lastGroup.name,
        label: lastWeek.label,
        topic: lastWeek.items[lastWeek.items.length - 1]?.text || ''
      };
    }
  }

  return result;
}

/**
 * Parsed study plans loaded from the manifest.
 */
const studyPlans = [];

/**
 * Builds the word-tree DOM for a study plan's phases, weeks, and projects.
 * Leaves are clickable and open the detail drawer.
 *
 * @param {Object} plan Parsed study plan object.
 * @returns {HTMLElement} The completed word-tree element.
 */
function buildWordTree(plan) {
  const wordTree = document.createElement('div');
  wordTree.style.marginTop = '0.5rem';

  for (const phase of plan.phases) {
    const branch = document.createElement('div');
    branch.className = 'wt-branch';

    const root = document.createElement('div');
    root.className = 'wt-root';

    const rootNum = document.createElement('span');
    rootNum.className = 'wt-root-num';
    rootNum.textContent = phase.name;

    const rootName = document.createElement('span');
    rootName.className = 'wt-root-name';
    rootName.textContent = phase.label;

    let phaseDone = 0;
    let phaseTotal = 0;
    for (const week of phase.weeks) {
      if (!week.items) continue;
      phaseDone += week.items.filter(item => item.done).length;
      phaseTotal += week.items.length;
    }

    const rootMeta = document.createElement('span');
    rootMeta.className = 'wt-root-meta';
    rootMeta.textContent = phaseTotal > 0 ? phaseDone + '/' + phaseTotal + ' items' : '';

    root.appendChild(rootNum);
    root.appendChild(rootName);
    root.appendChild(rootMeta);

    const branchLine = document.createElement('span');
    branchLine.className = 'wt-branch-line';

    const leaves = document.createElement('div');
    leaves.className = 'wt-leaves';

    for (const week of phase.weeks) {
      const isActive = plan.focus && plan.focus.label === week.label;
      leaves.appendChild(renderStudyNode(phase, week, isActive));
    }

    branch.appendChild(root);
    branch.appendChild(branchLine);
    branch.appendChild(leaves);

    wordTree.appendChild(branch);
  }

  return wordTree;
}

/**
 * Returns a plan's title with the 'Study Plan:' prefix stripped.
 *
 * @param {object} plan Parsed study plan object.
 * @returns {string} Display title.
 */
function studyPlanDisplayTitle(plan) {
  return plan.title.replace(/^Study Plan:\s*/i, '');
}

/**
 * Loads all study plans from the manifest and parses each markdown file.
 */
async function loadStudyPlans() {
  try {
    const response = await fetch('../../src/StudyPlans/plans.json');
    if (!response.ok) throw new Error('Failed to fetch plans.json');
    const filenames = await response.json();

    for (const file of filenames) {
      try {
        const markdownResponse = await fetch('../../src/StudyPlans/' + file);
        if (!markdownResponse.ok) throw new Error('Failed to fetch ' + file);
        const text = await markdownResponse.text();
        const plan = parseStudyPlan(text);
        if (plan.phases.length > 0) {
          studyPlans.push(plan);
        }
      } catch (error) {
        console.error('Error loading study plan:', file, error);
      }
    }
  } catch (error) {
    console.error('Error loading study plans manifest:', error);
  }
}

/**
 * Renders the list of study plan cards into the plans grid.
 */
function renderStudyPlans() {
  const container = document.getElementById('study-plans-grid');
  container.innerHTML = '';

  const loading = document.getElementById('study-loading');
  if (loading) {
    loading.classList.add('fade-out');
    loading.addEventListener('animationend', () => loading.remove(), { once: true });
  }

  const fallback = document.getElementById('study-fallback');
  const grid = document.createElement('div');
  grid.className = 'study-plans-grid';

  if (studyPlans.length === 0) {
    fallback.style.display = 'block';
    return;
  }

  fallback.style.display = 'none';

  studyPlans.forEach((plan, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'study-plan-card card';
    card.onclick = () => showStudyPlan(index);

    const title = studyPlanDisplayTitle(plan);
    const focus = plan.focus
      ? plan.focus.phase + ' · ' + plan.focus.label + ' — ' + plan.focus.topic
      : '';

    card.innerHTML = `
      <span class="study-plan-card-title">${mdInline(title)}</span>
      <span class="study-plan-card-focus">${mdInline(focus)}</span>
      <div class="study-plan-card-progress">
        <div class="study-plan-card-track">
          <div class="study-plan-card-fill" style="width: ${plan.pct}%"></div>
        </div>
        <span class="study-plan-card-pct">${plan.pct}%</span>
      </div>
      <span class="study-plan-card-meta">${plan.done}/${plan.total} items · ${plan.phases.length} phases</span>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

/**
 * Shows a single study plan's full detail view by index.
 *
 * @param {number} index Index of the plan in the studyPlans array.
 */
function showStudyPlan(index) {
  const plan = studyPlans[index];
  if (!plan) return;

  document.getElementById('study-plans-grid').style.display = 'none';
  const view = document.getElementById('study-plan-view');
  view.style.display = 'block';

  document.getElementById('study-title').innerHTML = mdInline(studyPlanDisplayTitle(plan));

  const progressFill = document.getElementById('study-progress-fill');
  const progressLabel = document.getElementById('study-progress-label');
  if (progressFill) progressFill.style.width = plan.pct + '%';
  if (progressLabel) progressLabel.textContent = plan.pct + '%';

  const focusEl = document.getElementById('study-focus');
  if (focusEl) {
    focusEl.innerHTML = mdInline(plan.focus
      ? plan.focus.phase + ' · ' + plan.focus.label + ' — ' + plan.focus.topic
      : '');
  }

  const treeEl = document.getElementById('study-tree');
  treeEl.innerHTML = '';
  treeEl.appendChild(buildWordTree(plan));

  const activeText = treeEl.querySelector('.wt-leaf.is-active .wt-leaf-text');
  if (activeText) {
    activeText.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  history.replaceState(null, '', '#plan-' + index);
  view.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Returns to the study plans list and clears the plan hash from the URL.
 */
function showStudyPlansList() {
  document.getElementById('study-plan-view').style.display = 'none';
  document.getElementById('study-plans-grid').style.removeProperty('display');
  history.replaceState(null, '', window.location.pathname);
  document.getElementById('study-plans-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Initializes the drawer close handlers (× button, overlay click, Escape key).
 * Also closes the drawer when the mobile menu opens.
 */
function initStudyDrawerHandlers() {
  const closeBtn = document.getElementById('study-drawer-close');
  const overlay = document.getElementById('study-overlay');
  const drawer = document.getElementById('study-drawer');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeStudyDrawer(window._studyDrawerPreviousFocus);
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      closeStudyDrawer(window._studyDrawerPreviousFocus);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeStudyDrawer(window._studyDrawerPreviousFocus);
    }
  });
}

stageSections();
renderMyspaceSections();
fetchCurrentProject();
fetchLeetCodeStats();

Promise.all([loadBooks(), loadStudyPlans()]).then(() => {
  renderBooks();
  renderStudyPlans();

  const hash = window.location.hash;
  if (hash && hash.startsWith('#book-')) {
    const bookIndex = parseInt(hash.replace('#book-', ''), 10);
    if (!isNaN(bookIndex) && bookIndex >= 0 && bookIndex < books.length) {
      expandSection('My Library');
      showBook(bookIndex);
    }
  }
  if (hash && hash.startsWith('#plan-')) {
    const planIndex = parseInt(hash.replace('#plan-', ''), 10);
    if (!isNaN(planIndex) && planIndex >= 0 && planIndex < studyPlans.length) {
      expandSection('Currently Studying');
      showStudyPlan(planIndex);
    }
  }
});
initStudyDrawerHandlers();
initMenuToggle('#myspace-container');