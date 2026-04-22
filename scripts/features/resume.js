/**
 * resume.js
 * Gerencia a renderização do PDF usando pdf.js e a troca do link de download
 * ao alternar o idioma na página de currículo.
 */

document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  const pdfContainer = document.getElementById('pdfContainer');
  const downloadBtn = document.getElementById('downloadBtn');

  if (!pdfContainer || !downloadBtn || typeof pdfjsLib === 'undefined') return;

  // Configura o worker do pdf.js
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  let currentRenderTasks = [];
  let currentPdfDoc = null;

  /**
   * Renderiza todas as páginas do PDF dentro do container
   * @param {string} url - Caminho do PDF
   */
  async function renderPdf(url) {
    try {
      // Limpa as páginas/tasks anteriores
      currentRenderTasks.forEach(task => task.cancel());
      currentRenderTasks = [];
      pdfContainer.innerHTML = ''; // Limpa os canvases existentes

      const loadingTask = pdfjsLib.getDocument(url);
      currentPdfDoc = await loadingTask.promise;

      const numPages = currentPdfDoc.numPages;
      const containerWidth = pdfContainer.clientWidth - 32; // descontando padding do container

      for (let i = 1; i <= numPages; i++) {
        const page = await currentPdfDoc.getPage(i);

        // Pega o viewport com escala 1 para saber o tamanho original
        const unscaledViewport = page.getViewport({ scale: 1.0 });

        // Ajusta a escala para caber na largura do container
        let scale = containerWidth / unscaledViewport.width;
        if (scale > 1.5) scale = 1.5; // Evita upscale exagerado

        const viewport = page.getViewport({ scale: scale });

        // Cria o canvas para a página
        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-canvas';
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        pdfContainer.appendChild(canvas);

        const context = canvas.getContext('2d');
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        currentRenderTasks.push(renderTask);

        await renderTask.promise; // Espera a renderização terminar para passar pra próxima
      }
    } catch (error) {
      console.error('Erro ao renderizar o PDF:', error);
    }
  }

  /**
   * Aplica o PDF correto para o idioma recebido,
   * atualizando os canvases e o link de download.
   * @param {string} lang - 'pt-BR' ou 'en'
   */
  function applyPdf(lang) {
    const attr = lang === 'en' ? 'data-pdf-en' : 'data-pdf-pt';
    const src = pdfContainer.getAttribute(attr);

    if (!src) return;

    downloadBtn.href = src;
    downloadBtn.download = src.split('/').pop();

    renderPdf(src);
  }

  // Aplica no carregamento conforme idioma salvo
  const savedLang = localStorage.getItem('lang') || 'pt-BR';

  // Pequeno delay para garantir que os estilos CSS foram aplicados antes de medir
  setTimeout(() => applyPdf(savedLang), 100);

  // Escuta o clique no botão de idioma
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      setTimeout(() => {
        const currentLang = localStorage.getItem('lang') || 'pt-BR';
        applyPdf(currentLang);
      }, 50);
    });
  }

  // Redesenha no resize para manter responsivo
  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
      const currentLang = localStorage.getItem('lang') || 'pt-BR';
      applyPdf(currentLang);
    }, 300);
  });
});
