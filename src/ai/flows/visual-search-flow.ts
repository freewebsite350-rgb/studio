
'use server';
/**
 * @fileOverview A visual search agent for finding products in a catalog.
 *
 * - findSimilarProducts - A function that handles the visual search process.
 * - VisualSearchInput - The input type for the findSimilarProducts function.
 * - VisualSearchOutput - The return type for the findSimilarProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getFirestore, collection, getDocs, query, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { initializeApp, getApps, getApp, deleteApp } from 'firebase/app';

// Helper to get a Firestore instance for server-side use.
// It initializes a new, uniquely named app for each request to avoid connection state issues in a serverless environment.
function getDb(): Firestore {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    // Use a unique app name for each initialization to avoid conflicts
    const appName = `server-app-visual-search-${Date.now()}-${Math.random()}`;
    const app = initializeApp(firebaseConfig, appName);
    return getFirestore(app);
}

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
   userId: z.string().describe("The UID of the user whose product catalog should be searched."),
});
export type VisualSearchInput = z.infer<typeof VisualSearchInputSchema>;

const VisualSearchOutputSchema = z.object({
  products: z.array(ProductSchema).describe('An array of matching products, sorted from best match to worst.'),
});
export type VisualSearchOutput = z.infer<typeof VisualSearchOutputSchema>;


export async function findSimilarProducts(input: VisualSearchInput): Promise<VisualSearchOutput> {
  return visualSearchFlow(input);
}

const promptTemplate = `You are an expert visual search AI for an e-commerce store. Your task is to find products from the provided catalog that are visually similar to the image uploaded by the user.

Analyze the user's uploaded image and compare it against the products in the catalog. Return the top 3 most similar products.

For each matching product, you MUST provide a 'matchScore' between 0 and 100, where 100 is a perfect match.

User's Uploaded Image:
{{media url=photoDataUri}}

Product Catalog (JSON format):
"""
{{{productCatalogJson}}}
"""

Provide your response in the required JSON format, with a 'products' array containing the matching items.
`;

const prompt = ai.definePrompt({
  name: 'visualSearchPrompt',
  input: {schema: VisualSearchInputSchema.extend({ productCatalogJson: z.string() })},
  output: {schema: VisualSearchOutputSchema},
  prompt: {template: promptTemplate},
  model: ai.model('gemini-1.5-flash'),
});


async function getProductsForUser(userId: string) {
    const firestore = getDb();
    const products = [];
    try {
        const productsCollectionRef = collection(firestore, 'users', userId, 'products');
        const querySnapshot = await getDocs(productsCollectionRef);
        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            products.push({
                productName: data.productName,
                price: data.price,
                currency: data.currency,
                imageUrl: data.imageUrl,
                productUrl: data.productUrl,
            });
        }
    } catch(e) {
        console.error("Error fetching products for visual search:", e);
    } finally {
        // Clean up the temporary app instance after use
        await deleteApp(firestore.app);
    }
    return products;
}

const visualSearchFlow = ai.defineFlow(
  {
    name: 'visualSearchFlow',
    inputSchema: VisualSearchInputSchema,
    outputSchema: VisualSearchOutputSchema,
  },
  async (input) => {
    const userProducts = await getProductsForUser(input.userId);
    const catalogJson = JSON.stringify(userProducts);

    const {output} = await prompt({
        ...input,
        productCatalogJson: catalogJson
    });
    
    
    if (output && output.products.length > 0 && input.userId) {
        const firestore = getDb();
        const interactionsRef = collection(firestore, 'users', input.userId, 'interactions');
        try {
            await addDoc(interactionsRef, {
                type: 'VISUAL_SEARCH',
                details: {
                    resultCount: output.products.length,
                    topMatch: output.products[0].productName,
                },
                createdAt: serverTimestamp(),
            });
        } catch(e) {
            console.error("Error logging visual search interaction:", e);
        } finally {
            // Clean up the temporary app instance after use
            await deleteApp(firestore.app);
        }
    }


    // Handle cases where the model might not find any products
    if (!output || !output.products) {
      return { products: [] };
    }

    return output;
  }
);
