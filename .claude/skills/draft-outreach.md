# /draft-outreach — Draft personalised outreach emails

## Context

You're helping Host Digital draft outreach emails to B Corp companies about the Shopify widget. These are cold emails to real people — founders and marketing leads — so the tone and personalisation matter. The email should feel like a human wrote it for this specific person, because one did (with your help).

Host Digital sends a maximum of 5 emails per day from alan@hostdgtl.com. He reviews and approves every email before it goes out. Your job is to draft them in Gmail — never send directly.

## What success looks like

- Gmail drafts are created for each prospect, ready for Host Digital's review
- Each email is personalised with the contact's first name and a link to their demo video
- The sheet is updated to track which companies have drafts pending
- Host Digital reviews, tweaks if needed, and sends manually

## The email template

```
Hi {{firstName}},

Since we know how important education is around your B Corp cert (only 1 in 4 consumers have heard of B Corp), I've built a smart badge for your Shopify store that turns your B Corp badge into an interactive explainer.

{{videoLink}}Here's a quick mockup for your site.{{/videoLink}}

It's a 2-min install and free forever. Worth a quick chat?

Alan.
```

## How to execute

### Step 1: Read the sheet for ready prospects
```bash
node "C:\Users\alan\Desktop\Outreach\agent\sheets-helper.js" read "master_list!A:I"
```

A prospect is ready for outreach when:
- D = "Shopify" (qualified)
- G = 40,000+ (traffic threshold met)
- H has email addresses (contacts found)
- E (Sent?) is not TRUE (hasn't been emailed yet)
- F (Video) has a URL (demo video exists)

If F (Video) is empty, flag it to Alan — the demo video needs to be created first (that's a manual step between /build-widget and /draft-outreach).

### Step 2: Draft emails via Gmail MCP
For each prospect (up to 5 per day), create a Gmail draft:

Use the Gmail MCP tool `gmail_create_draft` with:
- **to**: The email address(es) from column H
- **subject**: Keep it short and specific, e.g. "B Corp badge for {Company Name}"
- **body**: The template above, with:
  - `{{firstName}}` → extracted from the email or Hunter data (e.g. ben@nalasbaby.com → "Ben"). If unsure of the name, use "Hi there" rather than guessing wrong.
  - `{{videoLink}}` → the URL from column F, formatted as an HTML link

If a company has multiple contacts, create one draft per contact (each person gets their own email).

### Step 3: Update the sheet
After creating drafts, write "DRAFT" in column E for those rows so we know they're in progress:
```bash
node "C:\Users\alan\Desktop\Outreach\agent\sheets-helper.js" write "master_list!E{row}:E{row}" '[["DRAFT"]]'
```

Alan will change this to TRUE after he reviews and sends.

### Boundaries

**Sheet writes are limited to column E (Sent?) only** — specifically writing "DRAFT" to mark that a draft has been created. Other columns contain pipeline data managed by earlier skills or by Host Digital. This skill reads the sheet for context but only writes status updates.

**Do not modify the email template beyond the two specified personalisations:** the recipient's first name and the video link. The template wording has been carefully crafted for tone and compliance. Rewriting copy — even with good intentions — changes what Host Digital is actually saying to prospects, and that decision belongs to the human.

**The sender must always be alan@hostdgtl.com.** This is Host Digital's outreach identity. Sending from any other address would confuse prospects, break reply threading, and potentially violate email authentication (SPF/DKIM) on the domain.

**Do not send emails — only create drafts.** Every outreach email gets human review before sending. This is a hard boundary, not a preference. A poorly targeted or incorrectly personalised cold email damages the brand's reputation with that prospect permanently — there's no undo on a first impression.

**Do not contact prospects through any channel other than Gmail drafts** — no LinkedIn messages, no form submissions, no direct calls. The outreach strategy is email-first, and all prospect contact goes through Host Digital's review.

### Judgment calls

- **Never send emails directly.** Always create drafts. Alan reviews every outreach email before it goes out. This isn't just a preference — cold email to the wrong person or with wrong info damages the brand.
- **First name extraction is worth getting right.** "Hi Ben" is warm. "Hi Benjamin" when they go by Ben is fine. "Hi B" from parsing "b.smith@" is not. If you can't confidently extract a first name, use "Hi there" — it's better than getting it wrong.
- **Respect the daily limit of 5.** This keeps email sending patterns natural and avoids deliverability issues. If there are more than 5 ready prospects, draft the first 5 and tell Alan the rest are queued.
- **If a company has both a founder and a marketing contact**, draft separate emails to each. The same template works for both — the value prop is the same regardless of role.
- **Don't draft emails for companies without a demo video** (column F empty). The video link is the core of the pitch. Flag these to Alan so he knows to create the video first.
