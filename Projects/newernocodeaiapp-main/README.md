# AI App Builder Enterprise

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

Enterprise-grade AI application builder with multi-agent workflows powered by Cerebras AI.

## Features

- **Multi-Agent System**: Coordinated AI agents for full-stack development
- **Cerebras AI**: High-performance inference with Llama models
- **Real-time Preview**: Live application generation and editing
- **Enterprise Security**: Built-in security headers and validation
- **Docker Ready**: Containerized deployment

## Quick Start

### Docker (Recommended)
```bash
git clone https://github.com/rajshah9305/newernocodeaiapp.git
cd newernocodeaiapp
cp .env.example .env.local
# Add your Cerebras API key
docker-compose up -d
```

### Development
```bash
npm install
cp .env.example .env.local
# Add your Cerebras API key
npm run dev
```

## Configuration

Required environment variables:
```bash
CEREBRAS_API_KEY=your-cerebras-api-key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Usage

1. Access the application at `http://localhost:9002`
2. Enter your application description
3. Watch AI agents collaborate to build your app
4. Preview and edit the generated code
5. Deploy with one click

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code linting
npm run typecheck # TypeScript check
```

## Deployment

### Docker
```bash
docker-compose up -d
```

### Vercel
```bash
vercel --prod
```

## Security

- Input validation and sanitization
- Security headers (CSRF, XSS protection)
- Environment-based secret management
- Docker security best practices

See [SECURITY.md](SECURITY.md) for details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) file.