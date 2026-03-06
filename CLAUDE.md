# B Corp Widget Project

## Overview

This project provides embeddable B Corp certification widgets for customers (primarily Shopify stores). Each customer can have their own customized version of the widget, or use the master template with their own config values.

## Architecture

```
Customer's Shopify Site
        |
        +-- <div id="bcorp-widget">
        +-- <script> window.BCORP_CONFIG = {...} </script>
        +-- <link> -> hostdgtl.com/scripts/{version}/style.css
        +-- <script> -> hostdgtl.com/scripts/{version}/app.js
                              |
                              v
                    Hostinger (hostdgtl.com)
                              |
                              v
                    GitHub (hostdigitaldata/hostdgtl)
```

Widget scripts and assets are served from hostdgtl.com. The website repo lives at `C:\Users\alan\Desktop\hostdgtl.com\hostdgtl\`.

## Local Folder Structure

```
Outreach/
├── CLAUDE.md                 # This file
│
├── b-corp-main/              # Master widget template
│   ├── assets/
│   ├── scripts/
│   │   ├── app.js
│   │   └── style.css
│   └── index.html            # Local preview
│
├── handmade-soap/            # The Handmade Soap Company
├── Delilah/
├── Gatineau/
├── Hertility/
├── NalasBaby/
├── Peaches/
├── SaltOfTheEarth/
└── yescolours/
```

Each customer folder follows the same structure: `assets/`, `scripts/` (with `app.js` + `style.css`), and an `index.html` or `widget.html` for local preview.

## Development Workflow

1. **Edit locally** in the customer's folder (e.g. `b-corp-main/`, `Peaches/`)
2. **Preview locally** by opening `index.html` or `widget.html` in browser
3. **Deploy** — copy to the hostdgtl.com website repo at `C:\Users\alan\Desktop\hostdgtl.com\hostdgtl\`:
   - **Scripts:** `{customer}/scripts/app.js` + `style.css` → `hostdgtl/scripts/{customer-name}/`
   - **Brand logo:** `{customer}/assets/{logo-file}` → `hostdgtl/assets/`
4. **Stage only the new/changed files** in the hostdgtl repo — do not use `git add -A` or `git add .`
5. **Commit and push** the hostdgtl repo
6. **Hostinger auto-deploys** (or click Deploy button)

## Widget Versions

### Master (`/scripts/master/`)
- Generic template widget in `b-corp-main/`
- Use for new customers who don't need customizations
- Customers configure via `BCORP_CONFIG` object

### Adding New Customers
1. Create folder: `Outreach/{customer-name}/`
2. Copy files from `b-corp-main/` as starting point
3. Customize as needed
4. Deploy scripts + brand logo to the hostdgtl website repo (see workflow above)
5. Provide embed code to customer

## Embed Code Template

```html
<!--
  B Corp Widget — Shopify Custom Liquid Block
  Paste this into a Custom Liquid block on your product page.
-->

<div id="bcorp-widget"></div>

<script>
  window.BCORP_CONFIG = {
    brandName: 'Customer Brand Name',
    brandLogo: 'https://hostdgtl.com/assets/{logo-file}',
    overallScore: 0,
    certificationDate: 'Month Year',
    qualifyingScore: 80,
    medianScore: 50.9,
    governance: 0,
    workers: 0,
    community: 0,
    environment: 0,
    customers: 0,
    profileUrl: 'https://www.bcorporation.net/en-us/find-a-b-corp/company/{company-slug}/'
  };
</script>

<link rel="stylesheet" href="https://hostdgtl.com/scripts/{version}/style.css">
<script src="https://hostdgtl.com/scripts/{version}/app.js" defer></script>
```

## Browser Console Demo Script

For demoing the widget on any webpage:

### Master Version
```javascript
{
  window.BCORP_CONFIG = {
    brandName: 'The Handmade Soap Company',
    brandLogo: 'https://hostdgtl.com/assets/handmade.avif',
    overallScore: 94.1,
    certificationDate: 'October 2022',
    qualifyingScore: 80,
    medianScore: 50.9,
    governance: 17.4,
    workers: 20.5,
    community: 20.8,
    environment: 32.0,
    customers: 3.1,
    profileUrl: 'https://www.bcorporation.net/en-us/find-a-b-corp/company/the-handmade-soap-company/'
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
  cssLink.href = 'https://hostdgtl.com/scripts/master/style.css';
  document.head.appendChild(cssLink);

  const widgetScript = document.createElement('script');
  widgetScript.src = 'https://hostdgtl.com/scripts/master/app.js';
  document.body.appendChild(widgetScript);

  const style = document.createElement('style');
  style.innerHTML = `#bcorp-widget, #bcorp-widget * { font-family: 'Inter', sans-serif !important; }`;
  document.head.appendChild(style);

  console.log("Widget successfully re-injected!");
}
```

## Key URLs

| Resource | URL |
|----------|-----|
| Master CSS | https://hostdgtl.com/scripts/master/style.css |
| Master JS | https://hostdgtl.com/scripts/master/app.js |
| Assets folder | https://hostdgtl.com/assets/ |
| Website repo (for deployment) | `C:\Users\alan\Desktop\hostdgtl.com\hostdgtl\` |

## Local Preview URLs

| Widget | Local Preview |
|--------|---------------|
| Master | `file:///C:/Users/alan/Desktop/Outreach/b-corp-main/index.html` |
| Handmade Soap | `file:///C:/Users/alan/Desktop/Outreach/handmade-soap/widget.html` |

## Important Notes

1. **CDN_BASE** in `app.js` should point to `https://hostdgtl.com/assets/` (not jsDelivr)
2. **Legacy files** at `/scripts/app.js` and `/scripts/style.css` on hostdgtl.com still exist for backwards compatibility
3. **Deployment** goes through the hostdgtl website repo — only `scripts/{customer}/` and `assets/` need updating there
