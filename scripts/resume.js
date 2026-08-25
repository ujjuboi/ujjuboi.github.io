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

initMenuToggle('#resume-container');
