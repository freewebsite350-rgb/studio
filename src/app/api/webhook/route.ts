import { NextRequest } from 'next/server';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApp, App } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { getPolicyAnswer } from '@/ai/flows/policy-qa-flow';

const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

// Initialize Firebase
let app: App;
try {
  app = getApp();
} catch (e) {
  app = initializeApp(firebaseConfig);
}
const db = getFirestore(app);

/**
 * Handles the webhook verification request from Meta.
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
  } catch (err: any) {
    console.error('[FB WEBHOOK] Error handling verification GET:', err.message);
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

    if (body.object === 'page') {
      for (const entry of body.entry) {
        const webhook_event = entry.messaging[0];
        console.log(webhook_event);

        const sender_psid = webhook_event.sender.id;
        
        if (webhook_event.message) {
          await handleMessage(sender_psid, webhook_event.message);
        }
      }
      return new Response(JSON.stringify({ status: 'success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response('Not Found', { status: 404 });
    }
  } catch (err: any) {
    console.error('[FB WEBHOOK] Error processing POST:', err.message);
    return new Response('Internal Server Error', { status: 500 });
  }
}

async function handleMessage(sender_psid: string, received_message: any) {
    if (!received_message.text) {
        return;
    }

    // This is a placeholder for mapping a PSID to your app's user ID.
    // In a real app, you would have a database that stores this mapping
    // when a user authenticates and connects their Facebook Page.
    // For now, we will use the first user found in the database.
    // THIS IS NOT A PRODUCTION-READY SOLUTION.
    const userId = "lQ5t2h1sZ5Yg9t3rE8a2Vb1v1y2"; // HARDCODED for now

    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.error(`No user document found for hardcoded userId: ${userId}`);
            await callSendAPI(sender_psid, { text: "I'm sorry, I can't find the business information for this chat." });
            return;
        }

        const businessContext = userDoc.data()?.businessContext;

        if (!businessContext) {
            console.error(`User ${userId} does not have businessContext set.`);
            await callSendAPI(sender_psid, { text: "I'm sorry, the AI assistant for this business has not been configured yet." });
            return;
        }

        const aiResponse = await getPolicyAnswer({
            customer_question: received_message.text,
            business_context: businessContext,
            userId: userId,
        });

        await callSendAPI(sender_psid, { text: aiResponse.answer });

    } catch (error: any) {
        console.error('Error handling message:', error.message);
        await callSendAPI(sender_psid, { text: "Sorry, I ran into a problem trying to respond. Please try again later." });
    }
}

async function callSendAPI(sender_psid: string, response: any) {
  const request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request_body),
    });
    const data = await res.json();
    console.log('[SEND API] Response:', data);
  } catch(error: any) {
    console.error('[SEND API] Unable to send message:' + error.message);
  }
}
