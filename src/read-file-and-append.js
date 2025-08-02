import fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import pLimit from "p-limit";
import { shouldSkipForContent } from "./tree-generator.js";
import { Config } from "./config.js";
import { theme } from "./theme.js";
import { PERFORMANCE_CONSTANTS, MESSAGES } from "./constants.js";

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

// Stream-based file content appending for memory efficiency with concurrency control
async function appendFileContentsToTree(
  filePaths,
  outputFilePath,
  options = {}
) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    if (options.verbose) {
      console.log(theme.warning("📝 No files to process"));
    }
    return;
  }

  const config = options.config || new Config();

  // Handle legacy maxSize option for backward compatibility
  if (options.maxSize !== undefined && !options.config) {
    config.options.MAX_FILE_SIZE_MB = options.maxSize;
    config.maxFileSizeBytes = config.options.MAX_FILE_SIZE_MB * 1024 * 1024;
  }

  const { progress } = options;

  // Create concurrency limiter based on performance constants
  const concurrencyLimit = Math.min(
    PERFORMANCE_CONSTANTS.DEFAULT_CONCURRENCY_LIMIT,
    Math.max(1, Math.floor(filePaths.length / 10)) // Dynamic scaling
  );
  const limit = pLimit(concurrencyLimit);

  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    // Create write stream for efficient appending
    const writeStream = createWriteStream(outputFilePath, {
      flags: "a",
      encoding: "utf8"
    });

    // Process files with controlled concurrency
    const processFile = async (filePath) => {
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
              theme.skipWithIcon(
                `Skipped ${path.relative(process.cwd(), filePath)}: ${skipInfo.reason}`
              )
            );
          }
          return;
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
              theme.fileProcessed(
                `Processed ${path.relative(process.cwd(), filePath)} (${sizeFormatted})`
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
              theme.fileError(
                `Error reading ${path.relative(process.cwd(), filePath)}: ${readError.message}`
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
            theme.fileError(
              `Error processing ${path.relative(process.cwd(), filePath)}: ${fileError.message}`
            )
          );
        }
      }
    };

    // Execute file processing with concurrency control
    await Promise.allSettled(
      filePaths.map((filePath) => limit(() => processFile(filePath)))
    );

    // Close the write stream
    await new Promise((resolve, reject) => {
      writeStream.end((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Log summary
    if (!options.quiet) {
      console.log(theme.success("\n📊 File processing summary:"));
      console.log(theme.successWithIcon(`Processed: ${processedCount} files`));
      if (skippedCount > 0) {
        console.log(theme.skipWithIcon(`Skipped: ${skippedCount} files`));
      }
      if (errorCount > 0) {
        console.log(theme.errorWithIcon(`Errors: ${errorCount} files`));
      }
      console.log(theme.info(`Concurrency limit: ${concurrencyLimit}`));
    }
  } catch (error) {
    throw new Error(`${MESSAGES.PROCESSING_COMPLETE}: ${error.message}`);
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
    // eslint-disable-next-line no-param-reassign
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
