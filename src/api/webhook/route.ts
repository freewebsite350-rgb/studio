
import { NextRequest } from 'next/server';
import { getFirestore, doc, getDoc, collection, query, limit, getDocs, where, Firestore } from 'firebase/firestore';
import { getPolicyAnswer } from '@/ai/flows/policy-qa-flow';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

// Helper to initialize Firebase SDK for server-side use.
function getDb(): Firestore {
    if (getApps().length === 0) {
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };
        initializeApp(firebaseConfig);
    }
    return getFirestore(getApp());
}


const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

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
        const page_id = webhook_event.recipient.id;
        
        if (webhook_event.message && !webhook_event.message.is_echo) {
          await handleMessage(sender_psid, page_id, webhook_event.message);
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

async function handleMessage(sender_psid: string, page_id: string, received_message: any) {
    if (!received_message.text) {
        console.log('[FB WEBHOOK] Received message without text, ignoring.');
        return;
    }

    let userId = '';
    let businessContext = '';
    const firestore = getDb();

    try {
        console.log(`[FIREBASE] Searching for user with Facebook Page ID: ${page_id}`);
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where("facebookPageId", "==", page_id), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
             console.error(`[FIREBASE] CRITICAL: No user found for pageId ${page_id}. Cannot get business context.`);
             await callSendAPI(sender_psid, page_id, { text: "I'm sorry, this business has not configured their AI assistant correctly." });
             return;
        }

        const userDoc = querySnapshot.docs[0];
        userId = userDoc.id;
        businessContext = userDoc.data()?.businessContext;
        console.log(`[FIREBASE] Found user ${userId}. Using their context to respond.`);

        if (!businessContext) {
            console.error(`[FIREBASE] User ${userId} does not have businessContext set.`);
            await callSendAPI(sender_psid, page_id, { text: "I'm sorry, the AI assistant for this business has not been configured yet." });
            return;
        }
        
        console.log(`[AI] Generating response for user ${userId} with question: "${received_message.text}"`);
        const aiResponse = await getPolicyAnswer({
            customer_question: received_message.text,
            business_context: businessContext,
            userId: userId,
        });

        await callSendAPI(sender_psid, page_id, { text: aiResponse.answer });

    } catch (error: any)
    {
        console.error('[AI/FIREBASE ERROR] Error handling message:', error);
        await callSendAPI(sender_psid, page_id, { text: "Sorry, I ran into a problem trying to respond. Please try again later." });
    }
}

async function callSendAPI(sender_psid: string, page_id: string, response: any) {
  const request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  const url = `https://graph.facebook.com/v19.0/${page_id}/messages?access_token=${PAGE_ACCESS_TOKEN}`;
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
