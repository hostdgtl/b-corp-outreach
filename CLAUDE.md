# B Corp Widget Project

## Overview

This project provides embeddable B Corp certification widgets for customers (primarily Shopify stores). Each customer can have their own customized version of the widget, or use the master template with their own config values.

## Repo

- GitHub: `https://github.com/hostdgtl/b-corp-outreach`
- Branch: `main`
- Local path: `C:\Users\alan\Desktop\Outreach\`

## Local Folder Structure

```
Outreach/
├── CLAUDE.md                 # This file
├── Outbound.md               # Outreach email workflow & targeting process
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
├── Hertility/                # Includes _plans/, _specs/, and deployed/
├── NalasBaby/
├── Peaches/
├── SaltOfTheEarth/
└── yescolours/
```

Each customer folder follows the same structure: `assets/`, `scripts/` (with `app.js` + `style.css`), and an `index.html` or `widget.html` for local preview.

## Development Workflow

1. **Edit locally** in the customer's folder (e.g. `b-corp-main/`, `Peaches/`)
2. **Preview locally** by opening `index.html` or `widget.html` in browser
3. **Commit and push** this repo (`b-corp-outreach`)

### Serving via jsDelivr CDN

Widget scripts and brand logos are served directly from this GitHub repo via jsDelivr. No separate deployment step is needed — just commit and push to `main`, and jsDelivr serves the files with correct MIME types.

**Base URL:** `https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/`

Examples:
- Master widget JS: `https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/b-corp-main/scripts/app.js`
- Master widget CSS: `https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/b-corp-main/scripts/style.css`
- Customer logo: `https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/{Customer}/assets/{logo-file}`

**Cache:** jsDelivr caches files aggressively. Using `@main` auto-refreshes within ~12 hours. For instant purge, use `https://purge.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/{path}`.

## Widget Versions

### Master
- Generic template widget in `b-corp-main/`
- Use for new customers who don't need customizations
- Customers configure via `BCORP_CONFIG` object

### Adding New Customers
1. Create folder: `Outreach/{customer-name}/`
2. Copy files from `b-corp-main/` as starting point
3. Customize as needed (see `Outbound.md` for the full outreach workflow)
4. Commit and push to this repo
5. Commit and push — jsDelivr serves the files automatically
6. Provide embed code to customer

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
    brandLogo: 'https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/{Customer}/assets/{logo-file}',
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

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/b-corp-main/scripts/style.css">
<script src="https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/b-corp-main/scripts/app.js" defer></script>
```

## Browser Console Demo Script

For demoing the widget on any webpage (inject via Chrome DevTools console):

```javascript
{
  window.BCORP_CONFIG = {
    brandName: 'The Handmade Soap Company',
    brandLogo: 'https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/handmade-soap/assets/handmade.avif',
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

## Local Preview URLs

| Widget | Local Preview |
|--------|---------------|
| Master | `file:///C:/Users/alan/Desktop/Outreach/b-corp-main/index.html` |
| Handmade Soap | `file:///C:/Users/alan/Desktop/Outreach/handmade-soap/widget.html` |

## Git Config

- Name: `hostdigitaldata`
- Email: `hostinsight@gmail.com`

## Pipeline Skills

These skills handle the outreach pipeline. **Always invoke the matching skill** rather than doing the work manually.

| File Path | Command | Function / Description |
|-----------|---------|------------------------|
| `.claude/skills/prospect/SKILL.md` | `/prospect` | Check traffic + Shopify |
| `.claude/skills/find-contacts/SKILL.md` | `/find-contacts` | Hunter.io email lookup |
| `.claude/skills/build-widget/SKILL.md` | `/build-widget` | Create personalised widget + console script |
| `.claude/skills/draft-outreach/SKILL.md` | `/draft-outreach` | Create Gmail drafts for review |

**Rule:** If a user request matches one of these skills — even if they don't use the slash command — invoke the skill. For example, "create a widget for Acme Co" should trigger `/build-widget`, and "find email for Acme Co" should trigger `/find-contacts`.

## Important Notes

1. **CDN_BASE** in `app.js` — each customer's `app.js` may reference assets via CDN_BASE. For jsDelivr serving, logo paths in `console-script.js` use the full jsDelivr URL
2. **Widget scripts are served via jsDelivr** from this repo — no separate deployment to hostdgtl.com is needed
3. **Outbound.md** contains the full outreach process: targeting, email acquisition, widget building, and demo steps
