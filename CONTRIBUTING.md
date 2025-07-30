# Contributing to Calories API Server

Thank you for your interest in contributing to the Calories API Server! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/kcal-api-server.git
   cd kcal-api-server
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   npm run env:example
   # Edit .env.local with your actual Airtable credentials
   ```
5. **Start development server**:
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- Use **ES6+ features** where appropriate
- Follow **JSDoc documentation** standards for all functions
- Use **descriptive variable and function names**
- Keep functions **small and focused** on a single responsibility
- Add **comprehensive error handling** with appropriate HTTP status codes

### Code Structure

- **Modular approach**: Break down complex functionality into smaller functions
- **Environment validation**: Always validate required environment variables
- **Type safety**: Use JSDoc for type annotations and better IDE support
- **Error handling**: Provide detailed error messages for debugging

### Commit Messages

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for adding or updating tests
- `chore:` for maintenance tasks

Example: `feat: add caching headers for better performance`

## 🧪 Testing

Currently, the project doesn't have automated tests. If you'd like to contribute by adding a testing framework, please:

1. Choose a lightweight testing framework (Jest, Vitest, etc.)
2. Add test scripts to `package.json`
3. Create tests for the main API functionality
4. Include edge cases and error scenarios

## 📝 Documentation

When contributing:

1. **Update README.md** if you're adding new features or changing setup instructions
2. **Add JSDoc comments** for all new functions
3. **Update API documentation** if you're changing the API response format
4. **Include code examples** for new functionality

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (Node.js version, OS, etc.)
5. **Error logs** if available

## 💡 Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the use case** and problem it solves
3. **Provide implementation ideas** if you have them
4. **Consider backward compatibility**

## 🔄 Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test your changes** locally:
   ```bash
   npm run dev
   # Test the API endpoint manually
   ```

4. **Commit your changes** with descriptive messages

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots if applicable
   - Testing instructions

## ⚡ Performance Considerations

When contributing, keep in mind:

- **Serverless environment**: Functions should start quickly and use minimal memory
- **API response time**: Keep external API calls efficient
- **Error handling**: Fail fast with clear error messages
- **Caching**: Consider caching strategies for frequently accessed data

## 🔒 Security

- **Never commit** API keys or sensitive data
- **Validate all inputs** from external sources
- **Use HTTPS** for all external API calls
- **Follow OWASP guidelines** for web API security

## 📞 Getting Help

If you need help:

1. Check the [README.md](README.md) for setup instructions
2. Look at existing [issues](https://github.com/bartoszrychlicki/kcal-api-server/issues)
3. Create a new issue with the "question" label

## 📄 License

By contributing, you agree that your contributions will be licensed under the same ISC License that covers the project.

---

Thank you for contributing! 🎉