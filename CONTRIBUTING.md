# Contributing to Smart Campus

We welcome contributions to the Smart Campus project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Avoid harassment, discrimination, or offensive language
- Report unacceptable behavior to project maintainers

## Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following commit message guidelines
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Commit Message Guidelines

Follow the conventional commit format:

```
type(scope): subject

body

footer
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring without feature changes
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependencies, etc.
- **perf**: Performance improvements

### Examples
```
feat(auth): add google oauth2 integration
fix(booking): resolve calendar date selection issue
docs(api): update endpoint documentation
chore(deps): upgrade spring-boot to 3.1.0
```

## Development Workflow

### Backend Development
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
cd backend
./mvnw test

cd frontend
npm run test
```

## Code Style Guidelines

### Backend (Java)
- Use 4 spaces for indentation
- Follow Google Java Style Guide
- Use meaningful variable names
- Add JavaDoc comments for public methods
- Keep methods small and focused

### Frontend (JavaScript/React)
- Use 2 spaces for indentation
- Use ES6+ features
- Use functional components and hooks
- Add propTypes or TypeScript types
- Write descriptive component names

## Pull Request Process

1. Update README.md with any new features or changes
2. Update tests and ensure all tests pass
3. Ensure code follows style guidelines
4. Provide clear description of changes
5. Reference any related issues
6. Request review from maintainers

## Testing Requirements

- Backend: Minimum 80% code coverage for new features
- Frontend: All components should have unit tests
- Integration tests for API endpoints
- E2E tests for critical user flows

## Performance Guidelines

- Database queries should be optimized
- Avoid N+1 query problems
- Use caching where appropriate
- Minimize bundle size for frontend
- Optimize images and assets

## Security Considerations

- Never commit secrets or credentials
- Validate and sanitize user input
- Use parameterized queries
- Implement proper authentication/authorization
- Follow OWASP security guidelines

## Questions or Need Help?

- Open an issue on GitHub
- Check existing documentation
- Contact project maintainers
- Review similar resolved issues

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Monthly contributor highlights

Thank you for contributing to Smart Campus! 🎓
