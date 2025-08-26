#!/bin/bash

echo "🚀 Setting up AI App Builder - Multi-Agent Workflow System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment configuration..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
else
    echo "✅ Environment file already exists"
fi

# Check if Cerebras API key is configured
if grep -q "your-cerebras-api-key" .env.local 2>/dev/null; then
    echo "⚠️  Please update your Cerebras API key in .env.local"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🔥 Multi-Agent Workflow Features:"
echo "   • Orchestrator Agent - Project planning"
echo "   • UI/UX Agent - Interface generation"
echo "   • Backend Agent - API development"
echo "   • Database Agent - Schema design"
echo "   • Tester Agent - Quality assurance"
echo "   • DevOps Agent - Deployment prep"
echo ""
echo "📋 Next steps:"
echo "1. Ensure your Cerebras API key is in .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:9002 in your browser"
echo "4. Describe your app and watch the agents work!"
echo ""
echo "🔗 Get Cerebras API key: https://inference.cerebras.ai/"
echo "📚 Documentation: README.md"