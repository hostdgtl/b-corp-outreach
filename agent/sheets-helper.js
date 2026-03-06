// Shared helper for Google Sheets API access.
// Usage: node sheets-helper.js <action> [args...]
//
// Actions:
//   read <range>                     → stdout JSON of cell values
//   write <range> <json-values>      → write values to range
//   append <range> <json-values>     → append rows after range
//   get-token                        → print a fresh access token

const fs = require('fs');

const CREDS_PATH = 'C:\\Users\\alan\\.claude\\google-credentials.json';
const TOKENS_PATH = 'C:\\Users\\alan\\.claude\\google-tokens.json';
const SHEET_ID = '1MYTsz1Vz_IBKWmr1Oo72HQwXvQ0IR6fxS-E1eFZHd84';
const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;

// Encode range for URL: only encode the sheet name part, leave !: literal
function encodeRange(range) {
  const match = range.match(/^(.+?)!(.+)$/);
  if (!match) return encodeURIComponent(range);
  return encodeURIComponent(match[1]) + '!' + match[2];
}

async function getAccessToken() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8')).web;
  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));

  // Try current token first
  const test = await fetch(`${BASE}?fields=properties.title`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` }
  });

  if (test.ok) return tokens.access_token;

  // Refresh
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: creds.client_id,
      client_secret: creds.client_secret,
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token'
    })
  });

  const newTokens = await res.json();
  if (newTokens.error) throw new Error(`Token refresh failed: ${newTokens.error_description}`);

  tokens.access_token = newTokens.access_token;
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
  return tokens.access_token;
}

function cleanRange(range) {
  return range.replace(/\\!/g, '!');
}

async function readRange(range) {
  range = cleanRange(range);
  const token = await getAccessToken();
  const res = await fetch(`${BASE}/values/${encodeRange(range)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.values || [];
}

async function writeRange(range, values) {
  range = cleanRange(range);
  const token = await getAccessToken();
  const res = await fetch(
    `${BASE}/values/${encodeRange(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ range, values })
    }
  );
  return res.json();
}

async function appendRange(range, values) {
  range = cleanRange(range);
  const token = await getAccessToken();
  const res = await fetch(
    `${BASE}/values/${encodeRange(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ range, values })
    }
  );
  return res.json();
}

async function main() {
  const [,, action, ...args] = process.argv;

  switch (action) {
    case 'get-token':
      console.log(await getAccessToken());
      break;
    case 'read':
      console.log(JSON.stringify(await readRange(args[0])));
      break;
    case 'write':
      console.log(JSON.stringify(await writeRange(args[0], JSON.parse(args[1]))));
      break;
    case 'append':
      console.log(JSON.stringify(await appendRange(args[0], JSON.parse(args[1]))));
      break;
    default:
      console.error('Usage: node sheets-helper.js <read|write|append|get-token> [args...]');
      process.exit(1);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
