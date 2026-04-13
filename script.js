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

/* ══ PARTICLES ══ */
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  class P {
    constructor(){ this.reset(true); }
    reset(init){
      this.x  = Math.random() * (W||400);
      this.y  = init ? Math.random()*(H||800) : (H||800)+5;
      this.r  = 0.4 + Math.random()*1.3;
      this.vx = (Math.random()-0.5)*0.18;
      this.vy = -(0.07 + Math.random()*0.22);
      this.a  = 0.15 + Math.random()*0.55;
      this.c  = Math.random()>0.55 ? '#00d4ff' : '#f5c842';
    }
    upd(){ this.x+=this.vx; this.y+=this.vy; this.a-=0.0007; if(this.y<-5||this.a<=0) this.reset(false); }
    drw(){ ctx.save(); ctx.globalAlpha=this.a; ctx.fillStyle=this.c; ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
  }
  for(let i=0;i<90;i++) particles.push(new P());
  (function loop(){ ctx.clearRect(0,0,W,H); particles.forEach(p=>{p.upd();p.drw();}); requestAnimationFrame(loop); })();
}

/* ══ SCROLL ANIMATIONS ══ */
const obs = new IntersectionObserver(entries =>
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);
document.querySelectorAll('.scroll-anim').forEach(el => obs.observe(el));
function switchTab(tabId, index) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.tab-item')[index].classList.add('active');
    
    const underline = document.querySelector('.tab-underline');
    underline.style.left = (index * 50) + '%';
}

// Честице (кратка верзија)
const canvs = document.getElementById('particleCanvas');
const ctx = canvs.getContext('2d');
let w = canvs.width = window.innerWidth;
let h = canvs.height = window.innerHeight;
let ps = [];

for(let i=0; i<40; i++) ps.push({x:Math.random()*w, y:Math.random()*h, s:Math.random()*2, vx:Math.random()-0.5, vy:Math.random()-0.5});

function draw() {
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "rgba(245, 200, 66, 0.2)";
    ps.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0 || p.x>w) p.vx*=-1;
        if(p.y<0 || p.y>h) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
}
draw();