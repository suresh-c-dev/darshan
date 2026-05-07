/* ========================================
   DARSHAN PORTFOLIO — MAIN JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Loading Screen ---
  const loader = document.querySelector('.loader-wrapper');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
    // Fallback
    setTimeout(() => loader.classList.add('hidden'), 2500);
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-custom .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop();
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealOnScroll = () => {
    revealElements.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        setTimeout(() => el.classList.add('active'), i * 80);
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // --- Scroll to Top ---
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Particle Background ---
  initParticles();

  // --- Typing Effect (Home page) ---
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const phrases = [
      'BCA Student',
      'Aspiring Developer',
      'Tech Enthusiast',
      'Continuous Learner'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeEffect, 400);
          return;
        }
      } else {
        typedEl.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) {
          isDeleting = true;
          setTimeout(typeEffect, 1800);
          return;
        }
      }
      setTimeout(typeEffect, isDeleting ? 40 : 80);
    }
    typeEffect();
  }

  // --- Contact Form Validation ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = document.getElementById('form-name');
      const email = document.getElementById('form-email');
      const message = document.getElementById('form-message');

      [name, email, message].forEach(input => {
        input.style.borderColor = '';
      });

      if (!name.value.trim()) {
        name.style.borderColor = '#ef4444';
        valid = false;
      }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#ef4444';
        valid = false;
      }
      if (!message.value.trim()) {
        message.style.borderColor = '#ef4444';
        valid = false;
      }

      if (valid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        btn.disabled = true;

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }
    });
  }

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        let count = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            entry.target.textContent = target + (entry.target.dataset.suffix || '');
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.floor(count) + (entry.target.dataset.suffix || '');
          }
        }, 16);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));
});

// --- Particle Network ---
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const count = Math.min(60, Math.floor(window.innerWidth / 20));

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
}
