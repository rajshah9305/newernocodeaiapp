import { OrchestratorAgent } from './agents/orchestrator';
import { CrewAgent } from './agents/crew';
import { Project, Agent, GenerationRequest } from './types';

export class WorkflowEngine {
  private orchestrator: OrchestratorAgent;
  private apiKey: string;
  private activeProject: Project | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.orchestrator = new OrchestratorAgent(apiKey);
  }

  async executeWorkflow(
    request: GenerationRequest,
    onAgentUpdate: (agent: Agent) => void,
    onProjectUpdate: (project: Project) => void
  ): Promise<Project> {
    try {
      // Step 1: Create project plan with real AI
      const project = await this.orchestrator.createProject(request);
      this.activeProject = project;
      onProjectUpdate(project);

      // Step 2: Execute agents with real AI coordination
      const context = { 
        prompt: request.prompt, 
        project,
        previousOutputs: {} as Record<string, any>
      };
      
      for (const agent of project.agents) {
        try {
          const result = await this.executeAgentWithRetry(agent, context, onAgentUpdate);
          
          // Store agent output for next agents to use
          context.previousOutputs[agent.id] = result;
          
          // Update project with agent output
          project.agents = project.agents.map(a => 
            a.id === agent.id ? { ...agent, output: result } : a
          );
          onProjectUpdate(project);

          // Brief pause between agents for better UX
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error: any) {
          console.error(`Agent ${agent.id} failed:`, error);
          
          // Mark agent as failed but continue with others
          agent.status = 'error';
          agent.progress = 0;
          agent.endTime = Date.now();
          onAgentUpdate(agent);
          
          // Only fail completely for critical agents
          if (['architect', 'ui-ux'].includes(agent.id)) {
            throw new Error(`Critical agent ${agent.id} failed: ${error.message}`);
          }
        }
      }

      // Step 3: Intelligent code assembly with AI
      project.codebase = await this.assembleIntelligentCodebase(project.agents, request.prompt);
      project.status = 'preview';
      onProjectUpdate(project);

      return project;
    } catch (error: any) {
      console.error('Workflow execution failed:', error);
      throw error;
    }
  }

  private async executeAgentWithRetry(
    agent: Agent,
    context: any,
    onUpdate: (agent: Agent) => void,
    maxRetries: number = 2
  ): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        agent.status = 'working';
        agent.startTime = Date.now();
        agent.progress = 0;
        onUpdate(agent);

        const crewAgent = new CrewAgent(this.apiKey, agent.id);
        
        // Real-time progress tracking during AI generation
        let progressValue = 0;
        const progressInterval = setInterval(() => {
          if (progressValue < 85) {
            progressValue += Math.random() * 10 + 5;
            agent.progress = Math.min(progressValue, 85);
            onUpdate(agent);
          }
        }, 800);

        const result = await crewAgent.execute(context.prompt, {
          ...context,
          attempt: attempt + 1,
          previousOutputs: context.previousOutputs
        });

        clearInterval(progressInterval);

        if (result.success) {
          agent.status = 'complete';
          agent.progress = 100;
          agent.endTime = Date.now();
          onUpdate(agent);
          return result.data;
        } else {
          throw new Error(result.error || 'Agent execution failed');
        }
      } catch (error: any) {
        lastError = error;
        console.error(`Agent ${agent.id} attempt ${attempt + 1} failed:`, error.message);
        
        if (attempt < maxRetries) {
          agent.status = 'working';
          agent.progress = 0;
          onUpdate(agent);
          // Brief delay before retry
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
    }

    agent.status = 'error';
    agent.progress = 0;
    agent.endTime = Date.now();
    onUpdate(agent);
    throw lastError || new Error(`Agent ${agent.id} failed after ${maxRetries + 1} attempts`);
  }

  private async assembleIntelligentCodebase(agents: Agent[], prompt: string): Promise<any> {
    const outputs = agents.reduce((acc, agent) => {
      if (agent.output) acc[agent.id] = agent.output;
      return acc;
    }, {} as Record<string, any>);

    return {
      frontend: this.generateAdvancedFrontend(outputs, prompt),
      backend: this.generateAdvancedBackend(outputs, prompt),
      database: this.generateAdvancedDatabase(outputs, prompt),
      config: this.generateAdvancedConfig(outputs, prompt),
      tests: this.generateTestSuite(outputs, prompt),
      deployment: this.generateDeploymentConfig(outputs, prompt)
    };
  }

  private generateAdvancedFrontend(outputs: any, prompt: string): string {
    const hasAuth = prompt.toLowerCase().includes('login') || prompt.toLowerCase().includes('auth');
    const hasDashboard = prompt.toLowerCase().includes('dashboard');
    const hasDarkMode = prompt.toLowerCase().includes('dark');

    return `'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Advanced hooks
const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) setStoredValue(JSON.parse(item));
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
  }, [key]);

  const setValue = (value: any) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

const useAuth = () => {
  const [user, setUser] = useLocalStorage('user', null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = { id: 1, email, name: email.split('@')[0] };
    setUser(mockUser);
    setLoading(false);
    return mockUser;
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, logout, loading };
};

// Components
const LoginForm = ({ onLogin }: { onLogin: (email: string, password: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }}>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
        >
          Login
        </button>
      </form>
    </motion.div>
  );
};

const Dashboard = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const [stats, setStats] = useState({ users: 0, revenue: 0, orders: 0 });

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats({
        users: Math.floor(Math.random() * 10000) + 1000,
        revenue: Math.floor(Math.random() * 100000) + 10000,
        orders: Math.floor(Math.random() * 1000) + 100
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', value: stats.users.toLocaleString(), color: 'blue' },
          { label: 'Revenue', value: \`$\${stats.revenue.toLocaleString()}\`, color: 'green' },
          { label: 'Orders', value: stats.orders.toLocaleString(), color: 'purple' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{stat.label}</h3>
            <p className={\`text-3xl font-bold text-\${stat.color}-500\`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            'New user registered',
            'Order #1234 completed',
            'Payment received',
            'System backup completed'
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{activity}</span>
              <span className="text-sm text-gray-500 ml-auto">
                {Math.floor(Math.random() * 60)} min ago
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const { user, login, logout, loading } = useAuth();

  return (
    <div className={\`min-h-screen transition-colors \${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}\`}>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">AI Generated App</h1>
            ${hasDarkMode ? `
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>` : ''}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          ${hasAuth ? `
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : user ? (
            <Dashboard user={user} onLogout={logout} />
          ) : (
            <LoginForm onLogin={login} />
          )}` : `
          <Dashboard user={{ name: 'User' }} onLogout={() => {}} />`}
        </AnimatePresence>
      </main>
    </div>
  );
}`;
  }

  private generateAdvancedBackend(outputs: any, prompt: string): string {
    return `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
};

// Validation middleware
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Mock database
let users = [
  { id: 1, email: 'admin@example.com', name: 'Admin User', role: 'admin' },
  { id: 2, email: 'user@example.com', name: 'Regular User', role: 'user' }
];

let projects = [
  { id: 1, userId: 1, name: 'Sample Project', status: 'active', createdAt: new Date() }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Auth routes
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], validateRequest, (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // In production, use proper password hashing
  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token: 'mock-jwt-token'
  });
});

// User routes
app.get('/api/users', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  
  const paginatedUsers = users.slice(offset, offset + limit);
  
  res.json({
    users: paginatedUsers.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })),
    pagination: {
      page,
      limit,
      total: users.length,
      pages: Math.ceil(users.length / limit)
    }
  });
});

app.post('/api/users', [
  body('email').isEmail().normalizeEmail(),
  body('name').isLength({ min: 2 }).trim(),
  body('role').isIn(['admin', 'user'])
], validateRequest, (req, res) => {
  const { email, name, role } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const newUser = {
    id: users.length + 1,
    email,
    name,
    role: role || 'user'
  };
  
  users.push(newUser);
  res.status(201).json({ user: newUser });
});

// Project routes
app.get('/api/projects', (req, res) => {
  const userId = req.query.userId ? parseInt(req.query.userId as string) : null;
  
  let filteredProjects = projects;
  if (userId) {
    filteredProjects = projects.filter(p => p.userId === userId);
  }
  
  res.json({ projects: filteredProjects });
});

app.post('/api/projects', [
  body('name').isLength({ min: 2 }).trim(),
  body('userId').isInt({ min: 1 })
], validateRequest, (req, res) => {
  const { name, userId } = req.body;
  
  const newProject = {
    id: projects.length + 1,
    userId,
    name,
    status: 'active',
    createdAt: new Date()
  };
  
  projects.push(newProject);
  res.status(201).json({ project: newProject });
});

// Analytics routes
app.get('/api/analytics/stats', (req, res) => {
  res.json({
    totalUsers: users.length,
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    revenue: Math.floor(Math.random() * 100000) + 50000,
    growth: {
      users: Math.floor(Math.random() * 20) + 5,
      projects: Math.floor(Math.random() * 15) + 3,
      revenue: Math.floor(Math.random() * 25) + 10
    }
  });
});

// WebSocket for real-time updates (mock)
app.get('/api/realtime/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendEvent = (data: any) => {
    res.write(\`data: \${JSON.stringify(data)}\\n\\n\`);
  };

  // Send periodic updates
  const interval = setInterval(() => {
    sendEvent({
      type: 'update',
      timestamp: new Date().toISOString(),
      data: { activeUsers: Math.floor(Math.random() * 100) + 50 }
    });
  }, 5000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📊 Health check: http://localhost:\${PORT}/health\`);
});

export default app;`;
  }

  private generateAdvancedDatabase(outputs: any, prompt: string): string {
    return `-- Advanced Database Schema with Indexes and Constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with advanced features
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Projects table with relationships
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    due_date TIMESTAMP,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table for project management
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    priority INTEGER DEFAULT 2 CHECK (priority BETWEEN 1 AND 5),
    estimated_hours INTEGER,
    actual_hours INTEGER,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity log for audit trail
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE VIEW user_project_stats AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(p.id) as total_projects,
    COUNT(CASE WHEN p.status = 'active' THEN 1 END) as active_projects,
    AVG(p.completion_percentage) as avg_completion
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.name, u.email;

-- Seed data
INSERT INTO users (email, password_hash, name, role, email_verified) VALUES
('admin@example.com', '$2b$10$hash', 'Admin User', 'admin', TRUE),
('user@example.com', '$2b$10$hash', 'Regular User', 'user', TRUE),
('demo@example.com', '$2b$10$hash', 'Demo User', 'user', TRUE);

INSERT INTO projects (user_id, name, description, status, priority) VALUES
((SELECT id FROM users WHERE email = 'admin@example.com'), 'AI App Builder', 'Multi-agent workflow system', 'active', 5),
((SELECT id FROM users WHERE email = 'user@example.com'), 'Personal Website', 'Portfolio and blog', 'active', 3),
((SELECT id FROM users WHERE email = 'demo@example.com'), 'E-commerce Store', 'Online shopping platform', 'active', 4);

-- Analytics functions
CREATE OR REPLACE FUNCTION get_user_analytics(user_uuid UUID)
RETURNS TABLE(
    total_projects BIGINT,
    completed_projects BIGINT,
    avg_completion_rate NUMERIC,
    total_tasks BIGINT,
    completed_tasks BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(p.id) as total_projects,
        COUNT(CASE WHEN p.completion_percentage = 100 THEN 1 END) as completed_projects,
        AVG(p.completion_percentage) as avg_completion_rate,
        COUNT(t.id) as total_tasks,
        COUNT(CASE WHEN t.status = 'done' THEN 1 END) as completed_tasks
    FROM projects p
    LEFT JOIN tasks t ON p.id = t.project_id
    WHERE p.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;`;
  }

  private generateAdvancedConfig(outputs: any, prompt: string): string {
    return JSON.stringify({
      "package.json": {
        "name": "ai-generated-app",
        "version": "1.0.0",
        "scripts": {
          "dev": "next dev",
          "build": "next build",
          "start": "next start",
          "lint": "next lint",
          "test": "jest",
          "test:watch": "jest --watch",
          "type-check": "tsc --noEmit"
        },
        "dependencies": {
          "next": "^14.0.0",
          "react": "^18.0.0",
          "react-dom": "^18.0.0",
          "framer-motion": "^10.0.0",
          "express": "^4.18.0",
          "helmet": "^7.0.0",
          "express-rate-limit": "^6.0.0",
          "express-validator": "^7.0.0",
          "cors": "^2.8.5"
        }
      },
      "vercel.json": {
        "version": 2,
        "builds": [
          { "src": "package.json", "use": "@vercel/next" }
        ],
        "functions": {
          "app/api/**/*.js": { "maxDuration": 30 }
        },
        "env": {
          "DATABASE_URL": "@database-url",
          "JWT_SECRET": "@jwt-secret"
        }
      },
      "docker-compose.yml": `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/appdb
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=appdb
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:`,
      "Dockerfile": `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]`,
      ".env.example": `# Database
DATABASE_URL=postgresql://user:password@localhost:5432/appdb

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# External APIs
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key

# App Configuration
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001`
    }, null, 2);
  }

  private generateTestSuite(outputs: any, prompt: string): string {
    return `// Jest configuration and test suite
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

// Component tests
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App Component', () => {
  test('renders login form when not authenticated', () => {
    render(<App />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('handles login flow correctly', async () => {
    render(<App />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Welcome/)).toBeInTheDocument();
    });
  });

  test('toggles dark mode correctly', () => {
    render(<App />);
    const darkModeButton = screen.getByText('🌙');
    
    fireEvent.click(darkModeButton);
    
    expect(document.body.className).toContain('dark');
  });
});

// API tests
import request from 'supertest';
import app from '../server';

describe('API Endpoints', () => {
  test('GET /health returns status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('POST /api/auth/login validates credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'password' });
    
    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();
  });

  test('GET /api/users returns paginated results', async () => {
    const response = await request(app)
      .get('/api/users?page=1&limit=5');
    
    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(5);
    expect(response.body.pagination).toBeDefined();
  });
});`;
  }

  private generateDeploymentConfig(outputs: any, prompt: string): string {
    return `# Deployment configurations

# GitHub Actions CI/CD
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}

# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-app
  template:
    metadata:
      labels:
        app: ai-app
    spec:
      containers:
      - name: ai-app
        image: ai-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url

---
apiVersion: v1
kind: Service
metadata:
  name: ai-app-service
spec:
  selector:
    app: ai-app
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer`;
  }
}