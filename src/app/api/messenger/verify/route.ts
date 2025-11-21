// File: src/app/api/messenger/verify/route.ts

const VERIFY_TOKEN = "retail-assist-token";

/**
 * Handles Facebook webhook verification (GET request)
 */
export async function GET(req: Request) {
  console.log("Received verification request:", req.url);

  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  console.log("Mode:", mode);
  console.log("Token:", token);
  console.log("Challenge:", challenge);
  
  // Verification logic
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    // MUST return challenge as plain text only
    return new Response(challenge || "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.error("Webhook verification failed.");
  // Fail if token doesn't match
  return new Response("Forbidden", { status: 403 });
}
