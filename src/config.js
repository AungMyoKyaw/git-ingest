/**
 * Configuration management for git-ingest
 * Centralizes all configuration options and constants
 */

// Default configuration constants
export const DEFAULT_CONFIG = {
  // File processing
  MAX_FILE_SIZE_MB: 10,
  TRUNCATE_SIZE_KB: 2048,
  get TRUNCATE_SIZE_BYTES() {
    return this.TRUNCATE_SIZE_KB * 1024;
  }, // 2MB

  // Output formatting
  SEPARATOR_LENGTH: 48,
  SEPARATOR_CHAR: "=",

  // Performance settings
  LARGE_FILE_THRESHOLD_MB: 1,
  MEMORY_LIMIT_MB: 200,

  // Default ignore patterns (world-class, modern, comprehensive)
  DEFAULT_IGNORE_PATTERNS: [
    // Project-specific generated output
    "git-ingest-*.txt",
    "git-ingest-*.json",
    "git-ingest-*.md",

    // Node.js package lock file
    "package-lock.json",

    // Version control and VCS metadata
    ".git/",
    ".git",
    ".svn/",
    ".hg/",
    ".gitlab/",
    ".circleci/",
    ".github/",
    ".azure-pipelines/",
    ".travis.yml",
    ".appveyor.yml",
    ".codecov.yml",
    ".coveralls.yml",
    ".gitmodules",
    ".gitattributes",
    ".gitkeep",
    ".gitignore",

    // Dependencies and package managers
    "node_modules/",
    "node_modules",
    "bower_components/",
    "jspm_packages/",
    "web_modules/",
    "vendor/",
    ".npm/",
    ".cache/",
    ".next/",
    ".nuxt/",
    ".parcel-cache/",
    ".tmp/",
    ".virtualenv/",
    ".vs/",
    ".vscode/",
    "__pycache__/",
    "coverage/",
    "nyc_output/",
    "target/",
    "temp/",
    "tmp/",
    "venv/",
    ".pnpm-debug.log*",
    ".yarn/*",
    "!/.yarn/releases",
    "!/.yarn/patches",
    "!/.yarn/plugins",
    "!/.yarn/sdks",
    "!/.yarn/versions",
    ".yarn/cache",
    ".yarn/unplugged",
    ".yarn/build-state.yml",
    ".yarn/install-state.gz",
    ".pnp.*",
    ".npmrc",
    ".yarnrc",
    ".nvmrc",
    ".tool-versions",

    // Build, output, and cache
    "dist/",
    "dist",
    "build/",
    "out/",
    "bin/",
    "obj/",
    "Release/",
    ".next/",
    ".nuxt/",
    ".output/",
    ".out/",
    ".serverless/",
    ".docusaurus/",
    ".svelte-kit/",
    ".turbo/",
    ".vite/",
    ".fusebox/",
    ".dynamodb/",
    ".tern-port/",
    ".vscode-test/",
    ".rpt2_cache/",
    ".rts2_cache_cjs/",
    ".rts2_cache_es/",
    ".rts2_cache_umd/",
    ".parcel-cache/",
    ".cache/",
    ".nyc_output/",
    ".grunt/",
    ".husky/",
    ".history/",
    ".idea/",
    ".vscode/",
    ".vs/",
    ".sublime-*",
    "*.sublime-*",

    // IDE/editor/project files
    "*.swp",
    "*.swo",
    "*~",
    "*.iml",
    "*.ipr",
    "*.iws",
    "workspace.xml",
    "tasks.xml",
    "usage.statistics.xml",
    "dictionaries",
    "shelf",
    "contentModel.xml",
    "dataSources/",
    "dataSources.ids",
    "dataSources.local.xml",
    "sqlDataSources.xml",
    "dynamic.xml",
    "uiDesigner.xml",
    "dbnavigator.xml",
    "gradle.xml",
    "libraries",
    "modules.xml",
    "misc.xml",
    "replstate.xml",
    "sonarlint/",
    "sonarIssues.xml",
    "markdown-navigator.xml",
    "markdown-navigator-enh.xml",
    "markdown-navigator/",
    "$CACHE_FILE$",
    "codestream.xml",
    "azureSettings.xml",

    // OS-specific files
    ".DS_Store",
    ".AppleDouble",
    ".LSOverride",
    "Icon\r\r",
    "._*",
    ".DocumentRevisions-V100",
    ".fseventsd",
    ".Spotlight-V100",
    ".TemporaryItems",
    ".Trashes",
    ".VolumeIcon.icns",
    ".com.apple.timemachine.donotpresent",
    ".AppleDB",
    ".AppleDesktop",
    "Network Trash Folder",
    "Temporary Items",
    ".apdisk",
    "*.icloud",
    "Thumbs.db",
    "Thumbs.db:encryptable",
    "ehthumbs.db",
    "ehthumbs_vista.db",
    "desktop.ini",
    "$RECYCLE.BIN/",
    "*.stackdump",
    ".Trash-*",
    ".nfs*",

    // Logs, reports, and runtime data
    "*.log",
    "logs/",
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*",
    "lerna-debug.log*",
    "report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json",
    "pids",
    "*.pid",
    "*.seed",
    "*.pid.lock",

    // Coverage and test output
    "coverage/",
    "*.lcov",
    ".nyc_output/",
    ".vscode-test/",
    "*.tgz",

    // Environment and secrets
    ".env",
    ".env.*",
    "!.env.example",

    // Binary, media, and archives
    "*.jpg",
    "*.jpeg",
    "*.png",
    "*.gif",
    "*.svg",
    "*.webp",
    "*.ico",
    "*.pdf",
    "*.zip",
    "*.tar",
    "*.gz",
    "*.rar",
    "*.7z",
    "*.mp4",
    "*.avi",
    "*.mov",
    "*.mp3",
    "*.wav",
    "*.exe",
    "*.dll",
    "*.so",
    "*.dylib",
    "*.class",
    "*.jar",

    // Miscellaneous caches and lock files
    ".eslintcache",
    ".stylelintcache",
    "*.tsbuildinfo",
    ".rpt2_cache/",
    ".rts2_cache_cjs/",
    ".rts2_cache_es/",
    ".rts2_cache_umd/",
    ".parcel-cache/",
    ".cache/",
    ".tmp/",
    "tmp/",
    "temp/",
    // --- Appended world-class patterns (additive, non-duplicate) ---
    // Modern monorepo and build tools
    ".pnpm/",
    ".turbo/",
    ".output/",
    ".vite/",
    ".svelte-kit/",
    ".docusaurus/",
    ".vercel/",
    ".netlify/",
    ".serverless/",
    ".vscode-test/",
    ".husky/",
    ".history/",
    // IDE/editor/project files (additional)
    "*.code-workspace",
    "*.sublime-project",
    "*.sublime-workspace",
    // OS-specific (additional)
    ".AppleDB",
    ".AppleDesktop",
    "Network Trash Folder",
    "Temporary Items",
    ".apdisk",
    "*.icloud",
    // Logs, reports, and runtime data (additional)
    ".node_repl_history",
    // Coverage and test output (additional)
    "*.lcov",
    // Environment and secrets (additional)
    ".env.local",
    ".env.development.local",
    ".env.test.local",
    ".env.production.local",
    // Binary, media, and archives (additional)
    "*.bin",
    // Miscellaneous caches and lock files (additional)
    ".rts2_cache_esm/",
    ".rts2_cache_umd/",
    ".rts2_cache_cjs/",
    ".rts2_cache_es/",
    // Cloud/CI/CD
    ".github/workflows/",
    ".gitlab-ci.yml",
    ".dockerignore",
    ".envrc",
    ".prettierignore",
    ".editorconfig",
    // Misc
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*",
    "lerna-debug.log*",
    ".pnp.*",
    ".yarn-integrity",
    ".yarn/cache",
    ".yarn/unplugged",
    ".yarn/build-state.yml",
    ".yarn/install-state.gz"
  ],

  // Default file extensions to treat as text
  TEXT_EXTENSIONS: [
    ".txt",
    ".md",
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".css",
    ".scss",
    ".sass",
    ".html",
    ".htm",
    ".xml",
    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".ini",
    ".py",
    ".rb",
    ".php",
    ".java",
    ".c",
    ".cpp",
    ".h",
    ".hpp",
    ".cs",
    ".go",
    ".rs",
    ".sh",
    ".bash",
    ".zsh",
    ".fish",
    ".ps1",
    ".bat",
    ".cmd",
    ".sql",
    ".prisma",
    ".graphql",
    ".gql",
    ".svelte",
    ".vue",
    ".dart",
    ".swift",
    ".kt",
    ".scala",
    ".clj",
    ".ex",
    ".exs",
    ".elm",
    ".hs",
    ".dockerfile",
    ".gitignore",
    ".gitattributes",
    ".editorconfig"
  ]
};

