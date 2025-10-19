# Contributing to Prometheus Nexus Flow

Thank you for your interest in contributing to Prometheus Nexus Flow! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/prometheus-nexus-flow/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and OS information

### Suggesting Features

1. Check [Discussions](https://github.com/yourusername/prometheus-nexus-flow/discussions) for similar ideas
2. Create a new discussion with:
   - Clear use case
   - Proposed solution
   - Alternative approaches considered
   - Mockups or examples if applicable

### Pull Requests

1. **Fork the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/prometheus-nexus-flow.git
   cd prometheus-nexus-flow
   \`\`\`

2. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

3. **Make your changes**
   - Follow the code style guidelines
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   \`\`\`bash
   git commit -m "feat: add amazing feature"
   \`\`\`
   
   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

6. **Create a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Include screenshots for UI changes

## Development Setup

See [INSTALLATION.md](INSTALLATION.md) for detailed setup instructions.

Quick start:
\`\`\`bash
npm install
npm run dev
\`\`\`

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Implement error boundaries for critical components

### CSS/Tailwind
- Use Tailwind utility classes
- Follow the design token system in globals.css
- Ensure responsive design (mobile-first)
- Test in multiple browsers

### File Organization
- Place components in `components/`
- Place utilities in `lib/`
- Place types in `lib/types/`
- Keep files focused on single responsibility

## Testing

Before submitting a PR:
1. Test your changes locally
2. Verify on multiple browsers
3. Check mobile responsiveness
4. Ensure no TypeScript errors: `npm run build`
5. Test with different URLs and content types

## Documentation

Update documentation when:
- Adding new features
- Changing existing behavior
- Adding configuration options
- Modifying APIs or interfaces

## Questions?

- Open a [Discussion](https://github.com/yourusername/prometheus-nexus-flow/discussions)
- Join our community chat
- Email: contribute@example.com

Thank you for contributing! 🚀
