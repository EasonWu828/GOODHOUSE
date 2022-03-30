// menu 切換
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.nav-menu a');
let menu = document.querySelector('.nav-menu');

menuOpenBtn.addEventListener('click', menuToggle);

function menuToggle(){
  if (menu.classList.contains('openMenu')){
    menu.classList.remove('openMenu');
  }else{
    menu.classList.add('openMenu');
  }
}

linkBtn.forEach((item)=>{
  item.addEventListener('click', closeMenu);
})
function closeMenu(){
  menu.classList.remove('openMenu');
}

