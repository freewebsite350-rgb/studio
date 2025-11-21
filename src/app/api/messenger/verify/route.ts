// File: src/app/api/messenger/verify/route.ts

const VERIFY_TOKEN = "retail-assist-token";

/**
 * Handles Facebook webhook verification (GET request) by logging the request
 * and returning the challenge as plain text if the token is valid.
 */
export async function GET(req: Request) {
  console.log("--- New Verification Attempt ---");
  console.log("Request URL:", req.url);
  
  const headersObject: {[key: string]: string} = {};
  req.headers.forEach((value, key) => {
    headersObject[key] = value;
  });
  console.log("Request Headers:", JSON.stringify(headersObject, null, 2));

  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const receivedParams = {
    "hub.mode": mode,
    "hub.verify_token": token,
    "hub.challenge": challenge,
  };
  
  console.log("Received Parameters:", JSON.stringify(receivedParams, null, 2));

  // Verification logic based on the received parameters.
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Verification successful, returning challenge.");
    // Facebook requires the challenge to be returned as plain text.
    return new Response(challenge || "NO_CHALLENGE_RECEIVED", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.log("Verification failed. Token or mode did not match.");
  return new Response("Verification Failed: Token or mode did not match.", { status: 403 });
}
