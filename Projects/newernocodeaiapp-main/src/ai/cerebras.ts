import Cerebras from '@cerebras/cerebras_cloud_sdk';

export class CerebrasClient {
  private client: Cerebras;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.CEREBRAS_API_KEY || process.env.NEXT_PUBLIC_CEREBRAS_API_KEY;
    if (!key) {
      throw new Error('Cerebras API key is required');
    }
    
    this.client = new Cerebras({
      apiKey: key,
    });
  }

  async generateCompletion(prompt: string, systemMessage?: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        messages: [
          ...(systemMessage ? [{ role: 'system' as const, content: systemMessage }] : []),
          { role: 'user' as const, content: prompt }
        ],
        model: 'llama3.1-8b',
        max_completion_tokens: 4096,
        temperature: 0.7,
        top_p: 0.9
      });

      return (response as any).choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('Cerebras API Error:', error);
      throw new Error(`Cerebras API failed: ${error.message}`);
    }
  }

  async generateStreamCompletion(
    prompt: string, 
    systemMessage?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      const stream = await this.client.chat.completions.create({
        messages: [
          ...(systemMessage ? [{ role: 'system' as const, content: systemMessage }] : []),
          { role: 'user' as const, content: prompt }
        ],
        model: 'llama3.1-8b',
        stream: true,
        max_completion_tokens: 4096,
        temperature: 0.7,
        top_p: 0.9
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = (chunk as any).choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onChunk?.(content);
        }
      }

      return fullResponse;
    } catch (error: any) {
      console.error('Cerebras Streaming API Error:', error);
      throw new Error(`Cerebras Streaming API failed: ${error.message}`);
    }
  }

  async verifyApiKey(): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await this.client.chat.completions.create({
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'llama3.1-8b',
        max_completion_tokens: 10,
        temperature: 0.1
      });
      
      if ((response as any).choices[0]?.message?.content) {
        return { success: true, message: 'API key verified successfully' };
      }
      
      return { success: false, message: 'Invalid response from API' };
    } catch (error: any) {
      console.error('API Key Verification Error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify API key'
      };
    }
  }
}