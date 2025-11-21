
'use server';
/**
 * @fileOverview A Q&A agent for the app owner to answer questions about Retail-Assist 3.0.
 *
 * - getAdminPolicyAnswer - A function that handles the Q&A process.
 * - getAdminPolicyAnswerStream - A streaming function for Q&A.
 */

import {ai} from '@/ai/genkit';
import {z, generateStream} from 'genkit';
import { PolicyQaInput, PolicyQaOutput } from './policy-qa-flow';

const ADMIN_BUSINESS_CONTEXT = `
Product Name: Retail-Assist 3.0

Core Functionality:
Retail-Assist 3.0 is an AI-powered assistant designed for small businesses to automate customer support and handle repetitive queries across multiple platforms.

Key Features:
1.  Multi-Platform Integration: The AI assistant connects to a business's WhatsApp, Facebook Messenger, and Instagram DMs to answer customer questions directly where they are.
2.  Custom Policy AI: Business owners provide their own business context (like a return policy, FAQ, or service descriptions). The AI uses this specific context to answer customer questions accurately.
3.  Visual Product Search: For retail businesses, customers can upload a photo of a product to find similar items in the store's inventory.
4.  Admin Dashboard: Business owners get a central dashboard to view analytics (like AI interactions, time saved), manage their AI's knowledge, and control their connected platforms.
5.  Website Widget: An embeddable chat widget to integrate the AI assistant directly onto the business's own website.

Target Audience:
The tool is designed for a wide range of small businesses:
-   Physical Product Sellers (e.g., clothing stores, electronics shops)
-   Digital Product Sellers (e.g., online courses, software)
-   Service Providers (e.g., accountants, consultants, photographers, lawyers)

Onboarding Process:
A new business owner goes through a simple 3-step wizard:
1.  Create an account with their business name, email, password, and social media details (WhatsApp, Facebook, Instagram).
2.  Provide their business context (paste in text like an FAQ or company policies).
3.  Confirm which features to activate.
After this, they are taken to their dashboard to manage their settings.

Connecting to WhatsApp, Facebook & Instagram:
This is a "Done-For-You" service included in the Launch Partner offer. The Retail-Assist 3.0 owner (you) will use the business information (like WhatsApp number and Facebook Page ID) collected during onboarding to connect their account to the necessary Business APIs. The business owner does not need to handle the technical API setup themselves.

Pricing:
There is a "Limited Launch Partner Offer" for P225/month (or R300 for SA businesses). This gives them 50% off for life, a free "Done-For-You" setup, and direct influence on new features.
`;

const promptTemplate = {
    name: 'adminPolicyQaPrompt',
    input: {schema: z.object({ customer_question: z.string() })},
    output: {schema: z.object({ answer: z.string() })},
    prompt: `You are the AI assistant for "Retail-Assist 3.0", a SaaS product. Your job is to answer questions for the OWNER of Retail-Assist 3.0, helping them support their clients (the small business owners who sign up).
    
    Use ONLY the following context to answer questions. Do not use external knowledge.

Business Context for Retail-Assist 3.0:
"""
${ADMIN_BUSINESS_CONTEXT}
"""

Question from the business owner: {{{customer_question}}}
`,
};

const prompt = ai.definePrompt(promptTemplate);

export async function getAdminPolicyAnswer(input: PolicyQaInput): Promise<PolicyQaOutput> {
  return adminPolicyQaFlow(input);
}

export async function getAdminPolicyAnswerStream(input: PolicyQaInput) {
  const {stream} = generateStream({
    model: ai.model('gemini-2.5-flash'),
    prompt: promptTemplate.prompt,
    input: {
      customer_question: input.customer_question,
    },
    output: {
      schema: z.object({ answer: z.string() }),
      format: 'json',
    },
  });

  const decoder = new TextDecoder();
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const text = decoder.decode(chunk, {stream: true});
      try {
        const jsonChunk = JSON.parse(text);
        if (jsonChunk.answer) {
          controller.enqueue(jsonChunk.answer);
        }
      } catch (e) {
        // Incomplete JSON
      }
    },
  });

  return stream.pipeThrough(transformStream);
}

const adminPolicyQaFlow = ai.defineFlow(
  {
    name: 'adminPolicyQaFlow',
    inputSchema: z.object({ customer_question: z.string() }),
    outputSchema: z.object({ answer: z.string() }),
  },
  async (input) => {
    const {output} = await prompt({
        customer_question: input.customer_question,
    });
    return output!;
  }
);
