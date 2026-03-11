# /build-widget — Create personalised widget for a prospect

## Context

You're building a personalised B Corp widget demo for a specific prospect company. This widget will be injected into the prospect's live website (via browser console) so Host Digital can screen-record a demo video showing how it looks on their actual site. The personalisation is what makes the outreach compelling — it's not a generic pitch, it's a working prototype on their site.

Each widget needs:
1. A folder in the Outreach repo with the company's customised widget code
2. The company's logo
3. Their actual B Corp scores from the B Corp directory
4. A ready-to-paste browser console script

## What success looks like

- A new folder at `C:\Users\alan\Desktop\Outreach\{Company-Name}\` with the widget files
- The widget uses the company's real logo and real B Corp certification data
- A console injection script is saved that Host Digital can paste into DevTools on the prospect's website
- Host Digital can open the prospect's site, paste the script, and see a working personalised widget

## How to execute

### Step 1: Get company info from the sheet
```bash
node "C:\Users\alan\Desktop\Outreach\agent\sheets-helper.js" read "master_list!A:I"
```

Identify the target company. You need: company name (A), website URL (C).

### Step 2: Duplicate the master widget template
Copy `C:\Users\alan\Desktop\Outreach\b-corp-main\` to `C:\Users\alan\Desktop\Outreach\{Company-Name}\`

Use Train-Case for the folder name (e.g. "The Handmade Soap Company" → "Handmade-Soap", "Nala's Baby" → "NalasBaby" or "Nalas-Baby"). Follow the conventions of existing folders in the repo.

### Step 3: Source and download the company logo
Find the company's logo from their own website first — check the `og:image` meta tag, or search the page source for "logo". Failing that, search the web. Look for SVG or high-quality PNG format.

Download the logo to `{Company-Name}\assets\{Company-Name}-Logo.{ext}`. Delete the old `handmade.avif` from the new folder's assets.

Update logo references in three places:
- `scripts/app.js` — leave the CDN_BASE default as-is (used when deployed)
- `index.html` — use a relative path: `assets/{Company-Name}-Logo.{ext}`
- `console-script.js` — use jsDelivr URL: `https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/{Company-Name}/assets/{Company-Name}-Logo.{ext}`

### Step 4: Get B Corp certification data
Fetch the company's B Corp profile. The directory URL pattern is:
`https://www.bcorporation.net/en-us/find-a-b-corp/company/{company-slug}/`

Use WebFetch to extract: overall score, certification date, and the five impact area scores (governance, workers, community, environment, customers). Also get the profile URL.

### Step 5: Build the console injection script
Create a file at `{Company-Name}\console-script.js` using this template. Replace all values with the company's real data:

```javascript
{
  window.BCORP_CONFIG = {
    brandName: '{Company Name}',
    brandLogo: 'https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/{Company-Name}/assets/{Company-Name}-Logo.{ext}',
    overallScore: 0,
    certificationDate: '{Month Year}',
    qualifyingScore: 80,
    medianScore: 50.9,
    governance: 0,
    workers: 0,
    community: 0,
    environment: 0,
    customers: 0,
    profileUrl: 'https://www.bcorporation.net/en-us/find-a-b-corp/company/{slug}/'
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

  // After app.js loads, move modal overlay to body and set z-index
  // (belt-and-suspenders — CDN may serve stale app.js without this fix)
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
```

All URLs in the console script use jsDelivr to serve files directly from this GitHub repo. The logo and widget scripts will be available as soon as the company folder is committed and pushed. jsDelivr caches aggressively — if you need to bust the cache after an update, use `@main` in the URL (which auto-refreshes within ~12 hours) or pin to a specific commit hash.

### Step 6: Update the widget's app.js config
In the new folder's `scripts/app.js`, update the BCORP_CONFIG defaults to match this company's data.

### Step 7: Update index.html for local preview
The template's `index.html` has its own inline `BCORP_CONFIG` block that overrides the `app.js` defaults. Update all config values in `index.html` to match this company's data — brand name, logo path (relative: `assets/{Company-Name}-Logo.{ext}`), scores, certification date, and profile URL. If this step is skipped, the local preview will show the template's placeholder data instead of the prospect's.

### Step 8: Output the console script in a markdown file
After all files are saved, create a markdown file at `C:\Users\alan\Desktop\Outreach\{Company-Name}\console-script.md` containing the full console script in a fenced JavaScript code block. This is what Host Digital will copy from to paste into the browser console on the prospect's website to record the demo video. The script must be ready to paste — no placeholders, no instructions, just the working script in a code block.

### Step 9: Commit and push to GitHub
The console script references brand logos via jsDelivr, which serves files from this GitHub repo. The logo won't render until the new folder is pushed. Commit the new company folder and push to `main`:

```bash
cd "C:\Users\alan\Desktop\Outreach"
git add "{Company-Name}/"
git commit -m "Add {Company Name} widget and console script"
git push origin main
```

This makes the logo and any other assets available at `https://cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/{Company-Name}/assets/...` immediately (jsDelivr picks up new files quickly; cached files may take up to 12 hours to refresh).

### Boundaries

**Do not modify the `b-corp-main/` template folder** — only duplicate it. This is the master template that all future widgets are built from. Changes here would silently propagate to every subsequent prospect, potentially breaking working widgets or introducing unreviewed changes.

**Do not edit any files outside the new company folder.** Other company folders contain finalised or in-progress work for other prospects. The master template, other customer folders, and shared config are all off-limits. This skill creates one self-contained folder per prospect.

**Do not alter the widget code beyond what's specified in the instructions** (config values, logo reference, console script generation). The widget's behaviour, styling, and structure are already tested and proven. "Improving" the widget for one prospect creates inconsistency across the portfolio and introduces untested changes into what gets shown to a real prospect.

**Do not create or fabricate a logo** (e.g. generating one with AI or building a placeholder). Source and download the company's actual brand logo from their website or the web. SVG is preferred, then high-quality PNG. If only a low-res or questionable version is available, download it but flag it to Host Digital — they may want to source a better version before recording the demo.

**Do not contact any prospect directly.** This skill builds demo assets — it has no reason to interact with the prospect. Outreach happens later, after the demo video is recorded and reviewed.

**Do not write to the Google Sheet.** This skill works entirely on the local filesystem. Sheet updates for tracking are handled by other skills.

### Judgment calls

- **B Corp data accuracy is critical.** These scores appear in what we're showing to the prospect. If the B Corp directory page is unclear or the data doesn't parse cleanly, flag it to Host Digital rather than guessing. A wrong score would undermine trust immediately.
- **Logo quality matters.** SVG is preferred. If only a low-res raster image is available, note it — Host Digital may want to source a better version. Don't use a blurry or tiny logo.
- **If the company isn't found in the B Corp directory**, stop and tell Host Digital. The company may have lost certification, changed names, or the slug may be different. Don't proceed with made-up scores.
- **The console script paths** use jsDelivr to serve directly from this GitHub repo (`cdn.jsdelivr.net/gh/hostdgtl/b-corp-outreach@main/`). The widget scripts always point to `b-corp-main/scripts/` (the master template). The logo points to the company's own folder. Both require the folder to be committed and pushed before the console script will work.
