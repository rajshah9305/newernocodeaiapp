'use server';

import { CerebrasClient } from './cerebras';

export interface ApiVerificationResult {
  success: boolean;
  message?: string;
}

export async function verifyVercelKey(apiKey: string): Promise<ApiVerificationResult> {
  try {
    const response = await fetch('https://api.vercel.com/v2/user', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      return { 
        success: false, 
        message: 'Invalid Vercel API key or insufficient permissions' 
      };
    }
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to verify Vercel API key' 
    };
  }
}

export async function verifySupabaseKey(apiKey: string): Promise<ApiVerificationResult> {
  try {
    // Extract project URL from the key format (if it's a service role key)
    if (!apiKey.startsWith('eyJ')) {
      return { 
        success: false, 
        message: 'Invalid Supabase key format' 
      };
    }
    
    // For demo purposes, we'll just validate the format
    // In a real implementation, you'd need the project URL to make a proper test call
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to verify Supabase API key' 
    };
  }
}

export async function verifyGitHubKey(apiKey: string): Promise<ApiVerificationResult> {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${apiKey}`,
        'User-Agent': 'AI-App-Builder'
      },
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      return { 
        success: false, 
        message: 'Invalid GitHub API key or insufficient permissions' 
      };
    }
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to verify GitHub API key' 
    };
  }
}

export async function verifyCerebrasKey(apiKey: string): Promise<ApiVerificationResult> {
  try {
    const client = new CerebrasClient(apiKey);
    return await client.verifyApiKey();
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to verify Cerebras API key' 
    };
  }
}