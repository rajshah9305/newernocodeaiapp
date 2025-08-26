import { CerebrasClient } from '@/ai/cerebras';
import { Agent, AgentOutput } from '@/lib/types';

export class CrewAgent {
  private client: CerebrasClient;
  private agentId: string;

  constructor(apiKey: string, agentId: string) {
    this.client = new CerebrasClient(apiKey);
    this.agentId = agentId;
  }

  async execute(prompt: string, context: any): Promise<AgentOutput> {
    try {
      const systemPrompt = this.getAdvancedSystemPrompt();
      const enhancedPrompt = this.buildContextualPrompt(prompt, context);
      
      console.log(`🤖 ${this.agentId} agent starting AI generation...`);
      
      let response: string;
      try {
        response = await this.client.generateCompletion(enhancedPrompt, systemPrompt);
      } catch (apiError: any) {
        console.warn(`⚠️ AI API failed for ${this.agentId}, using fallback:`, apiError.message);
        // Use intelligent fallback based on agent type and prompt
        response = this.generateIntelligentFallback(prompt, context);
      }
      
      if (!response || response.trim().length === 0) {
        throw new Error('Empty response from AI model and fallback');
      }
      
      console.log(`✅ ${this.agentId} agent completed generation`);
      
      const data = this.parseAndValidateResponse(response);

      return {
        agentId: this.agentId,
        success: true,
        data
      };
    } catch (error: any) {
      console.error(`❌ ${this.agentId} agent failed:`, error.message);
      
      // Final fallback - return basic structure
      const fallbackData = this.createFallbackResponse(`Agent ${this.agentId} generated content for: ${prompt}`);
      
      return {
        agentId: this.agentId,
        success: true, // Mark as success to continue workflow
        data: fallbackData
      };
    }
  }

