import fs from "fs/promises";
import { existsSync, statSync } from "fs";
import path from "path";
import ignore from "ignore";
import { isBinaryFileSync } from "isbinaryfile";
import chalk from "chalk";

// Default ignore patterns for common files that should be excluded
const DEFAULT_IGNORE_PATTERNS = [
  // Generated output files
  "git-ingest-*.txt",
  "git-ingest-*.json",

  // Git directory
  ".git/",

  // Common binary/media files
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

  // Package manager directories
  "node_modules/",
  ".npm/",
  "bower_components/",
  "vendor/",

  // Build directories
  "dist/",
  "build/",
  "out/",
  ".next/",
  ".nuxt/",

  // IDE and editor files
  ".vscode/",
  ".idea/",
  "*.swp",
  "*.swo",
  "*~",

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
];

// Parse gitignore files and create ignore instance
async function createIgnoreFilter(baseDir, options = {}) {
  const ig = ignore();

  try {
    // Add default patterns
    ig.add(DEFAULT_IGNORE_PATTERNS);

    // Add custom exclude patterns
    if (options.exclude) {
      ig.add(options.exclude);
    }

    // Read .gitignore file if it exists
    const gitignorePath = path.join(baseDir, ".gitignore");
    if (existsSync(gitignorePath)) {
      try {
        const gitignoreContent = await fs.readFile(gitignorePath, "utf8");
        ig.add(gitignoreContent);

        if (options.verbose) {
          console.log(chalk.gray(`📋 Loaded .gitignore from ${gitignorePath}`));
        }
      } catch (error) {
        if (options.verbose) {
          console.warn(chalk.yellow(`⚠️  Could not read .gitignore: ${error.message}`));
        }
      }
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
    // Check file size limit
    const maxSizeBytes = (options.maxSize || 10) * 1024 * 1024; // Convert MB to bytes

    // Use sync stat since isBinaryFileSync also uses sync operations
    const stats = existsSync(filePath) ? statSync(filePath) : null;

    if (stats && stats.size > maxSizeBytes) {
      return { skip: true, reason: `File too large (${(stats.size / 1024 / 1024).toFixed(2)}MB)` };
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
  const { ignore: ignoreFilter, includeFilter } = await createIgnoreFilter(dirPath, options);

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
              size: stats.size,
            });
          } catch (statError) {
            if (options.verbose) {
              console.warn(chalk.yellow(`⚠️  Could not stat ${fullPath}: ${statError.message}`));
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
          displayName += chalk.gray(` (${(item.size / 1024 / 1024).toFixed(1)}MB)`);
        }

        output.push(`${prefix}${branch}${displayName}`);

        // Recursively process directories
        if (item.isDirectory) {
          await traverse(item.fullPath, depth + 1, newPrefix);
        }
      }
    } catch (error) {
      if (options.verbose) {
        console.warn(chalk.yellow(`⚠️  Could not read directory ${currentPath}: ${error.message}`));
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
  const { ignore: ignoreFilter, includeFilter } = await createIgnoreFilter(dirPath, options);

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
              console.warn(chalk.yellow(`⚠️  Could not stat ${fullPath}: ${statError.message}`));
            }
          }
        }
      }
    } catch (error) {
      if (options.verbose) {
        console.warn(chalk.yellow(`⚠️  Could not read directory ${currentPath}: ${error.message}`));
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
      "",
    ];

    const content = [...header, ...output, "", ""].join("\n");

    await fs.writeFile(fileName, content, "utf8");

    if (options.verbose) {
      console.log(chalk.gray(`📁 Directory tree saved to ${fileName}`));
    }
  } catch (error) {
    throw new Error(`Failed to save tree to file: ${error.message}`);
  }
}

export { displayTreeWithGitignore, saveTreeToFile, getAllFilePaths, shouldSkipForContent };
