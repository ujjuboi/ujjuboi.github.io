/**
 * Blog post categories, shown as collapsible sections in order.
 */
const categories = ['Deloitte', 'Personal Projects', 'Research'];

/**
 * Parsed posts loaded from the manifest.
 */
const posts = [];

/**
 * Loads all posts from the manifest and parses each markdown file.
 */
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

/**
 * Renders the latest post as the first, expanded collapsible section of the
 * blog list.
 *
 * @param {HTMLElement} container The blog list container to append to.
 */
function renderLatestPost(container) {
  const latest = posts[0];
  if (!latest) return;

  const card = document.createElement('div');
  card.className = 'post-card card';
  card.style.margin = 'auto';
  card.onclick = () => showPost(0);
  card.innerHTML = `
    <img class="latest-post-banner" src="${latest.banner}" alt="${latest.title} banner">
    <h3 class="card-title">${latest.title}</h3>
    <p class="card-date">${latest.date}</p>
    <p class="card-excerpt">${latest.excerpt}</p>
    <a class="card-link" href="#post-0" target="_self" onclick="event.stopPropagation(); showPost(0)">Read more →</a>
  `;

  new Section({
    title: 'Latest Post',
    content: card,
    className: 'blog-section',
    expanded: true
  }).addTo(container);
}

/**
 * Renders the list of posts grouped by category.
 */
function renderBlogList() {
  const container = document.getElementById('blog-list');
  container.innerHTML = '';
  const loading = document.getElementById('blog-loading');
  if (loading) {
    loading.classList.add('fade-out');
    loading.addEventListener('animationend', () => loading.remove(), { once: true });
  }
  renderLatestPost(container);
  let delayIndex = 0;
  categories.forEach(category => {
    const grouped = posts
      .map((post, index) => ({ post, index }))
      .filter(item => item.post.category === category);
    if (!grouped.length) return;

    const grid = document.createElement('div');
    grid.className = 'post-grid';

    grouped.forEach(({ post, index }) => {
      const card = document.createElement('div');
      card.className = 'post-card card';
      card.id = 'post-' + index;
      card.style.animationDelay = (delayIndex * 0.1) + 's';
      card.style.margin = 'auto';
      card.onclick = () => showPost(index);
      card.innerHTML = `
        <h3 class="card-title">${post.title}</h3>
        <p class="card-date">${post.date}</p>
        <p class="card-excerpt">${post.excerpt}</p>
        <a class="card-link" href="#post-${index}" target="_self" onclick="event.stopPropagation(); showPost(${index})">Read more →</a>
      `;
      grid.appendChild(card);
      delayIndex++;
    });

    new Section({
      title: category,
      content: grid,
      className: 'blog-section',
      expanded: false
    }).addTo(container);
  });
}

/**
 * Shows a single post's full view by index.
 *
 * @param {number} index Index of the post in the posts array.
 */
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
    div.innerHTML = renderMarkdown(p);
    content.appendChild(div);
  });

  history.replaceState(null, '', '#post-' + index);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Returns to the post list and clears the post hash from the URL.
 */
function showBlogList() {
  document.getElementById('post-view').style.display = 'none';
  document.getElementById('blog-list').style.removeProperty('display');
  history.replaceState(null, '', window.location.pathname);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Loads posts, renders the list, then honors an incoming `#post-N` hash.
 */
loadPosts().then(() => {
  renderBlogList();

  const hash = window.location.hash;
  if (hash && hash.startsWith('#post-')) {
    const idx = parseInt(hash.replace('#post-', ''), 10);
    if (!isNaN(idx) && idx >= 0 && idx < posts.length) {
      showPost(idx);
    }
  }
});

initMenuToggle('#blog-list');