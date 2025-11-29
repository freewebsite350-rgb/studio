'use server';
/**
 * @fileOverview A Q&A agent that answers questions based on a provided business context.
 *
 * - getPolicyAnswer - A function that handles the Q&A process.
 * - getPolicyAnswerStream - A streaming function for Q&A.
 * - PolicyQaInput - The input type for the getPolicyAnswer function.
 * - PolicyQaOutput - The return type for the getPolicyAnswer function.
 */

import {ai} from '@/lib/ai/genkit';
import {z} from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getUserBusinessContext } from '@/lib/data-access'; // Import the new data access function

const PolicyQaInputSchema = z.object({
  customer_question: z.string().describe("The customer's question about the business."),
  userId: z.string().describe("The UID of the user whose context is being used."),
});
export type PolicyQaInput = z.infer<typeof PolicyQaInputSchema>;

const PolicyQaOutputSchema = z.object({
  answer: z.string().describe("The answer to the customer's question, based on the provided context."),
});
export type PolicyQaOutput = z.infer<typeof PolicyQaOutputSchema>;


const promptTemplate = {
    name: 'policyQaPrompt',
    input: {schema: z.object({
        customer_question: z.string(),
        business_context: z.string(), // Renamed from system_prompt
    })},
    output: {schema: PolicyQaOutputSchema},
    prompt: {
        template: `You are an AI assistant for this business. Use the following business context to answer the user's question.
Business Context:
---
{{{business_context}}}
---

User message:
{{{customer_question}}}
`,
    }
};

const prompt = ai.definePrompt(promptTemplate);

export async function getPolicyAnswer(input: PolicyQaInput): Promise<PolicyQaOutput> {
  return policyQaFlow(input);
}

export async function getPolicyAnswerStream(input: PolicyQaInput) {
  const businessContext = await getUserBusinessContext(input.userId); // Use the new data access function

  const {stream} = ai.generateStream({
    model: 'gemini-1.5-flash',
    prompt: {
      template: promptTemplate.prompt.template,
      input: {
        customer_question: input.customer_question,
        business_context: businessContext, // Use businessContext
      },
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

const policyQaFlow = ai.defineFlow(
  {
    name: 'policyQaFlow',
    inputSchema: PolicyQaInputSchema,
    outputSchema: PolicyQaOutputSchema,
  },
  async (input) => {
    const supabase = createClient();
    const businessContext = await getUserBusinessContext(input.userId); // Use the new data access function

    const {output} = await prompt({
        customer_question: input.customer_question,
        business_context: businessContext, // Use businessContext
    });

    if (output) {
        // Log interaction to Supabase
        await supabase.from('interactions').insert([
            {
                user_id: input.userId,
                message: input.customer_question,
                response: output.answer,
            },
        ]);
    }

    return output!;
  }
);
