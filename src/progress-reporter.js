/**
 * Enhanced progress reporting system for git-ingest
 * Provides detailed progress tracking with estimates and statistics
 */

import ora from "ora";
import chalk from "chalk";

/**
 * Progress reporter with enhanced features
 */
export class ProgressReporter {
  constructor(options = {}) {
    this.quiet = options.quiet || false;
    this.verbose = options.verbose || false;
    this.currentSpinner = null;
    this.startTime = null;
    this.stats = {
      startTime: new Date(),
      filesProcessed: 0,
      filesSkipped: 0,
      errors: 0,
      totalBytes: 0,
      totalFiles: 0,
      estimatedTotalBytes: 0
    };
  }

  /**
   * Start a new progress operation
   */
  start(message, totalItems = null) {
    if (this.quiet) return;

    this.startTime = Date.now();
    this.stats.totalFiles = totalItems || 0;

    if (this.currentSpinner) {
      this.currentSpinner.stop();
    }

    this.currentSpinner = ora(message).start();
    return this.currentSpinner;
  }

  /**
   * Update progress with current status
   */
  update(message, completed = null, total = null) {
    if (this.quiet || !this.currentSpinner) return;

    let progressText = message;

    if (completed !== null && total !== null && total > 0) {
      const percentage = Math.round((completed / total) * 100);
      const progressBar = this.createProgressBar(completed, total);
      progressText = `${message} ${progressBar} ${percentage}% (${completed}/${total})`;

      // Add time estimate
      const timeEstimate = this.calculateTimeEstimate(completed, total);
      if (timeEstimate) {
        progressText += ` ETA: ${timeEstimate}`;
      }
    }

    this.currentSpinner.text = progressText;
  }

  /**
   * Mark current operation as successful
   */
  succeed(message = null) {
    if (this.quiet || !this.currentSpinner) return;

    const finalMessage = message || this.currentSpinner.text;
    this.currentSpinner.succeed(finalMessage);
    this.currentSpinner = null;
  }

  /**
   * Mark current operation as failed
   */
  fail(message = null) {
    if (this.quiet || !this.currentSpinner) return;

    const finalMessage = message || this.currentSpinner.text;
    this.currentSpinner.fail(finalMessage);
    this.currentSpinner = null;
  }

  /**
   * Stop current spinner without status
   */
  stop() {
    if (this.currentSpinner) {
      this.currentSpinner.stop();
      this.currentSpinner = null;
    }
  }

  /**
   * Report file processing progress
   */
  reportFileProgress(filePath, sizeBytes, status = "processed") {
    this.stats.totalBytes += sizeBytes;

    switch (status) {
      case "processed":
        this.stats.filesProcessed++;
        break;
      case "skipped":
        this.stats.filesSkipped++;
        break;
      case "error":
        this.stats.errors++;
        break;
    }

    if (this.verbose) {
      const sizeFormatted = this.formatBytes(sizeBytes);
      const icon = this.getStatusIcon(status);
      const relativePath = this.getRelativePath(filePath);
      console.log(`${icon} ${status} ${relativePath} (${sizeFormatted})`);
    }

    // Update spinner with current progress
    if (this.stats.totalFiles > 0) {
      const completed =
        this.stats.filesProcessed + this.stats.filesSkipped + this.stats.errors;
      this.update("Processing files...", completed, this.stats.totalFiles);
    }
  }

  /**
   * Report final summary
   */
  reportSummary() {
    if (this.quiet) return;

    const duration = this.startTime ? Date.now() - this.startTime : 0;
    const durationFormatted = this.formatDuration(duration);

    console.log(chalk.green("\n📊 Processing Summary:"));
    console.log(
      chalk.green(`   ✅ Processed: ${this.stats.filesProcessed} files`)
    );

    if (this.stats.filesSkipped > 0) {
      console.log(
        chalk.yellow(`   ⏭️  Skipped: ${this.stats.filesSkipped} files`)
      );
    }

    if (this.stats.errors > 0) {
      console.log(chalk.red(`   ❌ Errors: ${this.stats.errors} files`));
    }

    console.log(
      chalk.blue(`   📁 Total size: ${this.formatBytes(this.stats.totalBytes)}`)
    );
    console.log(chalk.blue(`   ⏱️  Duration: ${durationFormatted}`));

    if (this.stats.totalBytes > 0 && duration > 0) {
      const throughput = this.stats.totalBytes / (duration / 1000);
      console.log(
        chalk.blue(`   🚀 Throughput: ${this.formatBytes(throughput)}/s`)
      );
    }
  }

