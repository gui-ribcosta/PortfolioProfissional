// ===========================
// MOBILE MENU
// ===========================
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  const closeBtn = document.getElementById('closeMobileNav');
  const overlay = document.getElementById('overlay');
  const header = document.querySelector('.header');

  if (!mobileToggle || !mobileNav) return;

  mobileToggle.addEventListener('click', () => {
    mobileNav.classList.add('active');
    overlay?.classList.add('active');
  });

  closeBtn?.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    overlay?.classList.remove('active');
  });

  overlay?.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
  });

  // Scroll suave + fecha menu ao clicar em link âncora
  mobileNav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      mobileNav.classList.remove('active');
      overlay?.classList.remove('active');

      const topPos = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0);
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    });
  });
}

// ===========================
// TEMA CLARO / ESCURO
// ===========================
function initThemeToggle() {
  const themeToggle = document.getElementById("themeToggle");
  const themeToggleMobile = document.getElementById("themeToggleMobile");
  const root = document.documentElement;

  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  [themeToggle, themeToggleMobile].forEach(btn => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  });
}

// ===========================
// REVEAL ON SCROLL
// ===========================
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 150) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();
}

// ===========================
// ESTRELAS DINÂMICAS (PERFORMANCE)
// ===========================
function initStars() {
  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;

  // Define a quantidade de estrelas
  const numStars = 40;

  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    // Posição aleatória
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Duração e delay aleatórios
    const duration = 1.5 + Math.random() * 2;
    const delay = Math.random() * 2;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.setProperty('--twinkle-duration', `${duration}s`);
    star.style.animationDelay = `${delay}s`;

    starsContainer.appendChild(star);
  }
}

// ===========================
// OFUSCAÇÃO DE CONTATOS
// ===========================
function initContactProtection() {
  const contactBtns = document.querySelectorAll('.js-contact');
  if (!contactBtns.length) return;

  contactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const type = btn.getAttribute('data-type');
      const info = btn.getAttribute('data-info');
      
      if (!type || !info) return;
      
      try {
        const decoded = atob(info);
        if (type === 'email') {
          window.location.href = `mailto:${decoded}`;
        } else if (type === 'wa') {
          window.open(`https://wa.me/${decoded}`, '_blank', 'noopener,noreferrer');
        }
      } catch (err) {
        console.error('Erro ao decodificar contato', err);
      }
    });
  });
}

// Executar as inicializações auto-contidas (as que não são chamadas no main.js)
document.addEventListener("DOMContentLoaded", () => {
  initStars();
  initContactProtection();
});
