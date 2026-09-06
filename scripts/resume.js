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
    const response = await fetch('../../src/cv.md');
    if (!response.ok) throw new Error('Failed to fetch CV');
    const text = await response.text();
    const data = parseCV(text);

    contact = data.contact;
    sections.push({ category: 'Professional Summary', body: renderSummary(data.summary) });
    sections.push({ category: 'Work Experience', body: renderExperience(data.experience) });
    sections.push({ category: 'Projects', body: renderProjects(data.projects) });
    sections.push({ category: 'Education', body: renderEducation(data.education) });
    sections.push({ category: 'Skills', body: renderSkills(data.skills) });

    renderResume();
  } catch (error) {
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
    const match = sections.find(section => section.category === category);
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

  const paragraph = document.createElement('p');
  paragraph.className = 'resume-contact';

  const parts = [];
  if (contact.location) parts.push('<span>' + escapeHtml(contact.location) + '</span>');
  if (contact.email) parts.push('<a href="mailto:' + escapeHtml(contact.email) + '">' + escapeHtml(contact.email) + '</a>');
  if (contact.linkedin) parts.push('<a href="https://' + escapeHtml(contact.linkedin) + '" target="_blank">LinkedIn</a>');
  if (contact.portfolio) parts.push('<a href="https://' + escapeHtml(contact.portfolio) + '" target="_blank">Portfolio</a>');
  if (contact.github) parts.push('<a href="https://' + escapeHtml(contact.github) + '" target="_blank">GitHub</a>');

  paragraph.innerHTML = parts.join(' | ');
  header.appendChild(paragraph);
  return header;
}

/**
 * Builds the professional summary paragraph.
 *
 * @param {string} text Summary sentence(s) from the CV.
 * @returns {HTMLParagraphElement} Paragraph element ready to append.
 */
function renderSummary(text) {
  const paragraph = document.createElement('p');
  paragraph.innerHTML = renderInlineMarkdown(text);
  return paragraph;
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
    const jobDiv = document.createElement('div');
    jobDiv.className = 'job';

    const companyHeading = document.createElement('h3');
    companyHeading.textContent = job.company || '';
    jobDiv.appendChild(companyHeading);

    const roleHeading = document.createElement('h4');
    roleHeading.textContent = job.role || '';
    jobDiv.appendChild(roleHeading);

    const dateParagraph = document.createElement('p');
    dateParagraph.className = 'job-date';
    dateParagraph.textContent = job.date || '';
    jobDiv.appendChild(dateParagraph);

    if (job.bullets && job.bullets.length) {
      jobDiv.appendChild(renderMarkdownBullets(job.bullets));
    }

    timeline.appendChild(jobDiv);
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
  projects.forEach(project => {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'project';

    const heading = document.createElement('h3');
    heading.innerHTML = renderInlineMarkdown(project.name || '');
    if (project.tag) {
      const tag = document.createElement('span');
      tag.className = 'project-tag';
      tag.innerHTML = renderInlineMarkdown(project.tag);
      heading.appendChild(tag);
    }
    projectDiv.appendChild(heading);

    if (project.description) {
      const descriptionParagraph = document.createElement('p');
      descriptionParagraph.innerHTML = renderInlineMarkdown(project.description);
      projectDiv.appendChild(descriptionParagraph);
    }

    wrapper.appendChild(projectDiv);
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
  items.forEach(educationEntry => {
    const educationDiv = document.createElement('div');
    educationDiv.className = 'education';

    const degreeHeading = document.createElement('h3');
    degreeHeading.innerHTML = renderInlineMarkdown(educationEntry.degree || '');
    educationDiv.appendChild(degreeHeading);

    const schoolParagraph = document.createElement('p');
    schoolParagraph.innerHTML = renderInlineMarkdown(
      [educationEntry.school, educationEntry.cgpa].filter(Boolean).join(' ') || educationEntry.school || ''
    );
    educationDiv.appendChild(schoolParagraph);

    if (educationEntry.dates) {
      const dateParagraph = document.createElement('p');
      dateParagraph.className = 'job-date';
      dateParagraph.innerHTML = renderInlineMarkdown(educationEntry.dates);
      educationDiv.appendChild(dateParagraph);
    }

    wrapper.appendChild(educationDiv);
  });
  return wrapper;
}

/**
 * Builds the skills grid grouped by category.
 *
 * @param {Object[]} skillCategories Parsed skill categories.
 * @returns {HTMLDivElement} Skills grid element ready to append.
 */
function renderSkills(skillCategories) {
  const gridDiv = document.createElement('div');
  gridDiv.className = 'skills-grid';

  skillCategories.forEach(skillCategory => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'skill-category';

    const heading = document.createElement('h3');
    heading.innerHTML = renderInlineMarkdown(skillCategory.category || '');
    categoryDiv.appendChild(heading);

    const wrapper = document.createElement('div');
    wrapper.className = 'skills-wrapper';

    if (skillCategory.items) {
      skillCategory.items.forEach(item => {
        const span = document.createElement('span');
        span.className = 'skill-item';
        span.innerHTML = renderInlineMarkdown(item);
        wrapper.appendChild(span);
      });
    }

    categoryDiv.appendChild(wrapper);
    gridDiv.appendChild(categoryDiv);
  });

  return gridDiv;
}

loadCV();
initMenuToggle('#resume-container');