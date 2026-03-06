## CONTEXT
I need to send 5 outbound emails per day from my Gmail account: alan@hostdgtl.com.

The email:

"Hi {{name}},

Since we know how important education is around your B Corp cert (only 1 in 4 consumers have heard of B Corp), I've built a smart badge for your Shopify store that turns your B Corp badge into an interactive explainer.

<link>Here's a quick mockup for your site.</link> 

It's a 2-min install and free forever. Worth a quick chat?

Alan."

## STEP 1: Targeting
Sending the email to B-corp companies in the UK. The list is here:
https://docs.google.com/spreadsheets/d/1MYTsz1Vz_IBKWmr1Oo72HQwXvQ0IR6fxS-E1eFZHd84/edit?gid=570772518#gid=570772518
('master_list' tab)

Only a subset of companies on this list are elgible for outreach. Here is the criteria:

a. Must have more than 40,000 people to the website last month (source: SimilarWeb Chrome extension)
b. Website must be on Shopify (source: BuiltWith, e.g. https://builtwith.com/bbc.co.uk)

N.B. if the (a) is not true, then there is no point moving to (b). We only want to contact prospects who pass both benchmarks.

This information should be saved into the Google Sheet under the "Shopify?" and "Traffic" columns.

If both criterion are met, we move to the next step.

## STEP 2: Acquiring relevant email addresses

Here is the criteria:
a. Senior Leadership e.g. founder, co-founder, CEO
b. Work in the marketing or growth team e.g. marketing manager

Source: https://hunter.io/search

Write this information under the 'Email' and 'Role' columns in the Google Sheet. Examples:
"heatherb@gatineau.com, liaf@gatineau.com"
"Sales & Marketing Director, Marketing Manager"

## STEP 3: Building personalised widget assets
As per the outreach email, each prospect will receive a personalised video. Before I can create this video, we need a personalised widget.

Here's how you'll do this:

a. Duplicate the 'b-corp-main' folder in this repo

b. Name this new folder 'Company-Name' (use Train-Case)

c. In the code for each new widget (the 3 new versions), replace the reference to handmade.avif with:

Company_Name_Logo

And delete handmade.avif in each assets folder.

Working in the 'COMPANY-NAME' folder, replace the reference to handmade.avif with: "C:\Users\alan\Desktop\Outreach\Company-Name\assets\Company-Name-Logo.svg"

## STEP 4: Building personalised widget

Update the below code block. Don't edit the code in our codebase, just provide the full updated code block in our chat that I can paste into the browser console for the purposes of client demo.

You should adjust the following values based on the information about each company in this directory: https://www.bcorporation.net/en-us/find-a-b-corp/ 

brandName, brandLogo, overallScore, certificationDate, qualifyingScore, medianScore, governance, workers, community, environment, customers, profileUrl

Finally, you will also need to replace:
https://hostdgtl.com/scripts/master/style.css
https://hostdgtl.com/scripts/master/app.js

Here is the code to adjust:

{
// 1. Set the data the widget needs to run
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
// 1b. Centre the widget
const widgetContainer = document.getElementById('bcorp-widget');
if (widgetContainer) {
widgetContainer.style.cssText = 'display:flex; justify-content:center; width:100%;';
}
// 2. Load Google Fonts
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
document.head.appendChild(fontLink);
// 3. Load the CSS
const cssLink = document.createElement('link');
cssLink.rel = 'stylesheet';
cssLink.href = 'https://hostdgtl.com/scripts/master/style.css';
document.head.appendChild(cssLink);
// 4. Load the JS
const widgetScript = document.createElement('script');
widgetScript.src = 'https://hostdgtl.com/scripts/master/app.js';
document.body.appendChild(widgetScript);
// 5. Force the Inter font onto the widget
const style = document.createElement('style');
style.innerHTML = `#bcorp-widget, #bcorp-widget * { font-family: 'Inter', sans-serif !important; }`;
document.head.appendChild(style);
console.log("Widget successfully re-injected!");
}

## STEP 5: Create demo on local browser
Inject the script into Google Chrome Console (Dev Tools) in a logical page location so that I can create a screen recording of the widget in situ.
