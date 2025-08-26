export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'working' | 'complete' | 'error';
  progress: number;
  output?: any;
  startTime?: number;
  endTime?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'generating' | 'preview' | 'deployed' | 'error';
  createdAt: string;
  agents: Agent[];
  codebase?: any;
  preview?: {
    url: string;
    status: 'building' | 'ready' | 'error';
  };
  deployment?: {
    frontend: string;
    backend: string;
    database: string;
  };
  metadata?: any;
  error?: string;
}

export interface GenerationRequest {
  prompt: string;
  projectId?: string;
}

export interface AgentOutput {
  agentId: string;
  success: boolean;
  data: any;
  error?: string;
}