/**
 * Wires up the mobile menu drawer: toggles the header open from the right,
 * moves the shared footer into the drawer, and morphs the hamburger icon into
 * a back arrow. Requires the shared drawer styles from styles.css.
 *
 * @param {string} contentSelector Selector for the page's main content block.
 * @param {string} [restoreDisplay] Display value to restore on the content block.
 */
function initMenuToggle(contentSelector, restoreDisplay) {
  const defaultDisplay = restoreDisplay || 'block';
  const footer = document.querySelector('footer');
  const menuIcon = document.getElementById('menuIcon');
  const header = document.querySelector('header');
  const content = document.querySelector(contentSelector);
  const hamburgerIcon = menuIcon.innerHTML;

  /**
   * Closes the drawer, restores page content, swaps the hamburger icon back,
   * and returns the footer to the page body.
   */
  function closeDrawer() {
    header.classList.remove('is-open');
    menuIcon.classList.remove('is-open');
    menuIcon.innerHTML = hamburgerIcon;
    content.style.display = defaultDisplay;
    document.body.appendChild(footer);
  }

  /**
   * Moves the footer into the drawer, opens it, hides the page content, and
   * replaces the hamburger with a back arrow.
   */
  function openDrawer() {
    header.appendChild(footer);
    header.classList.add('is-open');
    menuIcon.classList.add('is-open');
    menuIcon.innerHTML = MENU_ARROW_ICON;
    content.style.display = 'none';
  }

  menuIcon.addEventListener('click', () => {
    const isMobile = window.matchMedia('(max-width: 720px)').matches;
    if (!isMobile) return;
    if (header.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  footer.addEventListener('click', () => {
    const studyDrawer = document.getElementById('study-drawer');
    if (studyDrawer && studyDrawer.classList.contains('is-open')) {
      studyDrawer.classList.remove('is-open');
      studyDrawer.setAttribute('aria-hidden', 'true');
      const overlay = document.getElementById('study-overlay');
      if (overlay) {
        overlay.classList.remove('is-visible');
        overlay.hidden = true;
      }
      document.body.style.overflow = '';
    }
    closeDrawer();
  });
}

/**
 * Escapes HTML-significant characters in a string.
 *
 * @param {*} value Value to escape; null/undefined become an empty string.
 * @returns {string} Escaped HTML-safe string.
 */
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

/**
 * Converts inline markdown (code, links, bold, italics) into safe HTML.
 *
 * @param {string} text Markdown source to render.
 * @returns {string} Rendered HTML.
 */
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

/**
 * Renders a markdown string to HTML using the vendored Marked library,
 * falling back to escaped plain text when Marked is unavailable.
 *
 * @param {string} markdown Markdown source to render.
 * @returns {string} Rendered HTML.
 */
function renderMarkdown(markdown) {
  if (typeof marked !== 'undefined') {
    return marked.parse(String(markdown || ''), { headerIds: false, mangle: false });
  }
  return escapeHtml(String(markdown || ''));
}

/**
 * Renders an inline markdown fragment to HTML using the vendored Marked
 * library, falling back to escaped plain text when Marked is unavailable.
 * Unlike renderMarkdown, no surrounding block element is emitted.
 *
 * @param {string} markdown Markdown inline source to render.
 * @returns {string} Rendered inline HTML.
 */
function renderInlineMarkdown(markdown) {
  if (typeof marked !== 'undefined') {
    return marked.parseInline(String(markdown || ''));
  }
  return escapeHtml(String(markdown || ''));
}

/**
 * Renders a list of markdown bullets (subheadings, items, and nested
 * sub-bullets) into a styled list, matching the work-experience layout
 * shared by the Resume page. Subheadings become heading list items,
 * regular bullets become list items, and sub-bullets nest inside them.
 *
 * @param {Object[]} bullets Parsed bullet entries with kind/text/sub fields.
 * @param {string} [subheadingClass] Class for subheading items.
 * @returns {HTMLUListElement} Completed list element ready to append.
 */
function renderMarkdownBullets(bullets, subheadingClass) {
  const list = document.createElement('ul');
  (bullets || []).forEach(bullet => {
    if (bullet.kind === 'heading') {
      const heading = document.createElement('li');
      heading.className = subheadingClass || 'resume-subheading';
      heading.innerHTML = renderMarkdown(bullet.text);
      list.appendChild(heading);
      return;
    }
    const listItem = document.createElement('li');
    listItem.innerHTML = renderMarkdown(bullet.text);
    if (bullet.sub && bullet.sub.length) {
      const subList = document.createElement('ul');
      bullet.sub.forEach(sub => {
        const subListItem = document.createElement('li');
        subListItem.innerHTML = renderMarkdown(sub);
        subList.appendChild(subListItem);
      });
      listItem.appendChild(subList);
    }
    list.appendChild(listItem);
  });
  return list;
}

/**
 * Builds and manages a collapsible page section: a heading paired with a
 * content area. Clicking the heading toggles it open or closed.
 *
 * @param {Object} [options] Section configuration.
 * @param {string} [options.title] Heading text.
 * @param {Node|string} [options.content] Content as a DOM node or HTML string.
 * @param {string} [options.className] Classes for the wrapper element.
 * @param {boolean} [options.expanded=false] Initial state of the section.
 * @param {boolean} [options.collapsible=true] Whether the heading toggles the content.
 */
class Section {
  constructor({ title = '', content = null, className = 'section', expanded = false, collapsible = true } = {}) {
    this.element = document.createElement('div');
    this.element.className = className;

    this.heading = document.createElement('h2');
    this.heading.className = 'section-heading' + (collapsible ? ' collapsible' : ' static');

    const titleEl = document.createElement('span');
    titleEl.className = 'title-text';
    titleEl.textContent = title;
    this.heading.appendChild(titleEl);

    if (collapsible) {
      this.icon = document.createElement('span');
      this.icon.className = 'toggle-icon';
      this.icon.textContent = '+';
      this.heading.appendChild(this.icon);
      this.heading.addEventListener('click', () => this.toggle());
    }

    this.content = document.createElement('div');
    this.content.className = 'section-content';
    if (content instanceof Node) {
      this.content.appendChild(content);
    } else if (content) {
      this.content.innerHTML = content;
    }

    this.element.appendChild(this.heading);
    this.element.appendChild(this.content);

    if (expanded) {
      this.expand();
    } else if (collapsible) {
      this.collapse();
    }
  }

  /**
   * Whether the section content is currently visible.
   *
   * @returns {boolean} True when expanded.
   */
  get isExpanded() {
    return this.content.style.display !== 'none';
  }

  /**
   * Expands the section, revealing its content.
   */
  expand() {
    this.content.style.display = '';
    if (this.icon) this.icon.textContent = '-';
    this.heading.classList.add('active');
  }

  /**
   * Collapses the section, hiding its content.
   */
  collapse() {
    this.content.style.display = 'none';
    if (this.icon) this.icon.textContent = '+';
    this.heading.classList.remove('active');
  }

  /**
   * Toggles the section between expanded and collapsed.
   */
  toggle() {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  /**
   * Appends the section to a parent element.
   *
   * @param {HTMLElement} parent Element to append to.
   * @returns {Section} This section, for chaining.
   */
  addTo(parent) {
    parent.appendChild(this.element);
    return this;
  }
}

/**
 * Builds a single blog post card DOM element for the post list view.
 *
 * @param {Object} post Parsed post with title, date, excerpt, banner, etc.
 * @param {number} index Index of the post in the posts array.
 * @param {function} [onClick] Optional click handler; default uses showPost(index).
 * @param {boolean} [includeBanner=false] Whether to show the post banner image.
 * @returns {HTMLDivElement} Card element ready to append.
 */
function renderPostCard(post, index, onClick, includeBanner) {
  const card = document.createElement('div');
  card.className = 'post-card card';
  card.id = 'post-' + index;
  card.style.margin = 'auto';

  if (onClick) {
    card.onclick = onClick;
  } else {
    card.onclick = () => showPost(index);
  }

  if (includeBanner && post.banner) {
    const image = document.createElement('img');
    image.className = 'latest-post-banner';
    image.src = post.banner;
    image.alt = post.title + ' banner';
    card.appendChild(image);
  }

  const titleHeading = document.createElement('h3');
  titleHeading.className = 'card-title';
  titleHeading.textContent = post.title;
  card.appendChild(titleHeading);

  const dateParagraph = document.createElement('p');
  dateParagraph.className = 'card-date';
  dateParagraph.textContent = post.date;
  card.appendChild(dateParagraph);

  const excerptParagraph = document.createElement('p');
  excerptParagraph.className = 'card-excerpt';
  excerptParagraph.textContent = post.excerpt;
  card.appendChild(excerptParagraph);

  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = '#post-' + index;
  link.target = '_self';
  link.textContent = 'Read more →';
  link.onclick = (event) => {
    event.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      showPost(index);
    }
  };
  card.appendChild(link);

  return card;
}

/**
 * Builds the full post view content as a DocumentFragment: banner image,
 * title, date, and rendered paragraph blocks.
 *
 * @param {Object} post Parsed post with title, date, banner, paragraphs.
 * @returns {DocumentFragment} Fragment ready to append into post-view.
 */
function renderPostContent(post) {
  const fragment = document.createDocumentFragment();

  if (post.banner) {
    const image = document.createElement('img');
    image.id = 'post-banner';
    image.src = post.banner;
    image.alt = post.title + ' banner';
    fragment.appendChild(image);
  }

  const titleHeading = document.createElement('h1');
  titleHeading.id = 'post-title';
  titleHeading.textContent = post.title;
  fragment.appendChild(titleHeading);

  const dateParagraph = document.createElement('p');
  dateParagraph.id = 'post-date';
  dateParagraph.textContent = post.date;
  fragment.appendChild(dateParagraph);

  const contentDiv = document.createElement('div');
  contentDiv.id = 'post-content';
  (post.paragraphs || []).forEach(paragraph => {
    const paragraphDiv = document.createElement('div');
    paragraphDiv.className = 'post-paragraph';
    paragraphDiv.innerHTML = renderMarkdown(paragraph);
    contentDiv.appendChild(paragraphDiv);
  });
  fragment.appendChild(contentDiv);

  return fragment;
}

/**
 * Extracts the `# title` and `**Key:** value` metadata from a markdown
 * document. The legacy `## Key: value` form is also recognized so that
 * content created by the quick-book skill keeps parsing.
 *
 * @param {string} text Raw markdown source.
 * @returns {Object} Map of lowercase metadata keys to trimmed values.
 */
function parsePostHeaders(text) {
  const meta = {};
  const lines = text.split('\n');
  for (const line of lines) {
    const titleMatch = line.match(/^# (.+)/);
    if (titleMatch) {
      meta.title = titleMatch[1].trim();
      continue;
    }
    const kvMatch = line.match(/^\*\*(\w+):\*\*\s*(.+)/);
    if (kvMatch) {
      meta[kvMatch[1].toLowerCase()] = kvMatch[2].trim();
      continue;
    }
    const legacyMatch = line.match(/^## (\w+):\s*(.+)/);
    if (legacyMatch) {
      meta[legacyMatch[1].toLowerCase()] = legacyMatch[2].trim();
    }
  }
  return meta;
}

/**
 * Extracts body paragraphs from the markdown source. Scans the leading
 * header block — the first `# title` line plus any `**Key:** value` (or
 * legacy `## Key:` value) metadata lines — and starts the body at the
 * first line that is neither part of the header nor blank; paragraphs are
 * separated by blank lines.
 *
 * @param {string} text Raw markdown source.
 * @returns {string[]} Paragraph bodies.
 */
function parsePostBody(text) {
  const lines = text.split('\n');
  let bodyStart = 0;
  let titleSeen = false;
  for (let index = 0; index < lines.length; index++) {
    const trimmed = lines[index].trim();
    if (trimmed === '') {
      bodyStart = index + 1;
      continue;
    }
    if (!titleSeen && trimmed.startsWith('# ')) {
      titleSeen = true;
      bodyStart = index + 1;
      continue;
    }
    const headerKeyMatch = trimmed.match(/^\*\*(\w+):\*\*|^## (\w+):/);
    if (headerKeyMatch) {
      bodyStart = index + 1;
      continue;
    }
    break;
  }
  const paragraphs = [];
  let current = [];
  for (let index = bodyStart; index < lines.length; index++) {
    const trimmed = lines[index].trim();
    if (trimmed === '') {
      if (current.length) {
        paragraphs.push(current.join(' '));
        current = [];
      }
    } else {
      current.push(trimmed);
    }
  }
  if (current.length) paragraphs.push(current.join(' '));
  return paragraphs;
}

/**
 * Converts a "Month YYYY" start date into a numerically sortable key (YYYYMM).
 *
 * @param {string} dateStr Start date string to parse.
 * @returns {number} Sortable key, or 0 when the date cannot be parsed.
 */
function parseStartSortKey(dateStr) {
  const match = String(dateStr || '').trim().match(/^([A-Za-z]+)\s+(\d{4})/);
  if (!match) return 0;
  const month = SORT_MONTHS[match[1].toLowerCase().slice(0, 3)];
  if (!month) return 0;
  return parseInt(match[2], 10) * 100 + month;
}

/**
 * Returns the index of the first non-blank line at or after `start`.
 *
 * @param {string[]} lines Source lines.
 * @param {number} start Line index to begin searching from.
 * @returns {number} Index of the next non-blank line.
 */
function nextNonBlank(lines, start) {
  let index = start;
  while (index < lines.length && lines[index].trim() === '') index++;
  return index;
}

/**
 * Collects lines from `start` until the next `## ` section heading.
 *
 * @param {string[]} lines Source lines.
 * @param {number} start Line index to begin collecting from.
 * @returns {string[]} Lines belonging to the current section.
 */
function sectionLines(lines, start) {
  const result = [];
  let index = start;
  while (index < lines.length && !lines[index].startsWith('## ')) {
    result.push(lines[index]);
    index++;
  }
  return result;
}

/**
 * Splits a single skill entry into its name and one-line description.
 *
 * @param {string} item Skill entry in "Name — description" form.
 * @returns {Object} Object with the skill name and description.
 */
function parseSkillItem(item) {
  const parts = item.split(' — ');
  return { name: parts[0].trim(), description: (parts[1] || '').trim() };
}

/**
 * Parses the canonical `src/cv.md` into a structured resume object.
 *
 * @param {string} text Raw CV markdown source.
 * @returns {Object} Structured CV with contact, summary, experience, projects, education, and skills.
 */
function parseCV(text) {
  const lines = text.split('\n');
  const data = { contact: {}, summary: '', experience: [], projects: [], education: [], skills: [] };
  const fields = { Location: 'location', Email: 'email', LinkedIn: 'linkedin', Portfolio: 'portfolio', GitHub: 'github' };

  let index = 0;
  while (index < lines.length && !lines[index].startsWith('## ')) {
    const line = lines[index].trim();
    for (const [key, field] of Object.entries(fields)) {
      if (line.startsWith('**' + key + ':**')) {
        data.contact[field] = line.split('**' + key + ':**')[1].trim();
      }
    }
    index++;
  }

  while (index < lines.length) {
    const section = lines[index].replace(/^## /, '').trim();

    if (section === 'Professional Summary') {
      index = nextNonBlank(lines, index + 1);
      const summaryLines = sectionLines(lines, index);
      data.summary = summaryLines.filter(line => line.trim()).join(' ');
      index += summaryLines.length;
      continue;
    }

    if (section === 'Work Experience') {
      const block = sectionLines(lines, index + 1);
      let job = null;
      for (const line of block) {
        if (line.startsWith('### ')) {
          if (job) data.experience.push(job);
          job = { company: line.replace(/^### /, '').trim(), role: '', date: '', banner: '', readMore: null, bullets: [] };
        } else if (job) {
          const trimmed = line.trim();
          if (trimmed === '') continue;
          if (trimmed.startsWith('**') && trimmed.endsWith('**') && !job.role) {
            job.role = trimmed.slice(2, -2);
          } else if (/^#{3,6}\s/.test(trimmed)) {
            job.bullets.push({ kind: 'heading', level: trimmed.match(/^#+/)[0].length, text: trimmed.replace(/^#+\s*/, '') });
          } else if (/^[-+*]\s/.test(trimmed) && line !== trimmed) {
            const last = job.bullets[job.bullets.length - 1];
            if (last && last.kind === 'bullet') {
              last.sub.push(trimmed.replace(/^[-+*]\s*/, ''));
            }
          } else if (trimmed.startsWith('- ')) {
            job.bullets.push({ kind: 'bullet', text: trimmed.slice(2), sub: [] });
          } else if (/^>\s*\[([^\]]+)\]\(([^)]+)\)/.test(trimmed)) {
            const match = trimmed.match(/^>\s*\[([^\]]+)\]\(([^)]+)\)/);
            job.readMore = { label: match[1], url: match[2] };
          } else if (/^!\[[^\]]*\]\(([^)]+)\)/.test(trimmed)) {
            const match = trimmed.match(/^!\[[^\]]*\]\(([^)]+)\)/);
            job.banner = match[1].trim();
          } else if (trimmed && !job.date) {
            job.date = trimmed;
            job.sortKey = parseStartSortKey(trimmed);
          }
        }
      }
      if (job) data.experience.push(job);
      index += block.length;
      continue;
    }

    if (section === 'Projects') {
      const block = sectionLines(lines, index + 1);
      let project = null;
      for (const line of block) {
        const trimmed = line.trim();
        if (/^>\s*\[([^\]]+)\]\(([^)]+)\)/.test(trimmed)) {
          const match = trimmed.match(/^>\s*\[([^\]]+)\]\(([^)]+)\)/);
          if (project) project.readMore = { label: match[1], url: match[2] };
          continue;
        }
        if (/^!\[[^\]]*\]\(([^)]+)\)/.test(trimmed)) {
          const match = trimmed.match(/^!\[[^\]]*\]\(([^)]+)\)/);
          if (project) project.banner = match[1].trim();
          continue;
        }
        if (!trimmed.startsWith('- ')) continue;
        const content = trimmed.slice(2);
        const name = content.split('**')[1] || '';
        const afterName = content.split(')')[0] || '';
        const tag = afterName.split('(')[1] || '';
        const description = content.split('--')[1] || '';
        project = { name: name.trim(), tag: tag.trim(), description: description.trim(), banner: '', readMore: null };
        data.projects.push(project);
      }
      index += block.length;
      continue;
    }

    if (section === 'Education') {
      const block = sectionLines(lines, index + 1);
      for (const line of block) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('- ')) continue;
        const content = trimmed.slice(2);
        const degree = content.split(',')[0].trim();
        const remaining = content.split(',')[1] || '';
        const school = remaining.split('(')[0].trim();
        const cgpa = remaining.includes('(') ? remaining.split('(')[1].split(')')[0].trim() : '';
        const dates = remaining.includes(')') ? remaining.split(')')[1].trim() : '';
        data.education.push({ degree, school, cgpa, dates });
      }
      index += block.length;
      continue;
    }

    if (section === 'Skills') {
      const block = sectionLines(lines, index + 1);
      for (const line of block) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('- ')) continue;
        const content = trimmed.slice(2);
        const category = (content.split('**')[1] || '').replace(/:$/, '');
        const items = (content.split(':**')[1] || '').split(',').map(item => item.trim());
        data.skills.push({ category, items });
      }
      index += block.length;
      continue;
    }

    index++;
  }

  return data;
}

