function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function mdInline(text) {
  let html = escapeHtml(String(text || ''));
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (match, label, url) {
    const trimmed = url.trim();
    const scheme = trimmed.match(/^([a-z][a-z0-9+.-]*):/i);
    if (scheme && ['http', 'https', 'mailto', '#'].indexOf(scheme[1].toLowerCase()) === -1) {
      return match;
    }
    return '<a href="' + escapeHtml(trimmed) + '" target="_blank" rel="noopener">' + label + '</a>';
  });
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[^*])\*([^*]+)\*/g, function (match, pre, italic) {
    return pre + '<em>' + italic + '</em>';
  });
  return html;
}

function mdBlock(text) {
  const lines = String(text || '').split('\n');
  let html = '';
  const stack = [];

  function closeAll() {
    while (stack.length) {
      const tag = stack.pop();
      html += tag === 'li' ? '</li>' : '</' + tag + '>';
    }
  }

  for (const line of lines) {
    const listMatch = line.match(/^([ \t]*)([-+*]|\d+\.)\s+(.*)$/);
    if (listMatch) {
      const level = Math.round(listMatch[1].replace(/\t/g, '  ').length / 2);
      const marker = listMatch[2];
      const content = listMatch[3];
      let depth = stack.filter(function (t) { return t === 'ul' || t === 'ol'; }).length - 1;

      if (depth < level) {
        while (depth < level) {
          const tag = /^\d+\.$/.test(marker) ? 'ol' : 'ul';
          html += '<' + tag + '>';
          stack.push(tag);
          depth++;
        }
      } else {
        while (depth > level) {
          html += '</li>';
          stack.pop();
          html += '</' + stack.pop() + '>';
          depth--;
        }
        if (depth >= 0) {
          html += '</li>';
          stack.pop();
        }
      }

      html += '<li>' + mdInline(content);
      stack.push('li');
      continue;
    }

    closeAll();

    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      html += '\n<h' + level + '>' + mdInline(line.replace(/^#{1,6}\s*/, '')) + '</h' + level + '>\n';
    } else if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
      html += '\n<hr>\n';
    } else if (/^>\s?/.test(line)) {
      html += '\n<blockquote><p>' + mdInline(line.replace(/^>\s?/, '').trim()) + '</p></blockquote>\n';
    } else if (line.trim() === '') {
      html += '\n';
    } else {
      html += '\n<p>' + mdInline(line.trim()) + '</p>\n';
    }
  }

  closeAll();
  return html;
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
          } else if (/^#{3,6}\s/.test(t)) {
            job.bullets.push({
              kind: 'heading',
              level: t.match(/^#+/)[0].length,
              text: t.replace(/^#+\s*/, '')
            });
          } else if (/^[-+*]\s/.test(t) && line !== t) {
            const last = job.bullets[job.bullets.length - 1];
            if (last && last.kind === 'bullet') {
              last.sub.push(t.replace(/^[-+*]\s*/, ''));
            }
          } else if (t.startsWith('- ')) {
            job.bullets.push({ kind: 'bullet', text: t.slice(2), sub: [] });
          } else if (/^>\s*\[([^\]]+)\]\(([^)]+)\)/.test(t)) {
            const m = t.match(/^>\s*\[([^\]]+)\]\(([^)]+)\)/);
            job.readMore = { label: m[1], url: m[2] };
          } else if (/^!\[[^\]]*\]\(([^)]+)\)/.test(t)) {
            const m = t.match(/^!\[[^\]]*\]\(([^)]+)\)/);
            job.banner = m[1].trim();
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
      let proj = null;
      for (const line of block) {
        const t = line.trim();
        if (/^>\s*\[([^\]]+)\]\(([^)]+)\)/.test(t)) {
          const m = t.match(/^>\s*\[([^\]]+)\]\(([^)]+)\)/);
          if (proj) proj.readMore = { label: m[1], url: m[2] };
          continue;
        }
        if (/^!\[[^\]]*\]\(([^)]+)\)/.test(t)) {
          const m = t.match(/^!\[[^\]]*\]\(([^)]+)\)/);
          if (proj) proj.banner = m[1].trim();
          continue;
        }
        if (!t.startsWith('- ')) continue;
        const content = t.slice(2);
        const name = content.split('**')[1] || '';
        const afterName = content.split(')')[0] || '';
        const tag = afterName.split('(')[1] || '';
        const desc = content.split('--')[1] || '';
        proj = { name: name.trim(), tag: tag.trim(), desc: desc.trim() };
        data.projects.push(proj);
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
        const category = (content.split('**')[1] || '').replace(/:$/, '');
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

