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

async function fetchGitHubStats() {
  try {
    const repos = await cachedFetch('https://api.github.com/users/ujjuboi/repos?sort=updated&per_page=6');
    if (!Array.isArray(repos) || repos.length === 0) throw new Error('No repos');

    const grid = document.getElementById('github-repos-grid');

    const cards = await Promise.all(repos.map(async (repo) => {
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
    }));

    cards.forEach(c => grid.appendChild(c));
    document.getElementById('github-loading').style.display = 'none';
  } catch (error) {
    console.error('GitHub stats error:', error);
    document.getElementById('github-loading').style.display = 'none';
    document.getElementById('github-repos-grid').style.display = 'none';
    document.getElementById('github-fallback').style.display = 'block';
  }
}

let recentActivityOk = false;
let gitHubIssuesOk = false;

function syncActivityFallback() {
  const fallback = document.getElementById('activity-fallback');
  if (!recentActivityOk && !gitHubIssuesOk) {
    fallback.style.display = 'block';
  } else {
    fallback.style.display = 'none';
  }
}

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
      const lcActiveDays = document.getElementById('lc-active-days');
      lcActiveDays.textContent = `Last active: ${data.data.totalActiveDays} days`;
      document.getElementById('lc-ranking').textContent = `Ranking: ${data.ranking.toLocaleString()}`;
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

async function loadLatestPost() {
  try {
    const manifestRes = await fetch('../../src/Blogs/posts.json');
    if (!manifestRes.ok) throw new Error('Failed to fetch posts.json');
    const filenames = await manifestRes.json();
    if (filenames.length === 0) return;

    const mdRes = await fetch('../../src/Blogs/' + filenames[0]);
    if (!mdRes.ok) throw new Error('Failed to fetch ' + filenames[0]);
    const text = await mdRes.text();
    const meta = {};
    for (const line of text.split('\n')) {
      if (line.startsWith('## Paragraphs')) break;
      const match = line.match(/^## (\w+):\s*(.+)/);
      if (match) meta[match[1].toLowerCase()] = match[2].trim();
    }

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
      tagSpan.className = 'project-tag';
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
initMenuToggle('#projects-container');