/**
 * Initializes the bottom-right font switcher: restores the saved theme
 * and wires up the toggle plus selection handlers.
 */
function initFontSwitcher() {
  const toggle = document.getElementById('font-switcher-toggle');
  const menu = document.getElementById('font-switcher-menu');
  if (!toggle || !menu) return;

  const saved = localStorage.getItem('font-theme');
  if (saved && FONT_THEMES.includes(saved)) {
    document.body.dataset.fontTheme = saved;
  }
  updateThemeButtons();

  toggle.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });

  menu.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-font-theme]');
    if (!button) return;
    document.body.dataset.fontTheme = button.dataset.fontTheme;
    localStorage.setItem('font-theme', button.dataset.fontTheme);
    updateThemeButtons();
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Highlights the active theme option in the switcher menu.
 */
function updateThemeButtons() {
  const active = document.body.dataset.fontTheme || 'default';
  document.querySelectorAll('#font-switcher-menu button[data-font-theme]').forEach(button => {
    button.classList.toggle('active', button.dataset.fontTheme === active);
  });
}

/**
 * Shared floating tooltip backed by a single element appended to the body.
 * Positions itself near an attached anchor, staying inside the viewport,
 * and toggles on hover and tap.
 */
class Tooltip {
  /**
   * Creates the tooltip element (reusing an existing one) and closes it on
   * outside clicks.
   */
  constructor() {
    this.element = document.querySelector('.tooltip');
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.className = 'tooltip';
      this.element.setAttribute('role', 'tooltip');
      this.element.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.element);
    }
    this.anchor = null;

    document.addEventListener('click', (event) => {
      if (this.isVisible && !(this.anchor && this.anchor.contains(event.target))) {
        this.hide();
      }
    });
  }

  /**
   * Whether the tooltip is currently visible.
   *
   * @returns {boolean} True when visible.
   */
  get isVisible() {
    return this.element.style.display !== 'none';
  }

  /**
   * Positions the tooltip next to an anchor, staying inside the viewport.
   *
   * @param {HTMLElement} anchor Element to position the tooltip near.
   */
  position(anchor) {
    const rect = anchor.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - this.element.offsetWidth / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - this.element.offsetWidth - 8));
    let top = rect.bottom + 10;
    if (top + this.element.offsetHeight > window.innerHeight - 8) {
      top = rect.top - this.element.offsetHeight - 10;
    }
    this.element.style.left = left + 'px';
    this.element.style.top = top + 'px';
  }

  /**
   * Sets the tooltip content from a trusted HTML string or DOM node.
   *
   * @param {string|Node} content Content to display.
   */
  setContent(content) {
    if (content instanceof Node) {
      this.element.innerHTML = '';
      this.element.appendChild(content);
    } else {
      this.element.innerHTML = String(content);
    }
  }

  /**
   * Shows the tooltip near the given anchor with the given content.
   *
   * @param {string|Node} content Content to display.
   * @param {HTMLElement} anchor Element to position the tooltip near.
   */
  show(content, anchor) {
    this.anchor = anchor;
    this.setContent(content);
    this.element.style.display = 'block';
    this.element.setAttribute('aria-hidden', 'false');
    this.element.style.opacity = '0';
    this.position(anchor);
    requestAnimationFrame(() => {
      this.element.style.opacity = '1';
    });
  }

  /**
   * Hides the tooltip.
   */
  hide() {
    this.element.style.display = 'none';
    this.element.setAttribute('aria-hidden', 'true');
  }

  /**
   * Shows on hover, toggles on tap, and closes on outside clicks.
   *
   * @param {HTMLElement} anchor Element that triggers the tooltip.
   * @param {string|Node} content Content to show near the anchor.
   */
  attach(anchor, content) {
    if (!IS_TOUCH_TAP) {
      anchor.addEventListener('mouseenter', () => this.show(content, anchor));
      anchor.addEventListener('mouseleave', () => this.hide());
    }
    anchor.addEventListener('click', (event) => {
      event.stopPropagation();
      if (this.isVisible) {
        this.hide();
      } else {
        this.show(content, anchor);
      }
    });
  }
}