var SHORT_NAMES = {
  'Software Engineer 2 - DI App Factory': 'swe-2',
  'Software Engineer 1 - DI App Factory': 'swe-1',
  'Associate Software Developer - DI App Factory': 'asoc-dev-sc',
  'Associate Software Developer - DDPX': 'asoc-dev-ddpx',
  'Risk & Financial Advisory Analyst - DDPX': 'iam-risk-analyst',
  'Frontend/Backend': 'frontend',
  'Languages/Tools': 'languages',
  'Databases': 'databases',
  'Cloud/AI': 'cloud',
  'Infrastructure': 'infra'
};

var ICON_SRC = '../../Images/information-svgrepo-com.svg';

function shortName(label) {
  const clean = String(label || '').replace(/:$/, '');
  if (SHORT_NAMES[clean] !== undefined) return SHORT_NAMES[clean];
  const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const parts = slug.split('-').filter(Boolean);
  if (parts.length === 0) return 'file';
  return parts.slice(0, 2).join('-');
}

function setActiveFolderHeader() {
  if (!editorWindow || !editorWindow.folders) return;
  editorWindow.folders.forEach(folder => {
    folder.__setActive(false);
  });
}

function setActiveTreeItem(item) {
  if (!editorWindow) return;
  editorWindow.entries.forEach(entry => {
    entry.item.classList.remove('active');
  });
  if (item) item.classList.add('active');
  setActiveFolderHeader();
  if (item && item.parentElement && item.parentElement.classList.contains('directory-folder-body')) {
    const folder = item.parentElement.parentElement;
    if (folder && folder.__setActive) folder.__setActive(true);
  }
}

function activateSection(sectionEl, item) {
  if (!editorWindow) return;
  if (editorWindow.sidebar) editorWindow.sidebar.classList.add('open');
  editorWindow.main.querySelectorAll('.pro-section').forEach(function (s) {
    s.style.display = 'none';
  });
  sectionEl.style.display = 'block';
  setActiveTreeItem(item);
}

function registerDirectoryEntry(title, sectionEl, item) {
  if (!editorWindow) return;
  item = item || document.createElement('div');
  if (!item.classList.contains('directory-file')) item.className = 'directory-file';
  const icon = item.querySelector('.directory-file-icon') || document.createElement('img');
  const name = item.querySelector('.directory-file-name') || document.createElement('span');
  if (!item.querySelector('.directory-file-icon')) {
    icon.className = 'directory-file-icon';
    icon.alt = '';
    icon.src = ICON_SRC;
    item.appendChild(icon);
  }
  if (!item.querySelector('.directory-file-name')) {
    name.className = 'directory-file-name';
    item.appendChild(name);
  }
  name.textContent = title;
  item.onclick = function () { activateSection(sectionEl, item); };
  sectionEl.style.display = 'none';
  editorWindow.entries.push({ section: sectionEl, item: item });
  editorWindow.tree.appendChild(item);
  return item;
}

function registerSectionFolder(name, sectionEl, tabRefs) {
  if (!editorWindow) return;

  const folder = document.createElement('div');
  folder.className = 'directory-folder open';

  const header = document.createElement('div');
  header.className = 'directory-folder-header';

  const caret = document.createElement('span');
  caret.className = 'directory-caret';
  caret.textContent = '\u25BE';

  const icon = document.createElement('span');
  icon.className = 'directory-folder-icon';

  const label = document.createElement('span');
  label.className = 'directory-folder-name';
  label.textContent = name;

  header.appendChild(caret);
  header.appendChild(icon);
  header.appendChild(label);

  const body = document.createElement('div');
  body.className = 'directory-folder-body';

  tabRefs.forEach(ref => {
    const item = document.createElement('div');
    item.className = 'directory-file directory-file-nested';
    const fileName = (ref.fileName || shortName(ref.label) || 'file') + '.md';
    registerDirectoryEntry(fileName, sectionEl, item);
    const baseClick = item.onclick;
    item.onclick = function () {
      if (baseClick) baseClick.call(this);
      if (ref.editor && ref.tab && ref.view) {
        selectEditorFile(ref.editor, ref.tab, ref.view);
      }
    };
    body.appendChild(item);
    ref.item = item;
    if (ref.view) ref.view.__treeItem = item;
  });

  function toggle(force) {
    const open = typeof force === 'boolean' ? force : !folder.classList.contains('open');
    folder.classList.toggle('open', open);
    header.setAttribute('aria-expanded', String(open));
    caret.textContent = open ? '\u25BE' : '\u25B8';
    return open;
  }

  header.addEventListener('click', function () {
    toggle();
  });

  folder.appendChild(header);
  folder.appendChild(body);
  editorWindow.tree.appendChild(folder);
  sectionEl.style.display = 'none';

  folder.__setActive = function (active) {
    header.classList.toggle('active', active);
    if (active) toggle(true);
  };

  editorWindow.folders = editorWindow.folders || [];
  editorWindow.folders.push(folder);
}