  /**
   * Create a simple progress bar
   */
  createProgressBar(completed, total, width = 20) {
    const progress = Math.min(completed / total, 1);
    const filledWidth = Math.round(progress * width);
    const emptyWidth = width - filledWidth;

    const filled = "█".repeat(filledWidth);
    const empty = "░".repeat(emptyWidth);

    return chalk.cyan(`[${filled}${empty}]`);
  }

  /**
   * Calculate estimated time remaining
   */
  calculateTimeEstimate(completed, total) {
    if (!this.startTime || completed === 0) return null;

    const elapsed = Date.now() - this.startTime;
    const rate = completed / elapsed;
    const remaining = total - completed;
    const estimatedMs = remaining / rate;

    return this.formatDuration(estimatedMs);
  }

  /**
   * Get estimated time remaining for processing
   */
  getEstimatedTimeRemaining(totalFiles) {
    const completed =
      this.stats.filesProcessed + this.stats.filesSkipped + this.stats.errors;
    if (completed === 0) return 0;

    // Use stats.startTime instead of this.startTime for consistent timing
    const startTime = this.stats.startTime.getTime();
    const elapsed = Date.now() - startTime;

    if (elapsed === 0) return 1; // Return small positive value if no time has elapsed yet

    const rate = completed / elapsed;
    const remaining = totalFiles - completed;

    return remaining / rate;
  }

  /**
   * Update progress with current status
   */
  updateProgress(completed, total, message = "Processing...") {
    this.update(message, completed, total);
  }

  /**
   * Format duration in human-readable format
   */
  formatDuration(ms) {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000)
      return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;

    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }

  /**
   * Format bytes in human-readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return "0B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(1)}${sizes[i]}`;
  }

  /**
   * Get status icon for file processing
   */
  getStatusIcon(status) {
    switch (status) {
      case "processed":
        return chalk.green("✅");
      case "skipped":
        return chalk.yellow("⏭️");
      case "error":
        return chalk.red("❌");
      default:
        return "ℹ️";
    }
  }

  /**
   * Get relative path for display
   */
  getRelativePath(filePath) {
    try {
      const path = require("path");
      return path.relative(process.cwd(), filePath);
    } catch {
      return filePath;
    }
  }

  /**
   * Log verbose message
   */
  verbose(message) {
    if (this.verbose && !this.quiet) {
      console.log(chalk.gray(`🔍 ${message}`));
    }
  }

  /**
   * Log information message
   */
  info(message) {
    if (!this.quiet) {
      console.log(chalk.blue(`ℹ️  ${message}`));
    }
  }

  /**
   * Log warning message
   */
  warn(message) {
    if (!this.quiet) {
      console.warn(chalk.yellow(`⚠️  ${message}`));
    }
  }

  /**
   * Log error message
   */
  error(message) {
    if (!this.quiet) {
      console.error(chalk.red(`❌ ${message}`));
    }
  }

  /**
   * Log success message
   */
  success(message) {
    if (!this.quiet) {
      console.log(chalk.green(`✅ ${message}`));
    }
  }

  /**
   * Get current statistics
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      startTime: new Date(),
      filesProcessed: 0,
      filesSkipped: 0,
      errors: 0,
      totalBytes: 0,
      totalFiles: 0,
      estimatedTotalBytes: 0
    };
    this.startTime = null;
  }
}

/**
 * Create a progress reporter with options
 */
export function createProgressReporter(options = {}) {
  return new ProgressReporter(options);
}