/**
 * Builds the scrolling profile strip with hover tooltips.
 *
 * @returns {HTMLDivElement} The completed strip element.
 */
function buildProfilesStrip() {
  const strip = document.createElement('div');
  strip.className = 'profiles-strip';
  const tooltip = new Tooltip();

  /**
   * Builds a single marquee group of profile items.
   *
   * @returns {HTMLDivElement} The completed group element.
   */
  function buildProfile() {
    const group = document.createElement('div');
    group.className = 'profiles-group';
    PROFILES.forEach(function (profile) {
      const item = document.createElement('span');
      item.className = 'profiles-item';
      item.textContent = profile;
      const separator = document.createElement('span');
      separator.className = 'profiles-sep';
      separator.textContent = '\u2022';
      item.appendChild(separator);
      group.appendChild(item);

      tooltip.attach(item, PROFILE_INFO[profile] || profile);
    });
    return group;
  }

  strip.appendChild(buildProfile());
  strip.appendChild(buildProfile());
  return strip;
}

/**
 * Builds the shared site footer with the social links and attached tooltips.
 *
 * @returns {HTMLElement} The completed footer element.
 */
function buildSiteFooter() {
  const footer = document.createElement('footer');
  const list = document.createElement('ul');
  list.id = 'footer_nav';
  const tooltip = new Tooltip();

  /**
   * Appends one social link to the footer navigation list.
   *
   * @param {Object} link Link config with label, href, and svg markup.
   */
  FOOTER_LINKS.forEach(function (link) {
    const item = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.setAttribute('data-tooltip', link.label);
    anchor.innerHTML = link.svg;
    item.appendChild(anchor);
    list.appendChild(item);
    tooltip.attach(anchor, link.label);
  });

  footer.appendChild(list);
  return footer;
}

