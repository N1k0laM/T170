const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicToggle');
let musicStarted = false;

// Funkcija koja pokreće muziku na prvi interaktivni klik
function startMusic() {
    if (!musicStarted) {
        music.volume = 0.15; // Tiho u pozadini
        music.play();
        musicBtn.innerText = "🎵 Muzika: ON";
        musicBtn.classList.add('active');
        musicStarted = true;
    }
}

// Ručno gašenje/paljenje na dugme
musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Sprečava body klik
    if (music.paused) {
        music.play();
        musicBtn.innerText = "🎵 Muzika: ON";
        musicBtn.classList.add('active');
    } else {
        music.pause();
        musicBtn.innerText = "🎵 Muzika: OFF";
        musicBtn.classList.remove('active');
    }
});

// Animacije pri skrolovanju
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.scroll-anim').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
    observer.observe(el);
});