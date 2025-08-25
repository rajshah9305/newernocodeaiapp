'use server';

/**
 * @fileOverview This file defines a Genkit flow for verifying a Google AI API key.
 *
 * - verifyGoogleAIKey - A function that takes an API key and checks its validity.
 * - VerifyGoogleAIKeyInput - The input type for the verifyGoogleAIKey function.
 * - VerifyGoogleAIKeyOutput - The return type for the verifyGoogleAIKey function.
 */

import {z, generate} from 'genkit';
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
      // Temporarily use the provided API key to make a test call.
      // We use a simple, low-cost model and a short prompt.
      await generate({
        model: googleAI('gemini-pro', { apiKey: input.apiKey }),
        prompt: 'test',
        config: {
            maxOutputTokens: 1,
        }
      });

      // If the above call doesn't throw, the key is valid.
      return { success: true };

    } catch (error: any) {
      console.error('API key verification failed:', error);
      let message = 'An unknown error occurred during verification.';
      
      // Attempt to parse more specific error messages from the caught error.
      if (error.message) {
        if (error.message.includes('API key not valid')) {
          message = 'The provided API key is not valid. Please check the key and try again.';
        } else if (error.message.includes('permission')) {
           message = 'The provided API key does not have the necessary permissions.';
        } else if (error.message.includes('found for model')) {
           message = 'The provided API key does not have access to the required models.';
        } else {
           message = 'Failed to verify the key. It might be invalid, expired, or lack permissions.';
        }
      }
      
      return {
        success: false,
        message: message,
      };
    }
  }
);