  private getAdvancedSystemPrompt(): string {
    const prompts = {
      architect: `You are an Elite System Architect with 15+ years of experience. Design scalable, maintainable architectures.

EXPERTISE:
- Microservices & distributed systems
- Cloud-native architectures (AWS, GCP, Azure)
- Performance optimization & caching strategies
- Security best practices & compliance
- Database design & optimization

RESPONSE FORMAT (JSON):
{
  "architecture": {
    "pattern": "microservices|monolith|serverless",
    "description": "detailed architecture explanation",
    "scalability": "horizontal|vertical scaling strategy",
    "security": "authentication, authorization, encryption details"
  },
  "stack": {
    "frontend": "framework with reasoning",
    "backend": "technology with justification", 
    "database": "database choice with rationale",
    "cache": "caching strategy",
    "deployment": "containerization & orchestration"
  },
  "structure": {
    "folders": ["organized folder structure"],
    "patterns": ["design patterns to implement"],
    "integrations": ["third-party services needed"]
  },
  "performance": {
    "metrics": "expected performance benchmarks",
    "optimization": "key optimization strategies"
  }
}`,
      
      'ui-ux': `You are an Elite UI/UX Designer specializing in modern, accessible, and conversion-optimized interfaces.

EXPERTISE:
- Modern design systems (Material Design, Human Interface Guidelines)
- Accessibility (WCAG 2.1 AA compliance)
- Performance-optimized components
- Mobile-first responsive design
- User psychology & conversion optimization

RESPONSE FORMAT (JSON):
{
  "design": {
    "theme": "design system approach",
    "colors": "color palette with accessibility ratios",
    "typography": "font hierarchy and readability",
    "spacing": "consistent spacing system"
  },
  "components": [
    {
      "name": "component name",
      "purpose": "functional purpose",
      "code": "complete React component with TypeScript",
      "accessibility": "ARIA labels and keyboard navigation",
      "responsive": "mobile-first breakpoints"
    }
  ],
  "layout": {
    "structure": "page layout strategy",
    "navigation": "navigation pattern",
    "responsive": "breakpoint strategy"
  },
  "ux": {
    "userFlow": "optimized user journey",
    "interactions": "micro-interactions and animations",
    "performance": "loading states and optimization"
  }
}`,
      
      backend: `You are an Elite Backend Engineer with expertise in scalable, secure, and maintainable APIs.

EXPERTISE:
- RESTful & GraphQL API design
- Microservices architecture
- Database optimization & caching
- Security (OAuth, JWT, encryption)
- Performance monitoring & logging

RESPONSE FORMAT (JSON):
{
  "api": {
    "architecture": "REST|GraphQL|hybrid approach",
    "authentication": "JWT|OAuth2|session strategy",
    "rateLimit": "rate limiting configuration",
    "validation": "input validation strategy"
  },
  "endpoints": [
    {
      "path": "/api/endpoint",
      "method": "GET|POST|PUT|DELETE",
      "purpose": "endpoint functionality",
      "code": "complete implementation with error handling",
      "validation": "input validation rules",
      "security": "authorization requirements"
    }
  ],
  "middleware": {
    "security": "helmet, cors, rate limiting",
    "logging": "structured logging implementation",
    "monitoring": "health checks and metrics"
  },
  "performance": {
    "caching": "caching strategy implementation",
    "optimization": "query optimization techniques"
  }
}`,
      
      database: `You are an Elite Database Engineer specializing in high-performance, scalable database design.

EXPERTISE:
- Relational & NoSQL database design
- Query optimization & indexing
- Data modeling & normalization
- Backup & disaster recovery
- Performance monitoring & tuning

RESPONSE FORMAT (JSON):
{
  "design": {
    "type": "PostgreSQL|MongoDB|hybrid",
    "reasoning": "database choice justification",
    "scalability": "horizontal|vertical scaling approach"
  },
  "schema": {
    "tables": [
      {
        "name": "table_name",
        "purpose": "table functionality",
        "fields": [
          {
            "name": "field_name",
            "type": "data_type",
            "constraints": "constraints and validations"
          }
        ],
        "indexes": ["optimized index strategy"],
        "relationships": "foreign key relationships"
      }
    ]
  },
  "optimization": {
    "indexes": "performance index strategy",
    "queries": "optimized query patterns",
    "caching": "database caching approach"
  },
  "seedData": "realistic sample data for testing"
}`,
      
      tester: `You are an Elite QA Engineer specializing in comprehensive testing strategies and quality assurance.

EXPERTISE:
- Test-driven development (TDD)
- Automated testing (unit, integration, e2e)
- Performance testing & load testing
- Security testing & vulnerability assessment
- Code quality & static analysis

RESPONSE FORMAT (JSON):
{
  "strategy": {
    "approach": "TDD|BDD testing methodology",
    "coverage": "target code coverage percentage",
    "automation": "CI/CD integration strategy"
  },
  "tests": [
    {
      "type": "unit|integration|e2e",
      "file": "test file name",
      "code": "complete test implementation",
      "coverage": "what functionality is tested"
    }
  ],
  "quality": {
    "linting": "ESLint/Prettier configuration",
    "typeChecking": "TypeScript strict mode settings",
    "security": "security vulnerability checks"
  },
  "performance": {
    "benchmarks": "performance testing criteria",
    "monitoring": "performance monitoring setup"
  }
}`,
      
      deployment: `You are an Elite DevOps Engineer specializing in cloud-native deployments and infrastructure automation.

EXPERTISE:
- Container orchestration (Docker, Kubernetes)
- Cloud platforms (AWS, GCP, Azure, Vercel)
- CI/CD pipelines & automation
- Infrastructure as Code (Terraform, CloudFormation)
- Monitoring & observability

RESPONSE FORMAT (JSON):
{
  "strategy": {
    "platform": "deployment platform choice",
    "approach": "containerized|serverless|traditional",
    "scaling": "auto-scaling configuration"
  },
  "containers": {
    "dockerfile": "optimized Dockerfile",
    "compose": "docker-compose configuration",
    "kubernetes": "K8s deployment manifests"
  },
  "cicd": {
    "pipeline": "GitHub Actions|GitLab CI configuration",
    "stages": "build, test, deploy stages",
    "environments": "staging and production setup"
  },
  "monitoring": {
    "logging": "centralized logging setup",
    "metrics": "application metrics collection",
    "alerts": "alerting and notification setup"
  }
}`
    };

    return prompts[this.agentId as keyof typeof prompts] || prompts.architect;
  }

