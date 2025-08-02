/**
 * Language detection utility for file extensions
 * Maps file extensions to programming languages for syntax highlighting
 */

import path from "path";

// Comprehensive mapping of file extensions to programming languages
const EXTENSION_LANGUAGE_MAP = {
  // JavaScript/TypeScript ecosystem
  ".js": "javascript",
  ".jsx": "jsx",
  ".ts": "typescript",
  ".tsx": "tsx",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".vue": "vue",
  ".svelte": "svelte",

  // Web technologies
  ".html": "html",
  ".htm": "html",
  ".xml": "xml",
  ".xhtml": "xhtml",
  ".css": "css",
  ".scss": "scss",
  ".sass": "sass",
  ".less": "less",
  ".stylus": "stylus",

  // Python
  ".py": "python",
  ".pyx": "python",
  ".pyi": "python",
  ".pyw": "python",
  ".py3": "python",

  // Java ecosystem
  ".java": "java",
  ".kt": "kotlin",
  ".kts": "kotlin",
  ".scala": "scala",
  ".groovy": "groovy",
  ".gradle": "gradle",

  // C/C++
  ".c": "c",
  ".h": "c",
  ".cpp": "cpp",
  ".cxx": "cxx",
  ".cc": "cpp",
  ".hpp": "hpp",
  ".hxx": "hpp",
  ".hh": "hpp",

  // C#/.NET
  ".cs": "csharp",
  ".vb": "vb",
  ".fs": "fsharp",

  // Rust
  ".rs": "rust",

  // Go
  ".go": "go",

  // PHP
  ".php": "php",
  ".php3": "php",
  ".php4": "php",
  ".php5": "php",
  ".phtml": "php",

  // Ruby
  ".rb": "ruby",
  ".rbw": "ruby",
  ".rake": "ruby",
  ".gemspec": "ruby",

  // Swift
  ".swift": "swift",

  // Objective-C
  ".m": "objective-c",
  ".mm": "objective-c",

  // Shell scripts
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "zsh",
  ".fish": "fish",
  ".ksh": "ksh",
  ".csh": "csh",
  ".tcsh": "tcsh",

  // PowerShell
  ".ps1": "powershell",
  ".psd1": "powershell",
  ".psm1": "powershell",

  // Batch files
  ".bat": "batch",
  ".cmd": "batch",

  // SQL
  ".sql": "sql",
  ".mysql": "sql",
  ".pgsql": "sql",
  ".plsql": "plsql",

  // R
  ".r": "r",
  ".R": "r",

  // MATLAB (Note: .m conflicts with Objective-C, we prioritize Objective-C)
  ".mlx": "matlab",

  // Perl
  ".pl": "perl",
  ".pm": "perl",
  ".t": "perl",

  // Lua
  ".lua": "lua",

  // Haskell
  ".hs": "haskell",
  ".lhs": "haskell",

  // Clojure
  ".clj": "clojure",
  ".cljs": "clojure",
  ".cljc": "clojure",

  // Erlang/Elixir
  ".erl": "erlang",
  ".ex": "elixir",
  ".exs": "elixir",

  // Dart
  ".dart": "dart",

  // Configuration files
  ".json": "json",
  ".json5": "json5",
  ".jsonl": "jsonl",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".toml": "toml",
  ".ini": "ini",
  ".cfg": "ini",
  ".conf": "apache",
  ".config": "xml",

  // Markup languages
  ".md": "markdown",
  ".markdown": "markdown",
  ".mdown": "markdown",
  ".mkd": "markdown",
  ".rst": "rst",
  ".tex": "latex",
  ".bib": "bibtex",

  // Docker
  ".dockerfile": "dockerfile",
  ".dockerignore": "ignore",

  // Git
  ".gitignore": "ignore",
  ".gitattributes": "ignore",

  // Other data formats
  ".csv": "csv",
  ".tsv": "tsv",
  ".log": "log",
  ".txt": "text",

  // Build files
  ".mk": "makefile",
  ".cmake": "cmake",
  ".ninja": "ninja",

  // Package managers
  ".lock": "text", // Various lock files
  ".sum": "text" // Checksums
};

// Special filename patterns that override extension-based detection
const FILENAME_LANGUAGE_MAP = {
  "Dockerfile": "dockerfile",
  "Makefile": "makefile",
  "Rakefile": "ruby",
  "Gemfile": "ruby",
  "Guardfile": "ruby",
  "Vagrantfile": "ruby",
  "Jenkinsfile": "groovy",
  ".bashrc": "bash",
  ".zshrc": "zsh",
  ".vimrc": "vim",
  ".gitconfig": "ini",
  ".gitignore": "ignore",
  ".gitattributes": "ignore",
  "package.json": "json",
  "tsconfig.json": "json",
  "composer.json": "json",
  "bower.json": "json",
  ".eslintrc": "json",
  ".babelrc": "json",
  ".prettierrc": "json",
  "webpack.config.js": "javascript",
  "rollup.config.js": "javascript",
  "vite.config.js": "javascript",
  "jest.config.js": "javascript",
  "tailwind.config.js": "javascript",
  "next.config.js": "javascript",
  "nuxt.config.js": "javascript",
  "vue.config.js": "javascript",
  "svelte.config.js": "javascript",
  "astro.config.js": "javascript",
  "vitest.config.js": "javascript",
  "cypress.config.js": "javascript",
  "playwright.config.js": "javascript",
  "eslint.config.js": "javascript",
  "prettier.config.js": "javascript",
  "babel.config.js": "javascript",
  "postcss.config.js": "javascript",
  "karma.config.js": "javascript",
  "gulpfile.js": "javascript",
  "gruntfile.js": "javascript"
};

