// Minimal GitHub OAuth proxy for Decap CMS
// Handles /auth and /callback — no dependencies beyond Node built-ins

const http = require('http');
const https = require('https');
const url = require('url');
const crypto = require('crypto');

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const ORIGIN = process.env.ORIGIN || '*';
const PORT = 3000;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must be set');
  process.exit(1);
}

function httpsGet(reqUrl) {
  return new Promise((resolve, reject) => {
    const opts = { ...url.parse(reqUrl), headers: { 'User-Agent': 'decap-oauth-proxy' } };
    const req = https.get(opts, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
  });
}

function httpsPost(reqUrl, body) {
  return new Promise((resolve, reject) => {
    const parsed = url.parse(reqUrl);
    const opts = {
      hostname: parsed.hostname,
      path: parsed.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'decap-oauth-proxy',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(opts, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  // GET /auth — redirect to GitHub OAuth
  if (parsed.pathname === '/auth') {
    const state = crypto.randomBytes(16).toString('hex');
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      scope: 'repo',
      state,
    });
    res.writeHead(302, { Location: `https://github.com/login/oauth/authorize?${params}` });
    res.end();
    return;
  }

  // GET /callback — exchange code for token and return to CMS popup
  if (parsed.pathname === '/callback') {
    const { code, error } = parsed.query;

    if (error || !code) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderScript('error', { message: error || 'access_denied' }));
      return;
    }

    try {
      const body = JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code });
      const tokenRes = await httpsPost('https://github.com/login/oauth/access_token', body);
      const json = JSON.parse(tokenRes);

      if (json.error || !json.access_token) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderScript('error', { message: json.error || 'no_token' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderScript('success', { token: json.access_token, provider: 'github' }));
    } catch (e) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderScript('error', { message: e.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

// Render the postMessage script that Decap CMS popup expects
function renderScript(status, data) {
  const msg = status === 'success'
    ? `authorization:github:success:${JSON.stringify(data)}`
    : `authorization:github:error:${JSON.stringify(data)}`;

  return `<!doctype html><html><body><script>
(function() {
  function cb(e) {
    window.opener.postMessage(${JSON.stringify(msg)}, e.origin);
    window.removeEventListener("message", cb, false);
  }
  window.addEventListener("message", cb, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script></body></html>`;
}

server.listen(PORT, () => console.log(`OAuth proxy listening on port ${PORT}`));