/**
 * Replaces the footer placeholder with the built shared footer, falling back
 * to appending it to the page body when no placeholder exists.
 */
function initSiteFooter() {
  const holder = document.getElementById('site-footer');
  const footer = buildSiteFooter();
  if (holder) {
    holder.replaceWith(footer);
  } else {
    document.body.appendChild(footer);
  }
}

/**
 * Applies the shared `.tapped` class in place of `:hover` on touch devices so
 * users get one-tap feedback instead of sticky-hover double-tap friction.
 * Underline-style effects persist until the next tap; everything else flashes
 * only while the finger is down; the home signature replays its draw each tap.
 */
function initTouchInteraction() {
  if (!IS_TOUCH_TAP) return;

  let tappedPersistent = null;
  let tappedMomentary = null;

  /**
   * Clears the currently persisted tapped element, if any.
   */
  function clearPersistent() {
    if (tappedPersistent) {
      tappedPersistent.classList.remove('tapped');
      tappedPersistent = null;
    }
  }

  /**
   * Whether the touched element lives inside a transient overlay (mobile menu
   * drawer or study drawer), where persisted tap styles would leak.
   *
   * @param {HTMLElement} element Element to test.
   * @returns {boolean} True when inside an overlay drawer.
   */
  function isInsideOverlay(element) {
    return !!(element.closest('.study-drawer') || element.closest('header.is-open'));
  }

  /**
   * Restarts the signature draw animation by toggling the tapped class and
   * removing it once the stroke finishes drawing.
   *
   * @param {HTMLElement} signatureElement The signature SVG element.
   */
  function replaySignature(signatureElement) {
    signatureElement.classList.remove('tapped');
    void signatureElement.offsetWidth;
    signatureElement.classList.add('tapped');
    signatureElement.addEventListener('animationend', () => {
      signatureElement.classList.remove('tapped');
    }, { once: true });
  }

  /**
   * Applies tap feedback for the touched element, or clears persisted taps
   * when neither a persistent nor momentary target matched.
   *
   * @param {Event} event The touchstart event.
   */
  function handleTapStart(event) {
    const persistent = !isInsideOverlay(event.target)
      ? event.target.closest(TAPPED_PERSISTENT_SELECTOR)
      : null;
    if (persistent) {
      clearPersistent();
      persistent.classList.add('tapped');
      tappedPersistent = persistent;
      return;
    }

    tappedMomentary = event.target.closest(TAPPED_MOMENTARY_SELECTOR);
    clearPersistent();
    if (tappedMomentary) {
      if (tappedMomentary.id === 'signature') {
        replaySignature(tappedMomentary);
        tappedMomentary = null;
      } else {
        tappedMomentary.classList.add('tapped');
      }
    }
  }

  /**
   * Removes the momentary tapped class once the finger lifts, leaving any
   * persisted underline effect in place.
   */
  function handleTapEnd() {
    if (tappedMomentary) {
      tappedMomentary.classList.remove('tapped');
      tappedMomentary = null;
    }
  }

  document.addEventListener('touchstart', handleTapStart, { passive: true });
  document.addEventListener('touchend', handleTapEnd, { passive: true });
  document.addEventListener('touchcancel', handleTapEnd, { passive: true });
}

