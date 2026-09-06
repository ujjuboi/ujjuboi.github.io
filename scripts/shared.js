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
 * @param {*} str Value to escape; null/undefined become an empty string.
 * @returns {string} Escaped HTML-safe string.
 */
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
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
    this.el = document.createElement('div');
    this.el.className = className;

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

    this.el.appendChild(this.heading);
    this.el.appendChild(this.content);

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
    parent.appendChild(this.el);
    return this;
  }
}

/**
 * Extracts `## Key: value` front-matter from a markdown blog post.
 *
 * @param {string} text Raw markdown source.
 * @returns {Object} Map of lowercase front-matter keys to trimmed values.
 */
function parsePostHeaders(text) {
  const meta = {};
  for (const line of text.split('\n')) {
    if (line.startsWith('## Paragraphs')) break;
    const match = line.match(/^## (\w+):\s*(.+)/);
    if (match) {
      meta[match[1].toLowerCase()] = match[2].trim();
    }
  }
  return meta;
}

/**
 * Extracts the list of `- ` bullet paragraphs under `## Paragraphs`.
 *
 * @param {string} text Raw markdown source.
 * @returns {string[]} Paragraph bodies, trimmed of the leading bullet marker.
 */
function parsePostBody(text) {
  const lines = text.split('\n');
  const bodyStart = lines.findIndex(line => line.startsWith('## Paragraphs'));
  if (bodyStart === -1) return [];
  return lines.slice(bodyStart + 1)
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2).trim());
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
  const m = String(dateStr || '').trim().match(/^([A-Za-z]+)\s+(\d{4})/);
  if (!m) return 0;
  const mon = SORT_MONTHS[m[1].toLowerCase().slice(0, 3)];
  if (!mon) return 0;
  return parseInt(m[2], 10) * 100 + mon;
}

/**
 * Returns the index of the first non-blank line at or after `start`.
 *
 * @param {string[]} lines Source lines.
 * @param {number} start Line index to begin searching from.
 * @returns {number} Index of the next non-blank line.
 */
function nextNonBlank(lines, start) {
  let j = start;
  while (j < lines.length && lines[j].trim() === '') j++;
  return j;
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
  let j = start;
  while (j < lines.length && !lines[j].startsWith('## ')) {
    result.push(lines[j]);
    j++;
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

  let i = 0;
  while (i < lines.length && !lines[i].startsWith('## ')) {
    const line = lines[i].trim();
    for (const [key, field] of Object.entries(fields)) {
      if (line.startsWith('**' + key + ':**')) {
        data.contact[field] = line.split('**' + key + ':**')[1].trim();
      }
    }
    i++;
  }

  while (i < lines.length) {
    const section = lines[i].replace(/^## /, '').trim();

    if (section === 'Professional Summary') {
      i = nextNonBlank(lines, i + 1);
      const end = sectionLines(lines, i);
      data.summary = end.filter(line => line.trim()).join(' ');
      i += end.length;
      continue;
    }

    if (section === 'Work Experience') {
      const block = sectionLines(lines, i + 1);
      let job = null;
      for (const line of block) {
        if (line.startsWith('### ')) {
          if (job) data.experience.push(job);
          job = { company: line.replace(/^### /, '').trim(), role: '', date: '', banner: '', readMore: null, bullets: [] };
        } else if (job) {
          const t = line.trim();
          if (t === '') continue;
          if (t.startsWith('**') && t.endsWith('**') && !job.role) {
            job.role = t.slice(2, -2);
          } else if (/^#{3,6}\s/.test(t)) {
            job.bullets.push({ kind: 'heading', level: t.match(/^#+/)[0].length, text: t.replace(/^#+\s*/, '') });
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
        proj = { name: name.trim(), tag: tag.trim(), desc: desc.trim(), banner: '', readMore: null };
        data.projects.push(proj);
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
    this.el = document.querySelector('.tooltip');
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.className = 'tooltip';
      this.el.setAttribute('role', 'tooltip');
      this.el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.el);
    }
    this.anchor = null;

    document.addEventListener('click', (e) => {
      if (this.isVisible && !(this.anchor && this.anchor.contains(e.target))) {
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
    return this.el.style.display !== 'none';
  }

  /**
   * Positions the tooltip next to an anchor, staying inside the viewport.
   *
   * @param {HTMLElement} anchor Element to position the tooltip near.
   */
  position(anchor) {
    const rect = anchor.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - this.el.offsetWidth / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - this.el.offsetWidth - 8));
    let top = rect.bottom + 10;
    if (top + this.el.offsetHeight > window.innerHeight - 8) {
      top = rect.top - this.el.offsetHeight - 10;
    }
    this.el.style.left = left + 'px';
    this.el.style.top = top + 'px';
  }

  /**
   * Sets the tooltip content from a trusted HTML string or DOM node.
   *
   * @param {string|Node} content Content to display.
   */
  setContent(content) {
    if (content instanceof Node) {
      this.el.innerHTML = '';
      this.el.appendChild(content);
    } else {
      this.el.innerHTML = String(content);
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
    this.el.style.display = 'block';
    this.el.setAttribute('aria-hidden', 'false');
    this.el.style.opacity = '0';
    this.position(anchor);
    requestAnimationFrame(() => {
      this.el.style.opacity = '1';
    });
  }

  /**
   * Hides the tooltip.
   */
  hide() {
    this.el.style.display = 'none';
    this.el.setAttribute('aria-hidden', 'true');
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
    anchor.addEventListener('click', (e) => {
      e.stopPropagation();
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
      const sep = document.createElement('span');
      sep.className = 'profiles-sep';
      sep.textContent = '\u2022';
      item.appendChild(sep);
      group.appendChild(item);

      tooltip.attach(item, PROFILE_INFO[profile] || profile);
    });
    return group;
  }

  strip.appendChild(buildProfile());
  strip.appendChild(buildProfile());
  return strip;
}

initFontSwitcher();