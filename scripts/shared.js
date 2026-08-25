function notice(){ alert("Under Development!"); }

function closeAllDropdowns() {
  document.querySelectorAll('.nav-dropdown.dropdown-open').forEach(function(el) {
    el.classList.remove('dropdown-open');
  });
}

document.addEventListener('click', function(e) {
  var dropdowns = document.querySelectorAll('.nav-dropdown');
  if (!dropdowns.length) return;
  var clickedInsideDropdown = false;
  dropdowns.forEach(function(dropdown) {
    if (dropdown.contains(e.target)) clickedInsideDropdown = true;
  });
  if (!clickedInsideDropdown) {
    closeAllDropdowns();
  }
});

var navDropdowns = document.querySelectorAll('.nav-dropdown > a');
navDropdowns.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var parent = this.parentElement;
    var wasOpen = parent.classList.contains('dropdown-open');
    closeAllDropdowns();
    if (!wasOpen) {
      parent.classList.add('dropdown-open');
    }
  });
});

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
    closeAllDropdowns();
  });

  footer.addEventListener('click', () => {
    menuIcon.style.display = "block";
    footer.style.height = "18vh";
    footer.style.bottom = "4%";
    header.style.display = "none";
    content.style.display = restoreDisplay;
    closeAllDropdowns();
  });
}
