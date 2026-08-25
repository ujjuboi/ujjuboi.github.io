const categories = ['Deloitte', 'Personal Projects', 'Research'];

function renderBlogList() {
  const container = document.getElementById('blog-list');
  container.innerHTML = '';
  let delayIndex = 0;
  categories.forEach(category => {
    const grouped = posts
      .map((post, index) => ({ post, index }))
      .filter(item => item.post.category === category);
    if (!grouped.length) return;

    const section = document.createElement('div');
    section.className = 'blog-section';

    const heading = document.createElement('h2');
    heading.className = 'section-heading';
    heading.textContent = category;
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'post-grid';

    grouped.forEach(({ post, index }) => {
      const card = document.createElement('div');
      card.className = 'post-card';
      card.style.animationDelay = (delayIndex * 0.1) + 's';
      card.onclick = () => showPost(index);
      card.innerHTML = `
        <h3 class="card-title">${post.title}</h3>
        <p class="card-date">${post.date}</p>
        <p class="card-excerpt">${post.excerpt}</p>
      `;
      grid.appendChild(card);
      delayIndex++;
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function showPost(index) {
  const post = posts[index];
  document.getElementById('blog-list').style.display = 'none';
  const postView = document.getElementById('post-view');
  postView.style.display = 'block';

  document.getElementById('post-banner').src = post.banner;
  document.getElementById('post-banner').alt = post.title;
  document.getElementById('post-title').textContent = post.title;
  document.getElementById('post-date').textContent = post.date;

  const content = document.getElementById('post-content');
  content.innerHTML = '';
  post.paragraphs.forEach(p => {
    const div = document.createElement('div');
    div.className = 'post-paragraph';
    div.innerHTML = p;
    content.appendChild(div);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showBlogList() {
  document.getElementById('post-view').style.display = 'none';
  document.getElementById('blog-list').style.removeProperty('display');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

var themeSelect = document.getElementById('themeSelect');
var menu = document.getElementById("menu");
var selectedTheme = document.getElementById("selectedTheme");
var white = document.getElementById("whiteTheme");
var dark = document.getElementById("darkTheme");
var color = document.getElementById("colorTheme");
var root = document.querySelector(":root");

if(window.innerWidth <= 720){
  themeSelect.addEventListener('click', () => {
    menu.style.position = "relative";
    menu.style.opacity = "1";
    menu.style.visibility = "visible";
  });

  document.getElementById('blog-container').addEventListener('click', () => {
    menu.style.position = "absolute";
    menu.style.opacity = "0";
    menu.style.visibility = "hidden";
  });
}

function darkTheme(){
  menu.replaceChild(replace(), dark);
  selectedTheme.insertBefore(dark, selectedTheme.children[0]);
  let darkObj = new DarkTheme;
  document.querySelector('body').style.color = darkObj.border;
  root.style.setProperty('--borderColor', darkObj.border);
  root.style.setProperty('--backgroundColor', darkObj.bg);
  root.style.setProperty('--shadowColor', darkObj.shadow);
  root.style.setProperty('--contentColor', darkObj.content);
}

function colorTheme(){
  menu.replaceChild(replace(), color);
  selectedTheme.insertBefore(color, selectedTheme.children[0]);
  let colorObj = new ColorTheme;
  document.querySelector('body').style.color = colorObj.border;
  root.style.setProperty('--borderColor', colorObj.border);
  root.style.setProperty('--backgroundColor', colorObj.bg);
  root.style.setProperty('--shadowColor', colorObj.shadow);
  root.style.setProperty('--contentColor', colorObj.content);
}

function lightTheme(){
  menu.replaceChild(replace(), white);
  selectedTheme.insertBefore(white, selectedTheme.children[0]);
  let whiteObj = new WhiteTheme;
  document.querySelector('body').style.color = whiteObj.border;
  root.style.setProperty('--borderColor', whiteObj.border);
  root.style.setProperty('--backgroundColor', whiteObj.bg);
  root.style.setProperty('--shadowColor', whiteObj.shadow);
  root.style.setProperty('--contentColor', whiteObj.content);
}

function replace(){
  var insideTheme = null;
  for(var i = 0; i < selectedTheme.childNodes.length; i++){
    if(selectedTheme.childNodes[i].className == "menuItem"){
      insideTheme = selectedTheme.childNodes[i];
      break;
    }
  }
  return insideTheme;
};

renderBlogList();
initMenuToggle('#blog-container');
