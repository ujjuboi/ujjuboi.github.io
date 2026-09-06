/**
 * Converts a block of markdown (headings, lists, quotes, rulers) into HTML.
 *
 * @param {string} text Markdown source to render.
 * @returns {string} Rendered HTML.
 */
function mdBlock(text) {
  const lines = String(text || '').split('\n');
  let html = '';
  const stack = [];

  /**
   * Closes every list element still open on the tag stack.
   */
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

/**
 * Replaces the professional container with a loading placeholder.
 */
function showLoading() {
  const container = document.getElementById('pro-container');
  container.innerHTML = '<p class="loading-placeholder">Loading<span class="dot dot1">.</span><span class="dot dot2">.</span><span class="dot dot3">.</span></p>';
}

/**
 * Replaces the professional container with an error message.
 *
 * @param {string} message Error text to display.
 */
function showError(message) {
  const container = document.getElementById('pro-container');
  container.innerHTML = '<p class="error-message">' + escapeHtml(message) + '</p>';
}

/**
 * Toggles whether editor modebars are shown, hiding them when their section is collapsed on mobile.
 */
function refreshModebarVisibility() {
  if (!editorWindow || !editorWindow.modebars) return;
  const mobile = MOBILE_MQ && MOBILE_MQ.matches;
  editorWindow.modebars.forEach(function (entry) {
    const modebar = entry.modebar;
    const section = entry.panel.closest('.pro-section');
    if (mobile) {
      const visible = !section || section.style.display !== 'none';
      modebar.style.display = visible ? '' : 'none';
    } else {
      modebar.style.display = '';
    }
  });
}

/**
 * Moves a modebar into the activity bar on mobile, or back to its desktop parent.
 *
 * @param {HTMLElement} modebar The modebar element to place.
 */
function placeModebar(modebar) {
  if (!editorWindow || !editorWindow.activityBar) return;
  const mobile = MOBILE_MQ && MOBILE_MQ.matches;
  const target = mobile ? editorWindow.activityBar : modebar.__desktopParent;
  if (modebar.parentNode !== target) target.appendChild(modebar);
  modebar.classList.toggle('modebar-mobile', mobile);
}

/**
 * Locates every editor modebar and records its desktop parent before placing it.
 */
function setupModebarPlacement() {
  if (!editorWindow || !MOBILE_MQ) return;
  editorWindow.modebars = editorWindow.modebars || [];
  editorWindow.main.querySelectorAll('.editor-panel').forEach(function (panel) {
    const modebar = panel.querySelector('.editor-modebar');
    if (!modebar) return;
    if (!modebar.__placed) {
      modebar.__placed = true;
      modebar.__desktopParent = modebar.parentNode;
      editorWindow.modebars.push({ modebar: modebar, panel: panel });
    }
    placeModebar(modebar);
  });
  refreshModebarVisibility();
}

/**
 * Restores the launch banner overlay to its visible, unlaunched state.
 */
function showBanner() {
  const banner = document.getElementById('launch-banner');
  if (!banner) return;
  banner.classList.remove('launched');
  if (banner.__setEyesVisible) banner.__setEyesVisible(true);
}

/**
 * Exits fullscreen mode across standard and legacy webkit prefixes.
 */
function exitFullscreen() {
  if (document.fullscreenElement) {
    if (document.exitFullscreen) document.exitFullscreen().catch(function () {});
  } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * Builds the VS Code-style editor chrome (titlebar, sidebar, tabs, statusbar) in place.
 *
 * @returns {Object} References to the editor's interactive regions.
 */
function setupEditorWindow() {
  const container = document.getElementById('pro-container');
  container.classList.add('editor-window');
  container.innerHTML = '';

  const titlebar = document.createElement('div');
  titlebar.className = 'editor-titlebar';

  const dotTooltip = new Tooltip();

  /**
   * Creates a traffic-light dot that doubles as a back control.
   *
   * @param {string} colorClass Dot color class.
   * @param {string} label Accessible label and tooltip.
   * @param {Function} [onClick] Custom click action; defaults to returning to the banner.
   * @returns {HTMLButtonElement} Dot button element.
   */
  function makeBackDot(colorClass, label, onClick) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'editor-dot ' + colorClass + ' editor-dot-back';
    dot.setAttribute('aria-label', label);
    dot.addEventListener('click', function () {
      if (onClick) {
        onClick.call(this);
      } else {
        exitFullscreen();
        showBanner();
      }
      this.blur();
    });
    dotTooltip.attach(dot, label);
    return dot;
  }

  const redDot = makeBackDot('dot-red', 'Close and go back to mySpace', function () {
    window.location.href = '../../index.html';
  });
  const yellowDot = makeBackDot('dot-yellow', 'Back to banner');

  const greenDot = document.createElement('button');
  greenDot.type = 'button';
  greenDot.className = 'editor-dot dot-green editor-dot-back';
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
  dotTooltip.attach(greenDot, 'Toggle full screen');

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
  backBtn.setAttribute('aria-label', 'Back to banner');
  backBtn.addEventListener('click', function () {
    exitFullscreen();
    showBanner();
  });
  dotTooltip.attach(backBtn, 'Back to banner');
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

  editorWindow = { sidebar: sidebar, tree: tree, main: main, entries: [], activityBar: activityBar };
  return editorWindow;
}

/**
 * Maps long section/role labels to short folder names.
 */
const SHORT_NAMES = {
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

/**
 * Icon shown for directory tree files.
 */
const ICON_SRC = '../../Images/information-svgrepo-com.svg';

/**
 * Shortens an arbitrary label into a filename-safe slug.
 *
 * @param {string} label Label to shorten.
 * @returns {string} Slugged name, or the mapped short name when one exists.
 */
function shortName(label) {
  const clean = String(label || '').replace(/:$/, '');
  if (SHORT_NAMES[clean] !== undefined) return SHORT_NAMES[clean];
  const slug = clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const parts = slug.split('-').filter(Boolean);
  if (parts.length === 0) return 'file';
  return parts.slice(0, 2).join('-');
}

/**
 * Deactivates every folder header in the directory tree.
 */
function setActiveFolderHeader() {
  if (!editorWindow || !editorWindow.folders) return;
  editorWindow.folders.forEach(folder => {
    folder.__setActive(false);
  });
}

/**
 * Marks a single directory tree item as selected and highlights its parent folder.
 *
 * @param {HTMLElement} [item] Tree item to mark active, or null to clear all.
 */
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

/**
 * Shows one professional section and hides the others.
 *
 * @param {HTMLElement} sectionEl Section to reveal.
 * @param {HTMLElement} [item] Tree item to sync the selection to.
 */
function activateSection(sectionEl, item) {
  if (!editorWindow) return;
  if (editorWindow.sidebar) editorWindow.sidebar.classList.add('open');
  editorWindow.main.querySelectorAll('.pro-section').forEach(function (s) {
    s.style.display = 'none';
  });
  sectionEl.style.display = 'block';
  setActiveTreeItem(item);
  refreshModebarVisibility();
}

/**
 * Adds a file entry to the directory tree that activates a section on click.
 *
 * @param {string} title Display name for the entry.
 * @param {HTMLElement} sectionEl Section the entry opens.
 * @param {HTMLElement} [item] Existing tree item to reuse.
 * @returns {HTMLElement} The tree item element.
 */
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

/**
 * Groups directory entries under a collapsible folder in the tree.
 *
 * @param {string} name Folder label.
 * @param {HTMLElement} sectionEl Section the folder belongs to.
 * @param {Object[]} tabRefs Tab references to list inside the folder.
 */
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

  /**
   * Opens or closes the folder, optionally forcing a state.
   *
   * @param {boolean} [force] Desired open state when provided.
   * @returns {boolean} Whether the folder is now open.
   */
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

  /**
   * Sets whether the folder appears active and opens it when activated.
   *
   * @param {boolean} active Whether the folder should be marked active.
   */
  folder.__setActive = function (active) {
    header.classList.toggle('active', active);
    if (active) toggle(true);
  };

  editorWindow.folders = editorWindow.folders || [];
  editorWindow.folders.push(folder);
}

/**
 * Renders the full professional page from parsed CV data.
 *
 * @param {Object} data Structured CV from parseCV().
 */
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

  activateSection(expSection, exp.tabRefs[0] && exp.tabRefs[0].item);

  setupModebarPlacement();
}

