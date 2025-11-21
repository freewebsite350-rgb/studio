
import { NextResponse } from 'next/server';

// This is a secret token that you and Facebook will share.
// It's used to verify that the requests are genuinely coming from Facebook.
const VERIFY_TOKEN = "retail-assist-token";

/**
 * Handles the webhook verification request from Facebook.
 * Facebook sends a GET request to this endpoint to verify the webhook.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request as plain text
      console.log('WEBHOOK_VERIFIED');
      return new Response(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      console.error('Webhook verification failed: Verify tokens do not match.');
      return new Response('Forbidden', { status: 403 });
    }
  }
  // Respond with '400 Bad Request' if mode or token is not present
  return new Response('Bad Request', { status: 400 });
}


/**
 * Handles incoming messages from Facebook Messenger.
 * Facebook sends a POST request to this endpoint with message payloads.
 */
export async function POST(req: Request) {
    const body = await req.json();

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
        
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry: any) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            const webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // TODO: Handle the event
            // e.g., get sender PSID, get message text, pass to AI, send reply.

        });

        // Returns a '200 OK' response to all requests
        return new NextResponse('EVENT_RECEIVED', { status: 200 });
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        return new NextResponse(null, { status: 404 });
    }
}