function renderProfessional(data) {
  const container = document.getElementById('pro-container');
  container.innerHTML = '';

  setupEditorWindow();

  const exp = renderExperience(data.experience);
  const expSection = renderSection('Experience', exp.wrapper);
  editorWindow.main.appendChild(expSection);
  registerSectionFolder('Experience', expSection, exp.tabRefs);

  const projects = renderProjects(data.projects);
  const projectsSection = renderSection('Projects', projects.wrapper);
  editorWindow.main.appendChild(projectsSection);
  registerSectionFolder('Projects', projectsSection, projects.tabRefs);

  const skills = renderSkills(data.skills);
  const skillsSection = renderSection('Skills', skills.wrapper);
  editorWindow.main.appendChild(skillsSection);
  registerSectionFolder('Skills', skillsSection, skills.tabRefs);

  activateSection(expSection);
  if (exp.tabRefs[0] && exp.tabRefs[0].item) {
    activateSection(expSection, exp.tabRefs[0].item);
  }
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

function renderExperience(jobs) {
  const wrapper = document.createElement('div');
  wrapper.className = 'editor-panel experience-panel';

  const stack = document.createElement('div');
  stack.className = 'editor-stack';
  wrapper.appendChild(stack);

  const editor = createEditorPanel(stack);
  const tabRefs = [];

  const sorted = jobs.slice().sort(function (a, b) {
    return (b.sortKey || 0) - (a.sortKey || 0);
  });

  sorted.forEach(job => {
    const fullName = job.role || job.company || 'Role';
    const short = shortName(fullName);

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'editor-tab';
    tab.appendChild(document.createTextNode(short + '.md'));
    tab.title = fullName + (job.company && job.company !== job.role ? ' \u00B7 ' + job.company : '') + (job.date ? ' \u00B7 ' + job.date : '');

    const close = document.createElement('span');
    close.className = 'editor-tab-close';
    close.textContent = '\u00D7';
    tab.appendChild(close);

    const view = document.createElement('div');
    view.className = 'editor-view';

    const comment = document.createElement('p');
    comment.className = 'editor-comment';
    comment.textContent = '// Experience/' + short + '.md';
    view.appendChild(comment);

    if (job.banner) {
      const banner = document.createElement('img');
      banner.className = 'editor-banner';
      banner.src = job.banner;
      banner.alt = job.role || 'banner';
      view.appendChild(banner);
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
      const wrap = document.createElement('div');
      wrap.className = 'editor-bullets';
      let currentUl = null;

      function ensureUl() {
        if (!currentUl) {
          currentUl = document.createElement('ul');
          wrap.appendChild(currentUl);
        }
        return currentUl;
      }

      job.bullets.forEach(bullet => {
        if (bullet.kind === 'heading') {
          currentUl = null;
          const h = document.createElement('div');
          h.className = 'editor-subheading';
          h.innerHTML = mdInline(bullet.text);
          wrap.appendChild(h);
          return;
        }
        const li = document.createElement('li');
        li.innerHTML = mdInline(bullet.text);
        ensureUl().appendChild(li);
        if (bullet.sub && bullet.sub.length) {
          const subUl = document.createElement('ul');
          bullet.sub.forEach(s => {
            const sl = document.createElement('li');
            sl.innerHTML = mdInline(s);
            subUl.appendChild(sl);
          });
          li.appendChild(subUl);
        }
      });
      view.appendChild(wrap);

      if (job.readMore) {
        const readMore = document.createElement('a');
        readMore.className = 'editor-read-more';
        readMore.href = job.readMore.url;
        readMore.textContent = job.readMore.label;
        readMore.target = '_blank';
        readMore.rel = 'noopener';
        view.appendChild(readMore);
      }

      const preview = document.createElement('div');
      preview.className = 'editor-preview';
      const lines = [];
      job.bullets.forEach(bullet => {
        if (bullet.kind === 'heading') {
          lines.push('');
          lines.push('#'.repeat(bullet.level || 4) + ' ' + bullet.text);
        } else {
          lines.push('- ' + bullet.text);
          (bullet.sub || []).forEach(s => lines.push('  - ' + s));
        }
      });
      lines.push('');
      if (job.readMore) {
        lines.push('> [' + job.readMore.label + '](' + job.readMore.url + ')');
      }
      preview.innerHTML = mdBlock(lines.join('\n'));
      view.appendChild(preview);
    }

    tabRefs.push({ label: fullName, fileName: short, tab: tab, view: view, editor: editor });

    tab.onclick = function () { selectEditorFile(editor, tab, view); };

    editor.tabs.appendChild(tab);
    editor.views.appendChild(view);

    if (!editor.activeTab) selectEditorFile(editor, tab, view);
  });

  addPreviewToggle(wrapper, editor.modebar);

  return { wrapper: wrapper, editor: editor, tabRefs: tabRefs };
}

function renderProjects(projects) {
  const wrapper = document.createElement('div');
  wrapper.className = 'editor-panel';
  const editor = createEditorPanel(wrapper);
  const tabRefs = [];

  projects.forEach(proj => {
    const fullName = proj.name || 'Untitled';
    const short = shortName(fullName);

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'editor-tab';
    tab.appendChild(document.createTextNode(short + '.md'));
    tab.title = proj.tag || fullName;

    const close = document.createElement('span');
    close.className = 'editor-tab-close';
    close.textContent = '\u00D7';
    tab.appendChild(close);

    const view = document.createElement('div');
    view.className = 'editor-view';

    const comment = document.createElement('p');
    comment.className = 'editor-comment';
    comment.textContent = '// Projects/' + short + '.md';
    view.appendChild(comment);

    if (proj.banner) {
      const banner = document.createElement('img');
      banner.className = 'editor-banner';
      banner.src = proj.banner;
      banner.alt = fullName || 'banner';
      view.appendChild(banner);
    }

    const title = document.createElement('h3');
    title.className = 'editor-title';
    title.textContent = fullName;
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
      desc.innerHTML = mdInline(proj.desc);
      view.appendChild(desc);

      if (proj.readMore) {
        const readMore = document.createElement('a');
        readMore.className = 'editor-read-more';
        readMore.href = proj.readMore.url;
        readMore.textContent = proj.readMore.label;
        readMore.target = '_blank';
        readMore.rel = 'noopener';
        view.appendChild(readMore);
      }

      const preview = document.createElement('div');
      preview.className = 'editor-preview';
      const p = document.createElement('p');
      p.innerHTML = mdInline(proj.desc);
      preview.appendChild(p);

      if (proj.readMore) {
        const bq = document.createElement('blockquote');
        const bqP = document.createElement('p');
        const readMore2 = document.createElement('a');
        readMore2.href = proj.readMore.url;
        readMore2.textContent = proj.readMore.label;
        readMore2.target = '_blank';
        readMore2.rel = 'noopener';
        bqP.appendChild(readMore2);
        bq.appendChild(bqP);
        preview.appendChild(bq);
      }

      view.appendChild(preview);
    }

    tabRefs.push({ label: fullName, fileName: short, tab: tab, view: view, editor: editor });

    tab.onclick = function () { selectEditorFile(editor, tab, view); };

    editor.tabs.appendChild(tab);
    editor.views.appendChild(view);

    if (!editor.activeTab) selectEditorFile(editor, tab, view);
  });

  addPreviewToggle(wrapper, editor.modebar);

  return { wrapper: wrapper, editor: editor, tabRefs: tabRefs };
}

