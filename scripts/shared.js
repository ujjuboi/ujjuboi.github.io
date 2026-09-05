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
 * Toggles a collapsible section open/closed and marks its header active.
 *
 * @param {HTMLElement} header The section heading that was clicked.
 */
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