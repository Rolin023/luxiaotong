
const slides = document.querySelector('.slides');
const sections = [...document.querySelectorAll('.slide')];
const dotsWrap = document.querySelector('.dots');
const menuBtn = document.querySelector('.menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
let current = 0;
let locked = false;

sections.forEach((_, i) => {
  const d = document.createElement('button');
  d.addEventListener('click', () => go(i));
  dotsWrap.appendChild(d);
});

function isMobile(){
  return window.matchMedia('(max-width: 900px)').matches;
}

function go(i){
  current = Math.max(0, Math.min(sections.length - 1, Number(i)));
  if(isMobile()){
    sections[current].scrollIntoView({behavior:'smooth'});
  }else{
    slides.style.transform = `translateY(${-current * 100}vh)`;
  }
  document.querySelectorAll('.desktop-nav button').forEach((btn, idx) => btn.classList.toggle('active', idx === current));
  document.querySelectorAll('.dots button').forEach((btn, idx) => btn.classList.toggle('active', idx === current));
  mobileNav.classList.remove('open');
}

document.querySelectorAll('[data-go]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    go(el.dataset.go);
  });
});

window.addEventListener('wheel', (e) => {
  if(isMobile() || locked) return;
  locked = true;
  if(e.deltaY > 0) go(current + 1);
  else go(current - 1);
  setTimeout(() => locked = false, 900);
}, {passive:true});

window.addEventListener('keydown', (e) => {
  if(['ArrowDown','PageDown','s','S'].includes(e.key)) go(current + 1);
  if(['ArrowUp','PageUp','w','W'].includes(e.key)) go(current - 1);
});

let startY = 0;
window.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, {passive:true});
window.addEventListener('touchend', e => {
  if(isMobile()) return;
  const dy = startY - e.changedTouches[0].clientY;
  if(Math.abs(dy) > 55){
    go(current + (dy > 0 ? 1 : -1));
  }
}, {passive:true});

menuBtn.addEventListener('click', () => mobileNav.classList.toggle('open'));
window.addEventListener('resize', () => go(current));
go(0);
