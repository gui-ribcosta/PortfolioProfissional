document.addEventListener("DOMContentLoaded", () => {

  // UI
  initMobileMenu();
  initThemeToggle();
  initRevealOnScroll();

  // COMPONENTS
  new Carrossel("#projetos");
  new Carrossel("#certificados");
  initCertTechSlider();

});
