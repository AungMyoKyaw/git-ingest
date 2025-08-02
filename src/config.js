/**
 * Configuration management for git-ingest
 * Centralizes all configuration options and constants
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { FILE_PROCESSING_CONSTANTS, FORMAT_CONSTANTS } from "./constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load external configuration file safely
 */
async function loadConfigFile(filename, fallback = []) {
  try {
    const configPath = path.join(__dirname, "../config", filename);
    const content = await fs.readFile(configPath, "utf8");
    return JSON.parse(content);
  } catch {
    // Silent fallback to default values
    return fallback;
  }
}

// Default configuration constants with fallbacks
export const DEFAULT_CONFIG = {
  // File processing
  MAX_FILE_SIZE_MB: FILE_PROCESSING_CONSTANTS.DEFAULT_MAX_FILE_SIZE_MB,
  TRUNCATE_SIZE_KB: FILE_PROCESSING_CONSTANTS.DEFAULT_TRUNCATE_SIZE_KB,
  get TRUNCATE_SIZE_BYTES() {
    return this.TRUNCATE_SIZE_KB * 1024;
  },

  // Output formatting
  SEPARATOR_LENGTH: FORMAT_CONSTANTS.SEPARATOR_LENGTH,
  SEPARATOR_CHAR: FORMAT_CONSTANTS.SEPARATOR_CHAR,

  // Performance settings
  LARGE_FILE_THRESHOLD_MB: 1,
  MEMORY_LIMIT_MB: 200,

  // Fallback patterns (loaded dynamically)
  FALLBACK_IGNORE_PATTERNS: [
    "node_modules/",
    ".git/",
    "dist/",
    "build/",
    ".cache/",
    "*.log"
  ],
  FALLBACK_TEXT_EXTENSIONS: [
    ".txt",
    ".md",
    ".js",
    ".ts",
    ".json",
    ".yaml",
    ".yml",
    ".html",
    ".css"
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

    // Load external configurations
    this.ignorePatterns = null;
    this.textExtensions = null;

    // Validate configuration
    this.validate();
  }

  /**
   * Load ignore patterns (async, cached)
   */
  async getIgnorePatterns(customExclude = []) {
    if (!this.ignorePatterns) {
      const config = await loadConfigFile("default-ignore-patterns.json", {
        ignore_patterns: this.options.FALLBACK_IGNORE_PATTERNS
      });
      this.ignorePatterns =
        config.ignore_patterns || this.options.FALLBACK_IGNORE_PATTERNS;
    }
    return [...this.ignorePatterns, ...customExclude];
  }

  /**
   * Load text extensions (async, cached)
   */
  async getTextExtensions() {
    if (!this.textExtensions) {
      const config = await loadConfigFile("text-extensions.json", {
        text_extensions: this.options.FALLBACK_TEXT_EXTENSIONS
      });
      this.textExtensions =
        config.text_extensions || this.options.FALLBACK_TEXT_EXTENSIONS;
    }
    return this.textExtensions;
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
   * Check if file extension is treated as text (async)
   */
  async isTextExtension(filePath) {
    const ext = this.getFileExtension(filePath);
    const textExtensions = await this.getTextExtensions();
    return textExtensions.includes(ext);
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