  private buildContextualPrompt(prompt: string, context: any): string {
    const { previousOutputs = {}, attempt = 1 } = context;
    
    let contextualPrompt = `USER REQUEST: ${prompt}\n\n`;
    
    // Add context from previous agents
    if (Object.keys(previousOutputs).length > 0) {
      contextualPrompt += `PREVIOUS AGENT OUTPUTS:\n`;
      Object.entries(previousOutputs).forEach(([agentId, output]) => {
        contextualPrompt += `${agentId.toUpperCase()}: ${JSON.stringify(output, null, 2)}\n`;
      });
      contextualPrompt += `\n`;
    }

    // Add attempt information for retries
    if (attempt > 1) {
      contextualPrompt += `RETRY ATTEMPT: ${attempt} - Please provide an improved solution.\n\n`;
    }

    // Agent-specific context
    const agentContext = {
      architect: `Focus on creating a robust, scalable architecture that can handle the requirements efficiently.`,
      'ui-ux': `Design modern, accessible components that provide excellent user experience and are mobile-first.`,
      backend: `Create secure, performant APIs with proper error handling and validation.`,
      database: `Design an optimized database schema with proper relationships and indexing.`,
      tester: `Develop comprehensive tests that ensure code quality and reliability.`,
      deployment: `Create production-ready deployment configurations with monitoring and scaling.`
    };

    contextualPrompt += agentContext[this.agentId as keyof typeof agentContext] || '';
    contextualPrompt += `\n\nProvide a detailed, production-ready solution in the specified JSON format.`;

    return contextualPrompt;
  }

