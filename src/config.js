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

  // Default ignore patterns
  DEFAULT_IGNORE_PATTERNS: [
    // Generated output files
    "git-ingest-*.txt",
    "git-ingest-*.json",
    "git-ingest-*.md",

    // Version control
    ".git/",
    ".git",
    ".svn/",
    ".hg/",

    // Dependencies
    "node_modules/",
    "node_modules",
    ".npm/",
    "bower_components/",
    "vendor/",
    "venv/",
    "__pycache__/",
    ".virtualenv/",

    // Build directories
    "dist/",
    "dist",
    "build/",
    "out/",
    ".next/",
    ".nuxt/",
    "target/",
    "bin/",
    "obj/",

    // IDE and editor files
    ".vscode/",
    ".idea/",
    "*.swp",
    "*.swo",
    "*~",
    ".vs/",

    // OS files
    ".DS_Store",
    "Thumbs.db",
    "desktop.ini",

    // Log files
    "*.log",
    "logs/",

    // Cache directories
    ".cache/",
    ".tmp/",
    "tmp/",
    "temp/",

    // Binary and media files
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

    // Development files
    "coverage/",
    "nyc_output/",
    ".eslintcache",
    "*.tsbuildinfo",
    ".parcel-cache/"
  ],

  // Output formats
  OUTPUT_FORMATS: ["text", "json", "markdown"],

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

    if (
      !Array.isArray(this.options.OUTPUT_FORMATS) ||
      !this.options.OUTPUT_FORMATS.includes("text")
    ) {
      throw new Error("OUTPUT_FORMATS must be an array that includes \"text\"");
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
   * Load configuration from file
   */
  static async loadFromFile(configPath) {
    try {
      const fs = await import("fs/promises");
      const content = await fs.readFile(configPath, "utf8");
      const configData = JSON.parse(content);
      return new Config(configData);
    } catch (error) {
      throw new Error(
        `Failed to load configuration from ${configPath}: ${error.message}`
      );
    }
  }

  /**
   * Save configuration to file
   */
  async saveToFile(configPath) {
    try {
      const fs = await import("fs/promises");
      const content = JSON.stringify(this.options, null, 2);
      await fs.writeFile(configPath, content, "utf8");
    } catch (error) {
      throw new Error(
        `Failed to save configuration to ${configPath}: ${error.message}`
      );
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
