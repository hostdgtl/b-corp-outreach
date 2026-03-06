# Plan: Marketing Data Overview Microsite for Hertility Health

## Context

Hertility Health needs an internal reference page that explains how marketing data flows through their tech stack. It's aimed at new starters and non-technical colleagues — a "how things fit together" overview, not a deep technical handover. The page will be hosted at `hostdgtl.com/hertility` behind a simple password gate.

---

## Architecture

**Single self-contained HTML file** with all CSS and JS inline. This keeps deployment simple (one file to copy) and matches the "microsite" nature of the project.

- **CSS:** Tailwind via CDN for utility classes + inline `<style>` block for custom components (flow diagram, password gate, animations)
- **Icons:** Lucide via CDN (consistent with existing hostdgtl patterns)
- **Fonts:** Google Fonts — Inter (clean, professional, matches existing usage)
- **No build step** — the HTML file is the deliverable

## File Structure

```
Hertility/
├── _specs/
│   └── marketing-data-overview-microsite.md   # (exists)
├── _plans/
│   └── marketing-data-overview-microsite.md   # This file
├── index.html                                  # The microsite (new)
└── tests/
    └── microsite.test.html                     # Browser-based tests (new)
```

**Deployment target:**
```
hostdgtl/
└── hertility/
    └── index.html    # Copy from Hertility/index.html
```

---

## Implementation Steps

### Step 1: Create `Hertility/index.html` — Page Shell & Password Gate

- HTML5 boilerplate with viewport meta, charset, title
- Load Tailwind CSS, Lucide Icons, Inter font via CDN
- **Password gate:** A full-screen overlay (`#password-gate`) with a centered card containing a password input and submit button. All page content sits in a hidden `#main-content` div. On correct password ("health"), the gate fades out and content is revealed. Uses `sessionStorage` so the password persists for the browser session.
- Clean white background, teal `#00a897` accent colour

### Step 2: Hero / Header Section

- Hertility Health branding area at top. 
- Use the Hertility Health logo: "C:\Users\alan\Desktop\hostdgtl.com\Hertility\assets\hertility-logo.svg"
- Title: "Marketing Data Overview"
- Subtitle explaining the purpose: a plain-English guide to how marketing data flows through the tech stack
- Clean, minimal — white background with teal accent line or element

### Step 3: Visual Flow Diagram

- A horizontal (desktop) / vertical (mobile) pipeline diagram built with HTML/CSS (Tailwind + custom styles)
- Flow: **User Action** → **Cookie Consent** → **Data Layer** → **GTM** → **Marketing Platforms + GA** → **BigQuery**
- Each node is a styled card/pill with a Lucide icon, connected by arrows/lines
- Uses CSS flexbox/grid, responsive — stacks vertically on mobile
- Teal accent for connecting lines and active states

### Step 4: Content Sections (6 sections)

Each section follows a consistent pattern: section number badge, heading, 2-3 short paragraphs, optional visual element (icon, mini-diagram, or callout box).

**Section 1: Data Streams**
- Explain 3 platforms: Website, Android app, iPhone app
- List GA stream names: `hertilityhealth.com`, `hertilityassessment.com`, `Production IOS app`, `Production Android app`
- Note that filtering by stream name is usually the right approach
- Visual: small card grid showing the 4 streams

**Section 2: Google Tag Manager**
- GTM as central routing layer
- Sends events to: GA, Google Ads, Meta, LinkedIn, Pinterest, Awin, etc.
- Link to [Marketing Tags Tracker](https://www.notion.so/host-digital/Marketing-Tags-Tracker-Document-182797554f6e4abcb3f5fa6ef381abbe) — opens in new tab (`target="_blank"`)

**Section 3: Google Analytics & BigQuery**
- GA as primary reporting tool — powers "Infinity Loop" report
- Daily export to BigQuery
- Engineering models raw data with SQL for upstream reporting
- Note: raw BigQuery data needed when GA UI falls short

**Section 4: Engineering & the Data Layer**
- When and why Engineering implements `dataLayer.push()` events
- Examples: video engagements, button clicks, form submissions
- GTM listens to these events and routes to appropriate platforms

**Section 5: Website Platform Complexity**
- 3 platforms powering the website: HubSpot (Marketing team pages), Shopify (checkout), custom-built (Engineering team)
- Visual: three-card layout showing each platform and its owner

**Section 6: Cookie Consent**
- CookieBot (UserCentrics) cookie banner
- No marketing data fires unless user consents
- This is the first gate in the data pipeline

### Step 5: Footer

- Minimal footer with "Hertility Health — Internal Reference" and current year
- Small note that the page is maintained by Host Digital

### Step 6: Create Tests — `Hertility/tests/microsite.test.html`

A lightweight browser-based test file using a simple inline test framework (no npm/node dependencies needed — keeps it consistent with the zero-build-step approach). The test file loads the microsite in an iframe and checks:

1. Page renders without JavaScript errors (window.onerror listener)
2. All 6 sections present in the DOM (query for section headings or IDs)
3. Notion tracker link is correct URL and has `target="_blank"`
4. Viewport meta tag is present
5. Visual flow/diagram element is present in DOM
6. Password gate element is present and content is hidden by default

---

## Design Approach

- **White background** — `bg-white` base, clean and minimal
- **Teal accent** — `#00a897` for headings, links, diagram connectors, badges, hover states
- **Typography** — Inter font, strong hierarchy: large section headings, medium subheadings, regular body text
- **Cards** — Light grey `bg-gray-50` or white with subtle `border` for content grouping
- **Section numbers** — Small teal badge/pill for each section (01, 02, etc.)
- **Spacing** — Generous whitespace, `py-16` to `py-20` between sections
- **Mobile** — Single column, stacked flow diagram, readable at all widths
- Use `frontend-aesthetics` and `frontend-design` skills during implementation for high design quality

---

## Deployment Steps (after implementation)

1. Copy `Hertility/index.html` → `hostdgtl/hertility/index.html` (create `hertility/` dir)
2. Stage only `hertility/index.html` in the hostdgtl repo
3. Commit and push to `main`
4. Hostinger auto-deploys → live at `hostdgtl.com/hertility`

---

## Verification

1. Open `Hertility/index.html` locally in browser — confirm password gate works
2. Enter password "health" — confirm all content appears
3. Check all 6 sections are present and readable
4. Click the Notion Marketing Tags Tracker link — confirm it opens in new tab
5. Resize browser to mobile width — confirm responsive layout, no horizontal overflow
6. Open `Hertility/tests/microsite.test.html` in browser — confirm all tests pass
7. Check in Chrome, Firefox, Edge — confirm cross-browser rendering
