{
  window.BCORP_CONFIG = {
    brandName: 'NEOM',
    brandLogo: 'https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/NEOM/assets/NEOM-Logo.png',
    overallScore: 100.2,
    certificationDate: 'November 2022',
    qualifyingScore: 80,
    medianScore: 50.9,
    governance: 18.0,
    workers: 29.3,
    community: 20.9,
    environment: 28.4,
    customers: 3.4,
    profileUrl: 'https://www.bcorporation.net/en-us/find-a-b-corp/company/neom-ltd/'
  };

  const widgetContainer = document.getElementById('bcorp-widget');
  if (widgetContainer) {
    widgetContainer.style.cssText = 'display:flex; justify-content:center; width:100%;';
  }

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

  widgetScript.addEventListener('load', () => {
    const overlay = document.querySelector('.bcorp-modal-overlay');
    if (overlay && overlay.parentElement !== document.body) {
      document.body.appendChild(overlay);
    }
    if (overlay) {
      overlay.style.zIndex = '999999';
    }
  });

  const style = document.createElement('style');
  style.innerHTML = `
    /* Font & text isolation */
    #bcorp-widget, #bcorp-widget *, .bcorp-modal-overlay, .bcorp-modal-overlay * {
      font-family: 'Inter', sans-serif !important;
      text-transform: none !important;
      letter-spacing: normal !important;
      word-spacing: normal !important;
    }

    /* Modal overlay — hardcoded custom properties (survives CDN caching & theme resets) */
    .bcorp-modal-overlay {
      --bcorp-primary: #1a472a;
      --bcorp-primary-light: #2d5a3d;
      --bcorp-accent: #8bc34a;
      --bcorp-accent-light: #c5e1a5;
      --bcorp-bg: #ffffff;
      --bcorp-bg-secondary: #f8f9fa;
      --bcorp-text: #1a1a1a;
      --bcorp-text-muted: #6c757d;
      --bcorp-border: #e0e0e0;
      --bcorp-radius: 12px;
      --bcorp-radius-sm: 8px;
      --bcorp-governance: #1a472a;
      --bcorp-workers: #2d6a4f;
      --bcorp-community: #40916c;
      --bcorp-environment: #52b788;
      --bcorp-customers: #74c69d;
    }

    /* Modal chrome */
    .bcorp-modal { border-radius: 12px !important; background: #ffffff !important; }
    .bcorp-modal__header { border-bottom: 1px solid #e0e0e0 !important; background: #ffffff !important; }
    .bcorp-modal__description { border-bottom: 1px solid #e0e0e0 !important; background: #ffffff !important; }
    .bcorp-score-section { border-bottom: 1px solid #e0e0e0 !important; background: #ffffff !important; }
    .bcorp-score-section__inner { border-radius: 16px !important; }
    .bcorp-breakdown { border-bottom: 1px solid #e0e0e0 !important; background: #ffffff !important; }
    .bcorp-benchmark { border-radius: 10px !important; }

    /* Category bar gradients */
    .bcorp-category__fill { display: block !important; }
    .bcorp-modal-overlay.active .bcorp-category__fill { width: var(--width) !important; }
    .bcorp-category--governance .bcorp-category__fill { background: linear-gradient(90deg, #1a472a, #8bc34a) !important; }
    .bcorp-category--workers .bcorp-category__fill { background: linear-gradient(90deg, #2d6a4f, #8bc34a) !important; }
    .bcorp-category--community .bcorp-category__fill { background: linear-gradient(90deg, #40916c, #8bc34a) !important; }
    .bcorp-category--environment .bcorp-category__fill { background: linear-gradient(90deg, #52b788, #8bc34a) !important; }
    .bcorp-category--customers .bcorp-category__fill { background: linear-gradient(90deg, #74c69d, #8bc34a) !important; }

    /* Progress ring */
    .bcorp-progress-ring__bg { stroke: #e8e8e8 !important; fill: none !important; }
    .bcorp-progress-ring__progress { stroke: #1a472a !important; fill: none !important; }
    .bcorp-modal-overlay.active .bcorp-progress-ring__progress {
      stroke-dashoffset: calc(295.31 - (295.31 * var(--progress) / 100)) !important;
    }

    /* Proof section */
    .bcorp-proof { background: #f8f9fa !important; border-left: 4px solid #1a472a !important; border-radius: 0 8px 8px 0 !important; }
    .bcorp-proof__link { border: 2px solid #1a472a !important; border-radius: 50px !important; color: #1a472a !important; text-decoration: none !important; }
    .bcorp-proof__link:hover { background: #1a472a !important; color: #ffffff !important; }

    /* Trigger hover protection */
    .bcorp-trigger { background: #ffffff !important; border: 1px solid #EBEBEB !important; }
    .bcorp-trigger:hover { background: #f8f9fa !important; border-color: #1a472a !important; }
    .bcorp-trigger * { background: none !important; }
    .bcorp-trigger__logo-wrapper { background: #ffffff !important; border: 1px solid #EBEBEB !important; border-radius: 50% !important; }

    /* Overlay scroll fix */
    .bcorp-modal-overlay:not(.active) { pointer-events: none !important; }
  `;
  document.head.appendChild(style);

  console.log("Widget successfully re-injected!");
}
