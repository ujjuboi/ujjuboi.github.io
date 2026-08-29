function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

var TOKEN_MAP = {
  'next.js': 'tk-kw', 'nextjs': 'tk-kw', 'express.js': 'tk-kw',
  'expressjs': 'tk-kw', 'express js': 'tk-kw', 'springboot': 'tk-kw', 'spring boot': 'tk-kw',
  'django': 'tk-kw', 'react flow': 'tk-kw', 'react': 'tk-kw', 'chartjs': 'tk-kw',
  'javascript': 'tk-kw', 'typescript': 'tk-kw', 'java': 'tk-kw', 'python': 'tk-kw',
  'html': 'tk-kw', 'css': 'tk-kw', 'mongodb': 'tk-kw', 'redis': 'tk-kw', 'mysql': 'tk-kw',
  'postgres': 'tk-kw', 's3': 'tk-kw', 'gridfs': 'tk-kw', 'aws': 'tk-kw', 'gcp': 'tk-kw',
  'docker': 'tk-kw', 'kubernetes': 'tk-kw', 'langchain': 'tk-kw', 'spacy 3': 'tk-kw',
  'spacy': 'tk-kw', 'nltk': 'tk-kw', 'hadoop': 'tk-kw', 'pyspark': 'tk-kw',
  'tableau': 'tk-kw', 'vertex ai': 'tk-kw', 'numpy': 'tk-kw', 'pandas': 'tk-kw',
  'github actions': 'tk-kw', 'mqtt': 'tk-kw', 'websockets': 'tk-kw', 'sailpoint': 'tk-kw',
  'okta': 'tk-kw', 'pingfederate': 'tk-kw', 'active directory': 'tk-kw', 'entra id': 'tk-kw',
  'ldif': 'tk-kw', 'bootstrap': 'tk-kw', 'playwright': 'tk-kw', 'cognito': 'tk-kw',
  'bash': 'tk-kw', 'git': 'tk-kw', 'linux': 'tk-kw', 'kafka': 'tk-kw',
  'tdengine': 'tk-kw', 'influxdb': 'tk-kw', 'grafana': 'tk-kw', 'mosquitto': 'tk-kw',
  'golang': 'tk-kw', 'jenkins': 'tk-kw', 'react native': 'tk-kw', 'figma': 'tk-kw',
  'deloitte': 'tk-co', 'ddpx': 'tk-co',
  'software engineer': 'tk-role', 'associate software developer': 'tk-role',
  'ai': 'tk-fn', 'ci/cd': 'tk-fn', 'rbac': 'tk-fn', 'saml': 'tk-fn', 'oauth': 'tk-fn',
  'oauth2': 'tk-fn', 'sso': 'tk-fn', 'ldap': 'tk-fn', 'api gateway': 'tk-fn',
  'rest': 'tk-fn', 'api': 'tk-fn', 'graphql': 'tk-fn', 'microservices': 'tk-fn',
  'ml': 'tk-fn', 'nlp': 'tk-fn', 'llm': 'tk-fn', 'llmops': 'tk-fn', 'mcp': 'tk-fn',
  'modular monolith': 'tk-fn', 'monolith': 'tk-fn'
};

var TOKEN_RE = new RegExp(
  '\\b(' + Object.keys(TOKEN_MAP).sort(function (a, b) { return b.length - a.length; }).join('|') + ')\\b',
  'gi'
);

var NUM_RE = /\b(\d+(?:,\d{3})*(?:\.\d+)?%?)\b/g;

function applyRegexToNode(textNode, regex, classFor) {
  var original = textNode.data;
  var parts = [];
  var last = 0;
  var match;
  regex.lastIndex = 0;
  while ((match = regex.exec(original)) !== null) {
    if (match.index > last) {
      parts.push(document.createTextNode(original.slice(last, match.index)));
    }
    var span = document.createElement('span');
    span.className = classFor(match);
    span.textContent = match[0];
    parts.push(span);
    last = match.index + match[0].length;
    if (match[0].length === 0) regex.lastIndex++;
  }
  if (parts.length === 0) return;
  if (last < original.length) parts.push(document.createTextNode(original.slice(last)));
  var parent = textNode.parentNode;
  var frag = document.createDocumentFragment();
  parts.forEach(function (p) { frag.appendChild(p); });
  parent.replaceChild(frag, textNode);
}

