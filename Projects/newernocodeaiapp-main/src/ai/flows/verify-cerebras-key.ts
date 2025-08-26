'use server';

import { CerebrasClient } from '@/ai/cerebras';
import { z } from 'zod';

const VerifyCerebrasKeyInputSchema = z.object({
  apiKey: z.string().describe('The Cerebras AI API key to verify.'),
});
export type VerifyCerebrasKeyInput = z.infer<typeof VerifyCerebrasKeyInputSchema>;

const VerifyCerebrasKeyOutputSchema = z.object({
  success: z.boolean().describe('Whether the API key is valid.'),
  message: z.string().optional().describe('An error message if the key is invalid.'),
});
export type VerifyCerebrasKeyOutput = z.infer<typeof VerifyCerebrasKeyOutputSchema>;

export async function verifyCerebrasKey(input: VerifyCerebrasKeyInput): Promise<VerifyCerebrasKeyOutput> {
  try {
    const client = new CerebrasClient(input.apiKey);
    return await client.verifyApiKey();
  } catch (error: any) {
    console.error('Cerebras API key verification failed:', error);
    return {
      success: false,
      message: error.message || 'Failed to verify API key'
    };
  }
}
