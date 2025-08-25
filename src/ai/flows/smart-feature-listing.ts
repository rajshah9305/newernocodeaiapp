'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a list of key features for an application based on its description.
 *
 * - generateFeatures - A function that takes an app description and returns a list of key features.
 * - GenerateFeaturesInput - The input type for the generateFeatures function.
 * - GenerateFeaturesOutput - The return type for the generateFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFeaturesInputSchema = z.object({
  appDescription: z
    .string()
    .describe('The description of the application for which to generate features.'),
});
export type GenerateFeaturesInput = z.infer<typeof GenerateFeaturesInputSchema>;

const GenerateFeaturesOutputSchema = z.object({
  features: z
    .array(z.string())
    .describe('A list of key features for the application.'),
});
export type GenerateFeaturesOutput = z.infer<typeof GenerateFeaturesOutputSchema>;

export async function generateFeatures(input: GenerateFeaturesInput): Promise<GenerateFeaturesOutput> {
  return generateFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFeaturesPrompt',
  input: {schema: GenerateFeaturesInputSchema},
  output: {schema: GenerateFeaturesOutputSchema},
  prompt: `You are an AI assistant that generates key features for an application based on its description.

  Description: {{{appDescription}}}

  Generate a list of key features that would be relevant for this application.
  Each item in the list should be less than 5 words.
  There should be at least 3 and no more than 6 items in the list.
  `,
});

const generateFeaturesFlow = ai.defineFlow(
  {
    name: 'generateFeaturesFlow',
    inputSchema: GenerateFeaturesInputSchema,
    outputSchema: GenerateFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
