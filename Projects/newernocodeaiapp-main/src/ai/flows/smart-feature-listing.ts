'use server';

import { CerebrasClient } from '@/ai/cerebras';
import { z } from 'zod';

const GenerateFeaturesInputSchema = z.object({
  appDescription: z.string().describe('The description of the application for which to generate features.'),
  apiKey: z.string().describe('Cerebras API key')
});
export type GenerateFeaturesInput = z.infer<typeof GenerateFeaturesInputSchema>;

const GenerateFeaturesOutputSchema = z.object({
  features: z.array(z.string()).describe('A list of key features for the application.'),
});
export type GenerateFeaturesOutput = z.infer<typeof GenerateFeaturesOutputSchema>;

export async function generateFeatures(input: GenerateFeaturesInput): Promise<GenerateFeaturesOutput> {
  const client = new CerebrasClient(input.apiKey);
  
  const prompt = `You are an AI assistant that generates key features for an application based on its description.

Description: ${input.appDescription}

Generate a list of key features that would be relevant for this application.
Each item in the list should be less than 5 words.
There should be at least 3 and no more than 6 items in the list.

Respond with a JSON array of strings, for example: ["User authentication", "Real-time notifications", "Data analytics"]`;
  
  const response = await client.generateCompletion(prompt);
  
  try {
    const features = JSON.parse(response.trim());
    return { features };
  } catch {
    // Fallback if JSON parsing fails
    const lines = response.split('\n').filter(line => line.trim().length > 0);
    const features = lines.slice(0, 6).map(line => line.replace(/^[-*]\s*/, '').trim());
    return { features };
  }
}