/**
 * Fetches JSON with a localStorage cache, storing each URL for CACHE_TTL
 * milliseconds. On network or rate-limit failure, falls back to the last
 * cached copy so widgets still render instead of showing error states.
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
  const rawBase = GITHUB_RAW_BASE + '/' + repoFullName + '/' + branch + '/';
  return rawBase + source.replace(/^\/+/, '');
}

/**
 * Reads the author date from a commit search result item.
 *
 * @param {Object} commitItem A single commit search result item.
 * @returns {string|null} ISO author date, or null when absent.
 */
function getCommitAuthorDate(commitItem) {
  const date = commitItem && commitItem.commit && commitItem.commit.author && commitItem.commit.author.date;
  return date || null;
}

/**
 * Offsets a YYYY-MM month key by a number of months (negative for past months).
 *
 * @param {string} monthKey The YYYY-MM key to offset.
 * @param {number} monthOffset Signed number of months to shift.
 * @returns {string} The shifted YYYY-MM key.
 */
function offsetMonthKey(monthKey, monthOffset) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1 + monthOffset, 1);
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
}

/**
 * Tells whether the collected commits already span the chart's trailing
 * window, so no further result pages are needed.
 *
 * @param {Object[]} commits Collected commits, newest first.
 * @param {string} windowStartKey The earliest YYYY-MM key the chart shows.
 * @returns {boolean} True when the oldest commit predates the window start.
 */
