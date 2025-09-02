# Contributing to Product In-Situ Placer

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/product-in-situ-placer.git
   cd product-in-situ-placer
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Add your Gemini API key to .env.local
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

Example: `feature/add-image-filters`

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

Example:
```
feat(upload): add drag and drop support

Add drag and drop functionality to image uploader component
with visual feedback and file validation.

Closes #123
```

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all props and functions
- Avoid `any` type - use proper typing
- Use type assertions sparingly

### React

- Use functional components with hooks
- Follow React best practices
- Use proper prop types
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Ensure accessibility (WCAG 2.1 AA)
- Use semantic HTML elements

### File Organization

```
src/
├── app/           # Main application
├── components/    # Reusable components
│   ├── auth/     # Authentication components
│   ├── common/   # Common components
│   ├── features/ # Feature-specific components
│   ├── layout/   # Layout components
│   └── ui/       # Basic UI components
├── config/       # Configuration
├── hooks/        # Custom hooks
├── services/     # API services
├── styles/       # Global styles
├── test/         # Test utilities
├── types/        # Type definitions
└── utils/        # Utility functions
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Writing Tests

- Write tests for all new features
- Use descriptive test names
- Test both happy path and edge cases
- Mock external dependencies
- Aim for high test coverage

Example test:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/utils';
import { Button } from '@/src/components/ui';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Code Quality

### Linting and Formatting

Before committing, ensure your code passes all checks:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Fix formatting
npm run format

# Type checking
npm run type-check
```

### Pre-commit Hooks

The project uses Husky for pre-commit hooks that automatically:
- Run linting
- Format code
- Run type checking
- Run tests

## Pull Request Process

1. **Create a feature branch** from `develop`
2. **Make your changes** following the guidelines above
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Ensure all checks pass**:
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run build
   ```
6. **Create a pull request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Test coverage information

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Screenshots
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Performance Guidelines

- Optimize images and assets
- Use lazy loading where appropriate
- Minimize bundle size
- Implement proper caching strategies
- Monitor Core Web Vitals

## Accessibility Guidelines

- Use semantic HTML
- Provide proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

## Security Guidelines

- Validate all user inputs
- Sanitize data before processing
- Use environment variables for secrets
- Follow OWASP security practices
- Regular dependency updates

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for complex functions
- Update type definitions
- Include examples in documentation

## Getting Help

- Check existing issues and discussions
- Create an issue for bugs or feature requests
- Join our community discussions
- Review the documentation

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to make this project better!