/**
 * Configuration class for managing git-ingest settings
 */
export class Config {
  constructor(options = {}) {
    // Merge options with defaults
    this.options = { ...DEFAULT_CONFIG, ...options };

    // Derived configurations
    this.maxFileSizeBytes = this.options.MAX_FILE_SIZE_MB * 1024 * 1024;
    this.largeFileThresholdBytes =
      this.options.LARGE_FILE_THRESHOLD_MB * 1024 * 1024;
    this.memoryLimitBytes = this.options.MEMORY_LIMIT_MB * 1024 * 1024;

    // Validate configuration
    this.validate();
  }

  /**
   * Validate configuration values
   */
  validate() {
    if (
      typeof this.options.MAX_FILE_SIZE_MB !== "number" ||
      this.options.MAX_FILE_SIZE_MB <= 0
    ) {
      throw new Error("MAX_FILE_SIZE_MB must be a positive number");
    }

    if (
      typeof this.options.TRUNCATE_SIZE_BYTES !== "number" ||
      this.options.TRUNCATE_SIZE_BYTES < 0
    ) {
      throw new Error("TRUNCATE_SIZE_BYTES must be a non-negative number");
    }

    if (this.options.SEPARATOR_LENGTH < 10) {
      throw new Error("SEPARATOR_LENGTH must be at least 10");
    }
  }