function commitsCoverChartWindow(commits, windowStartKey) {
  const oldestDate = getCommitAuthorDate(commits[commits.length - 1]);
  if (!oldestDate) return true;
  return oldestDate.slice(0, 7) <= windowStartKey;
}

/**
 * Fetches a single repository's commit history via the GitHub commits
 * API, walking result pages (newest first) only until the accumulated
 * commits cover the chart's trailing window. The endpoint returns every
 * commit on the repo, regardless of author. A single failed continuation
 * page is treated as the end of history so partial data still renders
 * instead of dropping to the fallback.
 *
 * @param {string} repoFullName Owner/repo identifier whose commits to chart.
 * @returns {Promise<Object[]>} Flat list of unique commit objects, newest first.
 */
async function fetchCommitHistory(repoFullName) {
  const commits = [];
  const seenShas = new Set();
  let chartWindowStartKey = null;

  for (let page = 1; page <= MAX_GITHUB_PAGES; page++) {
    if (chartWindowStartKey && commitsCoverChartWindow(commits, chartWindowStartKey)) {
      break;
    }
    let data = null;
    try {
      data = await cachedFetch(GITHUB_API_BASE + '/repos/' + repoFullName + '/commits?per_page=100&page=' + page);
    } catch (error) {
      if (commits.length === 0) throw error;
      console.error('Commit history page error:', error);
      break;
    }
    if (!Array.isArray(data) || data.length === 0) break;
    if (!chartWindowStartKey) {
      const latestDate = getCommitAuthorDate(data[0]);
      if (latestDate) {
        chartWindowStartKey = offsetMonthKey(latestDate.slice(0, 7), -(COMMIT_CHART_MONTHS - 1));
      }
    }
    data.forEach(commit => {
      if (!seenShas.has(commit.sha)) {
        seenShas.add(commit.sha);
        commits.push(commit);
      }
    });
    commits.sort((firstCommit, secondCommit) => {
      const firstDate = getCommitAuthorDate(firstCommit) || '';
      const secondDate = getCommitAuthorDate(secondCommit) || '';
      return secondDate.localeCompare(firstDate);
    });
    if (data.length < 100) break;
  }
  if (commits.length === 0) throw new Error('No commits');
  return commits;
}

