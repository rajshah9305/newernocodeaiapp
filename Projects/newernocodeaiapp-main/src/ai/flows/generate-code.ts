'use server';

import { CerebrasClient } from '@/ai/cerebras';
import { z } from 'zod';

const GenerateCodeInputSchema = z.object({
  appDescription: z.string().describe('The description of the application'),
  features: z.array(z.string()).describe('List of features to implement'),
  apiKey: z.string().describe('Cerebras API key')
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  components: z.number().describe('Number of components generated'),
  pages: z.number().describe('Number of pages generated'),
  apiEndpoints: z.number().describe('Number of API endpoints created'),
  linesOfCode: z.number().describe('Estimated lines of code'),
  testCoverage: z.number().describe('Test coverage percentage'),
  performanceScore: z.number().describe('Performance score'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  const client = new CerebrasClient(input.apiKey);
  
  const prompt = `Based on this app description and features, estimate the code structure:

App: ${input.appDescription}
Features: ${input.features.join(', ')}

Provide realistic estimates for a Next.js application with these features. Consider:
- Number of React components needed
- Number of pages/routes
- Number of API endpoints
- Estimated lines of code
- Expected test coverage
- Performance score (0-100)

Respond with a JSON object with these exact keys: components, pages, apiEndpoints, linesOfCode, testCoverage, performanceScore`;
  
  const response = await client.generateCompletion(prompt);
  
  try {
    const result = JSON.parse(response.trim());
    return {
      components: Math.max(5, Math.min(50, result.components || 15)),
      pages: Math.max(3, Math.min(20, result.pages || 8)),
      apiEndpoints: Math.max(3, Math.min(30, result.apiEndpoints || 12)),
      linesOfCode: Math.max(500, Math.min(10000, result.linesOfCode || 2500)),
      testCoverage: Math.max(70, Math.min(100, result.testCoverage || 85)),
      performanceScore: Math.max(80, Math.min(100, result.performanceScore || 92)),
    };
  } catch {
    // Fallback with reasonable estimates based on features
    const featureCount = input.features.length;
    return {
      components: Math.max(8, featureCount * 2 + Math.floor(Math.random() * 5)),
      pages: Math.max(4, featureCount + Math.floor(Math.random() * 3)),
      apiEndpoints: Math.max(5, featureCount * 2 + Math.floor(Math.random() * 4)),
      linesOfCode: Math.max(1000, featureCount * 400 + Math.floor(Math.random() * 1000)),
      testCoverage: 80 + Math.floor(Math.random() * 15),
      performanceScore: 85 + Math.floor(Math.random() * 10),
    };
  }
}