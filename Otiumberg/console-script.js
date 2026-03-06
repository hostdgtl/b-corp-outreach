{
  window.BCORP_CONFIG = {
    brandName: 'Otiumberg',
    brandLogo: 'https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/Otiumberg/assets/Otiumberg-Logo.png',
    overallScore: 82.4,
    certificationDate: 'July 2023',
    qualifyingScore: 80,
    medianScore: 50.9,
    governance: 14.5,
    workers: 15.0,
    community: 15.8,
    environment: 33.0,
    customers: 3.9,
    profileUrl: 'https://www.bcorporation.net/en-us/find-a-b-corp/company/otiumberg/'
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

  const style = document.createElement('style');
  style.innerHTML = `#bcorp-widget, #bcorp-widget * { font-family: 'Inter', sans-serif !important; }`;
  document.head.appendChild(style);

  console.log("Widget successfully re-injected!");
}
