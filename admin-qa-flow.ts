'use server';
/**
 * @fileOverview A Q&A agent for the app owner to answer questions about Retail-Assist 3.0.
 *
 * - getAdminPolicyAnswer - A function that handles the Q&A process.
 * - getAdminPolicyAnswerStream - A streaming function for Q&A.
 */

import {ai} from '@/lib/ai/genkit';
import {z} from 'zod';
import { PolicyQaOutput } from './policy-qa-flow';
import { getAdminBusinessContext } from '@/lib/data-access';


const promptTemplateText = `You are the AI assistant for "Retail-Assist 3.0", a SaaS product. Your job is to answer questions for the OWNER of Retail-Assist 3.0, helping them support their clients (the small business owners who sign up).
    
    Use ONLY the following context to answer questions. Do not use external knowledge.

Business Context for Retail-Assist 3.0:
"""
{{{business_context}}}
"""

Question from the business owner: {{{customer_question}}}
`;


const PolicyQaInputSchema = z.object({
  customer_question: z.string().describe("The user's question."),
});
export type AdminQaInput = z.infer<typeof PolicyQaInputSchema>;


export async function getAdminPolicyAnswer(input: AdminQaInput): Promise<PolicyQaOutput> {
  return adminPolicyQaFlow(input);
}

export async function getAdminPolicyAnswerStream(input: AdminQaInput) {
  const adminContext = await getAdminBusinessContext();

  const {stream} = ai.generateStream({
    model: 'gemini-1.5-flash',
    prompt: {
        template: promptTemplateText,
        input: {
            customer_question: input.customer_question,
            business_context: adminContext,
        }
    },
    output: {
      schema: z.object({answer: z.string()}),
      format: 'json',
    },
  });

  const decoder = new TextDecoder();
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      const text = decoder.decode(chunk, {stream: true});
      try {
        // This is a simplified way to handle streaming JSON. It might not parse every chunk perfectly but works for many cases.
        // It accumulates text until it can parse a complete JSON object from it.
        const potentialJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        if(potentialJson) {
            const jsonChunk = JSON.parse(potentialJson);
            if (jsonChunk.answer) {
              controller.enqueue(jsonChunk.answer);
            }
        }
      } catch (e) {
        // Incomplete JSON, just ignore and wait for more data.
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
    const adminContext = await getAdminBusinessContext();
    
    const prompt = ai.definePrompt({
        name: 'adminQaPrompt',
        prompt: {
            template: promptTemplateText
        },
        input: { schema: PolicyQaInputSchema.extend({ business_context: z.string() }) },
        output: { schema: z.object({ answer: z.string() }) }
    });

    const {output} = await prompt({
        customer_question: input.customer_question,
        business_context: adminContext,
    });
    return output!;
  }
);
