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
