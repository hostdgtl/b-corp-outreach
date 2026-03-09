```javascript
{
  window.BCORP_CONFIG = {
    brandName: 'MONPURE London',
    brandLogo: 'https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/MONPURE/assets/MONPURE-Logo.svg',
    overallScore: 80.6,
    certificationDate: 'May 2024',
    qualifyingScore: 80,
    medianScore: 50.9,
    governance: 15.8,
    workers: 28.4,
    community: 23.3,
    environment: 10.5,
    customers: 2.4,
    profileUrl: 'https://www.bcorporation.net/en-us/find-a-b-corp/company/monpure-ltd/'
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
  style.innerHTML = `#bcorp-widget, #bcorp-widget * { font-family: 'Inter', sans-serif !important; }`;
  document.head.appendChild(style);

  console.log("Widget successfully re-injected!");
}
```
