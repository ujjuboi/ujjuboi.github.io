function notice(){ alert("Under Development!"); }

function initMenuToggle(contentSelector, restoreDisplay) {
  restoreDisplay = restoreDisplay || 'block';
  var footer = document.querySelector('footer');
  var menuIcon = document.getElementById('menuIcon');
  var header = document.querySelector('header');
  var content = document.querySelector(contentSelector);

  menuIcon.addEventListener('click', () => {
    menuIcon.style.display = "none";
    header.style.display = "block";
    content.style.display = "none";
    footer.style.height = "10vh";
    footer.style.bottom = "1%";
  });

  footer.addEventListener('click', () => {
    menuIcon.style.display = "block";
    footer.style.height = "18vh";
    footer.style.bottom = "4%";
    header.style.display = "none";
    content.style.display = restoreDisplay;
  });
}
