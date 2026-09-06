/**
 * Wires up the mobile menu toggle between a hidden header and the compact footer view.
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

  menuIcon.addEventListener('click', () => {
    menuIcon.style.display = 'none';
    header.style.display = 'block';
    content.style.display = 'none';
    footer.style.height = '10vh';
    footer.style.bottom = '1%';
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
    menuIcon.style.display = 'block';
    footer.style.height = '18vh';
    footer.style.bottom = '4%';
    header.style.display = 'none';
    content.style.display = defaultDisplay;
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
 */
class Section {
  constructor({ title = '', content = null, className = 'section', expanded = false } = {}) {
    this.element = document.createElement('div');
    this.element.className = className;

    this.heading = document.createElement('h2');
    this.heading.className = 'section-heading collapsible';

    const titleEl = document.createElement('span');
    titleEl.className = 'title-text';
    titleEl.textContent = title;
    this.heading.appendChild(titleEl);

    this.icon = document.createElement('span');
    this.icon.className = 'toggle-icon';
    this.heading.appendChild(this.icon);
    this.heading.addEventListener('click', () => this.toggle());

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
    } else {
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
    this.icon.textContent = '-';
    this.heading.classList.add('active');
  }

  /**
   * Collapses the section, hiding its content.
   */
  collapse() {
    this.content.style.display = 'none';
    this.icon.textContent = '+';
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
 * Month lookup used to build sortable keys from "Month YYYY" dates.
 */
const SORT_MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

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
 * Font themes selectable in the switcher, keyed by the data attribute value.
 */
const fontThemes = ['default', 'sans', 'ebook', 'scholarly'];

/**
 * Initializes the bottom-right font switcher: restores the saved theme
 * and wires up the toggle plus selection handlers.
 */
function initFontSwitcher() {
  const toggle = document.getElementById('font-switcher-toggle');
  const menu = document.getElementById('font-switcher-menu');
  if (!toggle || !menu) return;

  const saved = localStorage.getItem('font-theme');
  if (saved && fontThemes.includes(saved)) {
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
 * Profile headlines shown in the scrolling profile strip.
 */
const PROFILES = [
  'Full Stack Developer',
  'AI Developer',
  'Forward Deployed Engineer',
  'DevSecOps Engineer',
  'IAM/PAM Analyst'
];

/**
 * Tooltip copy shown when hovering each profile headline.
 */
const PROFILE_INFO = {
  'Full Stack Developer': 'I\u2019ve spent 4+ years building enterprise-scale applications end-to-end \u2014 Next.js, ExpressJS, and SpringBoot backed by MongoDB and Redis, from API-heavy features to data analytics platforms like DDPX.',
  'AI Developer': 'I\u2019ve built AI agents and workflows in production \u2014 autonomous GitHub agentic workflows that review PRs and update docs, LangChain high/low-code agents, and an NLTK/Spacy agent that identifies owners of IAM principals.',
  'Forward Deployed Engineer': 'I\u2019ve delivered directly on client engagements \u2014 turning identity-data requirements into shipped features, scaling bulk imports from 100K to 400K records and ingestion to 1,500 records/sec, and analyzing 100,000+ records across domains.',
  'DevSecOps Engineer': 'I\u2019ve automated PR-triggered CI/CD on GitHub Actions with secure guardrails \u2014 review, lint, documentation, testing, and quality-gate checks that run automatically before data reaches production.',
  'IAM/PAM Analyst': 'I\u2019ve worked hands-on across identity and access management \u2014 designing RBAC in Java, setting up SAML SSO with Okta and AWS Cognito, mapping SailPoint/Okta/PingFederate data, and building analytics for orphan groups and privileged entitlements with 95% ownership accuracy.'
};

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
    anchor.addEventListener('mouseenter', () => this.show(content, anchor));
    anchor.addEventListener('mouseleave', () => this.hide());
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
 * Social links rendered in the shared site footer, mirroring the
 * banner-links block found on the Professional page.
 */
const FOOTER_LINKS = [
  { label: 'Email', href: 'mailto:ujjwalv99@protonmail.com', svg: '<svg class="link-svg" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="link-bg" width="36" height="36" fill="#1e1e1e"/><path class="link-path" d="M32.8359 4.28906H3.16406C1.42158 4.28906 0 5.70909 0 7.45312V28.5469C0 30.285 1.41525 31.7109 3.16406 31.7109H32.8359C34.5741 31.7109 36 30.2957 36 28.5469V7.45312C36 5.715 34.5847 4.28906 32.8359 4.28906ZM32.399 6.39844L18.0671 20.7304L3.61118 6.39844H32.399ZM2.10938 28.1101V7.87985L12.2681 17.9514L2.10938 28.1101ZM3.60091 29.6016L13.766 19.4365L17.3278 22.9677C17.7401 23.3765 18.4055 23.3752 18.8161 22.9645L22.2891 19.4915L32.3991 29.6016H3.60091ZM33.8906 28.11L23.7806 18L33.8906 7.88991V28.11Z"/></svg>' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ujjwal-verma99/', svg: '<svg class="link-svg" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="link-bg" width="36" height="36" fill="#1e1e1e"/><path class="link-path" d="M11.2505 29.7422H6.32867V13.8516H11.2505V29.7422ZM11.7416 8.78879C11.7416 7.19769 10.4507 5.90625 8.86047 5.90625C7.26416 5.90625 5.97656 7.19769 5.97656 8.78879C5.97656 10.3804 7.26416 11.6719 8.86047 11.6719C10.4507 11.6719 11.7416 10.3804 11.7416 8.78879ZM29.6719 20.9998C29.6719 16.7341 28.7707 13.5703 23.7876 13.5703C21.3931 13.5703 19.7858 14.7678 19.1297 16.0131H19.125V13.8516H14.3438V29.7422H19.125V21.8524C19.125 19.7861 19.651 17.7844 22.2122 17.7844C24.7385 17.7844 24.8203 20.1473 24.8203 21.9836V29.7422H29.6719V20.9998ZM36 31.7812V4.21875C36 1.8924 34.1076 0 31.7812 0H4.21875C1.8924 0 0 1.8924 0 4.21875V31.7812C0 34.1076 1.8924 36 4.21875 36H31.7812C34.1076 36 36 34.1076 36 31.7812V31.7812ZM31.7812 2.8125C32.5566 2.8125 33.1875 3.44339 33.1875 4.21875V31.7812C33.1875 32.5566 32.5566 33.1875 31.7812 33.1875H4.21875C3.44339 33.1875 2.8125 32.5566 2.8125 31.7812V4.21875C2.8125 3.44339 3.44339 2.8125 4.21875 2.8125H31.7812Z"/></svg>' },
  { label: 'GitHub', href: 'https://github.com/ujjuboi', svg: '<svg class="link-svg" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect class="link-bg" width="36" height="36" fill="#1e1e1e"/><path class="link-path" d="M18 0C8.10709 0 0 8.1774 0 18.0703C0 27.9058 8.0332 36 18 36C27.9544 36 36 27.9179 36 18.0703C36 8.1774 27.8929 0 18 0ZM21.1641 33.5742C20.1517 33.7852 19.0758 33.8906 18 33.8906C16.9242 33.8906 15.8483 33.7852 14.8359 33.5742V28.6383C14.8359 27.457 15.1523 27.0352 15.5742 26.4655C15.789 26.22 15.9186 25.9997 16.8819 24.5462L15.2578 24.293C11.0811 23.6813 9.43588 21.5085 8.78192 19.821C7.93817 17.5641 8.3812 14.7373 9.90005 12.9446C10.1321 12.6703 10.3219 12.2061 10.1533 11.721C9.83661 10.7507 9.87891 9.21094 10.0898 8.62015C11.2083 8.78 12.3582 9.58118 13.3174 10.1602C13.7593 10.4181 13.9911 10.3499 14.2031 10.3711C14.9738 10.2107 16.176 9.8226 18.0211 9.8226C19.1602 9.8226 20.3626 9.99124 21.5439 10.3288C21.7551 10.3239 22.0946 10.5035 22.6829 10.1602C23.6854 9.54932 24.7964 8.7756 25.9102 8.62015C26.1211 9.21094 26.1634 10.7507 25.847 11.721C25.6781 12.2061 25.8679 12.6703 26.1002 12.9446C27.6188 14.7376 28.0618 17.5641 27.2181 19.821C26.5641 21.5085 24.9189 23.6813 20.7422 24.293L19.1181 24.5462C20.1138 26.0486 20.2187 26.2288 20.4261 26.4655C20.8477 27.0352 21.1641 27.457 21.1641 28.6383V33.5742ZM23.2734 32.9626V28.6383C23.2734 27.4359 23.0202 26.6344 22.6826 26.0436C25.889 25.179 28.1673 23.2803 29.1797 20.5593C30.2555 17.6907 29.7705 14.2734 27.9772 11.9108C28.2939 10.4977 28.2939 8.24057 27.5345 7.18588C27.1969 6.72198 26.7328 6.46875 26.1422 6.46875C26.1211 6.46875 26.1211 6.46875 26.1211 6.46875C24.4855 6.55719 23.1982 7.38089 21.818 8.21942C20.5524 7.88187 19.2656 7.71323 17.9789 7.71323C16.6712 7.71323 15.3633 7.90302 14.2034 8.21942C12.7505 7.34326 11.4755 6.55499 9.79459 6.46875C9.26724 6.46875 8.80307 6.72198 8.46552 7.18588C7.70636 8.24057 7.70636 10.4977 8.02277 11.9108C6.22952 14.2734 5.74448 17.7116 6.82031 20.5593C7.8327 23.2803 10.111 25.179 13.3174 26.0436C13.0556 26.5015 12.8485 27.0923 12.7669 27.8918C12.1193 28.1151 11.5576 28.1879 11.0352 28.0344C10.4843 27.8715 10.055 27.5037 9.68198 26.8764C8.84427 25.4691 7.41742 24.3202 5.79282 24.4696L5.97821 26.5707C6.7305 26.5018 7.47922 27.2977 7.86813 27.9539C8.50974 29.0344 9.37408 29.743 10.4378 30.0572C11.2275 30.2899 11.9493 30.2844 12.7266 30.1185V32.9626C6.58823 30.8109 2.10938 24.9469 2.10938 18.0703C2.10938 9.33755 9.26724 2.10938 18 2.10938C26.7328 2.10938 33.8906 9.33755 33.8906 18.0703C33.8906 24.9469 29.4118 30.8109 23.2734 32.9626Z"/></svg>' },
  { label: 'LeetCode', href: 'https://leetcode.com/ujjuboi/', svg: '<svg class="link-svg" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><rect class="link-bg" width="36" height="36" fill="#1e1e1e"/><path class="link-path" transform="translate(-3.43 0) scale(1.3393 1.125)" d="M21.469 23.907l-3.595 3.473c-0.624 0.625-1.484 0.885-2.432 0.885s-1.807-0.26-2.432-0.885l-5.776-5.812c-0.62-0.625-0.937-1.537-0.937-2.485 0-0.952 0.317-1.812 0.937-2.432l5.76-5.844c0.62-0.619 1.5-0.859 2.448-0.859s1.808 0.26 2.432 0.885l3.595 3.473c0.687 0.688 1.823 0.663 2.536-0.052 0.708-0.713 0.735-1.848 0.047-2.536l-3.473-3.511c-0.901-0.891-2.032-1.505-3.261-1.787l3.287-3.333c0.688-0.687 0.667-1.823-0.047-2.536s-1.849-0.735-2.536-0.052l-13.469 13.469c-1.307 1.312-1.989 3.113-1.989 5.113 0 1.996 0.683 3.86 1.989 5.168l5.797 5.812c1.307 1.307 3.115 1.937 5.115 1.937 1.995 0 3.801-0.683 5.109-1.989l3.479-3.521c0.688-0.683 0.661-1.817-0.052-2.531s-1.849-0.74-2.531-0.052zM27.749 17.349h-13.531c-0.932 0-1.692 0.801-1.692 1.791 0 0.991 0.76 1.797 1.692 1.797h13.531c0.933 0 1.693-0.807 1.693-1.797 0-0.989-0.76-1.791-1.693-1.791z"/></svg>' }
];

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

initSiteFooter();
initFontSwitcher();