/**
 * Builds a full-width professional section wrapper.
 *
 * @param {string} title Section title (used for the element id).
 * @param {Node} contentEl Content node to place inside the section.
 * @returns {HTMLDivElement} Section element ready to append.
 */
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

/**
 * Builds the experience panel with a tab bar, source/preview views, and preview toggle.
 *
 * @param {Object[]} jobs Parsed job entries.
 * @returns {Object} Panel wrapper, editor, and per-job tab refs.
 */
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

      /**
       * Returns the active bullet list, creating one when needed.
       *
       * @returns {HTMLUListElement} The current list element.
       */
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
          bullet.sub.forEach(sub => {
            const sl = document.createElement('li');
            sl.innerHTML = mdInline(sub);
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
          (bullet.sub || []).forEach(sub => lines.push('  - ' + sub));
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

/**
 * Builds the projects panel with a tab bar, source/preview views, and preview toggle.
 *
 * @param {Object[]} projects Parsed project entries.
 * @returns {Object} Panel wrapper, editor, and per-project tab refs.
 */
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

/**
 * Builds the skills panel with a tab, source/preview views, and preview toggle.
 *
 * @param {Object[]} categories Parsed skill categories.
 * @returns {Object} Panel wrapper, editor, and tab refs.
 */
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

/**
 * Creates the tabsbar / tabs / modebar / views skeleton for an editor panel.
 *
 * @param {HTMLElement} grid Element to attach the panel chrome to.
 * @returns {Object} References to the created regions.
 */
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

/**
 * Adds a Preview | Source toggle to an editor panel's modebar.
 *
 * @param {HTMLElement} panel The editor panel to style on toggle.
 * @param {HTMLElement} modebar The modebar to attach the buttons to.
 */
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

  /**
   * Switches the panel between preview and source rendering.
   *
   * @param {boolean} preview Whether to show preview mode.
   */
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

/**
 * Selects a tab within its editor panel and syncs the directory tree.
 *
 * @param {Object} editor Editor panel references.
 * @param {HTMLButtonElement} tab Tab to activate.
 * @param {HTMLElement} view View to show for the tab.
 */
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

/**
 * Wraps the 'j' characters in the banner heading and animates them as eyes that track the cursor.
 */
(function initBannerEyes() {
  const banner = document.querySelector('.launch-banner');
  const h1 = banner && banner.querySelector('h1');
  if (!h1) return;

  const text = h1.textContent;
  let wrapped = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] === 'j') {
      wrapped += '<span class="j-char">' + text[i] + '</span>';
    } else {
      wrapped += text[i];
    }
  }
  h1.innerHTML = wrapped;

  const chars = h1.querySelectorAll('.j-char');
  const eyes = [];

  const style = document.createElement('style');
  style.textContent =
    '@keyframes jLidBlink {' +
    '0%,88%,100%{transform:translateX(-50%) scaleY(0)}' +
    '92%{transform:translateX(-50%) scaleY(1)}' +
    '97%{transform:translateX(-50%) scaleY(0)}' +
    '}';
  document.head.appendChild(style);

  chars.forEach(function (ch) {
    const sclera = document.createElement('span');
    sclera.style.cssText =
      'position:absolute;background:var(--accentLight);border-radius:50%;pointer-events:none;z-index:9;' +
      'transform:translate(-50%,-50%);';
    h1.appendChild(sclera);

    const pupil = document.createElement('span');
    pupil.style.cssText =
      'position:absolute;background:var(--borderColor);border-radius:50%;pointer-events:none;z-index:10;' +
      'transform:translate(-50%,-50%);';
    h1.appendChild(pupil);

    const lid = document.createElement('span');
    lid.style.cssText =
      'position:absolute;background:var(--editorBg);border-radius:50%;pointer-events:none;z-index:11;' +
      'transform:translateX(-50%) scaleY(0);' +
      'transform-origin:top center;' +
      'animation:jLidBlink ' + (5000 / 1000) + 's infinite;';
    h1.appendChild(lid);
    eyes.push({ sclera: sclera, pupil: pupil, lid: lid, chEl: ch });
  });

  /**
   * Positions the eye elements over their host characters.
   */
  function positionEyes() {
    const h1Rect = h1.getBoundingClientRect();
    const fs = parseFloat(getComputedStyle(h1).fontSize);
    const scleraSize = Math.round(fs * 0.16);
    const pupilW = Math.round(scleraSize * 0.6);
    const pupilH = Math.round(scleraSize * 0.6);
    const maxDisp = (scleraSize - pupilW) / 2 - 1;

    eyes.forEach(function (eye) {
      eye.sclera.style.width = scleraSize + 'px';
      eye.sclera.style.height = scleraSize + 'px';
      eye.pupil.style.width = pupilW + 'px';
      eye.pupil.style.height = pupilH + 'px';
      eye.lid.style.width = scleraSize + 'px';
      eye.lid.style.height = scleraSize + 'px';
      eye.maxDisp = maxDisp;

      const r = eye.chEl.getBoundingClientRect();
      const dotX = r.left + r.width / 2 - h1Rect.left;
      const dotY = r.top + r.height * 0.22 - h1Rect.top;
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

  let rafId = null;

  banner.addEventListener('mousemove', function (e) {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      rafId = null;
      eyes.forEach(function (eye) {
        const r = eye.chEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.22;
        let dx = e.clientX - cx;
        let dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > eye.maxDisp) {
          dx = dx / dist * eye.maxDisp;
          dy = dy / dist * eye.maxDisp;
        }
        eye.pupil.style.transform = 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px))';
      });
    });
  });

  /**
   * Shows or hides the banner's eye elements.
   *
   * @param {boolean} visible Whether the eyes should be displayed.
   */
  banner.__setEyesVisible = function (visible) {
    eyes.forEach(function (eye) {
      eye.sclera.style.display = visible ? '' : 'none';
      eye.pupil.style.display = visible ? '' : 'none';
      eye.lid.style.display = visible ? '' : 'none';
    });
  };

  const launchBtn = document.getElementById('launch-btn');
  if (launchBtn) {
    launchBtn.addEventListener('click', function () {
      banner.__setEyesVisible(false);
    });
  }
})();

/**
 * Tracks the editor window and current mobile media query state.
 */
let editorWindow = null;
let MOBILE_MQ = null;

/**
 * Loads and renders the CV into the professional editor layout.
 */
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

MOBILE_MQ = window.matchMedia('(max-width: 720px)');
if (MOBILE_MQ.addEventListener) {
  MOBILE_MQ.addEventListener('change', function () {
    setupModebarPlacement();
  });
} else {
  MOBILE_MQ.addListener(function () {
    setupModebarPlacement();
  });
}

loadCV();

/**
 * Injects the profile strips and launch button behavior once, at load time.
 */
(function initLaunchBanner() {
  const profilesEl = document.getElementById('profiles-strip');
  if (profilesEl) {
    profilesEl.appendChild(buildProfilesStrip());
  }

  const bannerTooltip = new Tooltip();
  document.querySelectorAll('#banner-links a[data-tooltip]').forEach(function (link) {
    bannerTooltip.attach(link, link.getAttribute('data-tooltip') || '');
  });

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
})();