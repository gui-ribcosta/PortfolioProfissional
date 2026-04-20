/**
 * resume.js
 * Gerencia a troca do PDF exibido e do link de download
 * ao alternar o idioma na página de currículo.
 */

document.addEventListener('DOMContentLoaded', () => {
  const langToggle  = document.getElementById('langToggle');
  const pdfViewer   = document.getElementById('pdfViewer');
  const downloadBtn = document.getElementById('downloadBtn');

  if (!pdfViewer || !downloadBtn) return;

  /**
   * Aplica o PDF correto para o idioma recebido,
   * atualizando o iframe e o link de download.
   * @param {string} lang - 'pt-BR' ou 'en'
   */
  function applyPdf(lang) {
    const attr = lang === 'en' ? 'data-pdf-en' : 'data-pdf-pt';
    const src  = pdfViewer.getAttribute(attr);

    if (!src) return;

    pdfViewer.src        = src;
    downloadBtn.href     = src;
    downloadBtn.download = src.split('/').pop();
  }

  // Aplica no carregamento conforme idioma salvo
  const savedLang = localStorage.getItem('lang') || 'pt-BR';
  applyPdf(savedLang);

  // Escuta o clique no botão de idioma
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      // O i18n.js já atualizou o localStorage; aguarda um tick
      setTimeout(() => {
        const currentLang = localStorage.getItem('lang') || 'pt-BR';
        applyPdf(currentLang);
      }, 50);
    });
  }
});
