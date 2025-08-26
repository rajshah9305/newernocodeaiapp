import { CerebrasClient } from '@/ai/cerebras';
import { Agent, Project, GenerationRequest } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export class OrchestratorAgent {
  private client: CerebrasClient;

  constructor(apiKey: string) {
    this.client = new CerebrasClient(apiKey);
  }

  async createProject(request: GenerationRequest): Promise<Project> {
    const projectId = request.projectId || uuidv4();
    
    const systemPrompt = `You are an Elite Project Orchestrator AI. Analyze user requirements and create a comprehensive project plan.

RESPOND WITH VALID JSON ONLY:
{
  "name": "concise app name",
  "description": "detailed project description",
  "stack": {
    "frontend": "recommended frontend tech",
    "backend": "recommended backend tech",
    "database": "recommended database"
  },
  "features": ["key feature 1", "key feature 2"],
  "architecture": "architecture pattern"
}`;

    try {
      console.log('🎯 Orchestrator creating project plan with AI...');
      
      const response = await this.client.generateCompletion(
        `User Request: "${request.prompt}"

Analyze this request and create a comprehensive project plan. Focus on:
- Modern, scalable technology choices
- Key features that deliver value
- Production-ready architecture

Respond with valid JSON only.`,
        systemPrompt
      );

      let projectPlan;
      try {
        // Try to extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        projectPlan = JSON.parse(jsonMatch ? jsonMatch[0] : response);
        console.log('✅ AI-generated project plan:', projectPlan);
      } catch (parseError) {
        console.warn('⚠️ Failed to parse AI response, using fallback');
        projectPlan = {
          name: this.extractAppName(request.prompt),
          description: request.prompt,
          stack: { frontend: 'Next.js', backend: 'Node.js', database: 'PostgreSQL' },
          features: this.extractFeatures(request.prompt),
          architecture: 'Full-stack web application'
        };
      }

      const agents: Agent[] = [
        { id: 'architect', name: 'System Architect', description: 'Designing system architecture', status: 'pending', progress: 0 },
        { id: 'ui-ux', name: 'UI/UX Designer', description: 'Creating user interface', status: 'pending', progress: 0 },
        { id: 'backend', name: 'Backend Developer', description: 'Building API endpoints', status: 'pending', progress: 0 },
        { id: 'database', name: 'Database Engineer', description: 'Setting up data models', status: 'pending', progress: 0 },
        { id: 'tester', name: 'QA Tester', description: 'Running tests and validation', status: 'pending', progress: 0 },
        { id: 'deployment', name: 'DevOps Engineer', description: 'Preparing deployment', status: 'pending', progress: 0 }
      ];

      return {
        id: projectId,
        name: projectPlan.name || this.extractAppName(request.prompt),
        description: projectPlan.description || request.prompt,
        status: 'generating',
        createdAt: new Date().toISOString(),
        agents,
        metadata: {
          stack: projectPlan.stack,
          features: projectPlan.features,
          architecture: projectPlan.architecture
        }
      };
    } catch (error: any) {
      console.error('❌ Orchestrator failed:', error);
      throw new Error(`Project planning failed: ${error.message}`);
    }
  }

  private extractAppName(prompt: string): string {
    const words = prompt.toLowerCase().split(' ');
    const appTypes = ['app', 'application', 'platform', 'system', 'tool', 'manager', 'tracker'];
    
    for (let i = 0; i < words.length; i++) {
      if (appTypes.includes(words[i]) && i > 0) {
        return words.slice(Math.max(0, i-2), i+1).map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ');
      }
    }
    
    return 'AI Generated App';
  }

  private extractFeatures(prompt: string): string[] {
    const commonFeatures = [
      'user authentication', 'dashboard', 'data management', 
      'responsive design', 'real-time updates', 'search functionality'
    ];
    
    const features = [];
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('login') || lowerPrompt.includes('auth')) features.push('User Authentication');
    if (lowerPrompt.includes('dashboard')) features.push('Dashboard');
    if (lowerPrompt.includes('dark mode')) features.push('Dark Mode');
    if (lowerPrompt.includes('search')) features.push('Search');
    if (lowerPrompt.includes('real-time') || lowerPrompt.includes('live')) features.push('Real-time Updates');
    
    return features.length > 0 ? features : commonFeatures.slice(0, 4);
  }
}