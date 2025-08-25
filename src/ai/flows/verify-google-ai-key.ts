'use server';

/**
 * @fileOverview This file defines a Genkit flow for verifying a Google AI API key.
 *
 * - verifyGoogleAIKey - A function that takes an API key and checks its validity.
 * - VerifyGoogleAIKeyInput - The input type for the verifyGoogleAIKey function.
 * - VerifyGoogleAIKeyOutput - The return type for the verifyGoogleAIKey function.
 */

import {genkit, z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { ai } from '@/ai/genkit';

const VerifyGoogleAIKeyInputSchema = z.object({
  apiKey: z.string().describe('The Google AI API key to verify.'),
});
export type VerifyGoogleAIKeyInput = z.infer<
  typeof VerifyGoogleAIKeyInputSchema
>;

const VerifyGoogleAIKeyOutputSchema = z.object({
  success: z.boolean().describe('Whether the API key is valid.'),
  message: z.string().optional().describe('An error message if the key is invalid.'),
});
export type VerifyGoogleAIKeyOutput = z.infer<
  typeof VerifyGoogleAIKeyOutputSchema
>;

export async function verifyGoogleAIKey(
  input: VerifyGoogleAIKeyInput
): Promise<VerifyGoogleAIKeyOutput> {
  return verifyGoogleAIKeyFlow(input);
}

const verifyGoogleAIKeyFlow = ai.defineFlow(
  {
    name: 'verifyGoogleAIKeyFlow',
    inputSchema: VerifyGoogleAIKeyInputSchema,
    outputSchema: VerifyGoogleAIKeyOutputSchema,
  },
  async (input) => {
    try {
      // Create a temporary Genkit instance with the provided key to test it
      const tempGenkit = genkit({
        plugins: [googleAI({apiKey: input.apiKey})],
      });
      
      // We list models as a simple verification check
      const { models } = await tempGenkit.ai.listModels({
        model: 'googleai/gemini-pro', // A common model to check against
      });
      
      if (models.length > 0) {
        return { success: true };
      } else {
        return { success: false, message: 'No models found. The key may have limited permissions.' };
      }

    } catch (error: any) {
      console.error('API key verification failed:', error);
      let message = 'An unknown error occurred during verification.';
      if (error.message) {
        // Extract a more user-friendly error message if possible
        if (error.message.includes('API key not valid')) {
          message = 'The provided API key is not valid. Please check the key and try again.';
        } else if (error.message.includes('permission')) {
           message = 'The provided API key does not have the necessary permissions.';
        } else {
           message = error.message;
        }
      }
      return {
        success: false,
        message: message,
      };
    }
  }
);
