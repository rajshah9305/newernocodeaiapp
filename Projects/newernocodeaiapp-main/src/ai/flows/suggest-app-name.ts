'use server';

import { CerebrasClient } from '@/ai/cerebras';
import { z } from 'zod';

const SuggestAppNameInputSchema = z.object({
  appDescription: z.string().describe('The description of the app for which a name is to be suggested.'),
  apiKey: z.string().describe('Cerebras API key')
});
export type SuggestAppNameInput = z.infer<typeof SuggestAppNameInputSchema>;

const SuggestAppNameOutputSchema = z.object({
  appName: z.string().describe('The suggested name for the app.'),
});
export type SuggestAppNameOutput = z.infer<typeof SuggestAppNameOutputSchema>;

export async function suggestAppName(input: SuggestAppNameInput): Promise<SuggestAppNameOutput> {
  const client = new CerebrasClient(input.apiKey);
  
  const prompt = `You are an expert in naming applications. Based on the description provided, suggest a creative and relevant name for the app.

Description: ${input.appDescription}

Respond with only the app name, nothing else.`;
  
  const response = await client.generateCompletion(prompt);
  
  return {
    appName: response.trim()
  };
}
