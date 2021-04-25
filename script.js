class WhiteTheme{
  border = "#000000";
  bg  = "#F9F3EF";
  content = "#BE3D3D";
  shadow = "#09382F";
}

class ColorTheme{
  border = "#000000";
  bg  = "#4A4BC7";
  content = "#FEE5A5";
  shadow = "#FFD23B";
}

class DarkTheme{
  border = "#49D742";
  bg  = "#182733";
  content = "#A1AC25";
  shadow = "#C99910";
}

function notice(){
  alert("Under Development!");
};  

var themeSelect = document.getElementById('themeSelect');
var footer = document.querySelector('footer');
var hero = document.getElementById('hero');
var menuIcon = document.getElementById('menuIcon');
var header = document.querySelector('header');
var root = document.querySelector(":root");
var menu = document.getElementById("menu");
var selectedTheme = document.getElementById("selectedTheme");
var white = document.getElementById("whiteTheme");
var dark = document.getElementById("darkTheme");
var color = document.getElementById("colorTheme");

if(window.innerWidth <= 720){
  themeSelect.addEventListener('click', () => {
    menu.style.position =  "relative";
    menu.style.opacity = "1";
    menu.style.visibility = "visible";
  });

  hero.addEventListener('click', () =>{
    menu.style.position =  "absolute";
    menu.style.opacity = "0";
    menu.style.visibility = "hidden";
  });
  
  menuIcon.addEventListener('click', () => {
    menuIcon.style.display = "none";
    header.style.display = "block";
    hero.style.display = "none";
    footer.style.height = "10vh";
    footer.style.bottom = "1%";
    themeSelect.style.display = "none";
  });

  footer.addEventListener('click', () => {
    menuIcon.style.display = "block";
    footer.style.height = "18vh";
    footer.style.bottom = "4%";
    header.style.display = "none";
    hero.style.display = "flex";
    menu.style.position = "absolute";
    menu.style.opacity = "0";
    menu.style.visibility = "hidden";
    themeSelect.style.display = "block";
  });
}

function replace(){
  var insideTheme = null;
  for(var i = 0; i<selectedTheme.childNodes.length; i++){
    if(selectedTheme.childNodes[i].className == "menuItem"){
      insideTheme = selectedTheme.childNodes[i];
      break;
    }
  }
  return insideTheme;
};

function darkTheme(){
  menu.replaceChild(replace(), dark);
  selectedTheme.appendChild(dark);
  let darkObj = new DarkTheme;
  document.querySelector('body').style.color = darkObj.border;
  root.style.setProperty('--borderColor', darkObj.border);
  root.style.setProperty('--backgroundColor', darkObj.bg);
  root.style.setProperty('--shadowColor', darkObj.shadow);
  root.style.setProperty('--contentColor', darkObj.content);
}

function colorTheme(){
  
  menu.replaceChild(replace(), color);
  selectedTheme.appendChild(color);
  let colorObj = new ColorTheme;
  document.querySelector('body').style.color = colorObj.border;
  root.style.setProperty('--borderColor', colorObj.border);
  root.style.setProperty('--backgroundColor', colorObj.bg);
  root.style.setProperty('--shadowColor', colorObj.shadow);
  root.style.setProperty('--contentColor', colorObj.content);
}

function lightTheme(){
  
  menu.replaceChild(replace(), white);
  selectedTheme.appendChild(white);
  let whiteObj = new WhiteTheme;
  document.querySelector('body').style.color = whiteObj.border;
  root.style.setProperty('--borderColor', whiteObj.border);
  root.style.setProperty('--backgroundColor', whiteObj.bg);
  root.style.setProperty('--shadowColor', whiteObj.shadow);
  root.style.setProperty('--contentColor', whiteObj.content);
}