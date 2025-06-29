#!/usr/bin/env node

import { Command } from "commander";
import clipboardy from "clipboardy";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";
import { saveTreeToFile, getAllFilePaths } from "./tree-generator.js";
import { appendFileContentsToTree } from "./read-file-and-append.js";
import { Config } from "./config.js";
import { createErrorHandler, setupGlobalErrorHandlers, DirectoryError } from "./error-handler.js";
import { createProgressReporter } from "./progress-reporter.js";

// Version from package.json
const packageJson = JSON.parse(
  await fs.readFile(new URL("../package.json", import.meta.url), "utf-8")
);

/**
 * Main application class
 */
class GitIngestApp {
  constructor() {
    this.config = null;
    this.errorHandler = null;
    this.progress = null;
  }

  /**
   * Initialize the application with options
   */
  async initialize(options) {
    // Create configuration
    this.config = await this.createConfig(options);

    // Create error handler
    this.errorHandler = createErrorHandler({
      verbose: options.verbose,
      quiet: options.quiet,
    });

    // Setup global error handlers
    setupGlobalErrorHandlers(this.errorHandler);

    // Create progress reporter
    this.progress = createProgressReporter({
      verbose: options.verbose,
      quiet: options.quiet,
    });
  }

  /**
   * Create configuration from options
   */
  async createConfig(options) {
    let config = new Config();

    // Load from config file if specified
    if (options.config) {
      try {
        config = await Config.loadFromFile(options.config);
        this.progress?.verbose(`Loaded configuration from ${options.config}`);
      } catch (error) {
        this.errorHandler?.warn(`Could not load config file: ${error.message}`);
      }
    }

    // Override with command line options
    const overrides = {};
    if (options.maxSize) {
      overrides.MAX_FILE_SIZE_MB = parseFloat(options.maxSize);
    }

    return config.clone(overrides);
  }

  /**
   * Validate directory path
   */
  async validateDirectory(dirPath) {
    const resolvedPath = path.resolve(dirPath);

    try {
      const stats = await fs.stat(resolvedPath);
      this.errorHandler.validateConfig(
        stats.isDirectory(),
        `Path '${dirPath}' is not a directory`,
        "directory",
        dirPath
      );

      // Check read permissions
      await fs.access(resolvedPath, fs.constants.R_OK);
      return resolvedPath;
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new DirectoryError(`Directory '${dirPath}' does not exist`, dirPath, error);
      }
      if (error.code === "EACCES") {
        throw new DirectoryError(
          `Permission denied: Cannot read directory '${dirPath}'`,
          dirPath,
          error
        );
      }
      throw error;
    }
  }

  /**
   * Validate CLI options
   */
  validateOptions(options) {
    // Validate max file size
    if (options.maxSize) {
      const size = parseFloat(options.maxSize);
      this.errorHandler.validateConfig(
        !Number.isNaN(size) && size > 0,
        "Maximum file size must be a positive number",
        "maxSize",
        options.maxSize
      );
    }

    // Validate format
    this.errorHandler.validateConfig(
      this.config.options.OUTPUT_FORMATS.includes(options.format),
      `Invalid format '${options.format}'. Valid formats: ${this.config.options.OUTPUT_FORMATS.join(", ")}`,
      "format",
      options.format
    );
  }

  /**
   * Generate output filename
   */
  generateFileName(options) {
    if (options.output) {
      return options.output;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const extension = options.format === "json" ? "json" : "txt";
    return `git-ingest-${timestamp}.${extension}`;
  } /**
   * Process directory and generate output
   */
  async processDirectory(directory, options) {
    try {
      // Initialize application first - this is needed for all operations
      await this.initialize(options);

      // Validate inputs
      const targetDir = await this.validateDirectory(directory);
      this.validateOptions(options);

      this.progress.success(`Directory validated: ${chalk.blue(targetDir)}`);

      const fileName = this.generateFileName(options);

      if (!options.quiet) {
        console.log(chalk.cyan(`\n🔍 Analyzing project: ${targetDir}`));
        console.log(chalk.cyan(`📄 Output file: ${fileName}`));
      }

      // Generate directory tree
      this.progress.start("Generating directory tree...");
      await saveTreeToFile(targetDir, fileName, { ...options, config: this.config });
      this.progress.succeed("Directory tree generated");

      // Get file paths and process content
      this.progress.start("Discovering files...");
      const filePaths = await getAllFilePaths(targetDir, { ...options, config: this.config });
      this.progress.succeed(`Found ${chalk.yellow(filePaths.length)} files`);

      // Append file contents with enhanced progress tracking
      this.progress.start("Processing file contents...", filePaths.length);
      await appendFileContentsToTree(filePaths, fileName, {
        ...options,
        config: this.config,
        progress: this.progress,
      });
      this.progress.succeed("File contents processed");

      // Handle clipboard copy
      if (options.copy) {
        await this.handleClipboardCopy(fileName);
      }

      // Show success message and statistics
      await this.showSuccessMessage(fileName, filePaths.length);
      this.progress.reportSummary();
    } catch (error) {
      this.errorHandler?.handle(error);
      throw error;
    }
  }

  /**
   * Handle clipboard copy operation
   */
  async handleClipboardCopy(fileName) {
    this.progress.start("Copying to clipboard...");
    try {
      const content = await fs.readFile(fileName, "utf-8");
      await clipboardy.write(content);
      this.progress.succeed("Content copied to clipboard");
    } catch (clipError) {
      this.progress.fail("Failed to copy to clipboard");
      this.errorHandler.warn("Clipboard operation failed: " + clipError.message);
      this.errorHandler.info("Try installing clipboard tools for your platform:");
      this.errorHandler.info("  macOS: pbcopy (built-in)");
      this.errorHandler.info("  Linux: xclip or xsel");
      this.errorHandler.info("  Windows: clip (built-in)");
    }
  }

  /**
   * Show success message with file statistics
   */
  async showSuccessMessage(fileName, fileCount) {
    if (this.config?.options && !this.config.options.quiet) {
      this.progress.success(`File generated successfully: ${fileName}`);

      if (!this.config.options.copy) {
        this.progress.info("Use --copy flag to copy content to clipboard");
      }

      // Show file stats
      try {
        const stats = await fs.stat(fileName);
        const formattedSize = this.config.formatFileSize(stats.size);
        this.progress.info(`File size: ${formattedSize}`);
        this.progress.info(`Files processed: ${fileCount}`);
      } catch (error) {
        this.errorHandler.warn(`Could not read file stats: ${error.message}`);
      }
    }
  }
}

// Create and configure CLI
const program = new Command();
const app = new GitIngestApp();

program
  .name("git-ingest")
  .description("A powerful CLI tool for analyzing and ingesting project codebases")
  .version(packageJson.version)
  .argument("[directory]", "Target directory to analyze", "./")
  .option("-o, --output <filename>", "Specify output filename")
  .option("-c, --copy", "Copy output to clipboard")
  .option("-f, --format <type>", "Output format (text, json, markdown)", "text")
  .option("-i, --include <patterns...>", "Include files matching patterns")
  .option("-e, --exclude <patterns...>", "Exclude files matching patterns")
  .option("--max-size <size>", "Maximum file size to include (in MB)", "10")
  .option("--config <file>", "Use configuration file")
  .option("-v, --verbose", "Verbose output")
  .option("-q, --quiet", "Quiet mode")
  .action(async (directory, options) => {
    try {
      await app.processDirectory(directory, options);
    } catch {
      // Error already handled by app.processDirectory
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();
