const categories = ['Deloitte', 'Personal Projects', 'Research'];
const posts = [];

async function loadPosts() {
  try {
    const res = await fetch('../../src/Blogs/posts.json');
    if (!res.ok) throw new Error('Failed to fetch posts.json');
    const filenames = await res.json();

    for (const file of filenames) {
      try {
        const mdRes = await fetch('../../src/Blogs/' + file);
        if (!mdRes.ok) throw new Error('Failed to fetch ' + file);
        const text = await mdRes.text();
        const meta = parsePostHeaders(text);
        posts.push({
          file: file,
          title: meta.title || file,
          date: meta.date || '',
          excerpt: meta.excerpt || '',
          banner: meta.banner || '',
          category: meta.category || 'Personal Projects',
          paragraphs: parsePostBody(text)
        });
      } catch (e) {
        console.error('Error loading post:', file, e);
      }
    }
  } catch (e) {
    console.error('Error loading posts manifest:', e);
  }
}

function parsePostHeaders(text) {
  const meta = {};
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.startsWith('## Paragraphs')) break;
    const match = line.match(/^## (\w+):\s*(.+)/);
    if (match) {
      meta[match[1].toLowerCase()] = match[2].trim();
    }
  }
  return meta;
}

function parsePostBody(text) {
  const lines = text.split('\n');
  const bodyStart = lines.findIndex(l => l.startsWith('## Paragraphs'));
  if (bodyStart === -1) return [];
  return lines.slice(bodyStart + 1)
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2).trim());
}

function renderBlogList() {
  const container = document.getElementById('blog-list');
  container.innerHTML = '';
  let delayIndex = 0;
  categories.forEach(category => {
    const grouped = posts
      .map((post, index) => ({ post, index }))
      .filter(item => item.post.category === category);
    if (!grouped.length) return;

    const section = document.createElement('div');
    section.className = 'blog-section';

    const heading = document.createElement('h2');
    heading.className = 'section-heading';
    heading.textContent = category;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'post-grid';

    grouped.forEach(({ post, index }) => {
      const card = document.createElement('div');
      card.className = 'post-card card';
      card.id = 'post-' + index;
      card.style.animationDelay = (delayIndex * 0.1) + 's';
      card.onclick = () => showPost(index);
      card.innerHTML = `
        <h3 class="card-title">${post.title}</h3>
        <p class="card-date">${post.date}</p>
        <p class="card-excerpt">${post.excerpt}</p>
      `;
      grid.appendChild(card);
      delayIndex++;
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function showPost(index) {
  const post = posts[index];
  document.getElementById('blog-list').style.display = 'none';
  const postView = document.getElementById('post-view');
  postView.style.display = 'block';

  document.getElementById('post-banner').src = post.banner;
  document.getElementById('post-banner').alt = post.title;
  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-date').textContent = post.date;

  const content = document.getElementById('post-content');
  content.innerHTML = '';
  post.paragraphs.forEach(p => {
    const div = document.createElement('div');
    div.className = 'post-paragraph';
    div.innerHTML = p;
    content.appendChild(div);
  });

  history.replaceState(null, '', '#post-' + index);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showBlogList() {
  document.getElementById('post-view').style.display = 'none';
  document.getElementById('blog-list').style.removeProperty('display');
  history.replaceState(null, '', window.location.pathname);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

loadPosts().then(() => {
  renderBlogList();

  var hash = window.location.hash;
  if (hash && hash.startsWith('#post-')) {
    var idx = parseInt(hash.replace('#post-', ''), 10);
    if (!isNaN(idx) && idx >= 0 && idx < posts.length) {
      showPost(idx);
    }
  }
});
