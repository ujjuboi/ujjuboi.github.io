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

var NUM_RE = /\b(\d+(?:,\d{3})*(?:\.\d+)?%?[Kk]?)(?![.,\d])/g;

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

var SORT_MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
var SORT_MONTH_LABELS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseStartSortKey(dateStr) {
  const m = String(dateStr || '').trim().match(/^([A-Za-z]+)\s+(\d{4})/);
  if (!m) return 0;
  const mon = SORT_MONTHS[m[1].toLowerCase().slice(0, 3)];
  if (!mon) return 0;
  return parseInt(m[2], 10) * 100 + mon;
}

function sortKeyToLabel(key) {
  if (!key) return '';
  const year = Math.floor(key / 100);
  const mon = key % 100;
  return SORT_MONTH_LABELS[mon] ? SORT_MONTH_LABELS[mon] + ' ' + year : '';
}

function parseCV(text) {
  const lines = text.split('\n');
  const data = { summary: '', experience: [], projects: [], skills: [] };

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
            job.sortKey = parseStartSortKey(t);
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

function exitFullscreen() {
  if (document.fullscreenElement) {
    if (document.exitFullscreen) document.exitFullscreen().catch(function () {});
  } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function setupEditorWindow() {
  const container = document.getElementById('pro-container');
  container.classList.add('editor-window');
  container.innerHTML = '';

  const titlebar = document.createElement('div');
  titlebar.className = 'editor-titlebar';

  function makeBackDot(colorClass, label) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'editor-dot ' + colorClass + ' editor-dot-back';
    dot.title = label;
    dot.setAttribute('aria-label', label);
    dot.addEventListener('click', function () {
      exitFullscreen();
      const banner = document.getElementById('launch-banner');
      if (banner) banner.classList.remove('launched');
      this.blur();
    });
    return dot;
  }

  const redDot = makeBackDot('dot-red', 'Back to banner');
  const yellowDot = makeBackDot('dot-yellow', 'Back to banner');

  const greenDot = document.createElement('button');
  greenDot.type = 'button';
  greenDot.className = 'editor-dot dot-green editor-dot-back';
  greenDot.title = 'Toggle full screen';
  greenDot.setAttribute('aria-label', 'Toggle full screen');
  greenDot.addEventListener('click', function () {
    this.blur();
    const container = document.getElementById('pro-container');
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      exitFullscreen();
    } else if (container && container.requestFullscreen) {
      container.requestFullscreen().catch(function () {});
    } else if (container && container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
  });

  titlebar.appendChild(redDot);
  titlebar.appendChild(yellowDot);
  titlebar.appendChild(greenDot);
  titlebar.insertAdjacentHTML('beforeend', '<span class="editor-filename">portfolio.md \u2014 Ujjwal Verma</span>');
  container.appendChild(titlebar);

  const body = document.createElement('div');
  body.className = 'editor-window-body';

  const activityBar = document.createElement('div');
  activityBar.className = 'activity-bar';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'directory-toggle';
  toggle.setAttribute('aria-label', 'Toggle sidebar');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.title = 'Toggle sidebar';
  toggle.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  toggle.addEventListener('click', function () {
    const open = sidebar.classList.toggle('open');
    this.setAttribute('aria-expanded', String(open));
  });
  activityBar.appendChild(toggle);

  const content = document.createElement('div');
  content.className = 'editor-content';

  const sidebar = document.createElement('div');
  sidebar.className = 'directory';
  const header = document.createElement('div');
  header.className = 'directory-header';
  header.textContent = 'EXPLORER';
  const tree = document.createElement('div');
  tree.className = 'directory-tree';
  sidebar.appendChild(header);
  sidebar.appendChild(tree);

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'directory-back';
  backBtn.innerHTML = '<svg class="directory-back-icon" width="20" height="20" viewBox="0 0 219.151 219.151" xmlns="http://www.w3.org/2000/svg"><path d="M109.576,219.151c60.419,0,109.573-49.156,109.573-109.576C219.149,49.156,169.995,0,109.576,0S0.002,49.156,0.002,109.575C0.002,169.995,49.157,219.151,109.576,219.151z M109.576,15c52.148,0,94.573,42.426,94.574,94.575c0,52.149-42.425,94.575-94.574,94.576c-52.148-0.001-94.573-42.427-94.573-94.577C15.003,57.427,57.428,15,109.576,15z"/><path d="M94.861,156.507c2.929,2.928,7.678,2.927,10.606,0c2.93-2.93,2.93-7.678-0.001-10.608l-28.82-28.819l83.457-0.008c4.142-0.001,7.499-3.358,7.499-7.502c-0.001-4.142-3.358-7.498-7.5-7.498l-83.46,0.008l28.827-28.825c2.929-2.929,2.929-7.679,0-10.607c-1.465-1.464-3.384-2.197-5.304-2.197c-1.919,0-3.838,0.733-5.303,2.196l-41.629,41.628c-1.407,1.406-2.197,3.313-2.197,5.303c0.001,1.99,0.791,3.896,2.198,5.305L94.861,156.507z"/></svg>Back';
  backBtn.title = 'Back';
  backBtn.addEventListener('click', function () {
    exitFullscreen();
    const banner = document.getElementById('launch-banner');
    if (banner) banner.classList.remove('launched');
  });
  titlebar.appendChild(backBtn);

  content.appendChild(sidebar);

  const main = document.createElement('div');
  main.className = 'editor-main';
  content.appendChild(main);

  body.appendChild(activityBar);
  body.appendChild(content);

  const statusbar = document.createElement('div');
  statusbar.className = 'editor-statusbar';
  statusbar.textContent = 'UTF-8 \u00B7 Markdown \u00B7 Prettier';

  container.appendChild(body);
  container.appendChild(statusbar);

  editorWindow = { sidebar: sidebar, tree: tree, main: main, entries: [] };
  return editorWindow;
}

function activateSection(sectionEl, item) {
  if (!editorWindow) return;
  if (editorWindow.sidebar) editorWindow.sidebar.classList.add('open');
  editorWindow.main.querySelectorAll('.pro-section').forEach(function (s) {
    s.style.display = 'none';
  });
  editorWindow.entries.forEach(entry => {
    entry.item.classList.remove('active');
  });
  sectionEl.style.display = 'block';
  if (item) item.classList.add('active');
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
  item.onclick = function () { activateSection(sectionEl, item); };
  sectionEl.style.display = 'none';
  editorWindow.entries.push({ section: sectionEl, item: item });
  editorWindow.tree.appendChild(item);
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

  const exp = renderTimeline(data.experience);
  const expSection = renderSection('Experience', exp.wrapper);
  editorWindow.main.appendChild(expSection);
  registerDirectoryEntry('Experience.md', expSection);

  [['Projects', renderProjects(data.projects)],
   ['Skills', renderSkills(data.skills)]
  ].forEach(pair => {
    const section = renderSection(pair[0], pair[1]);
    editorWindow.main.appendChild(section);
    registerDirectoryEntry(pair[0] + '.md', section);
  });

  activateSection(expSection);
  exp.selectJob(exp.jobRefs[0]);

  container.querySelectorAll('.editor-bullets, .editor-excerpt, .skills-code').forEach(content => {
    highlightTokens(content);
  });
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
  wrapper.className = 'editor-panel experience-panel';

  const timeline = document.createElement('aside');
  timeline.className = 'timeline';
  wrapper.appendChild(timeline);

  const header = document.createElement('div');
  header.className = 'timeline-header';

  const title = document.createElement('span');
  title.className = 'timeline-title';
  title.textContent = '// careers \u2014 ' + jobs.length + ' role' + (jobs.length === 1 ? '' : 's');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'timeline-toggle';
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Collapse timeline');
  toggle.textContent = '\u25BE';
  toggle.addEventListener('click', function () {
    const collapsed = timeline.classList.toggle('collapsed');
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.setAttribute('aria-label', collapsed ? 'Expand timeline' : 'Collapse timeline');
  });

  header.appendChild(title);
  header.appendChild(toggle);
  timeline.appendChild(header);

  const list = document.createElement('div');
  list.className = 'timeline-list';
  timeline.appendChild(list);

  const stack = document.createElement('div');
  stack.className = 'editor-stack';
  wrapper.appendChild(stack);

  const editor = createEditorPanel(stack);
  const jobRefs = [];

  const sorted = jobs.slice().sort(function (a, b) {
    return (b.sortKey || 0) - (a.sortKey || 0);
  });

  sorted.forEach(job => {
    const tabName = job.role || job.company || 'Role';

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'editor-tab';
    tab.appendChild(document.createTextNode(tabName));
    tab.title = (job.company || '') + (job.date ? ' \u00B7 ' + job.date : '');

    const close = document.createElement('span');
    close.className = 'editor-tab-close';
    close.textContent = '\u00D7';
    tab.appendChild(close);

    const view = document.createElement('div');
    view.className = 'editor-view';

    if (job.company || job.role) {
      const comment = document.createElement('p');
      comment.className = 'editor-comment';
      const slug = tabName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
      meta.textContent = [job.company, job.date].filter(Boolean).join(' \u00B7 ');
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

    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'timeline-node';
    node.setAttribute('aria-label', (job.role || tabName) + (job.date ? ', ' + job.date : ''));

    const dot = document.createElement('span');
    dot.className = 'timeline-dot';
    const text = document.createElement('span');
    text.className = 'timeline-text';
    const roleEl = document.createElement('span');
    roleEl.className = 'timeline-role';
    roleEl.textContent = tabName;
    const companyEl = document.createElement('span');
    companyEl.className = 'timeline-company';
    companyEl.textContent = [job.company, job.date].filter(Boolean).join(' \u00B7 ');
    const dateEl = document.createElement('span');
    dateEl.className = 'timeline-date';
    dateEl.textContent = sortKeyToLabel(job.sortKey);
    text.appendChild(roleEl);
    text.appendChild(companyEl);
    node.appendChild(dot);
    node.appendChild(text);
    node.appendChild(dateEl);
    list.appendChild(node);

    const jobRef = { tab: tab, view: view, node: node, job: job, title: tabName };
    jobRefs.push(jobRef);

    tab.onclick = function () { selectJob(jobRef); };
    node.onclick = function () { selectJob(jobRef); };

    editor.tabs.appendChild(tab);
    editor.views.appendChild(view);
  });

  function selectJob(jobRef) {
    if (!jobRef) return;
    selectEditorFile(editor, jobRef.tab, jobRef.view);
    jobRefs.forEach(ref => {
      const active = ref === jobRef;
      ref.node.classList.toggle('active', active);
      ref.node.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  jobRefs.forEach((ref, index) => {
    ref.node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectJob(ref);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        const next = jobRefs[(index + step + jobRefs.length) % jobRefs.length];
        selectJob(next);
        next.node.focus({ preventScroll: true });
      }
    });
  });

  return { wrapper: wrapper, editor: editor, jobRefs: jobRefs, selectJob: selectJob };
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
  });

  return wrapper;
}

