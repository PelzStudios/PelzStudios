// GitHub OAuth callback for the Decap CMS dashboard.
// GitHub redirects here after the user authorizes. We exchange the code for
// an access token and post it back to the CMS popup using the exact
// postMessage protocol Decap expects:
//   opener: "authorizing:github"  (handshake)
//   CMS replies with the same string, then we send:
//   "authorization:github:success:<json {token, provider}>"
// Required Vercel env vars: OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET
// Optional: CMS_ORIGIN (defaults to the site origin).
const ALLOWED_ORIGIN = process.env.CMS_ORIGIN || 'https://pelzstudios.vercel.app';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const code = req.query && req.query.code;
  if (!code) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Missing authorization code.');
    return;
  }

  let token = null;
  let errorMessage = 'Failed to exchange code for token';
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'pelzstudios-cms-oauth',
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });
    const data = await tokenRes.json();
    if (data && data.error) {
      errorMessage = data.error_description || data.error;
    } else if (data && data.access_token) {
      token = data.access_token;
    }
  } catch (err) {
    errorMessage = err.message || errorMessage;
  }

  const message = token ? 'success' : 'error';
  const content = token ? { token, provider: 'github' } : { error: errorMessage };
  const origin = JSON.stringify(ALLOWED_ORIGIN);
  const contentJson = JSON.stringify(JSON.stringify(content));

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Finishing login</title></head>
<body style="background:#000;color:#fff;font-family:system-ui,sans-serif;display:grid;place-items:center;height:100vh;margin:0;text-align:center">
<p>Finishing login… you can close this window.</p>
<script>
(function () {
  var opener = window.opener;
  if (!opener) {
    document.body.innerHTML = '<p style="padding:24px">Login window could not reach the dashboard. Please close this tab and try again from the dashboard.</p>';
    return;
  }
  var origin = ${origin};
  function receive(e) {
    if (e.origin !== origin) return;
    if (e.data !== 'authorizing:github') return;
    window.removeEventListener('message', receive);
    opener.postMessage('authorization:github:${message}:' + ${contentJson}, origin);
    setTimeout(function () { try { window.close(); } catch (err) {} }, 300);
  }
  window.addEventListener('message', receive, false);
  opener.postMessage('authorizing:github', origin);
})();
</script>
</body>
</html>`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
};
