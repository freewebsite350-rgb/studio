'use server';

import {NextRequest, NextResponse} from 'next/server';

const VERIFY_TOKEN = 'retail-assist-token';

/**
 * Handles the webhook verification request from Meta.
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  console.log('Received verification request:', { mode, token, challenge });

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Verification successful. Responding with challenge.');
    // Respond with the challenge token from the request
    return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  } else {
    console.error('Verification failed. Mode or token did not match.');
    // Respond with '403 Forbidden' if verify tokens do not match
    return new NextResponse('Forbidden', { status: 403 });
  }
}


/**
 * Handles incoming messages and events from the Meta webhook.
 * @see https://developers.facebook.com/docs/graph-api/webhooks/getting-started#event-notifications
 */
export async function POST(request: NextRequest) {
    const body = await request.json();
    console.log('Received webhook event:', JSON.stringify(body, null, 2));

    // Process the webhook event
    // (Your logic to handle messages will go here)

    // Respond with a 200 OK to acknowledge receipt of the event
    return NextResponse.json({ status: 'success' }, { status: 200 });
}