// Language categories for grouping
const LANGUAGE_CATEGORIES = {
  "Web Frontend": [
    "javascript",
    "typescript",
    "jsx",
    "tsx",
    "html",
    "css",
    "scss",
    "sass",
    "less",
    "stylus",
    "vue",
    "svelte"
  ],
  "Backend/Server": [
    "python",
    "java",
    "csharp",
    "php",
    "ruby",
    "go",
    "rust",
    "swift",
    "kotlin",
    "scala",
    "groovy",
    "nodejs"
  ],
  "Systems/Low-level": ["c", "cpp", "rust", "go", "zig", "assembly"],
  "Functional": ["haskell", "clojure", "erlang", "elixir", "fsharp", "ocaml"],
  "Scripting": ["bash", "zsh", "fish", "powershell", "batch", "perl", "lua"],
  "Data/Config": ["json", "yaml", "toml", "xml", "csv", "sql", "ini"],
  "Documentation": ["markdown", "rst", "latex", "text"],
  "Mobile": ["swift", "kotlin", "dart", "objective-c"],
  "DevOps": ["dockerfile", "yaml", "bash", "makefile", "cmake", "ninja"]
};

/**
 * Detect programming language from file path
 * @param {string} filePath - The file path to analyze
 * @returns {Object} - Language detection result
 */
export function detectLanguage(filePath) {
  const basename = path.basename(filePath);
  const extension = path.extname(filePath).toLowerCase();

  // Check filename patterns first (more specific)
  if (FILENAME_LANGUAGE_MAP[basename]) {
    const language = FILENAME_LANGUAGE_MAP[basename];
    return {
      language,
      confidence: "high",
      source: "filename",
      category: getCategoryForLanguage(language)
    };
  }

  // Check extension patterns
  if (EXTENSION_LANGUAGE_MAP[extension]) {
    const language = EXTENSION_LANGUAGE_MAP[extension];
    return {
      language,
      confidence: "medium",
      source: "extension",
      category: getCategoryForLanguage(language)
    };
  }

  // Special cases for files without extensions
  if (!extension) {
    // Check if it might be a script with shebang
    return {
      language: "text",
      confidence: "low",
      source: "fallback",
      category: "Other"
    };
  }

  // Unknown file type
  return {
    language: "text",
    confidence: "low",
    source: "unknown",
    category: "Other"
  };
}

/**
 * Get category for a language
 * @param {string} language - The language identifier
 * @returns {string} - The category name
 */
function getCategoryForLanguage(language) {
  for (const [category, languages] of Object.entries(LANGUAGE_CATEGORIES)) {
    if (languages.includes(language)) {
      return category;
    }
  }
  return "Other";
}

/**
 * Get all supported languages
 * @returns {Array} - Array of supported language identifiers
 */
export function getSupportedLanguages() {
  const languages = new Set();

  // Add all languages from extension map
  Object.values(EXTENSION_LANGUAGE_MAP).forEach((lang) => languages.add(lang));

  // Add all languages from filename map
  Object.values(FILENAME_LANGUAGE_MAP).forEach((lang) => languages.add(lang));

  return Array.from(languages).sort();
}

/**
 * Get language statistics from file paths
 * @param {Array<string>} filePaths - Array of file paths
 * @returns {Object} - Language statistics
 */
export function getLanguageStats(filePaths) {
  const stats = {
    byLanguage: {},
    byCategory: {},
    total: filePaths.length,
    unknown: 0
  };

  filePaths.forEach((filePath) => {
    const detection = detectLanguage(filePath);

    // Count by language
    if (!stats.byLanguage[detection.language]) {
      stats.byLanguage[detection.language] = {
        count: 0,
        files: []
      };
    }
    stats.byLanguage[detection.language].count++;
    stats.byLanguage[detection.language].files.push(filePath);

    // Count by category
    if (!stats.byCategory[detection.category]) {
      stats.byCategory[detection.category] = {
        count: 0,
        languages: new Set()
      };
    }
    stats.byCategory[detection.category].count++;
    stats.byCategory[detection.category].languages.add(detection.language);

    // Count unknown
    if (
      detection.confidence === "low" &&
      (detection.source === "unknown" || detection.source === "fallback")
    ) {
      stats.unknown++;
    }
  });

  // Convert language sets to arrays for serialization
  Object.keys(stats.byCategory).forEach((category) => {
    stats.byCategory[category].languages = Array.from(
      stats.byCategory[category].languages
    );
  });

  return stats;
}

/**
 * Format language detection for display
 * @param {Object} detection - Language detection result
 * @returns {string} - Formatted string
 */
export function formatLanguageDetection(detection) {
  const confidence =
    detection.confidence === "high"
      ? "✓"
      : detection.confidence === "medium"
        ? "~"
        : "?";

  return `${detection.language} ${confidence} (${detection.source})`;
}

export default {
  detectLanguage,
  getSupportedLanguages,
  getLanguageStats,
  formatLanguageDetection,
  LANGUAGE_CATEGORIES
};
