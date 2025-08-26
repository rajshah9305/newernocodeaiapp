'use server';

/**
 * @fileOverview An AI agent that suggests app names based on a given description.
 *
 * - suggestAppName - A function that suggests an app name based on the provided description.
 * - SuggestAppNameInput - The input type for the suggestAppName function.
 * - SuggestAppNameOutput - The return type for the suggestAppName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAppNameInputSchema = z.object({
  appDescription: z
    .string()
    .describe('The description of the app for which a name is to be suggested.'),
});
export type SuggestAppNameInput = z.infer<typeof SuggestAppNameInputSchema>;

const SuggestAppNameOutputSchema = z.object({
  appName: z.string().describe('The suggested name for the app.'),
});
export type SuggestAppNameOutput = z.infer<typeof SuggestAppNameOutputSchema>;

export async function suggestAppName(input: SuggestAppNameInput): Promise<SuggestAppNameOutput> {
  return suggestAppNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAppNamePrompt',
  input: {schema: SuggestAppNameInputSchema},
  output: {schema: SuggestAppNameOutputSchema},
  prompt: `You are an expert in naming applications. Based on the description provided, suggest a creative and relevant name for the app.\n\nDescription: {{{appDescription}}}\n\nName: `,
});

const suggestAppNameFlow = ai.defineFlow(
  {
    name: 'suggestAppNameFlow',
    inputSchema: SuggestAppNameInputSchema,
    outputSchema: SuggestAppNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
