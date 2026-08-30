function toggleSection(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector('.toggle-icon');

  if (content.style.display === 'none') {
    content.style.display = 'block';
    icon.textContent = '-';
  } else {
    content.style.display = 'none';
    icon.textContent = '+';
  }

  header.classList.toggle('active');
}

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

function parseCV(text) {
  const lines = text.split('\n');
  const data = { contact: {}, summary: '', experience: [], projects: [], education: [], skills: [] };
  const fields = { Location: 'location', Email: 'email', LinkedIn: 'linkedin', Portfolio: 'portfolio', GitHub: 'github' };

  function nextNonBlank(start) {
    let j = start;
    while (j < lines.length && lines[j].trim() === '') j++;
    return j;
  }

  function sectionLines(start) {
    const result = [];
    let j = start;
    while (j < lines.length && !lines[j].startsWith('## ')) {
      result.push(lines[j]);
      j++;
    }
    return result;
  }

  for (let i = 1; i < lines.length && !lines[i].startsWith('## '); i++) {
    const line = lines[i].trim();
    for (const [key, field] of Object.entries(fields)) {
      if (line.startsWith('**' + key + ':**')) {
        data.contact[field] = line.split('**' + key + ':**')[1].trim();
      }
    }
  }

  let i = 0;
  while (i < lines.length && !lines[i].startsWith('## ')) i++;

  while (i < lines.length) {
    const section = lines[i].replace(/^## /, '').trim();

    if (section === 'Professional Summary') {
      i = nextNonBlank(i + 1);
      const end = sectionLines(i);
      data.summary = end.filter(l => l.trim()).join(' ');
      i += end.length;
      continue;
    }

    if (section === 'Work Experience') {
      const block = sectionLines(i + 1);
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
            job.bullets.push({ kind: 'heading', text: t.replace(/^#+\s*/, '') });
          } else if (/^[-+*]\s/.test(t) && line !== t) {
            const last = job.bullets[job.bullets.length - 1];
            if (last && last.kind === 'bullet') {
              last.sub.push(t.replace(/^[-+*]\s*/, ''));
            }
          } else if (t.startsWith('- ')) {
            job.bullets.push({ kind: 'bullet', text: t.slice(2), sub: [] });
          } else if (t && !job.date) {
            job.date = t;
          }
        }
      }
      if (job) data.experience.push(job);
      i += block.length;
      continue;
    }

    if (section === 'Projects') {
      const block = sectionLines(i + 1);
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

    if (section === 'Education') {
      const block = sectionLines(i + 1);
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
      const block = sectionLines(i + 1);
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

function renderSection(title, contentEl, active) {
  const section = document.createElement('div');
  section.className = 'resume-section';
  if (active) {
    section.className += ' active';
  }

  const h2 = document.createElement('h2');
  h2.className = 'section-heading' + (active ? ' active' : '');
  h2.onclick = function() { toggleSection(this); };

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

function renderSummary(text) {
  const p = document.createElement('p');
  p.textContent = text || '';
  return p;
}

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
          bullet.sub.forEach(s => {
            const sl = document.createElement('li');
            sl.innerHTML = mdInline(s);
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

initMenuToggle('#resume-container');
loadCV();
