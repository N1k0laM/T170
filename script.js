/* ══ MUZIKA ══ */
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
if (music && musicBtn) {
  music.volume = 0.12;
  musicBtn.addEventListener('click', () => {
    if (music.paused) {
      music.play();
      musicBtn.innerText = "♫ ON";
      musicBtn.classList.add('active');
    } else {
      music.pause();
      musicBtn.innerText = "♫ OFF";
      musicBtn.classList.remove('active');
    }
  });
}

/* ══ HAMBURGER ══ */
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('mainNav');
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mainNav.classList.remove('open');
    })
  );
}

/* ══ TAB SWITCHING ══ */
function switchTab(tab) {
  // Pages
  document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + tab);
  if (page) page.classList.add('active');

  // Tab buttons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tab-' + tab);
  if (btn) btn.classList.add('active');

  // Nav links
  document.querySelectorAll('nav a[id^="nav-"]').forEach(a => a.classList.remove('nav-active'));
  const navA = document.getElementById('nav-' + tab);
  if (navA) navA.classList.add('nav-active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchTab = switchTab;

/* ══ SCROLL TO BIO ══ */
function scrollToBio(id) {
  const el = document.getElementById(id);
  if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}
window.scrollToBio = scrollToBio;

/* ══ SWIPE BETWEEN TABS ══ */
(function(){
  const tabs = ['narod', 'velikani'];
  let touchStartX = 0, touchStartY = 0;
  let currentTab = 0;

  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only horizontal swipe (more X than Y, min 60px)
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // Don't swipe if dragging a card
      if (e.target.closest('.card-coin-scene') || e.target.closest('.coin-scene')) return;

      const active = tabs.findIndex(t => {
        const p = document.getElementById('page-' + t);
        return p && p.classList.contains('active');
      });

      if (dx < 0 && active < tabs.length - 1) switchTab(tabs[active + 1]);
      if (dx > 0 && active > 0) switchTab(tabs[active - 1]);
    }
  }, { passive: true });
})();

/* ══ PARTICLES ══ */
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  class P {
    reset(init){
      this.x = Math.random()*(W||400);
      this.y = init ? Math.random()*(H||800) : (H||800)+5;
      this.r = 0.4 + Math.random()*1.3;
      this.vx = (Math.random()-0.5)*0.18;
      this.vy = -(0.07 + Math.random()*0.22);
      this.a = 0.15 + Math.random()*0.55;
      this.c = Math.random()>0.55 ? '#00d4ff' : '#f5c842';
    }
    constructor(){ this.reset(true); }
    upd(){ this.x+=this.vx; this.y+=this.vy; this.a-=0.0007; if(this.y<-5||this.a<=0) this.reset(false); }
    drw(){ ctx.save(); ctx.globalAlpha=this.a; ctx.fillStyle=this.c; ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
  }
  for(let i=0;i<90;i++) particles.push(new P());
  (function loop(){ ctx.clearRect(0,0,W,H); particles.forEach(p=>{p.upd();p.drw();}); requestAnimationFrame(loop); })();
}

/* ══ SCROLL ANIM ══ */
const obs = new IntersectionObserver(
  entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
);
document.querySelectorAll('.scroll-anim').forEach(el => obs.observe(el));

