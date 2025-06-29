#!/usr/bin/env node

import { Command } from "commander";
import clipboardy from "clipboardy";
import chalk from "chalk";
import ora from "ora";
import fs from "fs/promises";
import path from "path";
import { saveTreeToFile, getAllFilePaths } from "./tree-generator.js";
import { appendFileContentsToTree } from "./read-file-and-append.js";

// Version from package.json
const packageJson = JSON.parse(
  await fs.readFile(new URL("../package.json", import.meta.url), "utf-8")
);

const program = new Command();

// Configure CLI
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
      await processDirectory(directory, options);
    } catch (error) {
      handleError(error, options.verbose);
      process.exit(1);
    }
  });

// Input validation functions
async function validateDirectory(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) {
      throw new Error(`Path '${dirPath}' is not a directory`);
    }

    // Check read permissions
    await fs.access(dirPath, fs.constants.R_OK);
    return path.resolve(dirPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Directory '${dirPath}' does not exist`);
    }
    if (error.code === "EACCES") {
      throw new Error(`Permission denied: Cannot read directory '${dirPath}'`);
    }
    throw error;
  }
}

function validateOptions(options) {
  // Validate max file size
  if (options.maxSize) {
    const size = parseFloat(options.maxSize);
    if (Number.isNaN(size) || size <= 0) {
      throw new Error("Maximum file size must be a positive number");
    }
  }

  // Validate format
  const validFormats = ["text", "json", "markdown"];
  if (!validFormats.includes(options.format)) {
    throw new Error(
      `Invalid format '${options.format}'. Valid formats: ${validFormats.join(", ")}`
    );
  }
}

// Generate timestamped filename
function generateFileName(options) {
  if (options.output) {
    return options.output;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const extension = options.format === "json" ? "json" : "txt";
  return `git-ingest-${timestamp}.${extension}`;
}

// Main processing function
async function processDirectory(directory, options) {
  const spinner = options.quiet ? null : ora("Initializing...").start();

  try {
    // Validate inputs
    const targetDir = await validateDirectory(directory);
    validateOptions(options);

    if (spinner) {
      spinner.text = "Validating directory...";
      spinner.succeed(`Directory validated: ${chalk.blue(targetDir)}`);
    }

    const fileName = generateFileName(options);

    if (!options.quiet) {
      console.log(chalk.cyan(`\n🔍 Analyzing project: ${targetDir}`));
      console.log(chalk.cyan(`📄 Output file: ${fileName}`));
    }

    // Generate directory tree
    const treeSpinner = options.quiet ? null : ora("Generating directory tree...").start();
    await saveTreeToFile(targetDir, fileName, options);
    if (treeSpinner) {
      treeSpinner.succeed("Directory tree generated");
    }

    // Get file paths and process content
    const pathsSpinner = options.quiet ? null : ora("Discovering files...").start();
    const filePaths = await getAllFilePaths(targetDir, options);
    if (pathsSpinner) {
      pathsSpinner.succeed(`Found ${chalk.yellow(filePaths.length)} files`);
    }

    // Append file contents
    const contentSpinner = options.quiet ? null : ora("Processing file contents...").start();
    await appendFileContentsToTree(filePaths, fileName, options);
    if (contentSpinner) {
      contentSpinner.succeed("File contents processed");
    }

    // Handle clipboard copy
    if (options.copy) {
      const clipSpinner = options.quiet ? null : ora("Copying to clipboard...").start();
      try {
        const content = await fs.readFile(fileName, "utf-8");
        await clipboardy.write(content);
        if (clipSpinner) {
          clipSpinner.succeed("Content copied to clipboard");
        }
      } catch (clipError) {
        if (clipSpinner) {
          clipSpinner.fail("Failed to copy to clipboard");
        }
        console.warn(chalk.yellow("⚠️  Clipboard operation failed:"), clipError.message);
        console.warn(chalk.yellow("💡 Try installing clipboard tools for your platform:"));
        console.warn(chalk.yellow("   macOS: pbcopy (built-in)"));
        console.warn(chalk.yellow("   Linux: xclip or xsel"));
        console.warn(chalk.yellow("   Windows: clip (built-in)"));
      }
    }

    // Success message
    if (!options.quiet) {
      console.log(chalk.green(`\n✅ File generated successfully: ${fileName}`));

      if (!options.copy) {
        console.log(chalk.gray("💡 Use --copy flag to copy content to clipboard"));
      }

      // Show file stats
      const stats = await fs.stat(fileName);
      console.log(chalk.gray(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`));
      console.log(chalk.gray(`📁 Files processed: ${filePaths.length}`));
    }
  } catch (error) {
    if (spinner) {
      spinner.fail("Operation failed");
    }
    throw error;
  }
}

// Enhanced error handling
function handleError(error, verbose = false) {
  console.error(chalk.red("❌ Error:"), error.message);

  if (verbose && error.stack) {
    console.error(chalk.gray("\nStack trace:"));
    console.error(chalk.gray(error.stack));
  }

  // Provide helpful suggestions based on error type
  if (error.code === "ENOENT") {
    console.error(chalk.yellow("💡 Make sure the directory path is correct"));
  } else if (error.code === "EACCES") {
    console.error(chalk.yellow("💡 Check file/directory permissions"));
  } else if (error.message.includes("not a directory")) {
    console.error(chalk.yellow("💡 Ensure you're pointing to a directory, not a file"));
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error(chalk.red("💥 Uncaught Exception:"), error.message);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error(chalk.red("💥 Unhandled Rejection:"), error.message);
  process.exit(1);
});

// Parse command line arguments
program.parse();
