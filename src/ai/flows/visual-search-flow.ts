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
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
// We simulate that by using the placeholder images.
const MOCK_PRODUCT_CATALOG = PlaceHolderImages.filter(img => img.id !== 'dashboard-analytics').map(img => ({
    productName: img.description,
    price: Math.floor(Math.random() * 1000) + 500,
    currency: 'R',
    imageUrl: img.imageUrl,
    productUrl: '#'
}));


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
    // In a real app with Firestore, you would fetch the user's product catalog here.
    // For example:
    // const userId = await getUserIdFromAuth(); // (pseudo-code)
    // const products = await getProductsForUser(userId);
    // const catalogJson = JSON.stringify(products);
    // Then you would pass `catalogJson` to the prompt.

    const {output} = await prompt(input);
    return output!;
  }
);