/**
 * Fetches a single repository's issue history via the GitHub issues API,
 * walking result pages until exhausted or the page cap is reached. Pull
 * requests are filtered out so only true issues are counted.
 *
 * @param {string} repoFullName Owner/repo identifier whose issues to read.
 * @returns {Promise<Object[]>} Flat list of created/closed date records.
 */
async function fetchIssueHistory(repoFullName) {
  const issues = [];
  const seenNumbers = new Set();

  for (let page = 1; page <= MAX_GITHUB_PAGES; page++) {
    let data = null;
    try {
      data = await cachedFetch(GITHUB_API_BASE + '/repos/' + repoFullName + '/issues?state=all&per_page=100&page=' + page);
    } catch (error) {
      if (issues.length === 0) throw error;
      console.error('Issue history page error:', error);
      break;
    }
    if (!Array.isArray(data) || data.length === 0) break;
    data.forEach(item => {
      if (item && item.pull_request) return;
      if (!item || seenNumbers.has(item.number)) return;
      seenNumbers.add(item.number);
      issues.push({
        createdAt: item.created_at || null,
        closedAt: item.closed_at || null
      });
    });
    if (data.length < 100) break;
  }
  return issues;
}

/**
 * Fetches the currently open issues for a single repository via the GitHub
 * issues API, walking result pages until exhausted or the page cap is reached.
 * Pull requests are filtered out so only true issues are counted.
 *
 * @param {string} repoFullName Owner/repo identifier whose open issues to read.
 * @returns {Promise<Object[]>} Flat list of creation-date records for open issues.
 */
