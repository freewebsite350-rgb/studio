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

const PolicyQaInputSchema = z.object({
  customer_question: z.string().describe("The customer's question about the business."),
  // In a real app, this context would be fetched from a database based on the logged-in user.
  business_context: z.string().describe("The business's policy, FAQ, or other relevant information.").optional(),
});
export type PolicyQaInput = z.infer<typeof PolicyQaInputSchema>;

const PolicyQaOutputSchema = z.object({
  answer: z.string().describe("The answer to the customer's question, based on the provided context."),
});
export type PolicyQaOutput = z.infer<typeof PolicyQaOutputSchema>;

// This is now a fallback for when no context is provided during the call.
const DEFAULT_BUSINESS_CONTEXT = `
Return Policy:

Our return window is 30 days for most items. Items must be unworn, in their original packaging, and with all tags attached. 
A full refund will be issued to the original payment method.

Electronics:
Electronics, such as headphones and cameras, have a 14-day return window. They must be in their original, unopened packaging. If the packaging is opened, a 15% restocking fee will apply. A valid receipt is required for all electronics returns.

Sale Items:
Items purchased on sale are final and cannot be returned or exchanged.

Exceptions:
Customized products are non-returnable. For hygiene reasons, undergarments and swimwear cannot be returned.
`;

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
  const context = input.business_context || DEFAULT_BUSINESS_CONTEXT;

  const {stream} = generateStream({
    model: ai.model('gemini-2.5-flash'),
    prompt: promptTemplate.prompt,
    input: {
      customer_question: input.customer_question,
      business_context: context,
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
    const context = input.business_context || DEFAULT_BUSINESS_CONTEXT;
    const {output} = await prompt({
        customer_question: input.customer_question,
        business_context: context,
    });
    return output!;
  }
);
