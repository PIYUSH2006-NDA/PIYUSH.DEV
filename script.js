/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 800);
});

/* ===== PARTICLE BACKGROUND ===== */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  const COUNT = 60;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.r = Math.random() * 1.8 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,57,70,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(230,57,70,${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===== MOUSE GLOW ===== */
(function initMouseGlow() {
  const glow = document.getElementById('mouse-glow');
  if (!glow) return;
  let mx = -500, my = -500;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function update() {
    glow.style.left = mx + 'px';
    glow.style.top = my + 'px';
    requestAnimationFrame(update);
  }
  update();
  // Hide on touch devices
  if ('ontouchstart' in window) glow.style.display = 'none';
})();

/* ===== TYPING EFFECT ===== */
const textElement = document.getElementById("typing");
const phrases = ["Problem Solver", "Code Explorer", "AI Enthusiast", "Innovator"];
let phraseIndex = 0, charIndex = 0, isDeleting = false, lastTime = 0;
const TYPE_SPEED = 80, DELETE_SPEED = 45, HOLD_DELAY = 1500;

function typeEffect(timestamp) {
  if (timestamp - lastTime < (isDeleting ? DELETE_SPEED : TYPE_SPEED)) {
    requestAnimationFrame(typeEffect); return;
  }
  lastTime = timestamp;
  const currentPhrase = phrases[phraseIndex];
  if (!isDeleting) {
    charIndex++;
    textElement.textContent = currentPhrase.slice(0, charIndex);
    if (charIndex === currentPhrase.length) {
      setTimeout(() => isDeleting = true, HOLD_DELAY);
    }
  } else {
    charIndex--;
    textElement.textContent = currentPhrase.slice(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  requestAnimationFrame(typeEffect);
}
requestAnimationFrame(typeEffect);

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===== NAVBAR: Scroll highlighting + shrink ===== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links li');
const navbar = document.getElementById('navbar');

function updateNav() {
  const scrollY = window.scrollY;
  // Navbar background
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);
  // Active section
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    const bottom = top + sec.offsetHeight;
    const id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < bottom) {
      navItems.forEach(li => {
        li.classList.remove('active');
        if (li.querySelector('a')?.getAttribute('href') === '#' + id) {
          li.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal-text');
const projectCards = document.querySelectorAll('.project-card');

function revealOnScroll() {
  const wh = window.innerHeight;
  revealEls.forEach((el, i) => {
    if (el.getBoundingClientRect().top < wh - 60) {
      setTimeout(() => el.classList.add('active'), i * 120);
    }
  });
  projectCards.forEach((card, i) => {
    if (card.getBoundingClientRect().top < wh - 60) {
      setTimeout(() => card.classList.add('visible'), i * 100);
    }
  });
}
window.addEventListener('scroll', revealOnScroll, { passive: true });
revealOnScroll();

/* ===== CODE CARD 3D TILT ===== */
const codeCard = document.querySelector('.about-code');
if (codeCard) {
  codeCard.addEventListener('mousemove', e => {
    const rect = codeCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    codeCard.style.transform =
      `perspective(800px) rotateX(${-y / 30}deg) rotateY(${x / 30}deg) translateY(-6px)`;
  });
  codeCard.addEventListener('mouseleave', () => {
    codeCard.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
}

/* ===== MORE/LESS TOGGLE ===== */
document.addEventListener('click', function (e) {
  if (!e.target.classList.contains('more-link')) return;
  const parent = e.target.closest('.project-text');
  const moreText = parent.querySelector('.more-text');
  const dots = parent.querySelector('.dots');
  const isOpen = moreText.classList.contains('show');
  if (isOpen) {
    moreText.classList.remove('show');
    moreText.style.display = 'none';
    if (dots) dots.classList.remove('hide');
    if (dots) dots.style.display = 'inline';
    e.target.textContent = 'MORE';
  } else {
    moreText.classList.add('show');
    moreText.style.display = 'inline';
    if (dots) dots.classList.add('hide');
    if (dots) dots.style.display = 'none';
    e.target.textContent = 'LESS';
  }
});

/* ===== SECTION TITLE REVEAL ===== */
const sectionTitles = document.querySelectorAll('.section-title');
const titleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp .7s ease both';
    }
  });
}, { threshold: 0.3 });
sectionTitles.forEach(t => titleObserver.observe(t));
