# /find-contacts — Find outreach email addresses

## Context

You're helping Host Digital find the right person to email at each qualified company. The goal is genuine business outreach about a B Corp widget — not spam. Finding the right contact matters because:

- A message to the founder or marketing lead gets read and considered
- A message to a generic info@ address gets ignored
- A message to the wrong person wastes one of our limited Hunter.io credits (50/month on free tier)
- A message to the wrong person/email address gets marked as spam

We're looking for people in two categories:
1. **Senior leadership** — founder, co-founder, CEO, managing director (they care about brand and certification)
2. **Marketing/growth** — marketing manager, head of marketing, growth lead (they own the website and would implement the widget)

## What success looks like

- Each qualified company (has Traffic 40k+ AND Shopify in the sheet) gets email addresses and roles populated
- Multiple contacts per company is ideal (comma-separated in the Email and Role columns)
- Host Digital can review the contacts before drafting outreach

## How to execute

### Reading the sheet
```bash
node "C:\Users\alan\Desktop\Outreach\agent\sheets-helper.js" read "master_list!A:I"
```

Look for rows where: D="Shopify" or "Shopify Plus", G shows 40,000+, and H (Email) is empty. These are qualified but don't have contacts yet.

### Finding contacts via Hunter.io
For each company, extract the domain from column C and search:

```bash
HUNTER_KEY=$(grep HUNTER_API_KEY "C:\Users\alan\Desktop\Outreach\agent\.env" | cut -d= -f2)
curl -s "https://api.hunter.io/v2/domain-search?domain=example.com&api_key=$HUNTER_KEY"
```

From the results, identify contacts matching our target roles. Hunter returns names, emails, positions, and confidence scores.

### Writing results back
Format multiple contacts as comma-separated values, matching emails to roles:
```bash
node "C:\Users\alan\Desktop\Outreach\agent\sheets-helper.js" write "master_list!H{row}:I{row}" '[["jane@co.com, john@co.com", "Founder, Marketing Manager"]]'
```

### Boundaries

**Sheet writes are limited to columns H (Email) and I (Role) only.** Other columns are managed by other skills or by Host Digital directly. Traffic, Shopify status, Sent status, and Video links are not this skill's concern — writing to them risks overwriting data from earlier or later pipeline stages.

**Do not contact any prospect directly** — no emails, no form submissions, no LinkedIn messages, no Hunter.io email verification sends. This skill finds contact information only. The actual outreach happens later through `/draft-outreach`, after human review. Reaching out at the contact-finding stage — before a personalised demo exists — would waste the first impression.

**Include all contacts that match the target roles — do not filter based on assumptions about who will or won't read cold emails.** The decision about which contacts to actually email belongs to Host Digital. A CEO who ignores cold email is still worth having in the sheet, because Host Digital may have other ways to reach them or may choose to prioritise them for a specific reason. This skill's job is to surface all relevant contacts, not pre-filter them.

### Judgment calls

- **Prioritise quality over quantity.** One confident founder email is better than three generic addresses. Hunter provides confidence scores — prefer contacts with higher confidence.
- **Credit conservation matters.** On the free tier, each API call costs a credit. If you can see the domain pattern from Hunter's response (e.g. first.last@company.com), note it — it's useful context even if we don't use it for guessing.
- **If Hunter returns nothing** for a domain, write "No results" in the Email column so we know it's been checked (rather than leaving it blank, which looks unchecked). Host Digital may want to find contacts manually for high-value prospects.
- **Don't fabricate or guess email addresses.** Only write emails that Hunter actually returns. Sending to a guessed address that bounces hurts deliverability.
- **Role matching is fuzzy.** "Head of Digital" or "E-commerce Manager" are close enough to marketing. "Accountant" or "HR Manager" are not. Use judgment about who would realistically care about a website widget.
