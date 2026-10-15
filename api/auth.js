// GitHub OAuth "begin" endpoint for the Decap CMS dashboard.
// The CMS opens this page in a popup; we redirect it to GitHub's
// authorization page.
// Required Vercel env vars: OAUTH_CLIENT_ID
module.exports = (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('OAUTH_CLIENT_ID is not configured in Vercel environment variables.');
    return;
  }

  const redirectUri =
    process.env.OAUTH_REDIRECT_URI || 'https://pelzstudios.vercel.app/api/callback';
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);

  const url =
    'https://github.com/login/oauth/authorize' +
    '?client_id=' + encodeURIComponent(clientId) +
    '&redirect_uri=' + encodeURIComponent(redirectUri) +
    '&scope=repo,user' +
    '&state=' + encodeURIComponent(state);

  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  res.setHeader('Location', url);
  res.end();
};
