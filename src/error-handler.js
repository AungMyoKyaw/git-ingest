/**
 * Enhanced error handling system for git-ingest
 * Provides consistent error types, messages, and handling strategies
 */

import chalk from "chalk";
import path from "path";

/**
 * Base error class for git-ingest specific errors
 */
export class GitIngestError extends Error {
  constructor(message, code = "GENERIC_ERROR", details = {}) {
    super(message);
    this.name = "GitIngestError";
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Directory-related errors
 */
export class DirectoryError extends GitIngestError {
  constructor(message, path, originalError = null) {
    super(message, "DIRECTORY_ERROR", {
      path,
      originalError: originalError?.message
    });
    this.name = "DirectoryError";
    this.path = path;
    this.originalError = originalError;
  }
}

/**
 * File processing errors
 */
export class FileProcessingError extends GitIngestError {
  constructor(message, filePath, originalError = null) {
    super(message, "FILE_PROCESSING_ERROR", {
      filePath,
      originalError: originalError?.message
    });
    this.name = "FileProcessingError";
    this.filePath = filePath;
    this.originalError = originalError;
  }
}

/**
 * Configuration errors
 */
export class ConfigurationError extends GitIngestError {
  constructor(message, option = null, value = null) {
    super(message, "CONFIGURATION_ERROR", { option, value });
    this.name = "ConfigurationError";
    this.option = option;
    this.value = value;
  }
}

/**
 * Resource limit errors
 */
export class ResourceLimitError extends GitIngestError {
  constructor(message, resource, limit, actual) {
    super(message, "RESOURCE_LIMIT_ERROR", { resource, limit, actual });
    this.name = "ResourceLimitError";
    this.resource = resource;
    this.limit = limit;
    this.actual = actual;
  }
}

/**
 * Error handler class with enhanced formatting and suggestions
 */
export class ErrorHandler {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.quiet = options.quiet || false;
  }

  /**
   * Handle and format errors for display
   */
  handle(error, exitProcess = false) {
    if (this.quiet) {
      if (exitProcess) process.exit(1);
      return;
    }

    // Format error message
    const formattedError = this.formatError(error);
    console.error(formattedError.message);

    // Show suggestions if available
    if (formattedError.suggestions.length > 0) {
      console.error(chalk.yellow("\n💡 Suggestions:"));
      formattedError.suggestions.forEach((suggestion, index) => {
        console.error(chalk.yellow(`   ${index + 1}. ${suggestion}`));
      });
    }

    // Show stack trace in verbose mode
    if (this.verbose && error.stack) {
      console.error(chalk.gray("\nStack trace:"));
      console.error(chalk.gray(error.stack));
    }

    // Show additional details for custom errors
    if (error instanceof GitIngestError && this.verbose) {
      console.error(chalk.gray("\nError details:"));
      console.error(chalk.gray(JSON.stringify(error.details, null, 2)));
    }

    if (exitProcess) {
      process.exit(1);
    }
  }

  /**
   * Format error message with icon and color
   */
  formatError(error) {
    const message = chalk.red("❌ Error: ") + error.message;
    const suggestions = [];

    // Add specific formatting and suggestions based on error type
    if (error instanceof DirectoryError) {
      suggestions.push("Verify the directory path exists and is accessible");
      suggestions.push("Check file system permissions");
      if (error.path) {
        suggestions.push(
          `Try using an absolute path: ${path.resolve(error.path)}`
        );
      }
    } else if (error instanceof FileProcessingError) {
      suggestions.push(
        "Check if the file is corrupted or in use by another process"
      );
      suggestions.push("Verify file permissions");
      if (error.filePath) {
        suggestions.push(
          `Try excluding this file with --exclude "${path.basename(error.filePath)}"`
        );
      }
    } else if (error instanceof ConfigurationError) {
      suggestions.push("Review the command line options");
      suggestions.push("Check the configuration file syntax if using --config");
      if (error.option && error.value) {
        suggestions.push(
          `Invalid value "${error.value}" for option "${error.option}"`
        );
      }
    } else if (error instanceof ResourceLimitError) {
      suggestions.push(`Consider increasing the ${error.resource} limit`);
      suggestions.push("Try excluding large files or directories");
      if (error.resource === "memory") {
        suggestions.push("Process smaller directories at a time");
      }
    } else {
      // Handle Node.js system errors
      switch (error.code) {
        case "ENOENT":
          suggestions.push("Verify the file or directory exists");
          suggestions.push("Check for typos in the path");
          break;
        case "EACCES":
          suggestions.push("Check file/directory permissions");
          suggestions.push("Run with appropriate user privileges");
          break;
        case "EMFILE":
        case "ENFILE":
          suggestions.push(
            "Too many open files - try processing smaller directories"
          );
          suggestions.push("Increase system file descriptor limits");
          break;
        case "ENOSPC":
          suggestions.push("Insufficient disk space");
          suggestions.push("Free up disk space and try again");
          break;
        case "ENOMEM":
          suggestions.push("Insufficient memory");
          suggestions.push("Try processing smaller directories");
          suggestions.push("Increase system memory or reduce --max-size limit");
          break;
        default:
          if (error.message.includes("clipboard")) {
            suggestions.push("Install clipboard tools for your platform:");
            suggestions.push("  macOS: pbcopy (built-in)");
            suggestions.push("  Linux: xclip or xsel");
            suggestions.push("  Windows: clip (built-in)");
          }
      }
    }

    return { message, suggestions };
  }

  /**
   * Wrap async functions with error handling
   */
  async wrapAsync(fn, context = "operation") {
    try {
      return await fn();
    } catch (error) {
      throw new GitIngestError(
        `Failed to ${context}: ${error.message}`,
        "WRAPPED_ERROR",
        {
          context,
          originalError: error.message
        }
      );
    }
  }

  /**
   * Wrap async functions with error handling
   */
  safeAsyncWrapper(fn, context = "operation") {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        throw new GitIngestError(
          `Failed to ${context}: ${error.message}`,
          "WRAPPED_ERROR",
          {
            context,
            originalError: error.message
          }
        );
      }
    };
  }

  /**
   * Create a safe wrapper for file operations
   */
  safeFileOperation(operation, filePath) {
    return async (...args) => {
      try {
        return await operation(...args);
      } catch (error) {
        throw new FileProcessingError(
          `Failed to process file: ${error.message}`,
          filePath,
          error
        );
      }
    };
  }

  /**
   * Create a safe wrapper for directory operations
   */
  safeDirectoryOperation(operation, dirPath) {
    return async (...args) => {
      try {
        return await operation(...args);
      } catch (error) {
        throw new DirectoryError(
          `Failed to access directory: ${error.message}`,
          dirPath,
          error
        );
      }
    };
  }

  /**
   * Validate and throw configuration error if invalid
   */
  validateConfig(condition, message, option = null, value = null) {
    if (!condition) {
      throw new ConfigurationError(message, option, value);
    }
  }

  /**
   * Check resource limits and throw error if exceeded
   */
  checkResourceLimit(actual, limit, resource) {
    if (actual > limit) {
      throw new ResourceLimitError(
        `${resource} limit exceeded: ${actual} > ${limit}`,
        resource,
        limit,
        actual
      );
    }
  }

  /**
   * Log warning message
   */
  warn(message) {
    if (!this.quiet) {
      console.warn(chalk.yellow("⚠️  Warning: ") + message);
    }
  }

  /**
   * Log info message
   */
  info(message) {
    if (!this.quiet) {
      console.log(chalk.blue("ℹ️  Info: ") + message);
    }
  }

  /**
   * Log success message
   */
  success(message) {
    if (!this.quiet) {
      console.log(chalk.green("✅ ") + message);
    }
  }
}

/**
 * Global error handlers for uncaught exceptions
 */
export function setupGlobalErrorHandlers(errorHandler) {
  process.on("uncaughtException", (error) => {
    console.error(chalk.red("💥 Uncaught Exception:"));
    errorHandler.handle(error, true);
  });

  process.on("unhandledRejection", (error) => {
    console.error(chalk.red("💥 Unhandled Rejection:"));
    errorHandler.handle(error, true);
  });
}

/**
 * Utility function to create error handler with options
 */
export function createErrorHandler(options = {}) {
  return new ErrorHandler(options);
}
