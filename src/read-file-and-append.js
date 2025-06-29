import fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import chalk from "chalk";
import { shouldSkipForContent } from "./tree-generator.js";

// Configuration constants
const DEFAULT_MAX_FILE_SIZE_MB = 10;
const CONTENT_TRUNCATE_SIZE = 1024 * 1024; // 1MB truncation point for large files
const SEPARATOR_LENGTH = 48;

// Create separator line
function createSeparator(char = "=", length = SEPARATOR_LENGTH) {
  return char.repeat(length);
}

// Format file header with metadata
function formatFileHeader(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  const separator = createSeparator();

  return `${separator}\nFile: ${relativePath}\n${separator}\n`;
}

// Handle binary or large file placeholders
function createFilePlaceholder(filePath, skipInfo) {
  const relativePath = path.relative(process.cwd(), filePath);
  const separator = createSeparator();

  return `${separator}\nFile: ${relativePath}\n${separator}\n[${skipInfo.reason}]\n\n`;
}

// Truncate large text files
async function readFileWithTruncation(filePath, maxSize = CONTENT_TRUNCATE_SIZE) {
  try {
    const handle = await fs.open(filePath, "r");
    const buffer = Buffer.alloc(maxSize);
    const { bytesRead } = await handle.read(buffer, 0, maxSize, 0);
    await handle.close();

    const content = buffer.subarray(0, bytesRead).toString("utf8");

    // Check if file was truncated
    const stats = await fs.stat(filePath);
    if (stats.size > maxSize) {
      const truncatedMessage = `\n\n[File truncated - showing first ${(maxSize / 1024).toFixed(0)}KB of ${(stats.size / 1024).toFixed(0)}KB total]`;
      return content + truncatedMessage;
    }

    return content;
  } catch (error) {
    throw new Error(`Error reading file ${filePath}: ${error.message}`);
  }
}

// Stream-based file content appending for memory efficiency
async function appendFileContentsToTree(filePaths, outputFilePath, options = {}) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    if (options.verbose) {
      console.log(chalk.yellow("📝 No files to process"));
    }
    return;
  }

  const maxFileSize = (options.maxSize || DEFAULT_MAX_FILE_SIZE_MB) * 1024 * 1024;
  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    // Create write stream for efficient appending
    const writeStream = createWriteStream(outputFilePath, { flags: "a", encoding: "utf8" });

    for (const filePath of filePaths) {
      try {
        // Check if file should be skipped (binary, too large, etc.)
        const skipInfo = shouldSkipForContent(filePath, options);

        if (skipInfo.skip) {
          // Write placeholder for skipped files
          const placeholder = createFilePlaceholder(filePath, skipInfo);
          writeStream.write(placeholder);
          skippedCount++;

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
        const header = formatFileHeader(filePath);
        writeStream.write(header);

        // Read and write file content
        try {
          let content;
          const stats = await fs.stat(filePath);

          if (stats.size > maxFileSize) {
            // Use truncation for very large files
            content = await readFileWithTruncation(filePath, CONTENT_TRUNCATE_SIZE);
          } else {
            // Read normal files completely
            content = await fs.readFile(filePath, "utf8");
          }

          writeStream.write(content);
          writeStream.write("\n\n");

          processedCount++;

          if (options.verbose) {
            const sizeKB = (stats.size / 1024).toFixed(1);
            console.log(
              chalk.green(`✅ Processed ${path.relative(process.cwd(), filePath)} (${sizeKB}KB)`)
            );
          }
        } catch (readError) {
          // Handle file read errors gracefully
          const errorMessage = `Error reading file: ${readError.message}`;
          writeStream.write(`${errorMessage}\n\n`);
          errorCount++;

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
async function appendFileContentsStreaming(filePaths, outputFilePath, options = {}) {
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
    totalSizeMB: totalSize / (1024 * 1024),
  };
}

export { appendFileContentsToTree, appendFileContentsStreaming, getFileStats };
