# Spec for Marketing Data Overview Microsite

branch: claude/feature/marketing-data-overview-microsite

## Summary

A single-page microsite that explains how marketing data flows through Hertility Health's tech stack. Aimed at new starters and non-technical colleagues, it provides a clear, visual overview of the data pipeline — from user action on the website/app, through Google Tag Manager, to marketing platforms and BigQuery. The tone should be plain-English, brief, and scannable. This is not a detailed handover document; it's a "how things fit together" reference.

## Functional Requirements

- Single HTML page (self-contained microsite) hosted at `hostdgtl.com/hertility`
- Visual diagram/flow showing the data journey: User action > Cookie consent > Data Layer > GTM > Marketing platforms + GA > BigQuery
- Section: **Data Streams** — explain the 3 platforms (Website, Android app, iPhone app) and how they map to Google Analytics data streams (reportable separately or in aggregate). This should contain the stream names: 'hertilityhealth.com', 'hertilityassessment.com', 'Production IOS app' and 'Production Android app'. Explain that it usually makes sense to filter report based on stream name.
- Section: **Google Tag Manager** — explain GTM's role as the central routing layer that sends events to marketing platforms (GA, Google Ads, Meta, LinkedIn, Pinterest, Awin, etc.). Link to the live Marketing Tags Tracker document: https://www.notion.so/host-digital/Marketing-Tags-Tracker-Document-182797554f6e4abcb3f5fa6ef381abbe
- Section: **Google Analytics & BigQuery** — explain that GA is a primary reporting tool (powers the "Infinity Loop" report and other business-critical reports). GA data is exported daily to BigQuery where the Engineering team models it with SQL for upstream reporting. Note that raw BigQuery data is often needed when the GA UI falls short
- Section: **Engineering & the Data Layer** — explain when and why Engineering implements data layer pushes (custom events like video engagements, button clicks, form submissions). GTM listens to these events and routes them to the appropriate platforms
- Section: **Website Platform Complexity** — explain that the website spans 3 platforms: HubSpot (Marketing team pages), Shopify (checkout), and custom-built (Engineering team)
- Section: **Cookie Consent** — explain that no marketing data fires unless the user consents via the CookieBot (UserCentrics) cookie banner
- Design: clean white layout with primary teal `#00a897` as the accent colour (reference frontend-aesthetics and frontend-design skills for high design quality). Short paragraphs, strong visual hierarchy, minimal jargon
- Password-protected page — a simple password gate (no username) using password: `health`. The gate should appear before any content is visible
- Responsive (works on desktop and mobile)

## Possible Edge Cases

- Content should remain useful even as specific marketing tags change over time (keep wording general where possible)

## Acceptance Criteria

- Page loads and renders correctly in modern browsers (Chrome, Safari, Firefox, Edge)
- All 6 content sections are present and clearly labelled
- A visual flow/diagram shows the end-to-end data pipeline
- The Marketing Tags Tracker Notion link is present and clickable
- Copy is concise — no section exceeds ~3-4 short paragraphs
- Page is responsive and readable on mobile
- Design feels professional — clean white with teal `#00a897` accent, not cluttered
- Password gate blocks access until the correct password is entered

## Resolved Questions

- **Design direction:** Clean white layout with primary teal `#00a897` accent colour. Use frontend-aesthetics and frontend-design skills for high design quality.
- **Hosting:** `hostdgtl.com/hertility` (deployed via the existing hostdgtl repo → Hostinger pipeline).
- **Access restrictions:** Password-protected (no username). Password: `health`.
- **Additional platforms/data flows:** None — the current list is complete.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Page renders without JavaScript errors
- All sections are present in the DOM
- Notion tracker link is correct and has target="_blank"
- Page is responsive (viewport meta tag present, no horizontal overflow at mobile widths)
- Visual flow/diagram element is present
- Password gate is present and blocks content until correct password is entered
