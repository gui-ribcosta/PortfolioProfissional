/**
 * resume.js
 * Gerencia a renderização do PDF usando pdf.js e a troca do link de download
 * ao alternar o idioma na página de currículo.
 */

document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  const pdfContainer = document.getElementById('pdfContainer');
  const downloadBtn = document.getElementById('downloadBtn');

  // Garante acesso à variável global do PDF.js (usando a versão local carregada no HTML)
  const pdfjs = window.pdfjsLib || window['pdfjs-dist/build/pdf'];

  if (!pdfContainer || !downloadBtn) return;

  if (!pdfjs) {
    console.error("PDF.js não encontrado. Verifique se o arquivo scripts/libs/pdf.min.js existe.");
    pdfContainer.innerHTML = '<p style="color: white; text-align: center; padding: 20px;">Erro ao carregar o visualizador. Verifique os arquivos do projeto.</p>';
    return;
  }

  // Configura o worker do pdf.js para o arquivo LOCAL baixado
  pdfjs.GlobalWorkerOptions.workerSrc = '../scripts/libs/pdf.worker.min.js';

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
      pdfContainer.innerHTML = '<p style="color: white; text-align: center; padding: 40px;"><i class="fa-solid fa-spinner fa-spin"></i> Carregando currículo...</p>';

      const loadingTask = pdfjs.getDocument({
        url: url,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
      });
      
      currentPdfDoc = await loadingTask.promise;
      pdfContainer.innerHTML = ''; // Limpa o loading

      const numPages = currentPdfDoc.numPages;
      const containerWidth = pdfContainer.clientWidth - 32;
      
      for (let i = 1; i <= numPages; i++) {
        const page = await currentPdfDoc.getPage(i);
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        let scale = containerWidth / unscaledViewport.width;
        if (scale > 1.5) scale = 1.5;

        const viewport = page.getViewport({ scale: scale });
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
        await renderTask.promise;
      }
    } catch (error) {
      console.error('Erro ao renderizar o PDF:', error);
      pdfContainer.innerHTML = '<p style="color: #ff4444; text-align: center; padding: 20px;">Não foi possível carregar o arquivo PDF.</p>';
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

  const savedLang = localStorage.getItem('lang') || 'pt-BR';
  setTimeout(() => applyPdf(savedLang), 100);

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      setTimeout(() => {
        const currentLang = localStorage.getItem('lang') || 'pt-BR';
        applyPdf(currentLang);
      }, 50);
    });
  }

  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
      if (currentPdfDoc) {
        const currentLang = localStorage.getItem('lang') || 'pt-BR';
        applyPdf(currentLang);
      }
    }, 300);
  });
});
