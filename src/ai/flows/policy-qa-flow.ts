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
  business_context: z.string().describe("The business's policy, FAQ, or other relevant information."),
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
    const {output} = await prompt({
        customer_question: input.customer_question,
        business_context: input.business_context,
    });
    return output!;
  }
);
