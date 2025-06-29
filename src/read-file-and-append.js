import fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import chalk from "chalk";
import { shouldSkipForContent } from "./tree-generator.js";
import { Config } from "./config.js";

// Format file header with metadata
function formatFileHeader(filePath, config = null) {
  const cfg = config || new Config();
  const relativePath = path.relative(process.cwd(), filePath);
  const separator = cfg.createSeparator();

  return `${separator}\nFile: ${relativePath}\n${separator}\n`;
}

// Handle binary or large file placeholders
function createFilePlaceholder(filePath, skipInfo, config = null) {
  const cfg = config || new Config();
  const relativePath = path.relative(process.cwd(), filePath);
  const separator = cfg.createSeparator();

  return `${separator}\nFile: ${relativePath}\n${separator}\n[${skipInfo.reason}]\n\n`;
}

// Truncate large text files
async function readFileWithTruncation(filePath, config = null) {
  const cfg = config || new Config();
  const maxSize = cfg.options.TRUNCATE_SIZE_BYTES;

  try {
    const handle = await fs.open(filePath, "r");
    const buffer = Buffer.alloc(maxSize);
    const { bytesRead } = await handle.read(buffer, 0, maxSize, 0);
    await handle.close();

    const content = buffer.subarray(0, bytesRead).toString("utf8");

    // Check if file was truncated
    const stats = await fs.stat(filePath);
    if (stats.size > maxSize) {
      const truncatedMessage = `\n\n[File truncated - showing first ${cfg.formatFileSize(maxSize)} of ${cfg.formatFileSize(stats.size)} total]`;
      return content + truncatedMessage;
    }

    return content;
  } catch (error) {
    throw new Error(`Error reading file ${filePath}: ${error.message}`);
  }
}

