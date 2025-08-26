import { NextRequest, NextResponse } from 'next/server';
import { CerebrasClient } from '@/ai/cerebras';

export async function POST(request: NextRequest) {
  try {
    const { prompt, systemMessage, agentId } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const client = new CerebrasClient();
    const response = await client.generateCompletion(prompt, systemMessage);
    
    return NextResponse.json({ 
      success: true, 
      response,
      agentId 
    });
  } catch (error: any) {
    console.error('API Generation Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Generation failed' 
    }, { status: 500 });
  }
}