# /prospect — Qualify companies for outreach

## Context

You're helping Host Digital qualify B Corp-certified UK companies for outreach about an embeddable Shopify widget. The master list lives in a Google Sheet with hundreds of companies, but most won't be a fit. A company only qualifies if:

1. **Traffic:** 40,000+ monthly visitors (below this, the company probably doesn't generate enough revenue — it's not worth either party's time)
2. **Shopify:** Host Digital works with Shopify exclusively

Traffic is checked first because it's the stricter filter. If a company fails on traffic, skip the Shopify check entirely — it saves API credits and time.

## What success looks like

- Rows in the Google Sheet that don't yet have Traffic/Shopify data get checked
- Each checked company has its Traffic and Shopify columns populated
- You report which companies qualified and which didn't, so Host Digital can review before moving to the next phase

## How to execute

### Reading the sheet
Use the sheets helper to read the master list:
```bash
node "C:\Users\alan\Desktop\Outreach\agent\sheets-helper.js" read "master_list!A:I"
```

The columns are: A=Company name, B=Description, C=URL, D=Shopify?, E=Sent?, F=Video, G=Traffic, H=Email, I=Role.

Look for rows where column G (Traffic) has a value of 40,000+ AND column D (Shopify?) is empty. These are companies that Host Digital has already verified for traffic (manually via the SimilarWeb Chrome extension) and are ready for the Shopify check.

Skip rows where:
- G (Traffic) is empty — traffic hasn't been checked yet (that's a manual step)
- G (Traffic) is below 40,000 — doesn't meet threshold, no point checking Shopify
- D (Shopify?) already has a value — already checked
- E (Sent?) is TRUE — already done

**Traffic is checked manually by Host Digital** using the SimilarWeb Chrome extension, because all automated traffic estimation services either block bots or charge prohibitively. This skill does not check or write traffic data — it reads column G to determine which companies are ready for the Shopify check.

### Step 1: Check Shopify (two signals via curl)
For companies that pass the traffic threshold, run two curl calls — one for headers, one for page source — and look for two Shopify-specific signals:

```bash
# Check 1: HTTP headers (x-shopify header)
curl -sI -L "https://example.com" 2>/dev/null | grep -qi "x-shopify" && echo "HEADER_MATCH"

# Check 2: Page source (Shopify CDN or myshopify references)
curl -sL "https://example.com" 2>/dev/null | grep -qiE "cdn\.shopify\.com|shopify\.com/s/files|myshopify\.com" && echo "SOURCE_MATCH"
```

**Either signal is enough** to confirm Shopify:
- `x-shopify` header — direct Shopify hosting (missed when behind Cloudflare/Fastly)
- `cdn.shopify.com` or `myshopify.com` in source — Shopify asset delivery (hardest to hide, most reliable)

**Do not use URL patterns** like `/products/` or `/collections/` as signals. These are common across many e-commerce platforms (WooCommerce, Magento, custom builds) and produce false positives.

Write "Shopify" in column D if either signal matches. Write "No" only if both miss.

### Writing results back
```bash
node "C:\Users\alan\Desktop\Outreach\agent\sheets-helper.js" write "master_list!D{row}:D{row}" '[["Shopify"]]'
```

### Boundaries

**Sheet writes are limited to column D (Shopify?) only.** Traffic (column G) is populated manually by Host Digital — this skill must not write to it. All other columns contain data managed by other phases of the pipeline — Email, Role, Sent status, Video links. Writing to them here would overwrite work from other skills or manual input.

**Do not contact any prospect directly** — no emails, no form submissions, no LinkedIn messages. This skill is research only. Outreach happens later, after human review, through a separate skill. Premature contact with incomplete or unreviewed data would damage Host Digital's credibility with the prospect.

### Judgment calls

- If a site redirects to a different domain, follow the redirect and check that domain instead. Note the redirect in your summary to Host Digital.
- If the curl response is ambiguous (e.g. the site is under maintenance or returns a generic page), flag it rather than writing "No". Host Digital would rather review an edge case than miss a good prospect.
- Process companies in batches of 5-10 to keep things manageable and allow for review between batches.