// Stream-based file content appending for memory efficiency
async function appendFileContentsToTree(
  filePaths,
  outputFilePath,
  options = {}
) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    if (options.verbose) {
      console.log(chalk.yellow("📝 No files to process"));
    }
    return;
  }

  const config = options.config || new Config();

  // Handle legacy maxSize option for backward compatibility
  if (options.maxSize !== undefined && !options.config) {
    config.options.MAX_FILE_SIZE_MB = options.maxSize;
    config.maxFileSizeBytes = config.options.MAX_FILE_SIZE_MB * 1024 * 1024;
  }

  const progress = options.progress;

  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    // Create write stream for efficient appending
    const writeStream = createWriteStream(outputFilePath, {
      flags: "a",
      encoding: "utf8"
    });

    for (const filePath of filePaths) {
      try {
        // Check if file should be skipped (binary, too large, etc.)
        const skipInfo = shouldSkipForContent(filePath, { ...options, config });

        if (skipInfo.skip) {
          // Write placeholder for skipped files
          const placeholder = createFilePlaceholder(filePath, skipInfo, config);
          writeStream.write(placeholder);
          skippedCount++;

          if (progress) {
            progress.reportFileProgress(filePath, 0, "skipped");
          }

          if (options.verbose) {
            console.log(
              chalk.yellow(
                `⏭️  Skipped ${path.relative(process.cwd(), filePath)}: ${skipInfo.reason}`
              )
            );
          }
          continue;
        }

        // Write file header
        const header = formatFileHeader(filePath, config);
        writeStream.write(header);

        // Read and write file content
        try {
          let content;
          const stats = await fs.stat(filePath);

          if (stats.size > config.maxFileSizeBytes) {
            // Use truncation for very large files
            content = await readFileWithTruncation(filePath, config);
          } else {
            // Read normal files completely
            content = await fs.readFile(filePath, "utf8");
          }

          writeStream.write(content);
          writeStream.write("\n\n");

          processedCount++;

          if (progress) {
            progress.reportFileProgress(filePath, stats.size, "processed");
          }

          if (options.verbose) {
            const sizeFormatted = config.formatFileSize(stats.size);
            console.log(
              chalk.green(
                `✅ Processed ${path.relative(process.cwd(), filePath)} (${sizeFormatted})`
              )
            );
          }
        } catch (readError) {
          // Handle file read errors gracefully
          const errorMessage = `Error reading file: ${readError.message}`;
          writeStream.write(`${errorMessage}\n\n`);
          errorCount++;

          if (progress) {
            progress.reportFileProgress(filePath, 0, "error");
          }

          if (options.verbose) {
            console.warn(
              chalk.red(
                `❌ Error reading ${path.relative(process.cwd(), filePath)}: ${readError.message}`
              )
            );
          }
        }
      } catch (fileError) {
        errorCount++;
        if (progress) {
          progress.reportFileProgress(filePath, 0, "error");
        }
        if (options.verbose) {
          console.warn(
            chalk.red(
              `❌ Error processing ${path.relative(process.cwd(), filePath)}: ${fileError.message}`
            )
          );
        }
      }
    }

    // Close the write stream
    await new Promise((resolve, reject) => {
      writeStream.end((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Log summary
    if (!options.quiet) {
      console.log(chalk.green("\n📊 File processing summary:"));
      console.log(chalk.green(`   ✅ Processed: ${processedCount} files`));
      if (skippedCount > 0) {
        console.log(chalk.yellow(`   ⏭️  Skipped: ${skippedCount} files`));
      }
      if (errorCount > 0) {
        console.log(chalk.red(`   ❌ Errors: ${errorCount} files`));
      }
    }
  } catch (error) {
    throw new Error(`Failed to append file contents: ${error.message}`);
  }
}

// Alternative streaming implementation for very large projects
async function appendFileContentsStreaming(
  filePaths,
  outputFilePath,
  options = {}
) {
  const writeStream = createWriteStream(outputFilePath, { flags: "a" });

  try {
    for (const filePath of filePaths) {
      const skipInfo = shouldSkipForContent(filePath, options);

      if (skipInfo.skip) {
        const placeholder = createFilePlaceholder(filePath, skipInfo);
        writeStream.write(placeholder);
        continue;
      }

      // Write header
      const header = formatFileHeader(filePath);
      writeStream.write(header);

      try {
        // Stream file content directly
        const readStream = createReadStream(filePath, { encoding: "utf8" });
        await pipeline(readStream, writeStream, { end: false });
        writeStream.write("\n\n");
      } catch (streamError) {
        writeStream.write(`Error streaming file: ${streamError.message}\n\n`);
      }
    }
  } finally {
    writeStream.end();
  }
}

// Utility function to get file processing statistics
async function getFileStats(filePaths, options = {}) {
  // Handle legacy maxSize option for backward compatibility
  let config = options.config || new Config();
  if (options.maxSize !== undefined && !options.config) {
    config = new Config();
    config.options.MAX_FILE_SIZE_MB = options.maxSize;
    config.maxFileSizeBytes = config.options.MAX_FILE_SIZE_MB * 1024 * 1024;
    options = { ...options, config };
  }

  let totalSize = 0;
  let textFiles = 0;
  let binaryFiles = 0;
  let largeFiles = 0;

  for (const filePath of filePaths) {
    try {
      const stats = await fs.stat(filePath);
      totalSize += stats.size;

      const skipInfo = shouldSkipForContent(filePath, options);
      if (skipInfo.skip) {
        if (skipInfo.reason.includes("Binary")) {
          binaryFiles++;
        } else if (skipInfo.reason.includes("too large")) {
          largeFiles++;
        }
      } else {
        textFiles++;
      }
    } catch {
      // Skip files that can't be accessed
    }
  }

  return {
    totalFiles: filePaths.length,
    textFiles,
    binaryFiles,
    largeFiles,
    totalSizeBytes: totalSize,
    totalSizeMB: totalSize / (1024 * 1024)
  };
}

export { appendFileContentsToTree, appendFileContentsStreaming, getFileStats };
