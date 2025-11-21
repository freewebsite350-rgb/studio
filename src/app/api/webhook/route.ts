import { NextRequest } from 'next/server';
import { getFirestore, doc, getDoc, collection, query, limit, getDocs } from 'firebase/firestore';
import { initializeApp, getApp, App } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { getPolicyAnswer } from '@/ai/flows/policy-qa-flow';

const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.NEXT_PUBLIC_FB_PAGE_ID;

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
        console.log('[FB WEBHOOK] Processing event:', webhook_event);

        const sender_psid = webhook_event.sender.id;
        
        if (webhook_event.message && !webhook_event.message.is_echo) {
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
        console.log('[FB WEBHOOK] Received message without text, ignoring.');
        return;
    }

    // In a real app, you would have a database that stores a mapping
    // from a PSID to your app's user ID. For this demo, we'll find the
    // first user in the database and use their context.
    // THIS IS NOT A PRODUCTION-READY SOLUTION.
    let userId = '';
    let businessContext = '';

    try {
        console.log('[FIREBASE] Searching for user data to provide context...');
        const usersQuery = query(collection(db, 'users'), limit(1));
        const querySnapshot = await getDocs(usersQuery);

        if (querySnapshot.empty) {
             console.error('[FIREBASE] CRITICAL: No user documents found in the database. Cannot get business context.');
             await callSendAPI(sender_psid, { text: "I'm sorry, I can't find any business information to help you." });
             return;
        }

        const userDoc = querySnapshot.docs[0];
        userId = userDoc.id;
        businessContext = userDoc.data()?.businessContext;
        console.log(`[FIREBASE] Using context from user: ${userId}`);

        if (!businessContext) {
            console.error(`[FIREBASE] User ${userId} does not have businessContext set.`);
            await callSendAPI(sender_psid, { text: "I'm sorry, the AI assistant for this business has not been configured yet." });
            return;
        }
        
        console.log(`[AI] Generating response for user ${userId} with question: "${received_message.text}"`);
        const aiResponse = await getPolicyAnswer({
            customer_question: received_message.text,
            business_context: businessContext,
            userId: userId,
        });

        await callSendAPI(sender_psid, { text: aiResponse.answer });

    } catch (error: any)
    {
        console.error('[AI/FIREBASE ERROR] Error handling message:', error);
        await callSendAPI(sender_psid, { text: "Sorry, I ran into a problem trying to respond. Please try again later." });
    }
}

async function callSendAPI(sender_psid: string, response: any) {
  if (!PAGE_ID) {
    console.error('[SEND API] ERROR: NEXT_PUBLIC_FB_PAGE_ID environment variable not set.');
    return;
  }
  const request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  console.log('[SEND API] Calling Graph API to send message...');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request_body),
    });
    const data = await res.json();
    if(data.error) {
        console.error('[SEND API] Error response from Facebook:', data.error);
    } else {
        console.log('[SEND API] Successfully sent message:', data);
    }
  } catch(error: any) {
    console.error('[SEND API] Unable to send message:' + error.message);
  }
}
