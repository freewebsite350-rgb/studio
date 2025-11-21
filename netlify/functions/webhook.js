// Optional fallback: Netlify Function implementing the same webhook verification.
// Deploys as /.netlify/functions/webhook and can be used as callback URL if you
// prefer not to use the Next.js plugin for API routes.

exports.handler = async function (event, context) {
  try {
    const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN ?? ''; 
    const qs = event.queryStringParameters || {};
    const mode = qs['hub.mode'] || '';
    const token = (qs['hub.verify_token'] || '').trim();
    const challenge = qs['hub.challenge'] || '';

    console.log('[FB WEBHOOK FUNCTION] Incoming verification:', { mode, tokenProvided: !!token, challengePresent: !!challenge, headers: event.headers });

    if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: challenge,
      };
    } else {
      return {
        statusCode: 403,
        body: 'Forbidden',
      };
    }
  } catch (err) {
    console.error('[FB WEBHOOK FUNCTION] Error:', err);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};