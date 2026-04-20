document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.getElementById("langToggle");
  const htmlTag = document.documentElement;

  // Define o idioma atual baseado no localStorage ou html lang (padrão pt-BR)
  let currentLang = localStorage.getItem("lang") || htmlTag.lang || "pt-BR";

  // Garante que a tag html tem o idioma correto
  htmlTag.lang = currentLang;

  // Função para atualizar todos os textos da página
  function updateTexts() {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      const attr = el.getAttribute("data-i18n-attr");

      if (translations[currentLang] && translations[currentLang][key]) {
        if (attr) {
          el.setAttribute(attr, translations[currentLang][key]);
        } else {
          el.innerHTML = translations[currentLang][key];
        }
      }
    });

    // Atualiza tooltip do botão de idioma, se existir
    if (langToggle) {
      const tooltip = langToggle.querySelector(".lang-tooltip, .icon-tooltip");
      if (tooltip) {
        tooltip.textContent = currentLang === "pt-BR" ? "TRANSLATE TO ENGLISH" : "TRADUZIR PARA PORTUGUÊS";
      }
    }
  }

  // Atualiza os textos na inicialização
  if (typeof translations !== "undefined") {
    updateTexts();
  }

  function toggleLang() {
    currentLang = currentLang === "pt-BR" ? "en" : "pt-BR";
    htmlTag.lang = currentLang;
    localStorage.setItem("lang", currentLang);
    if (typeof translations !== "undefined") {
      updateTexts();
    }
  }

  if (langToggle) {
    langToggle.addEventListener("click", toggleLang);
  }

  // Botão de tradução no menu mobile (index.html)
  const langToggleMobile = document.getElementById("langToggleMobile");
  if (langToggleMobile) {
    langToggleMobile.addEventListener("click", toggleLang);
  }
});