function renderSkills(categories) {
  const wrapper = document.createElement('div');
  wrapper.className = 'editor-panel';
  const editor = createEditorPanel(wrapper);

  (categories || []).forEach((cat, index) => {
    const catName = (cat.category || 'skills_' + index).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'editor-tab';
    tab.appendChild(document.createTextNode(catName));
    tab.title = cat.category || catName;

    const close = document.createElement('span');
    close.className = 'editor-tab-close';
    close.textContent = '\u00D7';
    tab.appendChild(close);

    const view = document.createElement('div');
    view.className = 'editor-view';

    const comment = document.createElement('p');
    comment.className = 'editor-comment';
    comment.textContent = '// ' + catName;
    view.appendChild(comment);

    const pre = document.createElement('div');
    pre.className = 'skills-code';

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

    const closing = document.createElement('p');
    closing.className = 'skills-code-line indented';
    closing.textContent = '];';
    pre.appendChild(closing);

    view.appendChild(pre);

    tab.onclick = function () { selectEditorFile(editor, tab, view); };

    editor.tabs.appendChild(tab);
    editor.views.appendChild(view);

    if (!editor.activeTab) selectEditorFile(editor, tab, view);
  });

  return wrapper;
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

const PROFILES = [
  'Full Stack Developer',
  'AI Developer',
  'Forward Deployed Engineer',
  'DevSecOps Engineer',
  'IAM/PAM Analyst'
];

const PROFILE_INFO = {
  'Full Stack Developer': 'I\u2019ve spent 4+ years building enterprise-scale applications end-to-end \u2014 Next.js, ExpressJS, and SpringBoot backed by MongoDB and Redis, from API-heavy features to data analytics platforms like DDPX.',
  'AI Developer': 'I\u2019ve built AI agents and workflows in production \u2014 autonomous GitHub agentic workflows that review PRs and update docs, LangChain high/low-code agents, and an NLTK/Spacy agent that identifies owners of IAM principals.',
  'Forward Deployed Engineer': 'I\u2019ve delivered directly on client engagements \u2014 turning identity-data requirements into shipped features, scaling bulk imports from 100K to 400K records and ingestion to 1,500 records/sec, and analyzing 100,000+ records across domains.',
  'DevSecOps Engineer': 'I\u2019ve automated PR-triggered CI/CD on GitHub Actions with secure guardrails \u2014 review, lint, documentation, testing, and quality-gate checks that run automatically before data reaches production.',
  'IAM/PAM Analyst': 'I\u2019ve worked hands-on across identity and access management \u2014 designing RBAC in Java, setting up SAML SSO with Okta and AWS Cognito, mapping SailPoint/Okta/PingFederate data, and building analytics for orphan groups and privileged entitlements with 95% ownership accuracy.'
};

const profilesEl = document.getElementById('profiles-strip');
if (profilesEl) {
  const strip = document.createElement('div');
  strip.className = 'profiles-strip';
  profilesEl.appendChild(strip);

  const tooltip = document.createElement('div');
  tooltip.className = 'profile-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  document.body.appendChild(tooltip);

  function positionTooltip(item) {
    const rect = item.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tipRect.width - 8));
    let top = rect.bottom + 10;
    if (top + tipRect.height > window.innerHeight - 8) {
      top = rect.top - tipRect.height - 10;
    }
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
    tooltip.style.opacity = '1';
  }

  function buildProfile() {
    const group = document.createElement('div');
    group.className = 'profiles-group';
    PROFILES.forEach(function (profile) {
      const item = document.createElement('span');
      item.className = 'profiles-item';
      item.textContent = profile;
      const sep = document.createElement('span');
      sep.className = 'profiles-sep';
      sep.textContent = '\u2022';
      item.appendChild(sep);
      group.appendChild(item);

      item.addEventListener('mouseenter', function () {
        tooltip.textContent = PROFILE_INFO[profile] || profile;
        tooltip.style.display = 'block';
        tooltip.style.opacity = '0';
        positionTooltip(item);
        requestAnimationFrame(function () {
          tooltip.style.opacity = '1';
        });
      });
      item.addEventListener('mouseleave', function () {
        tooltip.style.display = 'none';
      });
    });
    return group;
  }

  strip.appendChild(buildProfile());
  strip.appendChild(buildProfile());
}

const launchBtn = document.getElementById('launch-btn');
if (launchBtn) {
  launchBtn.addEventListener('click', function () {
    const banner = document.getElementById('launch-banner');
    if (banner) {
      banner.classList.add('launched');
      launchBtn.blur();
    }
  });
}
