# /inject-widget — Inject B Corp widget into a prospect's live Shopify site

## Context

You're injecting a personalised B Corp widget into a prospect's live Shopify product page using Playwright. This is the step between building the widget (`/build-widget`) and screen-recording the demo video. The browser must be left open after injection so Host Digital can screen-record the result.

The company must already have a folder at `C:\Users\alan\Desktop\Outreach\{Company-Name}\` with a `console-script.js` file (created by `/build-widget`). That folder must also be committed and pushed to GitHub, because the console script loads assets via jsDelivr from the repo.

## What success looks like

- A Playwright browser is open showing a real product page on the prospect's Shopify site
- The B Corp widget is rendered below the product form / add-to-cart area
- The widget is visually correct (logo loads, scores display, trigger button visible)
- The browser remains open for Host Digital to screen-record
- A screenshot is saved confirming the widget rendered

## Multiple companies

When injecting for multiple companies, **use separate browser tabs** so all injected pages remain accessible for screen recording. Use the `browser_tabs` MCP tool:

1. The first company uses the default tab (no action needed).
2. For each subsequent company, open a new tab with `browser_tabs` action `new` **before** navigating to that company's site.
3. After all injections are complete, use `browser_tabs` action `list` to confirm all tabs are still open.
4. Use `browser_tabs` action `select` with the tab index to switch between tabs if needed.

**Never navigate away from an already-injected tab.** Opening a new URL in the same tab destroys the previous injection. Always create a new tab first.

## How to execute

### Step 1: Identify the company and find its folder

The skill takes a company name as its argument. Use Glob to find the matching folder:

```
Glob pattern: {Company-Name}*/console-script.js
Path: C:\Users\alan\Desktop\Outreach
```

If no `console-script.js` exists, stop and tell Host Digital to run `/build-widget` first.

### Step 2: Get the company's website URL from the Google Sheet

```bash
node "C:\Users\alan\Desktop\Outreach\agent\sheets-helper.js" read "master_list!A:C"
```

Find the row matching the company name (column A). Extract the website URL from column C.

If the company isn't found in the sheet, ask Host Digital for the URL directly.

### Step 3: Navigate to the website homepage

Use the Playwright MCP tool `browser_navigate` to open the company's website URL.

Then use `browser_snapshot` to get the page structure.

### Step 4: Find and navigate to a product page

From the homepage snapshot, look for links to product pages. Shopify product URLs follow the pattern `/products/{slug}`. Look for these in order of preference:

1. **Direct product links** visible on the homepage (featured products, bestsellers)
2. **Collection links** (`/collections/`) — if only collections are visible, click into a collection first, then find a product
3. **Navigation menu links** containing "Shop", "Products", or "Collections"

Click a product link using `browser_click`. Prefer a product that appears to be a hero/featured product — it will have the most realistic page layout for the demo.

After clicking, use `browser_snapshot` to confirm you're on a product page. A Shopify product page will have:
- A URL containing `/products/`
- An add-to-cart form or button
- Product images and description

If the first attempt doesn't land on a product page, try again with a different link. If after 3 attempts you can't reach a product page, stop and tell Host Digital — the site may have an unusual structure.

### Step 5: Find the right insertion point and insert the widget container div

The widget must be placed **outside** any width-constrained containers so it spans the full page width. It should sit below all salient product information (title, price, description, add-to-cart, accordions) but above the follow-up sections (testimonials, social proof, "voted best…", before/after photos, etc.).

**Strategy:** Inspect `<main>`'s direct children — Shopify themes typically use `shopify-section` divs as top-level siblings. Use `browser_evaluate` to enumerate them with their headings to identify:
1. The **product section** — contains the product title (`<h1>`), add-to-cart form, and product details
2. The **first follow-up section** — usually contains testimonial headings, "voted best…", stats, or before/after images

Insert the widget div as a direct child of `<main>`, between the product section and the first follow-up section.

```javascript
(() => {
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!main) return 'ERROR: no main element found';

  const children = Array.from(main.children);

  // Find the product section: the one containing the product form or h1
  let productIdx = children.findIndex(c =>
    c.querySelector('form[action*="/cart/add"]') ||
    c.querySelector('product-form') ||
    c.querySelector('.product-form') ||
    c.querySelector('[data-product-form]')
  );

  // Fallback: find the section with the h1 (product title)
  if (productIdx === -1) {
    productIdx = children.findIndex(c => c.querySelector('h1'));
  }

  if (productIdx === -1) return 'ERROR: could not identify product section';

  const insertBeforeEl = children[productIdx + 1] || null;

  const widgetDiv = document.createElement('div');
  widgetDiv.id = 'bcorp-widget';

  if (insertBeforeEl) {
    main.insertBefore(widgetDiv, insertBeforeEl);
  } else {
    main.appendChild(widgetDiv);
  }

  const nextDesc = insertBeforeEl
    ? (Array.from(insertBeforeEl.querySelectorAll('h2,h3')).map(h => h.textContent.trim().substring(0, 50)).join(', ') || 'unnamed section')
    : 'end of main';

  return 'Inserted as direct child of main, after product section (index ' + productIdx + '), before: ' + nextDesc;
})()
```

**Key principles:**
- The widget must be a **direct child of `<main>`**, not nested inside a product form or constrained column. This ensures it spans the full page width like the sections around it.
- Do NOT insert inside the product form or immediately after the add-to-cart button — that places it inside a width-constrained column.
- If the page structure is unusual, use `browser_snapshot` to inspect and pick the right insertion point manually.

### Step 6: Read and execute the console script

Read the contents of `C:\Users\alan\Desktop\Outreach\{Company-Name}\console-script.js`.

Before executing via `browser_evaluate`, strip the outer `{ }` block wrapper — it's a DevTools paste convenience that isn't needed in `browser_evaluate`.

Execute the unwrapped script contents via `browser_evaluate`. Then wait 3 seconds for the widget to load from jsDelivr:

```javascript
await new Promise(resolve => setTimeout(resolve, 3000))
```

### Step 7: Verify the widget rendered

Use `browser_snapshot` to check for elements with class `bcorp-trigger` or `bcorp-widget` in the page.

If the widget div exists but is empty:
- The company folder may not be pushed to GitHub yet — tell Host Digital
- Or jsDelivr is slow on first load — wait a few more seconds and check again

### Step 8: Visually verify the widget and modal styling

Before taking the final screenshot, **double-check the styling of the in-situ widget and modal** to catch Shopify theme CSS bleed:

1. **Scroll the trigger into view** and take a screenshot. Check that the trigger badge has a white background, correct text, and the brand logo loads.

2. **Open the modal** by clicking the `.bcorp-trigger` element via `browser_evaluate`:
   ```javascript
   document.querySelector('.bcorp-trigger')?.click()
   ```

3. **Inspect computed styles** on the modal header and key sections via `browser_evaluate`:
   ```javascript
   (() => {
     const header = document.querySelector('.bcorp-modal__header');
     const modal = document.querySelector('.bcorp-modal');
     const desc = document.querySelector('.bcorp-modal__description');
     const score = document.querySelector('.bcorp-score-section');
     return {
       headerBg: header ? getComputedStyle(header).backgroundColor : 'missing',
       modalBg: modal ? getComputedStyle(modal).backgroundColor : 'missing',
       descBg: desc ? getComputedStyle(desc).backgroundColor : 'missing',
       scoreBg: score ? getComputedStyle(score).backgroundColor : 'missing'
     };
   })()
   ```
   All backgrounds must be `rgb(255, 255, 255)` (white). If any show the site's theme color (e.g. blue, dark), Shopify CSS is bleeding in.

4. **Take a screenshot of the open modal** to visually confirm no theme bleed.

5. **Close the modal** by removing the `active` class:
   ```javascript
   document.querySelector('.bcorp-modal-overlay')?.classList.remove('active')
   ```

6. If any styling issues are found, inject additional CSS fixes via `browser_evaluate` and re-check. Flag any fixes to Host Digital so they can be added to the console script for future use.

### Step 9: Take the final screenshot

Scroll the widget into view first:

```javascript
document.getElementById('bcorp-widget')?.scrollIntoView({ behavior: 'instant', block: 'center' })
```

Then use `browser_take_screenshot` to capture the page with the widget visible.

### Step 10: Report and leave browser open

Tell Host Digital:
- Which product page the widget was injected on (the URL)
- Where the widget was placed (after which element)
- Whether the widget rendered correctly
- That the browser is open and ready for screen recording

**Do NOT close the browser.** Host Digital will screen-record this browser window.

## Boundaries

**Do not close the browser.** The browser must remain open after injection. Closing it defeats the entire purpose of this skill.

**Do not modify any files.** This skill is read-only on the filesystem. It reads the console-script.js but writes nothing.

**Do not write to the Google Sheet.** This skill doesn't update any tracking columns.

**Do not navigate away from the product page** after the widget is injected.

**Close the modal after verification.** Step 8 opens the modal to verify styling, but you must close it before reporting. Host Digital wants to click the trigger during screen recording for a natural walkthrough effect.

## Judgment calls

- **Product page selection matters.** Pick a product with a good visual layout — hero image, clear product form, and enough space below the form. Avoid "coming soon" products.
- **Widget positioning is critical.** The widget must sit outside any width-constrained containers (columns, grid cells, product form wrappers). It should be a direct child of `<main>`, positioned below all core product information (title, price, description, add-to-cart, accordions like "Description", "Ingredients", etc.) but above the follow-up value-proposition sections (testimonials, "voted best…", before/after photos, stats, reviews). Use `browser_evaluate` to enumerate `<main>`'s direct children with their headings to identify the correct insertion point. Every Shopify theme structures this differently — inspect first, then insert.
- **If the site has a cookie consent banner** or popup, dismiss it first using `browser_click` before proceeding.
- **If the site has age verification or password protection**, stop and tell Host Digital — they'll handle it manually.
- **The 3-second wait is a minimum.** If the widget div is empty after the snapshot check, wait a few more seconds and check again — jsDelivr may be slow on first load.
- **If the widget looks misaligned**, you can inject minor CSS fixes via `browser_evaluate` — but flag what you changed.