function textNodesIn(root) {
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if (node.parentElement && node.parentElement.closest('a, .tk-kw, .tk-co, .tk-role, .tk-num, .tk-fn, .tk-lg')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  var nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

function highlightTokens(root) {
  textNodesIn(root).forEach(function (node) {
    applyRegexToNode(node, TOKEN_RE, function (m) { return TOKEN_MAP[m[0].toLowerCase()]; });
  });
  textNodesIn(root).forEach(function (node) {
    applyRegexToNode(node, NUM_RE, function () { return 'tk-num'; });
  });
}

function showLoading() {
  const container = document.getElementById('pro-container');
  container.innerHTML = '<p class="loading-placeholder">Loading<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span></p>';
}

function showError(message) {
  const container = document.getElementById('pro-container');
  container.innerHTML = '<p class="error-message">' + escapeHtml(message) + '</p>';
}

function nextNonBlank(lines, start) {
  let j = start;
  while (j < lines.length && lines[j].trim() === '') j++;
  return j;
}

function sectionLines(lines, start) {
  const result = [];
  let j = start;
  while (j < lines.length && !lines[j].startsWith('## ')) {
    result.push(lines[j]);
    j++;
  }
  return result;
}

function parseCV(text) {
  const lines = text.split('\n');
  const data = { contact: {}, summary: '', experience: [], projects: [], education: [], skills: [] };
  const fields = { Location: 'location', Email: 'email', LinkedIn: 'linkedin', Portfolio: 'portfolio', GitHub: 'github' };

  for (let i = 1; i < lines.length && !lines[i].startsWith('## '); i++) {
    const line = lines[i].trim();
    for (const [key, field] of Object.entries(fields)) {
      if (line.startsWith('**' + key + ':**')) {
        data.contact[field] = line.split('**' + key + ':**')[1].trim();
      }
    }
  }

  let i = 0;
  while (i < lines.length && !lines[i].startsWith('## ')) i++;

  while (i < lines.length) {
    const section = lines[i].replace(/^## /, '').trim();

    if (section === 'Professional Summary') {
      i = nextNonBlank(lines, i + 1);
      const end = sectionLines(lines, i);
      data.summary = end.filter(l => l.trim()).join(' ');
      i += end.length;
      continue;
    }

    if (section === 'Work Experience') {
      const block = sectionLines(lines, i + 1);
      let job = null;
      for (const line of block) {
        if (line.startsWith('### ')) {
          if (job) data.experience.push(job);
          job = { company: line.replace(/^### /, '').trim(), role: '', date: '', bullets: [] };
        } else if (job) {
          const t = line.trim();
          if (t === '') continue;
          if (t.startsWith('**') && t.endsWith('**') && !job.role) {
            job.role = t.slice(2, -2);
          } else if (t.startsWith('- ')) {
            job.bullets.push(t.slice(2));
          } else if (t && !job.date) {
            job.date = t;
          }
        }
      }
      if (job) data.experience.push(job);
      i += block.length;
      continue;
    }

    if (section === 'Projects') {
      const block = sectionLines(lines, i + 1);
      for (const line of block) {
        const t = line.trim();
        if (!t.startsWith('- ')) continue;
        const content = t.slice(2);
        const name = content.split('**')[1] || '';
        const afterName = content.split(')')[0] || '';
        const tag = afterName.split('(')[1] || '';
        const desc = content.split('--')[1] || '';
        data.projects.push({ name: name.trim(), tag: tag.trim(), desc: desc.trim() });
      }
      i += block.length;
      continue;
    }

    if (section === 'Education') {
      const block = sectionLines(lines, i + 1);
      for (const line of block) {
        const t = line.trim();
        if (!t.startsWith('- ')) continue;
        const content = t.slice(2);
        const degree = content.split(',')[0].trim();
        const rest = content.split(',')[1] || '';
        const school = rest.split('(')[0].trim();
        const cgpa = rest.includes('(') ? rest.split('(')[1].split(')')[0].trim() : '';
        const dates = rest.includes(')') ? rest.split(')')[1].trim() : '';
        data.education.push({ degree, school, cgpa, dates });
      }
      i += block.length;
      continue;
    }

    if (section === 'Skills') {
      const block = sectionLines(lines, i + 1);
      for (const line of block) {
        const t = line.trim();
        if (!t.startsWith('- ')) continue;
        const content = t.slice(2);
        const category = content.split('**')[1] || '';
        const items = (content.split(':**')[1] || '').split(',').map(s => s.trim());
        data.skills.push({ category, items });
      }
      i += block.length;
      continue;
    }

    i++;
  }

  return data;
}

function loadCV() {
  showLoading();
  fetch('../../src/cv.md')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch CV');
      return res.text();
    })
    .then(text => {
      const data = parseCV(text);
      renderProfessional(data);
      loadBlogPosts();
    })
    .catch(e => {
      console.error('Error loading CV:', e);
      showError('Failed to load CV data.');
    });
}

var editorWindow = null;

function setupEditorWindow() {
  const container = document.getElementById('pro-container');
  container.classList.add('editor-window');
  container.innerHTML = '';

  const titlebar = document.createElement('div');
  titlebar.className = 'editor-titlebar';
  titlebar.innerHTML = '<span class="editor-dot dot-red"></span><span class="editor-dot dot-yellow"></span><span class="editor-dot dot-green"></span><span class="editor-filename">professional.md \u2014 Ujjwal Verma</span>';
  container.appendChild(titlebar);

  const body = document.createElement('div');
  body.className = 'editor-window-body';

  const sidebar = document.createElement('div');
  sidebar.className = 'directory';
  const header = document.createElement('div');
  header.className = 'directory-header';
  header.textContent = 'EXPLORER';
  const tree = document.createElement('div');
  tree.className = 'directory-tree';
  sidebar.appendChild(header);
  sidebar.appendChild(tree);
  body.appendChild(sidebar);

  const main = document.createElement('div');
  main.className = 'editor-main';
  body.appendChild(main);

  const statusbar = document.createElement('div');
  statusbar.className = 'editor-statusbar';
  statusbar.textContent = 'UTF-8 \u00B7 Markdown \u00B7 Prettier';

  container.appendChild(body);
  container.appendChild(statusbar);

  editorWindow = { sidebar: sidebar, tree: tree, main: main, entries: [] };
  return editorWindow;
}

function registerDirectoryEntry(title, sectionEl) {
  if (!editorWindow) return;
  const item = document.createElement('div');
  item.className = 'directory-file';
  const icon = document.createElement('span');
  icon.className = 'directory-file-icon';
  const name = document.createElement('span');
  name.className = 'directory-file-name';
  name.textContent = title;
  item.appendChild(icon);
  item.appendChild(name);
  item.onclick = function () {
    editorWindow.entries.forEach(entry => {
      entry.section.style.display = 'none';
      entry.item.classList.remove('active');
    });
    sectionEl.style.display = 'block';
    item.classList.add('active');
  };
  sectionEl.style.display = 'none';
  editorWindow.entries.push({ section: sectionEl, item: item });
  editorWindow.tree.appendChild(item);
}

function showFirstDirectoryEntry() {
  if (!editorWindow || !editorWindow.entries.length) return;
  const first = editorWindow.entries[0];
  first.item.classList.add('active');
  first.section.style.display = 'block';
}

function renderProfessional(data) {
  const container = document.getElementById('pro-container');
  container.innerHTML = '';

  if (data.summary) {
    const heroSummary = document.getElementById('hero-summary');
    if (heroSummary) {
      heroSummary.textContent = data.summary;
    }
  }

  setupEditorWindow();

  [['Experience', renderTimeline(data.experience)],
   ['Projects', renderProjects(data.projects)],
   ['Skills', renderSkills(data.skills)]
  ].forEach(pair => {
    const section = renderSection(pair[0], pair[1]);
    editorWindow.main.appendChild(section);
    registerDirectoryEntry(pair[0] + '.md', section);
  });

  showFirstDirectoryEntry();

  highlightTokens(container);
}

function renderSection(title, contentEl) {
  const section = document.createElement('div');
  section.className = 'pro-section';
  section.id = title.toLowerCase().replace(/\s+/g, '-');

  const content = document.createElement('div');
  content.className = 'section-content';
  content.style.display = 'block';

  if (contentEl) {
    content.appendChild(contentEl);
  }

  section.appendChild(content);
  return section;
}

function renderTimeline(jobs) {
  const wrapper = document.createElement('div');
  wrapper.className = 'editor-panel';
  const editor = createEditorPanel(wrapper);

  jobs.forEach(job => {
    const tabName = job.role || job.company || 'Role';
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'editor-tab';
    tab.appendChild(document.createTextNode(tabName));
    tab.title = (job.company || '') + (job.date ? ' · ' + job.date : '');

    const close = document.createElement('span');
    close.className = 'editor-tab-close';
    close.textContent = '\u00D7';
    tab.appendChild(close);

    const view = document.createElement('div');
    view.className = 'editor-view';

    if (job.company || job.role) {
      const comment = document.createElement('p');
      comment.className = 'editor-comment';
      const slug = (tabName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
      comment.textContent = '// careers/' + slug + '.md';
      view.appendChild(comment);
    }

    if (job.role) {
      const title = document.createElement('h3');
      title.className = 'editor-title';
      title.textContent = job.role;
      view.appendChild(title);
    }

    if (job.company || job.date) {
      const meta = document.createElement('p');
      meta.className = 'editor-meta';
      meta.textContent = [job.company, job.date].filter(Boolean).join(' · ');
      view.appendChild(meta);
    }

    if (job.bullets && job.bullets.length) {
      const ul = document.createElement('ul');
      ul.className = 'editor-bullets';
      job.bullets.forEach(bullet => {
        const li = document.createElement('li');
        li.textContent = bullet;
        ul.appendChild(li);
      });
      view.appendChild(ul);
    }

    tab.onclick = function () { selectEditorFile(editor, tab, view); };

    editor.tabs.appendChild(tab);
    editor.views.appendChild(view);

    if (!editor.activeTab) selectEditorFile(editor, tab, view);

    highlightTokens(view);
  });

  return wrapper;
}

function renderProjects(projects) {
  const wrapper = document.createElement('div');
  wrapper.className = 'editor-panel';
  const editor = createEditorPanel(wrapper);

  projects.forEach(proj => {
    const tabName = proj.name || 'Untitled';
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'editor-tab';
    tab.appendChild(document.createTextNode(tabName));
    tab.title = proj.tag || proj.name || '';

    const close = document.createElement('span');
    close.className = 'editor-tab-close';
    close.textContent = '\u00D7';
    tab.appendChild(close);

    const view = document.createElement('div');
    view.className = 'editor-view';

    const comment = document.createElement('p');
    comment.className = 'editor-comment';
    const slug = tabName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    comment.textContent = '// projects/' + slug + '.md';
    view.appendChild(comment);

    const title = document.createElement('h3');
    title.className = 'editor-title';
    title.textContent = tabName;
    view.appendChild(title);

    if (proj.tag) {
      const meta = document.createElement('p');
      meta.className = 'editor-meta';
      meta.textContent = proj.tag;
      view.appendChild(meta);
    }

    if (proj.desc) {
      const desc = document.createElement('p');
      desc.className = 'editor-excerpt';
      desc.textContent = proj.desc;
      view.appendChild(desc);
    }

    tab.onclick = function () { selectEditorFile(editor, tab, view); };

    editor.tabs.appendChild(tab);
    editor.views.appendChild(view);

    if (!editor.activeTab) selectEditorFile(editor, tab, view);

    highlightTokens(view);
  });

  return wrapper;
}

function renderSkills(categories) {
  const pre = document.createElement('div');
  pre.className = 'skills-code';

  categories.forEach(cat => {
    const catName = (cat.category || 'skills').toLowerCase().replace(/\s+/g, '_');

    const open = document.createElement('p');
    open.className = 'skills-code-line';
    open.appendChild(makeSpan('tk-kw', 'const'));
    open.appendChild(makeSpan('tk-lg', ' ' + catName));
    open.appendChild(document.createTextNode(' = ['));
    pre.appendChild(open);

    (cat.items || []).forEach(skill => {
      const item = document.createElement('p');
      item.className = 'skills-code-line indented';
      item.appendChild(document.createTextNode(skill));
      item.appendChild(document.createTextNode(','));
      pre.appendChild(item);
    });

    const close = document.createElement('p');
    close.className = 'skills-code-line indented';
    close.textContent = '];';
    pre.appendChild(close);
  });

  return pre;
}

function makeSpan(cls, text) {
  const span = document.createElement('span');
  span.className = cls;
  span.textContent = text;
  return span;
}

function loadBlogPosts() {
  fetch('../../src/Blogs/posts.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch posts.json');
      return res.json();
    })
    .then(filenames => {
      const blogSection = renderSection('Latest Posts', null);
      const grid = document.createElement('div');
      grid.className = 'editor-panel';
      grid.id = 'blog-grid';
      blogSection.querySelector('.section-content').appendChild(grid);
      if (editorWindow) {
        editorWindow.main.appendChild(blogSection);
        registerDirectoryEntry('Latest Posts.md', blogSection);
      } else {
        document.getElementById('pro-container').appendChild(blogSection);
      }

      const editor = createEditorPanel(grid);
      showLoadingPlaceholder(editor.views);

      const postFiles = filenames.slice(0, 2);
      let loaded = 0;
      let error = false;

      postFiles.forEach((file, index) => {
        fetch('../../src/Blogs/' + file)
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch ' + file);
            return res.text();
          })
          .then(text => {
            const meta = parsePostHeaders(text);
            const post = {
              title: meta.title || file,
              category: meta.category || '',
              date: meta.date || '',
              excerpt: meta.excerpt || '',
              file: file,
              index: index
            };
            renderBlogCard(editor, post);
            loaded++;
            if (loaded === postFiles.length) {
              removeLoading(editor.views);
              if (error) showBlogError(grid, 'Some posts could not be loaded.');
            }
          })
          .catch(e => {
            console.error('Error loading blog post:', file, e);
            error = true;
            loaded++;
            if (loaded === postFiles.length) {
              removeLoading(editor.views);
              showBlogError(grid, 'Some posts could not be loaded.');
            }
          });
      });
    })
    .catch(e => {
      console.error('Error loading posts manifest:', e);
      showBlogError(null, 'Unable to load latest posts.');
    });
}

