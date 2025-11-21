'use server';
/**
 * @fileOverview A visual search agent for finding products in a catalog.
 *
 * - findSimilarProducts - A function that handles the visual search process.
 * - VisualSearchInput - The input type for the findSimilarProducts function.
 * - VisualSearchOutput - The return type for the findSimilarProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  price: z.number().describe('The price of the product.'),
  currency: z.string().describe('The currency of the price (e.g., "R" or "P").'),
  imageUrl: z.string().url().describe('A public URL to an image of the product.'),
  productUrl: z.string().url().describe('A public URL to the product page on the website.'),
  matchScore: z.number().min(0).max(100).describe('A score from 0-100 indicating how well this product matches the user\'s uploaded image.'),
});

const VisualSearchInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VisualSearchInput = z.infer<typeof VisualSearchInputSchema>;

const VisualSearchOutputSchema = z.object({
  products: z.array(ProductSchema).describe('An array of matching products, sorted from best match to worst.'),
});
export type VisualSearchOutput = z.infer<typeof VisualSearchOutputSchema>;

// In a real app, this would come from a database (e.g., Firestore or a custom API).
const MOCK_PRODUCT_CATALOG = [
    {
        productName: "Classic Leather Biker Jacket",
        price: 2499,
        currency: "R",
        imageUrl: "https://images.unsplash.com/photo-1527016021513-b09758b777bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8YmxhY2slMjBqYWNrZXR8ZW58MHx8fHwxNzYzNzAxODk5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        productUrl: "#"
    },
    {
        productName: "Faux Leather Bomber Jacket",
        price: 1899,
        currency: "R",
        imageUrl: "https://picsum.photos/seed/201/600/600",
        productUrl: "#"
    },
    {
        productName: "Suede Moto Jacket",
        price: 2799,
        currency: "R",
        imageUrl: "https://picsum.photos/seed/202/600/600",
        productUrl: "#"
    },
     {
        productName: 'A Pair of Classic Blue Denim Jeans',
        price: 899,
        currency: 'R',
        imageUrl: 'https://images.unsplash.com/photo-1588544622467-6df9eef29c7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxibHVlJTIwamVhbnN8ZW58MHx8fHwxNzYzNjExMDU2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        productUrl: '#',
    },
];


export async function findSimilarProducts(input: VisualSearchInput): Promise<VisualSearchOutput> {
  return visualSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visualSearchPrompt',
  input: {schema: VisualSearchInputSchema},
  output: {schema: VisualSearchOutputSchema},
  prompt: `You are an expert visual search AI for an e-commerce store. Your task is to find products from the provided catalog that are visually similar to the image uploaded by the user.

Analyze the user's uploaded image and compare it against the products in the catalog. Return the top 3 most similar products.

For each matching product, you MUST provide a 'matchScore' between 0 and 100, where 100 is a perfect match.

User's Uploaded Image:
{{media url=photoDataUri}}

Product Catalog (JSON format):
"""
${JSON.stringify(MOCK_PRODUCT_CATALOG)}
"""

Provide your response in the required JSON format, with a 'products' array containing the matching items.
`,
});

const visualSearchFlow = ai.defineFlow(
  {
    name: 'visualSearchFlow',
    inputSchema: VisualSearchInputSchema,
    outputSchema: VisualSearchOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
