/**
 * Resume sections, shown as collapsible blocks in order.
 */
const categories = ['Professional Summary', 'Work Experience', 'Projects', 'Education', 'Skills'];

/**
 * Parsed resume content loaded from the manifest, keyed by category.
 */
const sections = [];

/**
 * Contact details parsed from the resume manifest.
 */
let contact = {};

/**
 * Loads `src/cv.md`, parses it, and stages each resume section's content
 * before rendering the page.
 */
async function loadCV() {
  const resumeContainer = document.getElementById('resume-container');
  try {
    const res = await fetch('../../src/cv.md');
    if (!res.ok) throw new Error('Failed to fetch CV');
    const text = await res.text();
    const data = parseCV(text);

    contact = data.contact;
    sections.push({ category: 'Professional Summary', body: renderSummary(data.summary) });
    sections.push({ category: 'Work Experience', body: renderExperience(data.experience) });
    sections.push({ category: 'Projects', body: renderProjects(data.projects) });
    sections.push({ category: 'Education', body: renderEducation(data.education) });
    sections.push({ category: 'Skills', body: renderSkills(data.skills) });

    renderResume();
  } catch (e) {
    resumeContainer.innerHTML = '<p style="text-align:center;padding:2rem;">Failed to load CV data.</p>';
  }
}

/**
 * Renders the contact header and each category as a shared collapsible
 * section. The first category starts expanded; the rest start collapsed.
 */
function renderResume() {
  const container = document.getElementById('resume-container');
  container.innerHTML = '';
  container.appendChild(renderHeader(contact));

  categories.forEach((category, index) => {
    const match = sections.find(s => s.category === category);
    if (!match) return;
    new Section({
      title: category,
      content: match.body,
      className: 'resume-section',
      expanded: index === 0
    }).addTo(container);
  });
}

/**
 * Builds the resume header block with the parsed contact links.
 *
 * @param {Object} contact Contact fields parsed from the CV.
 * @returns {HTMLDivElement} Header element ready to append.
 */
function renderHeader(contact) {
  const header = document.createElement('div');
  header.id = 'resume-header';

  const p = document.createElement('p');
  p.className = 'resume-contact';

  const parts = [];
  if (contact.location) parts.push('<span>' + escapeHtml(contact.location) + '</span>');
  if (contact.email) parts.push('<a href="mailto:' + escapeHtml(contact.email) + '">' + escapeHtml(contact.email) + '</a>');
  if (contact.linkedin) parts.push('<a href="https://' + escapeHtml(contact.linkedin) + '" target="_blank">LinkedIn</a>');
  if (contact.portfolio) parts.push('<a href="https://' + escapeHtml(contact.portfolio) + '" target="_blank">Portfolio</a>');
  if (contact.github) parts.push('<a href="https://' + escapeHtml(contact.github) + '" target="_blank">GitHub</a>');

  p.innerHTML = parts.join(' | ');
  header.appendChild(p);
  return header;
}

/**
 * Builds the professional summary paragraph.
 *
 * @param {string} text Summary sentence(s) from the CV.
 * @returns {HTMLParagraphElement} Paragraph element ready to append.
 */
function renderSummary(text) {
  const p = document.createElement('p');
  p.textContent = text || '';
  return p;
}

/**
 * Builds the work experience entries from parsed jobs.
 *
 * @param {Object[]} jobs Parsed job entries.
 * @returns {DocumentFragment} Fragment ready to append.
 */
function renderExperience(jobs) {
  const wrapper = document.createDocumentFragment();
  const timeline = document.createElement('div');
  timeline.className = 'timeline';
  jobs.forEach(job => {
    const div = document.createElement('div');
    div.className = 'job';

    const h3 = document.createElement('h3');
    h3.textContent = job.company || '';
    div.appendChild(h3);

    const h4 = document.createElement('h4');
    h4.textContent = job.role || '';
    div.appendChild(h4);

    const p = document.createElement('p');
    p.className = 'job-date';
    p.textContent = job.date || '';
    div.appendChild(p);

    if (job.bullets && job.bullets.length) {
      const ul = document.createElement('ul');
      job.bullets.forEach(bullet => {
        if (bullet.kind === 'heading') {
          const h = document.createElement('li');
          h.className = 'resume-subheading';
          h.innerHTML = renderMarkdown(bullet.text);
          ul.appendChild(h);
          return;
        }
        const li = document.createElement('li');
        li.innerHTML = renderMarkdown(bullet.text);
        if (bullet.sub && bullet.sub.length) {
          const subUl = document.createElement('ul');
          bullet.sub.forEach(sub => {
            const sl = document.createElement('li');
            sl.innerHTML = renderMarkdown(sub);
            subUl.appendChild(sl);
          });
          li.appendChild(subUl);
        }
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }

    timeline.appendChild(div);
  });
  wrapper.appendChild(timeline);
  return wrapper;
}

/**
 * Builds the projects entries from parsed projects.
 *
 * @param {Object[]} projects Parsed project entries.
 * @returns {DocumentFragment} Fragment ready to append.
 */
function renderProjects(projects) {
  const wrapper = document.createDocumentFragment();
  projects.forEach(proj => {
    const div = document.createElement('div');
    div.className = 'project';

    const h3 = document.createElement('h3');
    h3.textContent = proj.name || '';
    if (proj.tag) {
      const tag = document.createElement('span');
      tag.className = 'project-tag';
      tag.textContent = proj.tag;
      h3.appendChild(tag);
    }
    div.appendChild(h3);

    if (proj.desc) {
      const p = document.createElement('p');
      p.innerHTML = renderMarkdown(proj.desc);
      div.appendChild(p);
    }

    wrapper.appendChild(div);
  });
  return wrapper;
}

/**
 * Builds the education entries from parsed qualifications.
 *
 * @param {Object[]} items Parsed education entries.
 * @returns {DocumentFragment} Fragment ready to append.
 */
function renderEducation(items) {
  const wrapper = document.createDocumentFragment();
  items.forEach(edu => {
    const div = document.createElement('div');
    div.className = 'education';

    const h3 = document.createElement('h3');
    h3.textContent = edu.degree || '';
    div.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = [edu.school, edu.cgpa].filter(Boolean).join(' ') || edu.school || '';
    div.appendChild(p);

    if (edu.dates) {
      const dateP = document.createElement('p');
      dateP.className = 'job-date';
      dateP.textContent = edu.dates;
      div.appendChild(dateP);
    }

    wrapper.appendChild(div);
  });
  return wrapper;
}

/**
 * Builds the skills grid grouped by category.
 *
 * @param {Object[]} categories Parsed skill categories.
 * @returns {HTMLDivElement} Skills grid element ready to append.
 */
function renderSkills(categories) {
  const div = document.createElement('div');
  div.className = 'skills-grid';

  categories.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.className = 'skill-category';

    const h3 = document.createElement('h3');
    h3.textContent = cat.category || '';
    catDiv.appendChild(h3);

    const wrapper = document.createElement('div');
    wrapper.className = 'skills-wrapper';

    if (cat.items) {
      cat.items.forEach(item => {
        const span = document.createElement('span');
        span.className = 'skill-item';
        span.textContent = item;
        wrapper.appendChild(span);
      });
    }

    catDiv.appendChild(wrapper);
    div.appendChild(catDiv);
  });

  return div;
}

loadCV();
initMenuToggle('#resume-container');