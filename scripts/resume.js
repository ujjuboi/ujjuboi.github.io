/**
 * Loads `src/cv.md`, parses it, and renders the resume into the page container.
 */
async function loadCV() {
  const resumeContainer = document.getElementById('resume-container');
  try {
    const res = await fetch('../../src/cv.md');
    if (!res.ok) throw new Error('Failed to fetch CV');
    const text = await res.text();
    const data = parseCV(text);
    renderResume(data);
  } catch (e) {
    resumeContainer.innerHTML = '<p style="text-align:center;padding:2rem;">Failed to load CV data.</p>';
  }
}

/**
 * Renders the parsed CV into the resume container.
 *
 * @param {Object} data Structured CV from parseCV().
 */
function renderResume(data) {
  const container = document.getElementById('resume-container');
  container.innerHTML = '';
  container.appendChild(renderHeader(data.contact));
  container.appendChild(renderSection('Professional Summary', renderSummary(data.summary), true));
  container.appendChild(renderSection('Work Experience', renderExperience(data.experience), false));
  container.appendChild(renderSection('Projects', renderProjects(data.projects), false));
  container.appendChild(renderSection('Education', renderEducation(data.education), false));
  container.appendChild(renderSection('Skills', renderSkills(data.skills), false));
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
 * Builds a collapsible resume section with heading and content.
 *
 * @param {string} title Section heading text.
 * @param {Node} contentEl Content node to place inside the section.
 * @param {boolean} active Whether the section starts expanded.
 * @returns {HTMLDivElement} Section element ready to append.
 */
function renderSection(title, contentEl, active) {
  const section = document.createElement('div');
  section.className = 'resume-section';
  if (active) {
    section.className += ' active';
  }

  const h2 = document.createElement('h2');
  h2.className = 'section-heading' + (active ? ' active' : '');
  h2.onclick = function () { toggleSection(this); };

  const titleText = document.createElement('span');
  titleText.className = 'title-text';
  titleText.textContent = title;

  const toggleIcon = document.createElement('span');
  toggleIcon.className = 'toggle-icon';
  toggleIcon.textContent = active ? '-' : '+';

  h2.appendChild(titleText);
  h2.appendChild(toggleIcon);

  const content = document.createElement('div');
  content.className = 'section-content';
  content.style.display = active ? 'block' : 'none';

  if (contentEl) {
    content.appendChild(contentEl);
  }

  section.appendChild(h2);
  section.appendChild(content);
  return section;
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
          h.innerHTML = mdInline(bullet.text);
          ul.appendChild(h);
          return;
        }
        const li = document.createElement('li');
        li.innerHTML = mdInline(bullet.text);
        if (bullet.sub && bullet.sub.length) {
          const subUl = document.createElement('ul');
          bullet.sub.forEach(sub => {
            const sl = document.createElement('li');
            sl.innerHTML = mdInline(sub);
            subUl.appendChild(sl);
          });
          li.appendChild(subUl);
        }
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }

    wrapper.appendChild(div);
  });
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
      p.textContent = proj.desc;
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

initMenuToggle('#resume-container');
loadCV();