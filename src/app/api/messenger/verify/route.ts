// File: src/app/api/messenger/verify/route.ts

export const runtime = 'edge';

const VERIFY_TOKEN = "retail-assist-token";

/**
 * Handles Facebook webhook verification using the Edge runtime.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Log the attempt
  console.log('Edge Verification Attempt:', {
    url: req.url,
    mode,
    token,
    challenge,
  });

  // Verification logic
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Edge Verification Successful: Returning challenge.");
    // MUST return challenge as plain text only
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // Fail if token doesn't match
  console.log("Edge Verification Failed: Token or mode did not match.");
  return new Response("Forbidden", { status: 403 });
}
