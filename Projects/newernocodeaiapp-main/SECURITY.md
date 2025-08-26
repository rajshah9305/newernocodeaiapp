# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

1. **Do not** open a public GitHub issue
2. Email security concerns to: [security@yourcompany.com]
3. Include detailed information about the vulnerability
4. Allow up to 48 hours for initial response

## Security Measures

- All API keys are stored as environment variables
- Input validation on all user inputs
- Rate limiting on API endpoints
- HTTPS enforcement in production
- Regular dependency updates

## Best Practices

- Never commit API keys or secrets
- Use strong, unique API keys
- Regularly rotate credentials
- Monitor for unusual activity
- Keep dependencies updated