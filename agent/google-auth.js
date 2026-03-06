const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');

const CREDS_PATH = 'C:\\Users\\alan\\.claude\\google-credentials.json';
const TOKENS_PATH = 'C:\\Users\\alan\\.claude\\google-tokens.json';
const PORT = 3000;
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8')).web;
const { client_id, client_secret } = creds;
const redirect_uri = `http://localhost:${PORT}/oauth2callback`;

const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${encodeURIComponent(SCOPES)}&access_type=offline&prompt=consent`;

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) return;

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const code = url.searchParams.get('code');

  if (!code) {
    res.writeHead(400);
    res.end('No auth code received.');
    return;
  }

  const body = new URLSearchParams({
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: 'authorization_code'
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  const tokens = await response.json();

  if (tokens.error) {
    res.writeHead(400);
    res.end(`Error: ${tokens.error_description}`);
    console.error('Token exchange failed:', tokens);
    server.close();
    return;
  }

  fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h2>Authorised. You can close this tab.</h2>');
  console.log(`Tokens saved to ${TOKENS_PATH}`);
  server.close();
});

server.listen(PORT, () => {
  console.log(`Opening browser for Google auth...`);
  execSync(`start "" "${authUrl}"`);
});
