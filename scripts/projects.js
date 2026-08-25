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
      card.className = 'repo-card';
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

async function fetchRecentActivity() {
  try {
    const repos = await cachedFetch('https://api.github.com/users/ujjuboi/repos?sort=updated&per_page=1');
    if (repos.length === 0) return;

    const latestRepo = repos[0];
    const commits = await cachedFetch(`https://api.github.com/repos/ujjuboi/${latestRepo.name}/commits?per_page=1`);
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
  document.getElementById('research-card').style.display = 'block';
}

fetchGitHubStats();
fetchRecentActivity();
fetchLeetCodeStats();
renderResearch();
initMenuToggle('#projects-container');