function renderSkills(categories) {
  const wrapper = document.createElement('div');
  wrapper.className = 'editor-panel';
  const editor = createEditorPanel(wrapper);
  const tabRefs = [];

  const fullName = 'Skills';
  const short = shortName(fullName);

  const tab = document.createElement('button');
  tab.type = 'button';
  tab.className = 'editor-tab';
  tab.appendChild(document.createTextNode(short + '.md'));
  tab.title = fullName;

  const close = document.createElement('span');
  close.className = 'editor-tab-close';
  close.textContent = '\u00D7';
  tab.appendChild(close);

  const view = document.createElement('div');
  view.className = 'editor-view';

  const comment = document.createElement('p');
  comment.className = 'editor-comment';
  comment.textContent = '// Skills/' + short + '.md';
  view.appendChild(comment);

  const title = document.createElement('h3');
  title.className = 'editor-title';
  title.textContent = fullName;
  view.appendChild(title);

  const ul = document.createElement('ul');
  ul.className = 'editor-bullets';
  (categories || []).forEach(cat => {
    const li = document.createElement('li');
    li.textContent = (cat.category || '') + ': ' + (cat.items || []).join(', ');
    ul.appendChild(li);
  });
  view.appendChild(ul);

  const preview = document.createElement('div');
  preview.className = 'editor-preview skills-preview';

  const table = document.createElement('table');
  table.className = 'skills-table';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.appendChild(document.createElement('th')).textContent = 'Category';
  headRow.appendChild(document.createElement('th')).textContent = 'Skills';
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  (categories || []).forEach(cat => {
    const tr = document.createElement('tr');
    const catTd = document.createElement('td');
    catTd.className = 'skills-category';
    catTd.textContent = cat.category || '';
    tr.appendChild(catTd);
    const skillsTd = document.createElement('td');
    skillsTd.className = 'skills-items';
    skillsTd.textContent = (cat.items || []).join(', ');
    tr.appendChild(skillsTd);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  preview.appendChild(table);
  view.appendChild(preview);

  tabRefs.push({ label: fullName, fileName: short, tab: tab, view: view, editor: editor });

  tab.onclick = function () { selectEditorFile(editor, tab, view); };

  editor.tabs.appendChild(tab);
  editor.views.appendChild(view);

  if (!editor.activeTab) selectEditorFile(editor, tab, view);

  addPreviewToggle(wrapper, editor.modebar);

  return { wrapper: wrapper, editor: editor, tabRefs: tabRefs };
}

function createEditorPanel(grid) {
  const tabsbar = document.createElement('div');
  tabsbar.className = 'editor-tabsbar';

  const tabs = document.createElement('div');
  tabs.className = 'editor-tabs';

  const modebar = document.createElement('div');
  modebar.className = 'editor-modebar';
  modebar.setAttribute('role', 'group');
  modebar.setAttribute('aria-label', 'Display mode');

  tabsbar.appendChild(tabs);
  tabsbar.appendChild(modebar);

  const views = document.createElement('div');
  views.className = 'editor-views';

  grid.appendChild(tabsbar);
  grid.appendChild(views);

  return { tabs: tabs, views: views, modebar: modebar, activeTab: null };
}

function addPreviewToggle(panel, modebar) {
  const previewBtn = document.createElement('button');
  previewBtn.type = 'button';
  previewBtn.className = 'mode-btn mode-preview active';
  previewBtn.textContent = 'Preview';
  previewBtn.setAttribute('aria-pressed', 'true');

  const sourceBtn = document.createElement('button');
  sourceBtn.type = 'button';
  sourceBtn.className = 'mode-btn mode-source';
  sourceBtn.textContent = 'Source';
  sourceBtn.setAttribute('aria-pressed', 'false');

  function setMode(preview) {
    panel.classList.toggle('is-preview', preview);
    previewBtn.classList.toggle('active', preview);
    sourceBtn.classList.toggle('active', !preview);
    previewBtn.setAttribute('aria-pressed', String(preview));
    sourceBtn.setAttribute('aria-pressed', String(!preview));
  }

  previewBtn.addEventListener('click', function () { setMode(true); this.blur(); });
  sourceBtn.addEventListener('click', function () { setMode(false); this.blur(); });

  modebar.appendChild(previewBtn);
  modebar.appendChild(sourceBtn);
  setMode(true);
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
  setActiveTreeItem(view && view.__treeItem);
}

(function initBannerEyes() {
  var banner = document.querySelector('.launch-banner');
  var h1 = banner && banner.querySelector('h1');
  if (!h1) return;

  var text = h1.textContent;
  var wrapped = '';
  for (var i = 0; i < text.length; i++) {
    if (text[i] === 'j') {
      wrapped += '<span class="j-char">' + text[i] + '</span>';
    } else {
      wrapped += text[i];
    }
  }
  h1.innerHTML = wrapped;

  var chars = h1.querySelectorAll('.j-char');
  var eyes = [];

  var style = document.createElement('style');
  style.textContent =
    '@keyframes jLidBlink {' +
    '0%,88%,100%{transform:translateX(-50%) scaleY(0)}' +
    '92%{transform:translateX(-50%) scaleY(1)}' +
    '97%{transform:translateX(-50%) scaleY(0)}' +
    '}';
  document.head.appendChild(style);

  chars.forEach(function (ch) {
    var sclera = document.createElement('span');
    sclera.style.cssText =
      'position:absolute;background:#fff;border-radius:50%;pointer-events:none;z-index:9;' +
      'transform:translate(-50%,-50%);';
    h1.appendChild(sclera);

    var pupil = document.createElement('span');
    pupil.style.cssText =
      'position:absolute;background:#000;border-radius:50%;pointer-events:none;z-index:10;' +
      'transform:translate(-50%,-50%);';
    h1.appendChild(pupil);

    var lid = document.createElement('span');
    lid.style.cssText =
      'position:absolute;background:#1e1e1e;border-radius:50%;pointer-events:none;z-index:11;' +
      'transform:translateX(-50%) scaleY(0);' +
      'transform-origin:top center;' +
      'animation:jLidBlink ' + (5000 / 1000) + 's infinite;';
    h1.appendChild(lid);
    eyes.push({ sclera: sclera, pupil: pupil, lid: lid, chEl: ch });
  });

  function positionEyes() {
    var h1Rect = h1.getBoundingClientRect();
    var fs = parseFloat(getComputedStyle(h1).fontSize);
    var scleraSize = Math.round(fs * 0.16);
    var pupilW = Math.round(scleraSize * 0.6);
    var pupilH = Math.round(scleraSize * 0.6);
    var maxDisp = (scleraSize - pupilW) / 2 - 1;

    eyes.forEach(function (eye) {
      eye.sclera.style.width = scleraSize + 'px';
      eye.sclera.style.height = scleraSize + 'px';
      eye.pupil.style.width = pupilW + 'px';
      eye.pupil.style.height = pupilH + 'px';
      eye.lid.style.width = scleraSize + 'px';
      eye.lid.style.height = scleraSize + 'px';
      eye.maxDisp = maxDisp;

      var r = eye.chEl.getBoundingClientRect();
      var dotX = r.left + r.width / 2 - h1Rect.left;
      var dotY = r.top + r.height * 0.22 - h1Rect.top;
      eye.sclera.style.left = dotX + 'px';
      eye.sclera.style.top = dotY + 'px';
      eye.pupil.style.left = dotX + 'px';
      eye.pupil.style.top = dotY + 'px';
      eye.lid.style.left = dotX + 'px';
      eye.lid.style.top = (dotY - scleraSize / 2) + 'px';
    });
  }

  positionEyes();
  window.addEventListener('resize', positionEyes);

  var rafId = null;

  banner.addEventListener('mousemove', function (e) {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = null;
      eyes.forEach(function (eye) {
        var r = eye.chEl.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height * 0.22;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > eye.maxDisp) {
          dx = dx / dist * eye.maxDisp;
          dy = dy / dist * eye.maxDisp;
        }
        eye.pupil.style.transform = 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px))';
      });
    });
  });

  var launchBtn = document.getElementById('launch-btn');
  if (launchBtn) {
    launchBtn.addEventListener('click', function () {
      eyes.forEach(function (eye) {
        eye.sclera.style.display = 'none';
        eye.pupil.style.display = 'none';
        eye.lid.style.display = 'none';
      });
    });
  }
})();

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

      function showTooltip() {
        tooltip.textContent = PROFILE_INFO[profile] || profile;
        tooltip.style.display = 'block';
        tooltip.style.opacity = '0';
        positionTooltip(item);
        requestAnimationFrame(function () {
          tooltip.style.opacity = '1';
        });
      }

      function hideTooltip() {
        tooltip.style.display = 'none';
      }

      item.addEventListener('mouseenter', showTooltip);
      item.addEventListener('mouseleave', hideTooltip);

      item.addEventListener('click', function (e) {
        e.stopPropagation();
        if (tooltip.style.display === 'block') {
          hideTooltip();
        } else {
          showTooltip();
        }
      });

      document.addEventListener('click', function (e) {
        if (!item.contains(e.target)) hideTooltip();
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
