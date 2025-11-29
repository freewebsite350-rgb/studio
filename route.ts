import { NextRequest } from 'next/server';
import { getPolicyAnswer } from '@/lib/ai/flows/policy-qa-flow';
import { createClient } from '@/lib/supabase/server';
import { getUserBusinessContext } from '@/lib/data-access'; // Re-using data-access for context

const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

/**
 * Webhook verification (GET)
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const mode = url.searchParams.get('hub.mode') ?? '';
    const token = (url.searchParams.get('hub.verify_token') ?? '').trim();
    const challenge = url.searchParams.get('hub.challenge') ?? '';

    if (mode === 'subscribe' && token === VERIFY_TOKEN && challenge) {
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } else {
      return new Response('Forbidden', { status: 403 });
    }
  } catch (err: any) {
    console.error('[FB WEBHOOK] GET error:', err.message);
    return new Response('Internal Server Error', { status: 500 });
  }
}

/**
 * Incoming messages/events (POST)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.object !== 'page') return new Response(JSON.stringify({ status: 'not a page object' }), { status: 200 });

    for (const entry of body.entry) {
      if (!entry.messaging) continue;
      for (const webhook_event of entry.messaging) {
        const sender_psid = webhook_event.sender.id;
        const page_id = webhook_event.recipient.id;

        if (webhook_event.message && !webhook_event.message.is_echo) {
          await handleMessage(sender_psid, page_id, webhook_event.message);
        }
      }
    }

    return new Response(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[FB WEBHOOK] POST error:', err.message);
    return new Response('Internal Server Error', { status: 500 });
  }
}

/**
 * Handle a single message
 */
async function handleMessage(sender_psid: string, page_id: string, received_message: any) {
  if (!received_message.text) return;

  try {
    const supabase = createClient();

    // 1️⃣ Get user by Facebook page ID (using the page_id to find the user_id)
    // Assuming 'user_profiles' table has a 'facebook_page_id' column
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('facebook_page_id', page_id)
      .single();

    if (profileError || !userProfile) {
      console.error('[FB WEBHOOK] User lookup error:', profileError?.message || 'No user found for page ID');
      await callSendAPI(sender_psid, page_id, { text: "Business AI not configured for this page." });
      return;
    }

    const userId = userProfile.user_id;

    // 2️⃣ Get AI answer using the standardized flow
    // The getPolicyAnswer flow now internally fetches the business context using getUserBusinessContext(userId)
    const aiResponse = await getPolicyAnswer({
      customer_question: received_message.text,
      userId,
    });

    // 3️⃣ Send back to Messenger
    await callSendAPI(sender_psid, page_id, { text: aiResponse.answer });

  } catch (err: any) {
    console.error('[AI/SUPABASE ERROR]', err);
    await callSendAPI(sender_psid, page_id, { text: "Sorry, something went wrong with the AI service." });
  }
}

/**
 * Send response to Facebook Messenger
 */
async function callSendAPI(sender_psid: string, page_id: string, response: any) {
  const request_body = {
    recipient: { id: sender_psid },
    message: response,
  };

  // Correct URL construction
  const url = `https://graph.facebook.com/v19.0/${page_id}/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request_body),
    });
    const data = await res.json();
    if (data.error) console.error('[SEND API] Error:', data.error);
  } catch (err: any) {
    console.error('[SEND API] Failed to send:', err.message);
  }
}
