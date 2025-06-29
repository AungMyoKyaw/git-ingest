# Contributing to Git-Ingest

We love your input! We want to make contributing to Git-Ingest as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Quick Start

1. **Fork the Repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/git-ingest.git
   cd git-ingest
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run Tests**

   ```bash
   npm test
   npm run test:coverage  # With coverage report
   ```

4. **Start Developing**
   ```bash
   npm run lint          # Check code style
   npm run lint:fix      # Auto-fix linting issues
   npm run format        # Format code with Prettier
   ```

## 📋 Development Guidelines

### Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Latest version recommended
- **Git**: For version control

### Project Structure

```
src/
├── cli.js                     # Entry point and command handling
├── config.js                  # Configuration management
├── tree-generator.js          # Directory traversal and tree generation
├── read-file-and-append.js    # File content processing
├── progress-reporter.js       # Progress indicators and reporting
├── error-handler.js           # Centralized error handling
└── __tests__/                 # Test files
    ├── cli.test.js
    ├── config.test.js
    ├── error-handler.test.js
    ├── progress-reporter.test.js
    ├── read-file-and-append.test.js
    └── tree-generator.test.js
```

### Code Style

We use ESLint and Prettier to maintain consistent code style:

- **ESLint**: Enforces code quality and style rules
- **Prettier**: Handles code formatting
- **EditorConfig**: Maintains consistent editor settings

#### Key Style Guidelines

- Use **ES Modules** (`import`/`export`)
- Use **2 spaces** for indentation
- Use **double quotes** for strings
- Use **semicolons** at the end of statements
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes
- Use **UPPER_SNAKE_CASE** for constants

#### Running Code Quality Checks

```bash
# Check linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format
```

## 🐛 Bug Reports

Great Bug Reports tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Run command '...'
2. With options '...'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Environment:**

- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 18.0.0]
- Git-Ingest version: [e.g. 2.0.0]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

We welcome feature requests! Please provide:

- **Use case**: Describe the problem you're trying to solve
- **Proposed solution**: How you envision the feature working
- **Alternatives considered**: Any alternative solutions you've thought about
- **Impact**: Who would benefit from this feature

## 🔧 Pull Request Process

### Branching Strategy

- `main`: Production-ready code
- `feat/*`: New features
- `fix/*`: Bug fixes
- `docs/*`: Documentation updates
- `refactor/*`: Code refactoring
- `test/*`: Test improvements

### Pull Request Guidelines

1. **Branch Naming**

   ```bash
   git checkout -b feat/add-json-output
   git checkout -b fix/clipboard-copy-issue
   git checkout -b docs/update-readme
   ```

2. **Commit Messages**
   Use conventional commits format:

   ```
   type(scope): description

   Examples:
   feat(cli): add JSON output format option
   fix(clipboard): resolve copy operation on Windows
   docs(readme): update installation instructions
   test(tree): add binary file detection tests
   ```

3. **Before Submitting**
   - [ ] Run tests: `npm test`
   - [ ] Run linting: `npm run lint:fix`
   - [ ] Format code: `npm run format`
   - [ ] Update documentation if needed
   - [ ] Add tests for new features
   - [ ] Ensure tests pass with coverage

4. **Pull Request Template**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix (non-breaking change that fixes an issue)
   - [ ] New feature (non-breaking change that adds functionality)
   - [ ] Breaking change (fix or feature that would cause existing functionality to change)
   - [ ] Documentation update

   ## Testing

   - [ ] Tests pass locally
   - [ ] Added new tests for new functionality
   - [ ] Coverage maintained or improved

   ## Checklist

   - [ ] Code follows project style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes (or clearly documented)
   ```

## 🧪 Testing

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **CLI Tests**: Test command-line interface

### Writing Tests

```javascript
import { describe, test, expect } from "@jest/globals";
import { functionToTest } from "../src/module.js";

describe("Module Name", () => {
  describe("functionToTest", () => {
    test("should handle normal case", () => {
      const result = functionToTest("input");
      expect(result).toBe("expected output");
    });

    test("should handle edge case", () => {
      const result = functionToTest("");
      expect(result).toBe("");
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tree-generator.test.js
```

## 📚 Documentation

### README Updates

When updating the README:

- Keep it concise and user-focused
- Include examples for new features
- Update badges if needed
- Maintain consistent formatting

### Code Documentation

- Use JSDoc comments for functions and classes
- Include parameter and return type information
- Provide usage examples for complex functions

```javascript
/**
 * Process directory and generate output file
 * @param {string} directory - Target directory path
 * @param {Object} options - Processing options
 * @param {string} [options.output] - Output filename
 * @param {boolean} [options.copy] - Copy to clipboard
 * @returns {Promise<void>}
 * @example
 * await processDirectory('./src', { output: 'output.txt', copy: true });
 */
async function processDirectory(directory, options) {
  // Implementation
}
```

## 🏷️ Release Process

1. **Version Bump**: Update version in `package.json`
2. **Changelog**: Update with new features and fixes
3. **Tag**: Create git tag with version number
4. **Publish**: Publish to npm registry

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to a positive environment:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 📞 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and community discussions
- **Documentation**: Check the README and code comments

Thank you for contributing to Git-Ingest! 🚀
