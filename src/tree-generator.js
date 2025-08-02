import fs from "fs/promises";
import { statSync } from "fs";
import path from "path";
import ignore from "ignore";
import { isBinaryFileSync } from "isbinaryfile";
import { Config } from "./config.js";
import { theme } from "./theme.js";

// Parse gitignore files and create ignore instance
async function createIgnoreFilter(baseDir, options = {}) {
  const config = options.config || new Config();
  const ig = ignore();

  try {
    // Add default patterns from config (now async)
    const ignorePatterns = await config.getIgnorePatterns(options.exclude);
    ig.add(ignorePatterns);

    // Read .gitignore file if it exists
    const gitignorePath = path.join(baseDir, ".gitignore");

    try {
      // Use async fs.access instead of existsSync
      await fs.access(gitignorePath);

      try {
        const gitignoreContent = await fs.readFile(gitignorePath, "utf8");
        ig.add(gitignoreContent);

        if (options.verbose) {
          console.log(
            theme.muted(`📋 Loaded .gitignore from ${gitignorePath}`)
          );
        }
      } catch (error) {
        if (options.verbose) {
          console.warn(
            theme.warning(`⚠️  Could not read .gitignore: ${error.message}`)
          );
        }
      }
    } catch {
      // .gitignore doesn't exist, continue silently
    }

    // Handle include patterns (if specified, only include matching files)
    let includeFilter = null;
    if (options.include) {
      includeFilter = ignore().add(options.include);
    }

    return { ignore: ig, includeFilter };
  } catch (error) {
    throw new Error(`Failed to create ignore filter: ${error.message}`);
  }
}

// Check if a file should be ignored
function shouldIgnore(relativePath, ignoreFilter, includeFilter) {
  // Check include filter first (if specified)
  if (includeFilter && !includeFilter.ignores(relativePath)) {
    return true; // Not in include list, so ignore it
  }

  // Check ignore patterns
  return ignoreFilter.ignores(relativePath);
}

// Check if file is binary and should be skipped for content
function shouldSkipForContent(filePath, options = {}) {
  try {
    // Handle legacy maxSize option for backward compatibility
    let config = options.config || new Config();
    if (options.maxSize !== undefined && !options.config) {
      config = new Config();
      config.options.MAX_FILE_SIZE_MB = options.maxSize;
      config.maxFileSizeBytes = config.options.MAX_FILE_SIZE_MB * 1024 * 1024;
    }

    // Use sync stat since isBinaryFileSync also uses sync operations
    // This is a limitation of the binary detection library
    let stats;
    try {
      stats = statSync(filePath);
    } catch (error) {
      return {
        skip: true,
        reason: `Cannot access file: ${error.message}`
      };
    }

    if (stats.size > config.maxFileSizeBytes) {
      return {
        skip: true,
        reason: `File too large (${config.formatFileSize(stats.size)})`
      };
    }

    // Check if binary
    if (isBinaryFileSync(filePath)) {
      return { skip: true, reason: "Binary file" };
    }

    return { skip: false };
  } catch (error) {
    return { skip: true, reason: `Error checking file: ${error.message}` };
  }
}

// Async directory tree generation with gitignore support
async function displayTreeWithGitignore(dirPath, options = {}) {
  const output = [];
  const { ignore: ignoreFilter, includeFilter } = await createIgnoreFilter(
    dirPath,
    options
  );

  async function traverse(currentPath, depth = 0, prefix = "") {
    try {
      const items = await fs.readdir(currentPath);

      // Filter and sort items
      const filteredItems = [];
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const relativePath = path.relative(dirPath, fullPath);

        if (!shouldIgnore(relativePath, ignoreFilter, includeFilter)) {
          try {
            const stats = await fs.stat(fullPath);
            filteredItems.push({
              name: item,
              fullPath,
              isDirectory: stats.isDirectory(),
              size: stats.size
            });
          } catch (statError) {
            if (options.verbose) {
              console.warn(
                theme.warning(
                  `⚠️  Could not stat ${fullPath}: ${statError.message}`
                )
              );
            }
          }
        }
      }

      // Sort: directories first, then files, alphabetically
      filteredItems.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      // Process each item
      for (let i = 0; i < filteredItems.length; i++) {
        const item = filteredItems[i];
        const isLast = i === filteredItems.length - 1;

        // Tree symbols
        const branch = isLast ? "└── " : "├── ";
        const newPrefix = prefix + (isLast ? "    " : "│   ");

        // Add size info for large files
        let displayName = item.name;
        if (!item.isDirectory && item.size > 1024 * 1024) {
          displayName += theme.muted(
            ` (${(item.size / 1024 / 1024).toFixed(1)}MB)`
          );
        }

        output.push(`${prefix}${branch}${displayName}`);

        // Recursively process directories
        if (item.isDirectory) {
          await traverse(item.fullPath, depth + 1, newPrefix);
        }
      }
    } catch (error) {
      if (options.verbose) {
        console.warn(
          theme.warning(
            `⚠️  Could not read directory ${currentPath}: ${error.message}`
          )
        );
      }
      output.push(`${prefix}[Error reading directory: ${error.message}]`);
    }
  }

  await traverse(dirPath);
  return output;
}

// Async file path collection
async function getAllFilePaths(dirPath, options = {}) {
  const filePaths = [];
  const { ignore: ignoreFilter, includeFilter } = await createIgnoreFilter(
    dirPath,
    options
  );

  async function traverse(currentPath) {
    try {
      const items = await fs.readdir(currentPath);

      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const relativePath = path.relative(dirPath, fullPath);

        if (!shouldIgnore(relativePath, ignoreFilter, includeFilter)) {
          try {
            const stats = await fs.stat(fullPath);

            if (stats.isDirectory()) {
              await traverse(fullPath);
            } else {
              filePaths.push(fullPath);
            }
          } catch (statError) {
            if (options.verbose) {
              console.warn(
                theme.warning(
                  `⚠️  Could not stat ${fullPath}: ${statError.message}`
                )
              );
            }
          }
        }
      }
    } catch (error) {
      if (options.verbose) {
        console.warn(
          theme.warning(
            `⚠️  Could not read directory ${currentPath}: ${error.message}`
          )
        );
      }
    }
  }

  await traverse(dirPath);
  return filePaths;
}

// Save tree to file with enhanced formatting
async function saveTreeToFile(dirPath, fileName, options = {}) {
  try {
    const output = await displayTreeWithGitignore(dirPath, options);

    // Create header with metadata
    const header = [
      `Directory structure for: ${path.resolve(dirPath)}`,
      `Generated on: ${new Date().toISOString()}`,
      `Total items: ${output.length}`,
      ""
    ];

    const content = [...header, ...output, "", ""].join("\n");

    await fs.writeFile(fileName, content, "utf8");

    if (options.verbose) {
      console.log(theme.muted(`📁 Directory tree saved to ${fileName}`));
    }
  } catch (error) {
    throw new Error(`Failed to save tree to file: ${error.message}`);
  }
}

export {
  displayTreeWithGitignore,
  saveTreeToFile,
  getAllFilePaths,
  shouldSkipForContent
};