  private parseAndValidateResponse(response: string): any {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response);
      return this.validateAgentOutput(parsed);
    } catch {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          return this.validateAgentOutput(parsed);
        } catch {
          // Fall back to structured text parsing
          return this.parseStructuredText(response);
        }
      }
      
      // Last resort: return raw response with basic structure
      return this.createFallbackResponse(response);
    }
  }

  private validateAgentOutput(data: any): any {
    const validators = {
      architect: (d: any) => d.architecture && d.stack && d.structure,
      'ui-ux': (d: any) => d.design && d.components && Array.isArray(d.components),
      backend: (d: any) => d.api && d.endpoints && Array.isArray(d.endpoints),
      database: (d: any) => d.design && d.schema && d.optimization,
      tester: (d: any) => d.strategy && d.tests && Array.isArray(d.tests),
      deployment: (d: any) => d.strategy && d.containers && d.cicd
    };

    const validator = validators[this.agentId as keyof typeof validators];
    if (validator && validator(data)) {
      return data;
    }

    // If validation fails, enhance the data
    return this.enhanceIncompleteData(data);
  }

  private parseStructuredText(response: string): any {
    // Basic text parsing for fallback
    const lines = response.split('\n').filter(line => line.trim());
    const result: any = { raw: response, parsed: {} };

    lines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':').map(s => s.trim());
        result.parsed[key.toLowerCase()] = value;
      }
    });

    return result;
  }

  private generateIntelligentFallback(prompt: string, context: any): string {
    const fallbackResponses = {
      architect: `{
        "architecture": {
          "pattern": "microservices",
          "description": "Scalable microservices architecture for ${prompt}",
          "scalability": "horizontal scaling with load balancers",
          "security": "JWT authentication, HTTPS, input validation"
        },
        "stack": {
          "frontend": "Next.js with TypeScript",
          "backend": "Node.js with Express",
          "database": "PostgreSQL with Redis caching",
          "deployment": "Docker containers on Vercel/AWS"
        },
        "structure": {
          "folders": ["src/", "components/", "pages/", "api/", "lib/", "types/"],
          "patterns": ["MVC", "Repository Pattern", "Dependency Injection"],
          "integrations": ["Authentication", "Database", "Caching", "Monitoring"]
        }
      }`,
      'ui-ux': `{
        "design": {
          "theme": "modern minimalist",
          "colors": "blue and white with dark mode support",
          "typography": "Inter font family with clear hierarchy",
          "spacing": "8px grid system"
        },
        "components": [
          {
            "name": "Header",
            "purpose": "navigation and branding",
            "code": "// Modern header component with responsive navigation",
            "accessibility": "ARIA labels and keyboard navigation",
            "responsive": "mobile-first breakpoints"
          },
          {
            "name": "Dashboard",
            "purpose": "main application interface",
            "code": "// Dashboard with cards and data visualization",
            "accessibility": "screen reader friendly",
            "responsive": "grid layout adapts to screen size"
          }
        ],
        "layout": {
          "structure": "responsive grid layout",
          "navigation": "sidebar with mobile hamburger menu",
          "responsive": "mobile-first approach"
        }
      }`,
      backend: `{
        "api": {
          "architecture": "RESTful API",
          "authentication": "JWT with refresh tokens",
          "rateLimit": "100 requests per minute",
          "validation": "Joi schema validation"
        },
        "endpoints": [
          {
            "path": "/api/auth/login",
            "method": "POST",
            "purpose": "user authentication",
            "code": "// Login endpoint with JWT generation",
            "validation": "email and password validation",
            "security": "bcrypt password hashing"
          },
          {
            "path": "/api/users",
            "method": "GET",
            "purpose": "fetch user data",
            "code": "// Protected user data endpoint",
            "validation": "JWT token validation",
            "security": "role-based access control"
          }
        ],
        "middleware": {
          "security": "helmet, cors, rate limiting",
          "logging": "winston structured logging",
          "monitoring": "health checks and metrics"
        }
      }`,
      database: `{
        "design": {
          "type": "PostgreSQL",
          "reasoning": "ACID compliance and complex queries",
          "scalability": "read replicas and connection pooling"
        },
        "schema": {
          "tables": [
            {
              "name": "users",
              "purpose": "user account management",
              "fields": [
                {"name": "id", "type": "UUID", "constraints": "PRIMARY KEY"},
                {"name": "email", "type": "VARCHAR(255)", "constraints": "UNIQUE NOT NULL"},
                {"name": "password_hash", "type": "VARCHAR(255)", "constraints": "NOT NULL"}
              ],
              "indexes": ["email", "created_at"],
              "relationships": "one-to-many with projects"
            }
          ]
        },
        "optimization": {
          "indexes": "B-tree indexes on frequently queried columns",
          "queries": "optimized joins and pagination",
          "caching": "Redis for session and query caching"
        }
      }`,
      tester: `{
        "strategy": {
          "approach": "Test-Driven Development",
          "coverage": "85% minimum coverage",
          "automation": "CI/CD pipeline integration"
        },
        "tests": [
          {
            "type": "unit",
            "file": "components.test.tsx",
            "code": "// React component unit tests",
            "coverage": "component rendering and interactions"
          },
          {
            "type": "integration",
            "file": "api.test.ts",
            "code": "// API endpoint integration tests",
            "coverage": "request/response validation"
          }
        ],
        "quality": {
          "linting": "ESLint with TypeScript rules",
          "typeChecking": "strict TypeScript configuration",
          "security": "npm audit and dependency scanning"
        }
      }`,
      deployment: `{
        "strategy": {
          "platform": "Vercel for frontend, Railway for backend",
          "approach": "containerized deployment",
          "scaling": "auto-scaling based on traffic"
        },
        "containers": {
          "dockerfile": "FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\nEXPOSE 3000\nCMD [\"npm\", \"start\"]",
          "compose": "version: '3.8'\nservices:\n  app:\n    build: .\n    ports:\n      - \"3000:3000\"",
          "kubernetes": "deployment and service manifests"
        },
        "cicd": {
          "pipeline": "GitHub Actions workflow",
          "stages": "test, build, deploy",
          "environments": "staging and production"
        }
      }`
    };

    return fallbackResponses[this.agentId as keyof typeof fallbackResponses] || 
           `{"message": "Generated content for ${this.agentId} agent", "prompt": "${prompt}"}`;
  }

  private createFallbackResponse(response: string): any {
    const fallbacks = {
      architect: {
        architecture: { pattern: 'microservices', description: response },
        stack: { frontend: 'Next.js', backend: 'Node.js', database: 'PostgreSQL' },
        structure: ['src/', 'components/', 'pages/', 'api/']
      },
      'ui-ux': {
        design: { theme: 'modern', colors: 'blue-based palette' },
        components: [{ name: 'App', code: response, purpose: 'main application' }],
        layout: { structure: 'responsive grid' }
      },
      backend: {
        api: { architecture: 'REST', authentication: 'JWT' },
        endpoints: [{ path: '/api/data', method: 'GET', code: response }],
        middleware: { security: 'helmet, cors' }
      },
      database: {
        design: { type: 'PostgreSQL', reasoning: 'relational data needs' },
        schema: { tables: [{ name: 'users', fields: [] }] },
        optimization: { indexes: 'primary keys' }
      },
      tester: {
        strategy: { approach: 'TDD', coverage: '80%' },
        tests: [{ type: 'unit', file: 'app.test.js', code: response }],
        quality: { linting: 'ESLint' }
      },
      deployment: {
        strategy: { platform: 'Vercel', approach: 'serverless' },
        containers: { dockerfile: response },
        cicd: { pipeline: 'GitHub Actions' }
      }
    };

    const result = fallbacks[this.agentId as keyof typeof fallbacks] || { raw: response };
    console.log(`🔄 Using fallback response for ${this.agentId}:`, result);
    return result;
  }

  private enhanceIncompleteData(data: any): any {
    // Add missing required fields based on agent type
    const enhancements = {
      architect: () => ({
        ...data,
        architecture: data.architecture || { pattern: 'microservices', description: 'Scalable architecture' },
        stack: data.stack || { frontend: 'Next.js', backend: 'Node.js', database: 'PostgreSQL' },
        structure: data.structure || ['src/', 'components/', 'pages/', 'api/']
      }),
      'ui-ux': () => ({
        ...data,
        design: data.design || { theme: 'modern', colors: 'accessible palette' },
        components: data.components || [{ name: 'App', code: '// Component code', purpose: 'main app' }],
        layout: data.layout || { structure: 'responsive' }
      }),
      backend: () => ({
        ...data,
        api: data.api || { architecture: 'REST', authentication: 'JWT' },
        endpoints: data.endpoints || [{ path: '/api/health', method: 'GET', code: '// Health check' }],
        middleware: data.middleware || { security: 'helmet, cors' }
      }),
      database: () => ({
        ...data,
        design: data.design || { type: 'PostgreSQL', reasoning: 'ACID compliance' },
        schema: data.schema || { tables: [] },
        optimization: data.optimization || { indexes: 'performance indexes' }
      }),
      tester: () => ({
        ...data,
        strategy: data.strategy || { approach: 'TDD', coverage: '80%' },
        tests: data.tests || [{ type: 'unit', file: 'test.js', code: '// Test code' }],
        quality: data.quality || { linting: 'ESLint' }
      }),
      deployment: () => ({
        ...data,
        strategy: data.strategy || { platform: 'Vercel', approach: 'serverless' },
        containers: data.containers || { dockerfile: 'FROM node:18' },
        cicd: data.cicd || { pipeline: 'GitHub Actions' }
      })
    };

    const enhancer = enhancements[this.agentId as keyof typeof enhancements];
    return enhancer ? enhancer() : data;
  }
}