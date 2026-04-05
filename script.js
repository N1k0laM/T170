// ======================== MUZIKA ========================
const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
 
if (music && musicBtn) {
  music.volume = 0.12;
  musicBtn.addEventListener('click', () => {
    if (music.paused) {
      music.play();
      musicBtn.innerText = "🎵 ON";
      musicBtn.classList.add('active');
    } else {
      music.pause();
      musicBtn.innerText = "🎵 OFF";
      musicBtn.classList.remove('active');
    }
  });
}
 
// ======================== PARTICLE CANVAS ========================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;
 
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
 
  function randomBetween(a, b) { return a + Math.random() * (b - a); }
 
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = randomBetween(0, W);
      this.y = randomBetween(0, H);
      this.r = randomBetween(0.5, 1.8);
      this.vx = randomBetween(-0.2, 0.2);
      this.vy = randomBetween(-0.3, -0.05);
      this.alpha = randomBetween(0.2, 0.7);
      this.color = Math.random() > 0.6 ? '#00d4ff' : '#f5c842';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.001;
      if (this.y < -5 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
 
  for (let i = 0; i < 120; i++) particles.push(new Particle());
 
  function animParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animParticles);
  }
  animParticles();
}
 
// ======================== 3D PORTRAIT DRAG ========================
const portraitCard = document.getElementById('portraitCard');
if (portraitCard) {
  let isDragging = false;
  let startX = 0;
  let currentRotY = 0;
  let targetRotY = 0;
  let rafId;
 
  function lerp(a, b, t) { return a + (b - a) * t; }
 
  function animateRotation() {
    currentRotY = lerp(currentRotY, targetRotY, 0.1);
    portraitCard.style.transform = `rotateY(${currentRotY}deg)`;
    rafId = requestAnimationFrame(animateRotation);
  }
  animateRotation();
 
  // Mouse events
  portraitCard.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    portraitCard.style.cursor = 'grabbing';
    e.preventDefault();
  });
 
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    targetRotY = currentRotY + dx * 0.4;
    startX = e.clientX;
  });
 
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    portraitCard.style.cursor = 'grab';
    // Snap back to nearest 0 or 180
    const mod = ((targetRotY % 360) + 360) % 360;
    if (mod > 90 && mod < 270) {
      targetRotY = Math.round(targetRotY / 180) * 180;
    } else {
      targetRotY = Math.round(targetRotY / 360) * 360;
    }
  });
 
  // Touch events
  portraitCard.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    e.preventDefault();
  }, { passive: false });
 
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dx = e.touches[0].clientX - startX;
    targetRotY = currentRotY + dx * 0.5;
    startX = e.touches[0].clientX;
  });
 
  document.addEventListener('touchend', () => {
    isDragging = false;
    const mod = ((targetRotY % 360) + 360) % 360;
    if (mod > 90 && mod < 270) {
      targetRotY = Math.round(targetRotY / 180) * 180;
    } else {
      targetRotY = Math.round(targetRotY / 360) * 360;
    }
  });
 
  // Auto-spin hint on load
  let autoSpinDone = false;
  setTimeout(() => {
    if (!autoSpinDone) {
      autoSpinDone = true;
      targetRotY = 15;
      setTimeout(() => { targetRotY = -15; }, 800);
      setTimeout(() => { targetRotY = 0; }, 1600);
    }
  }, 1500);
}
 
// ======================== SCROLL ANIMATIONS ========================
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
 
document.querySelectorAll('.scroll-anim').forEach(el => {
  scrollObserver.observe(el);
});
 
// ======================== ACTIVE NAV HIGHLIGHT ========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');
 
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--primary)';
        }
      });
    }
  });
}, { threshold: 0.4 });
 
sections.forEach(s => sectionObserver.observe(s));
 