import { NextRequest } from 'next/server';

const VERIFY_TOKEN = 'retail-assist-token';

/**
 * Handles the webhook verification request from Meta.
 * Responds with plain text hub.challenge when verification succeeds.
 */
export async function GET(request: NextRequest) {
  try {
    const reqUrl = new URL(request.url);
    const mode = reqUrl.searchParams.get('hub.mode') ?? '';
    const token = (reqUrl.searchParams.get('hub.verify_token') ?? '').trim();
    const challenge = reqUrl.searchParams.get('hub.challenge') ?? '';

    console.log('[FB WEBHOOK] Verification request received:', { mode, tokenProvided: !!token, challengePresent: !!challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
      console.log('[FB WEBHOOK] Verification successful. Returning challenge.');
      // Return plain text body exactly equal to the challenge token
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } else {
      console.error('[FB WEBHOOK] Verification failed. Details:', {
        mode,
        tokenMatches: token === VERIFY_TOKEN,
        providedToken: token ? '[REDACTED]' : '[none]',
        challenge,
      });
      return new Response('Forbidden', { status: 403 });
    }
  } catch (err) {
    console.error('[FB WEBHOOK] Error handling verification GET:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

/**
 * Handles incoming messages and events from the Meta webhook.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[FB WEBHOOK] Event received:', JSON.stringify(body, null, 2));
    // Acknowledge immediately
    return new Response(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[FB WEBHOOK] Error processing POST:', err);
    return new Response('Bad Request', { status: 400 });
  }
}
