
'use server';
/**
 * @fileOverview A Q&A agent that answers questions based on a provided business context.
 *
 * - getPolicyAnswer - A function that handles the Q&A process.
 * - getPolicyAnswerStream - A streaming function for Q&A.
 * - PolicyQaInput - The input type for the getPolicyAnswer function.
 * - PolicyQaOutput - The return type for the getPolicyAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z, generateStream} from 'genkit';
import { getFirestore, collection, addDoc, serverTimestamp, Firestore, enablePersistentCache } from 'firebase/firestore';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';


// Helper to initialize Firebase SDK for server-side use.
let db: Firestore | null = null;
async function getDb() {
    if (!db) {
        let app: FirebaseApp;
        if (!getApps().length) {
            const firebaseConfig = {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            };
            app = initializeApp(firebaseConfig);
        } else {
            app = getApp();
        }
        const firestore = getFirestore(app);
        try {
            await enablePersistentCache(firestore);
        } catch (err) {
            console.error("Firebase persistence error", err);
        }
        db = firestore;
    }
    return db;
}


const PolicyQaInputSchema = z.object({
  customer_question: z.string().describe("The customer's question about the business."),
  business_context: z.string().describe("The business's policy, FAQ, or other relevant information."),
   userId: z.string().describe("The UID of the user whose context is being used."),
});
export type PolicyQaInput = z.infer<typeof PolicyQaInputSchema>;

const PolicyQaOutputSchema = z.object({
  answer: z.string().describe("The answer to the customer's question, based on the provided context."),
});
export type PolicyQaOutput = z.infer<typeof PolicyQaOutputSchema>;


const promptTemplate = {
    name: 'policyQaPrompt',
    input: {schema: PolicyQaInputSchema},
    output: {schema: PolicyQaOutputSchema},
    prompt: `You are a helpful AI assistant for a business. Your goal is to answer customer questions based ONLY on the following context provided. Do not use any external knowledge. If the answer is not in the context, politely state that you don't have that information.

Business Context:
"""
{{{business_context}}}
"""

Customer Question: {{{customer_question}}}
`,
};

const prompt = ai.definePrompt(promptTemplate);

export async function getPolicyAnswer(input: PolicyQaInput): Promise<PolicyQaOutput> {
  return policyQaFlow(input);
}

export async function getPolicyAnswerStream(input: PolicyQaInput) {

  const {stream} = generateStream({
    model: ai.model('gemini-2.5-flash'),
    prompt: promptTemplate.prompt,
    input: {
      customer_question: input.customer_question,
      business_context: input.business_context,
      userId: input.userId,
    },
    output: {
      schema: PolicyQaOutputSchema,
      format: 'json',
    },
  });

  const decoder = new TextDecoder();
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      // Assuming chunk is a Uint8Array. If it's a string, you don't need TextDecoder.
      const text = decoder.decode(chunk, {stream: true});
      try {
        const jsonChunk = JSON.parse(text);
        if (jsonChunk.answer) {
          controller.enqueue(jsonChunk.answer);
        }
      } catch (e) {
        // Incomplete JSON, just ignore and wait for more data.
      }
    },
  });

  return stream.pipeThrough(transformStream);
}

const policyQaFlow = ai.defineFlow(
  {
    name: 'policyQaFlow',
    inputSchema: PolicyQaInputSchema,
    outputSchema: PolicyQaOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);

    if (output && input.userId) {
        const firestore = await getDb();
        const interactionsRef = collection(firestore, 'users', input.userId, 'interactions');
        await addDoc(interactionsRef, {
            type: 'POLICY_QA',
            details: {
                question: input.customer_question,
                answer: output.answer,
            },
            createdAt: serverTimestamp(),
        });
    }

    return output!;
  }
);
