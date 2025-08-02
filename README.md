# Git-Ingest 🚀

[![codecov](https://codecov.io/gh/AungMyoKyaw/git-ingest/branch/master/graph/badge.svg?token=AG31A1EZ1W&style=flat-square)](https://codecov.io/gh/AungMyoKyaw/git-ingest)
[![npm downloads](https://img.shields.io/npm/dt/git-ingest.svg?style=flat-square)](https://npmjs.com/package/git-ingest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A powerful CLI tool for analyzing and ingesting project codebases into structured text files with advanced gitignore support, binary file detection, and cross-platform clipboard integration.

## 🚀 Installation

```bash
# Global installation
npm install -g git-ingest

# Or use with npx
npx git-ingest
```

## 📖 Usage

### Basic Usage

```bash
# Analyze current directory
git-ingest

# Analyze specific directory
git-ingest /path/to/project

# Copy output to clipboard
git-ingest --copy

# Verbose output with progress
git-ingest --verbose

# Quiet mode
git-ingest --quiet
```

### Advanced Options

```bash
# Custom output filename
git-ingest --output my-project-analysis.txt

# Generate LLM-friendly markdown format
git-ingest --format markdown

# Include only specific file patterns
git-ingest --include "*.js" "*.ts" "*.json"

# Exclude specific patterns
git-ingest --exclude "*.test.js" "*.spec.js"

# Set maximum file size (in MB)
git-ingest --max-size 5

# Generate markdown with custom output
git-ingest --format markdown --output analysis.md
```

### All Options

```bash
git-ingest [options] [directory]

Arguments:
  directory                    Target directory to analyze (default: "./")

Options:
  -V, --version                output the version number
  -o, --output <filename>      Specify output filename
  -f, --format <type>          Output format: text or markdown (default: "text")
  -c, --copy                   Copy output to clipboard
  -i, --include <patterns...>  Include files matching patterns
  -e, --exclude <patterns...>  Exclude files matching patterns
  --max-size <size>            Maximum file size to include (in MB) (default: "10")
  -v, --verbose                Verbose output
  -q, --quiet                  Quiet mode
  -h, --help                   display help for command
```

## 📊 Output Format

Git-Ingest supports two output formats optimized for different use cases:

### 📝 Text Format (Default)

The classic plain text format with directory tree and file contents:

```
Directory structure for: /path/to/project
Generated on: 2024-01-15T10:30:00.000Z
Total items: 15

├── package.json
├── README.md
├── src/
│   ├── index.js
│   └── utils/
│       └── helpers.js

================================================
File: package.json
================================================
{
  "name": "my-project",
  "version": "1.0.0"
}
```

### 📋 Markdown Format (LLM-Optimized)

A structured, semantic format designed for optimal AI/LLM processing:

```bash
git-ingest --format markdown
```

Features:

- **🎯 LLM-Friendly Structure**: Hierarchical organization with proper semantic markup
- **🔍 Language Detection**: Automatic syntax highlighting for 60+ programming languages
- **📊 Rich Metadata**: File statistics, language distribution, and categorization
- **📑 Table of Contents**: Navigation-friendly structure with links
- **🏷️ File Categorization**: Organized by Web Frontend, Backend, DevOps, etc.
- **💻 Code Blocks**: Proper syntax highlighting for better readability
- **📈 Analytics**: Comprehensive project statistics and insights

Example markdown output structure:

````markdown
# 🚀 Project Analysis Report

## 📊 Project Overview

**Language:** javascript | **Files:** 25 | **Size:** 2.3 MB

## 📈 Statistics

### 📊 File Type Distribution

| Category       | Files | Percentage |
| -------------- | ----- | ---------- |
| Web Frontend   | 15    | 60.0%      |
| Backend/Server | 8     | 32.0%      |

### 📄 `app.js`

**Path:** `src/app.js`
**Size:** 3.2 KB
**Language:** javascript (high confidence)
**Category:** Web Frontend

```javascript
// Your code here with proper syntax highlighting
```
````

````

## 🔧 Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/AungMyoKyaw/git-ingest.git
cd git-ingest

# Install dependencies
npm install

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
````

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Building

```bash
# Lint and format
npm run lint:fix
npm run format

# Test before release
npm test
```

## 🛠️ Configuration

Git-Ingest respects standard `.gitignore` files and includes sensible defaults:

### Default Exclusions

- Generated output files (`git-ingest-*.txt`, `git-ingest-*.json`)
- Version control (`.git/`)
- Dependencies (`node_modules/`, `vendor/`)
- Build directories (`dist/`, `build/`, `out/`)
- Binary files (images, videos, executables)
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)

### Custom Configuration

Use include/exclude patterns to customize file selection:

```bash
# Only include JavaScript and TypeScript files
git-ingest --include "*.js" "*.ts" "*.jsx" "*.tsx"

# Exclude test files
git-ingest --exclude "*.test.js" "*.spec.js" "__tests__/"

# Complex filtering
git-ingest --include "src/**" --exclude "*.min.js" "*.bundle.js"
```

## 🔍 Use Cases

### 📝 **Code Reviews**

Generate comprehensive project overviews for code reviews, sharing complete project context in a single document.

### 🤖 **AI Analysis**

Perfect for feeding entire codebases to AI tools like ChatGPT, Claude, or GitHub Copilot for analysis, documentation, or refactoring suggestions.

### 📚 **Documentation**

Create snapshot documentation of project structure and content for onboarding or archival purposes.

### 🔄 **Project Migration**

Analyze and understand legacy codebases before migration or modernization efforts.

### 👥 **Team Collaboration**

Share project context quickly with team members or stakeholders.

## 🚀 Performance

Git-Ingest v2.0 delivers significant performance improvements:

- **10x faster** than v1.0 for large projects
- **Constant memory usage** regardless of project size
- **Streaming architecture** prevents memory overflow
- **Async operations** ensure UI responsiveness
- **Smart caching** reduces redundant operations

### Benchmarks

| Project Size | Files  | Processing Time | Memory Usage |
| ------------ | ------ | --------------- | ------------ |
| Small        | < 100  | < 2 seconds     | < 50MB       |
| Medium       | 1,000  | < 10 seconds    | < 100MB      |
| Large        | 10,000 | < 60 seconds    | < 200MB      |

## 🔐 Security

Security is a top priority in Git-Ingest v2.0:

- **No Command Injection**: Safe clipboard operations
- **Path Validation**: Prevents directory traversal attacks
- **Permission Respect**: Works within user permissions
- **Input Sanitization**: All user inputs are validated
- **No Data Persistence**: Sensitive data is not cached

## 🆚 Version 2.0 Improvements

Git-Ingest v2.0 represents a complete rewrite with focus on security, performance, and user experience:

### 🔒 Security Enhancements

- ✅ Eliminated command injection vulnerabilities
- ✅ Added comprehensive input validation
- ✅ Implemented secure clipboard operations
- ✅ Added path traversal protection

### ⚡ Performance Optimizations

- ✅ Converted to fully async operations
- ✅ Implemented memory-efficient streaming
- ✅ Added binary file detection
- ✅ Optimized directory traversal

### 🎯 User Experience Improvements

- ✅ Professional CLI with Commander.js
- ✅ Real-time progress indicators
- ✅ Colored output and better formatting
- ✅ Enhanced error messages
- ✅ Comprehensive help system

### 🛠️ Developer Experience

- ✅ Complete test suite with Jest
- ✅ ESLint and Prettier configuration
- ✅ Modular, maintainable code structure
- ✅ Comprehensive documentation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Lint code: `npm run lint:fix`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Commander.js](https://github.com/tj/commander.js/) for CLI argument parsing
- [Chalk](https://github.com/chalk/chalk) for terminal colors
- [Ora](https://github.com/sindresorhus/ora) for progress indicators
- [ignore](https://github.com/kaelzhang/node-ignore) for gitignore support
- [isbinaryfile](https://github.com/gjtorikian/isBinaryFile) for binary detection
- [clipboardy](https://github.com/sindresorhus/clipboardy) for clipboard operations

---

**Made with ❤️ by [Aung Myo Kyaw](https://github.com/AungMyoKyaw)**

⭐ If you find Git-Ingest useful, please star the repository!
