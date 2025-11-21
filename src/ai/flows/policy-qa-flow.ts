'use server';
/**
 * @fileOverview A Q&A agent that answers questions based on a return policy.
 *
 * - getPolicyAnswer - A function that handles the Q&A process.
 * - PolicyQaInput - The input type for the getPolicyAnswer function.
 * - PolicyQaOutput - The return type for the getPolicyAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolicyQaInputSchema = z.object({
  customer_question: z.string().describe('The customer\'s question about the return policy.'),
});
export type PolicyQaInput = z.infer<typeof PolicyQaInputSchema>;

const PolicyQaOutputSchema = z.object({
  answer: z.string().describe('The answer to the customer\'s question, based on the policy.'),
});
export type PolicyQaOutput = z.infer<typeof PolicyQaOutputSchema>;

export async function getPolicyAnswer(input: PolicyQaInput): Promise<PolicyQaOutput> {
  return policyQaFlow(input);
}

const POLICY_CONTEXT = `
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

const prompt = ai.definePrompt({
  name: 'policyQaPrompt',
  input: {schema: PolicyQaInputSchema},
  output: {schema: PolicyQaOutputSchema},
  prompt: `Based ONLY on the following policy text, answer the question. Do not use any external knowledge.

Policy Text:
"""
${POLICY_CONTEXT}
"""

Question: {{{customer_question}}}
`,
});

const policyQaFlow = ai.defineFlow(
  {
    name: 'policyQaFlow',
    inputSchema: PolicyQaInputSchema,
    outputSchema: PolicyQaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