function showBlogError(grid, message) {
  const container = editorWindow ? editorWindow.main : document.getElementById('pro-container');
  if (!grid) {
    const p = document.createElement('p');
    p.className = 'blog-error';
    p.textContent = message;
    container.appendChild(p);
    return;
  }
  const p = document.createElement('p');
  p.className = 'blog-error';
  p.textContent = message;
  grid.appendChild(p);
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

function createEditorPanel(grid) {
  const tabs = document.createElement('div');
  tabs.className = 'editor-tabs';

  const views = document.createElement('div');
  views.className = 'editor-views';

  grid.appendChild(tabs);
  grid.appendChild(views);

  return { tabs: tabs, views: views, activeTab: null };
}

function selectEditorFile(editor, tab, view) {
  if (editor.activeTab === tab) return;
  const previousTab = editor.activeTab;
  const previousView = editor.views.querySelector('.editor-view.active');
  if (previousTab) previousTab.classList.remove('active');
  if (previousView) previousView.classList.remove('active');
  editor.activeTab = tab;
  tab.classList.add('active');
  view.classList.add('active');
}

function renderBlogCard(editor, post) {
  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'editor-tab';
  tab.appendChild(document.createTextNode(post.title));
  tab.title = post.title;

  const close = document.createElement('span');
  close.className = 'editor-tab-close';
  close.textContent = '\u00D7';
  tab.appendChild(close);

  const view = document.createElement('div');
  view.className = 'editor-view';

  if (post.file) {
    const comment = document.createElement('p');
    comment.className = 'editor-comment';
    comment.textContent = '// src/Blogs/' + post.file;
    view.appendChild(comment);
  }

  const title = document.createElement('h3');
  title.className = 'editor-title';
  title.textContent = post.title;
  view.appendChild(title);

  const meta = document.createElement('p');
  meta.className = 'editor-meta';
  meta.textContent = [post.category, post.date].filter(Boolean).join(' · ');
  view.appendChild(meta);

  const excerpt = document.createElement('p');
  excerpt.className = 'editor-excerpt';
  excerpt.textContent = post.excerpt;
  view.appendChild(excerpt);

  const link = document.createElement('a');
  link.className = 'editor-link';
  link.href = '../Blog/Blog.html#post-' + post.index;
  link.textContent = 'open in full editor \u2192';
  view.appendChild(link);

  tab.onclick = function () { selectEditorFile(editor, tab, view); };

  editor.tabs.appendChild(tab);
  editor.views.appendChild(view);

  if (!editor.activeTab) selectEditorFile(editor, tab, view);

  highlightTokens(view);
}

function showLoadingPlaceholder(grid) {
  if (!grid) return;
  const p = document.createElement('p');
  p.className = 'loading-placeholder';
  p.id = 'blog-loading';
  p.innerHTML = 'Loading<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span>';
  grid.appendChild(p);
}

function removeLoading(grid) {
  const loading = grid ? grid.querySelector('#blog-loading') : null;
  if (loading) {
    loading.remove();
  }
}

loadCV();
