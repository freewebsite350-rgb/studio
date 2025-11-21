
// File: src/app/api/webhook/route.ts

const VERIFY_TOKEN = "retail-assist-token";

/**
 * Handles Facebook webhook verification (GET request)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Verification logic
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    // MUST return challenge as plain text only
    return new Response(challenge || "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // Fail if token doesn't match
  return new Response("Forbidden", { status: 403 });
}

/**
 * Handles incoming messages from Facebook (POST request)
 */
export async function POST(req: Request) {
  const body = await req.json();

  // You can process incoming Messenger messages here
  console.log("Incoming webhook:", body);

  return new Response("EVENT_RECEIVED", { status: 200 });
}
