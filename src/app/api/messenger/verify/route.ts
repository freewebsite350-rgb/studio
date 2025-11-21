// File: src/app/api/messenger/verify/route.ts

const VERIFY_TOKEN = "retail-assist-token";

/**
 * Handles Facebook webhook verification (GET request) by logging the request
 * and returning received parameters for debugging.
 */
export async function GET(req: Request) {
  console.log("--- New Verification Attempt ---");
  console.log("Request URL:", req.url);
  console.log("Request Headers:", JSON.stringify(Object.fromEntries(req.headers), null, 2));

  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const receivedParams = {
    mode,
    token,
    challenge,
    allParams: Object.fromEntries(searchParams),
  };
  
  console.log("Received Parameters:", JSON.stringify(receivedParams, null, 2));

  // For now, let's see if we can get the challenge back at all.
  // The official verification requires plain text, but this test will show us if the connection works.
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Verification successful, returning challenge.");
    return new Response(challenge || "NO_CHALLENGE_RECEIVED", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.log("Verification failed. Token or mode did not match.");
  return new Response("Verification Failed: Token or mode did not match.", { status: 403 });
}
