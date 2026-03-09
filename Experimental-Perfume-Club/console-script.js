{
  window.BCORP_CONFIG = {
    brandName: 'Experimental Perfume Club',
    brandLogo: 'https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/Experimental-Perfume-Club/assets/Experimental-Perfume-Club-Logo.webp',
    overallScore: 85.0,
    certificationDate: 'June 2024',
    qualifyingScore: 80,
    medianScore: 50.9,
    governance: 14.0,
    workers: 23.3,
    community: 17.5,
    environment: 17.1,
    customers: 13.0,
    profileUrl: 'https://www.bcorporation.net/en-us/find-a-b-corp/company/experimental-perfume-club-ltd/'
  };

  let widgetContainer = document.getElementById('bcorp-widget');
  if (!widgetContainer) {
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'bcorp-widget';
    document.body.prepend(widgetContainer);
  }
  widgetContainer.style.cssText = 'display:flex; justify-content:center; width:100%;';

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(fontLink);

  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = 'https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/b-corp-main/scripts/style.css';
  document.head.appendChild(cssLink);

  const widgetScript = document.createElement('script');
  widgetScript.src = 'https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/b-corp-main/scripts/app.js';
  document.body.appendChild(widgetScript);

  const style = document.createElement('style');
  style.innerHTML = `
    #bcorp-widget, #bcorp-widget *, .bcorp-modal-overlay, .bcorp-modal-overlay * {
      font-family: 'Inter', sans-serif !important;
      text-transform: none !important;
      letter-spacing: normal !important;
      word-spacing: normal !important;
    }
    .bcorp-category__fill {
      display: block !important;
    }
    .bcorp-modal-overlay.active .bcorp-category__fill {
      width: var(--width) !important;
    }
    .bcorp-modal-overlay.active .bcorp-progress-ring__progress {
      stroke-dashoffset: calc(295.31 - (295.31 * var(--progress) / 100)) !important;
    }
  `;
  document.head.appendChild(style);

  console.log("Widget successfully re-injected!");
}