async function fetchOpenIssues(repoFullName) {
  const issues = [];
  const seenNumbers = new Set();

  for (let page = 1; page <= MAX_GITHUB_PAGES; page++) {
    let data = null;
    try {
      data = await cachedFetch(GITHUB_API_BASE + '/repos/' + repoFullName + '/issues?state=open&per_page=100&page=' + page);
    } catch (error) {
      if (issues.length === 0) throw error;
      console.error('Open issues page error:', error);
      break;
    }
    if (!Array.isArray(data) || data.length === 0) break;
    data.forEach(item => {
      if (item && item.pull_request) return;
      if (!item || seenNumbers.has(item.number)) return;
      seenNumbers.add(item.number);
      issues.push({
        createdAt: item.created_at || null
      });
    });
    if (data.length < 100) break;
  }
  return issues;
}

/**
 * Fetches a banner image and returns it as a base64 data URL, reusing a
 * localStorage cache so repeat visits render instantly. Falls back to a
 * direct fetch when the image is CORS-blocked or the download fails.
 *
 * @param {string} url Absolute banner image URL.
 * @returns {Promise<string>} Base64 data URL for the image.
 */
async function fetchCachedBannerDataUrl(url) {
  if (url.startsWith('data:')) return url;

  const cacheKey = 'banner_cache_' + url;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (typeof parsed.cachedAt === 'number' && Date.now() - parsed.cachedAt < CACHE_TTL) return parsed.dataUrl;
    } catch (error) {
      console.error('Banner cache read failed:', error);
    }
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const blob = await response.blob();
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ dataUrl, cachedAt: Date.now() }));
  } catch (error) {
    console.error('Banner cache write failed:', error);
  }
  return dataUrl;
}

/**
 * Warms the MySpace data caches from the home page so that section renders
 * instantly on the user's first visit. Fetches the featured repo, its README
 * banner image, commit history, and LeetCode data into localStorage. Failures
 * are logged and never block page rendering.
 */
async function prefetchMyspaceData() {
  try {
    for (const repoFullName of CURRENT_PROJECT_REPOS) {
      try {
        const repo = await cachedFetch(GITHUB_API_BASE + '/repos/' + repoFullName);
        if (!repo || !repo.name) throw new Error('Repo not found');
        const branch = repo.default_branch || 'main';

        try {
          const readmeData = await cachedFetch(GITHUB_API_BASE + '/repos/' + repoFullName + '/readme');
          if (readmeData && readmeData.content) {
            const readmeBytes = Uint8Array.from(atob(readmeData.content), character => character.charCodeAt(0));
            const readmeText = new TextDecoder('utf-8').decode(readmeBytes).replace(/\r\n/g, '\n');
            const bannerUrl = parseProjectBanner(readmeText, repoFullName, branch);
            if (bannerUrl) await fetchCachedBannerDataUrl(bannerUrl);
          }
        } catch (error) {
          console.error('Prefetch README error:', error);
        }

        await fetchCommitHistory(repoFullName);
        await fetchOpenIssues(repoFullName);
        await fetchIssueHistory(repoFullName);
        break;
      } catch (error) {
        console.error('Prefetch current project error:', error);
      }
    }
  } catch (error) {
    console.error('Prefetch myspace data error:', error);
  }

  try {
    await cachedFetch(LEETCODE_STATS_BASE);
  } catch (error) {
    console.error('Prefetch LeetCode stats error:', error);
  }
  try {
    await cachedFetch(LEETCODE_HEATMAP_URL);
  } catch (error) {
    console.error('Prefetch LeetCode activity error:', error);
  }
  try {
    await cachedFetch(LEETCODE_SUBMISSIONS_URL);
  } catch (error) {
    console.error('Prefetch LeetCode submissions error:', error);
  }
}

initSiteFooter();
initFontSwitcher();
initTouchInteraction();

if (document.getElementById('home-container')) {
  prefetchMyspaceData();
}