/* ══ COIN (Великани tab) ══ */
(function(){
  const scene = document.getElementById('coinScene');
  const coin  = document.getElementById('theCoin');
  const glow  = document.getElementById('coinGlow');
  const label = document.getElementById('coinLabelName');
  if (!scene || !coin) return;

  let rotX=10, rotY=-20, tgtX=10, tgtY=-20;
  let velX=0, velY=0, isDrag=false;
  let lastX=0, lastY=0, lastDX=0, lastDY=0;
  let showBack=false;

  function lerp(a,b,t){ return a+(b-a)*t; }
  (function tick(){
    if (!isDrag){
      velX *= 0.93; velY *= 0.93;
      tgtX += velX; tgtY += velY;
      if (Math.abs(velX)<0.05 && Math.abs(velY)<0.05){
        const t = Date.now()*0.0003;
        tgtX = lerp(tgtX, 8+Math.sin(t*0.7)*5, 0.02);
        tgtY = lerp(tgtY, Math.sin(t)*8, 0.02);
      }
    }
    rotX = lerp(rotX,tgtX,0.12);
    rotY = lerp(rotY,tgtY,0.12);
    coin.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

    const ny = ((rotY%360)+360)%360;
    const back = (ny>90 && ny<270);
    if (back !== showBack){
      showBack = back;
      if (label) { label.textContent = back ? 'Сава Владисlavić' : 'Никола Тесла'; label.classList.toggle('gold', back); }
      if (glow)  glow.classList.toggle('gold-glow', back);
    }
    requestAnimationFrame(tick);
  })();

  function onStart(x,y){ isDrag=true; lastX=x; lastY=y; lastDX=0; lastDY=0; scene.style.cursor='grabbing'; }
  function onMove(x,y){ if(!isDrag) return; const dx=x-lastX,dy=y-lastY; tgtY+=dx*0.55; tgtX-=dy*0.55; tgtX=Math.max(-75,Math.min(75,tgtX)); lastDX=dx; lastDY=dy; lastX=x; lastY=y; }
  function onEnd(){ isDrag=false; scene.style.cursor='grab'; velY=lastDX*0.55; velX=-lastDY*0.55; }

  scene.addEventListener('mousedown', e=>{onStart(e.clientX,e.clientY);e.preventDefault();});
  window.addEventListener('mousemove', e=>onMove(e.clientX,e.clientY));
  window.addEventListener('mouseup', onEnd);
  scene.addEventListener('touchstart', e=>{const t=e.touches[0];onStart(t.clientX,t.clientY);},{passive:true});
  window.addEventListener('touchmove', e=>{const t=e.touches[0];onMove(t.clientX,t.clientY);},{passive:true});
  window.addEventListener('touchend', onEnd);
})();

/* ══ PERSON CARD DRAG (Y-axis flip) ══ */
(function(){
  document.querySelectorAll('.card-coin-scene').forEach(scene => {
    const coin = scene.querySelector('.card-coin');
    const cardEl = scene.closest('.person-card');
    const labelName = cardEl ? cardEl.querySelector('.card-label-name') : null;
    if (!coin) return;

    let rotY = 0, tgtY = 0, velY = 0;
    let isDrag = false, lastX = 0, lastDX = 0;
    let showBack = false;

    function lerp(a,b,t){ return a+(b-a)*t; }

    (function tick(){
      if (!isDrag){
        velY *= 0.90;
        tgtY += velY;
        // Snap to nearest 0 or 180
        if (Math.abs(velY) < 0.3) {
          const mod = ((tgtY%360)+360)%360;
          const target = (mod > 90 && mod < 270) ? Math.round(tgtY/180)*180 : Math.round(tgtY/360)*360;
          tgtY = lerp(tgtY, target, 0.06);
        }
      }
      rotY = lerp(rotY, tgtY, 0.14);
      coin.style.transform = `rotateY(${rotY}deg)`;

      const mod = ((rotY%360)+360)%360;
      const back = (mod > 90 && mod < 270);
      if (back !== showBack){
        showBack = back;
        if (labelName) labelName.classList.toggle('showing-back', back);
      }
      requestAnimationFrame(tick);
    })();

    function onStart(x){ isDrag=true; lastX=x; lastDX=0; scene.style.cursor='grabbing'; }
    function onMove(x){
      if (!isDrag) return;
      const dx = x - lastX;
      tgtY += dx * 0.7;
      lastDX = dx; lastX = x;
    }
    function onEnd(){
      isDrag=false; scene.style.cursor='grab';
      velY = lastDX * 0.7;
    }

    scene.addEventListener('mousedown', e=>{onStart(e.clientX);e.preventDefault();});
    window.addEventListener('mousemove', e=>{ if(isDrag) onMove(e.clientX); });
    window.addEventListener('mouseup', ()=>{ if(isDrag) onEnd(); });
    scene.addEventListener('touchstart', e=>{onStart(e.touches[0].clientX);},{passive:true});
    window.addEventListener('touchmove', e=>{ if(isDrag) onMove(e.touches[0].clientX); },{passive:true});
    window.addEventListener('touchend', ()=>{ if(isDrag) onEnd(); });
  });
})();