  /**
   * Get ignore patterns including defaults and custom patterns
   */
  getIgnorePatterns(customExclude = []) {
    return [...this.options.DEFAULT_IGNORE_PATTERNS, ...customExclude];
  }

  /**
   * Check if file extension is treated as text
   */
  isTextExtension(filePath) {
    const ext = this.getFileExtension(filePath);
    return this.options.TEXT_EXTENSIONS.includes(ext);
  }

  /**
   * Get file extension including the dot
   */
  getFileExtension(filePath) {
    const lastDot = filePath.lastIndexOf(".");
    return lastDot === -1 ? "" : filePath.substring(lastDot).toLowerCase();
  }

  /**
   * Create separator line
   */
  createSeparator(length = null, char = null) {
    const separatorChar = char || this.options.SEPARATOR_CHAR;
    const separatorLength = length || this.options.SEPARATOR_LENGTH;
    return separatorChar.repeat(separatorLength);
  }

  /**
   * Check if file size exceeds limits
   */
  checkFileSize(sizeBytes) {
    return {
      exceedsLimit: sizeBytes > this.maxFileSizeBytes,
      isLarge: sizeBytes > this.largeFileThresholdBytes,
      sizeMB: sizeBytes / (1024 * 1024),
      formattedSize: this.formatFileSize(sizeBytes)
    };
  }

  /**
   * Format file size for display
   */
  formatFileSize(sizeBytes) {
    if (sizeBytes < 1024) {
      return `${sizeBytes} B`;
    } else if (sizeBytes < 1024 * 1024) {
      return `${(sizeBytes / 1024).toFixed(2)} KB`;
    } else if (sizeBytes < 1024 * 1024 * 1024) {
      return `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }

  /**
   * Clone configuration with overrides
   */
  clone(overrides = {}) {
    return new Config({ ...this.options, ...overrides });
  }

  /**
   * Get all configuration as plain object
   */
  toObject() {
    return { ...this.options };
  }
}
