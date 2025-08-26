# AI App Builder - Multi-Agent Workflow System

A production-ready Next.js application that uses CrewAI-inspired multi-agent workflows powered by Cerebras AI to generate full-stack web applications. Features real-time agent coordination, live preview, and instant deployment capabilities.

## 🚀 Features

- **Multi-Agent Workflow**: Orchestrated team of AI agents (Architect, UI/UX, Backend, Database, Tester, DevOps)
- **Cerebras AI Integration**: High-performance inference with Llama models
- **Real-time Generation**: Live progress tracking with actual AI API calls
- **Live Preview**: Instant app preview with responsive design testing
- **Code Editor**: Built-in Monaco editor with syntax highlighting
- **One-Click Deployment**: Ready for Vercel, Netlify, and other platforms
- **API Management**: Complete integration with Vercel, Supabase, and GitHub APIs

## 🏗️ Architecture

```
User Input (NLP Prompt)
       │
       ▼
 Orchestrator Agent
       │
 ┌─────┼───────────────────────┐
 │     │       │       │       │
 ▼     ▼       ▼       ▼       ▼
UI Agent   Backend   DB     Tester   Deployment
  │         Agent    Agent   Agent     Agent
  │            │       │       │        │
  └─────> Code Assembly (Project Dir) <─┘
                    │
                    ▼
             Live Preview Server
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
   User Edits Code        User Refines via NLP
       │                         │
       └───────────┬─────────────┘
                   ▼
             Final Deployment
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **AI**: Cerebras Cloud SDK, Multi-agent orchestration
- **UI**: Radix UI components, Monaco Editor
- **Deployment**: Vercel-ready with environment configuration

## 📦 Installation

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd ai-app-builder

# Run setup script
chmod +x setup.sh
./setup.sh

# Start development server
npm run dev
```

### Manual Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your Cerebras API key to .env.local

# Start development
npm run dev
```

## 🔑 API Configuration

### Required
- **Cerebras AI**: Get your API key from [Cerebras Inference](https://inference.cerebras.ai/)

### Optional (Enhanced Features)
- **Vercel**: For automated deployment
- **Supabase**: For database services
- **GitHub**: For repository management

## 🚀 Usage

1. **Open the app**: Navigate to `http://localhost:9002`
2. **Describe your app**: Enter a natural language description
3. **Watch agents work**: Real-time multi-agent coordination
4. **Preview instantly**: Live app preview with responsive testing
5. **Edit code**: Built-in editor with syntax highlighting
6. **Deploy**: One-click deployment to production

### Example Prompts
- "Create a task manager app with login, dashboard, and dark mode"
- "Build an e-commerce platform with product catalog and shopping cart"
- "Make a social media dashboard with real-time analytics"

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── workflow-dashboard.tsx
│   ├── agent-timeline.tsx
│   ├── live-preview.tsx
│   └── code-editor.tsx
├── lib/
│   ├── agents/         # AI agent implementations
│   ├── workflow-engine.ts
│   └── types.ts
└── ai/
    ├── cerebras.ts     # Cerebras client
    ├── services.ts     # API integrations
    └── flows/          # AI workflows
```

### Key Components

- **WorkflowEngine**: Orchestrates multi-agent execution
- **OrchestratorAgent**: Analyzes user input and creates project plans
- **CrewAgent**: Individual specialized agents for different tasks
- **LivePreview**: Real-time app preview with device simulation
- **CodeEditor**: Monaco-based code editing with download capabilities

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add CEREBRAS_API_KEY
```

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Environment Variables

```bash
# Required
CEREBRAS_API_KEY=your-cerebras-api-key

# Optional
VERCEL_API_KEY=your-vercel-token
SUPABASE_API_KEY=your-supabase-key
GITHUB_API_KEY=your-github-token
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions

## 🎯 Roadmap

- [ ] Advanced code editing with IntelliSense
- [ ] Real-time collaboration features
- [ ] Custom agent creation
- [ ] Template marketplace
- [ ] Advanced deployment options
- [ ] Performance monitoring integration

---

**Built with ❤️ using Cerebras AI and Next.js**