/**
 * LLM-friendly Markdown formatter for git-ingest output
 * Generates structured, semantic markdown optimized for AI consumption
 */

import fs from "fs/promises";
import path from "path";
import { detectLanguage, getLanguageStats } from "./language-detector.js";
import { Config } from "./config.js";

/**
 * Generate table of contents for the document
 * @param {Array} categories - File categories
 * @returns {string} - Markdown table of contents
 */
function generateTableOfContents(categories) {
  const toc = [
    "## 📑 Table of Contents",
    "",
    "- [📊 Project Overview](#-project-overview)",
    "- [📈 Statistics](#-statistics)",
    "- [🏗️ Directory Structure](#️-directory-structure)",
    "- [📁 Files by Category](#-files-by-category)"
  ];

  // Add category sections to TOC
  categories.forEach((category) => {
    const anchor = category.name.toLowerCase().replace(/[^a-z0-9]/gu, "-");
    const hexCode = 16;
    toc.push(
      `  - [${category.emoji} ${category.name}](#${category.emoji.codePointAt(0).toString(hexCode)}-${anchor})`
    );
  });

  toc.push("- [📋 Complete File Listing](#-complete-file-listing)");
  toc.push("");

  return toc.join("\n");
}

/**
 * Generate project overview section
 * @param {string} dirPath - Project directory path
 * @param {Object} stats - Project statistics
 * @returns {string} - Markdown overview section
 */
function generateProjectOverview(dirPath, stats) {
  const projectName = path.basename(path.resolve(dirPath));
  const now = new Date();

  return [
    "## 📊 Project Overview",
    "",
    `**Project:** \`${projectName}\`  `,
    `**Path:** \`${path.resolve(dirPath)}\`  `,
    `**Generated:** ${now.toISOString()}  `,
    `**Total Files:** ${stats.totalFiles}  `,
    `**Total Size:** ${formatFileSize(stats.totalSizeBytes)}  `,
    "",
    "### 🎯 Quick Summary",
    "",
    `This document contains a comprehensive analysis of the **${projectName}** project, `,
    "including its complete directory structure and the full content of all text files. ",
    "The content is organized in a hierarchical, LLM-friendly format with proper syntax ",
    "highlighting and metadata for optimal AI processing.",
    ""
  ].join("\n");
}

/**
 * Generate statistics section
 * @param {Object} stats - Project statistics
 * @param {Object} languageStats - Language statistics
 * @returns {string} - Markdown statistics section
 */
function generateStatistics(stats, languageStats) {
  const sections = [
    "## 📈 Statistics",
    "",
    "### 📊 File Type Distribution",
    "",
    "| Category | Files | Percentage |",
    "| --- | --- | --- |"
  ];

  // Add category statistics
  Object.entries(languageStats.byCategory)
    .sort(([, a], [, b]) => b.count - a.count)
    .forEach(([category, data]) => {
      const percentage = ((data.count / stats.totalFiles) * 100).toFixed(1);
      sections.push(`| ${category} | ${data.count} | ${percentage}% |`);
    });

  sections.push("");
  sections.push("### 💻 Programming Languages");
  sections.push("");
  sections.push("| Language | Files | Primary Category |");
  sections.push("| --- | --- | --- |");

  // Add language statistics
  const maxLanguagesToShow = 15;
  Object.entries(languageStats.byLanguage)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, maxLanguagesToShow) // Top languages
    .forEach(([language, data]) => {
      const detection = detectLanguage(data.files[0]);
      sections.push(`| ${language} | ${data.count} | ${detection.category} |`);
    });

  sections.push("");
  sections.push("### 📏 Size Analysis");
  sections.push("");
  sections.push(
    `- **Total Project Size:** ${formatFileSize(stats.totalSizeBytes)}`
  );
  sections.push(
    `- **Average File Size:** ${formatFileSize(stats.totalSizeBytes / stats.totalFiles)}`
  );
  sections.push(
    `- **Text Files:** ${stats.textFiles} (${((stats.textFiles / stats.totalFiles) * 100).toFixed(1)}%)`
  );

  if (stats.binaryFiles > 0) {
    sections.push(
      `- **Binary Files:** ${stats.binaryFiles} (excluded from content)`
    );
  }

  if (stats.largeFiles > 0) {
    sections.push(`- **Large Files:** ${stats.largeFiles} (may be truncated)`);
  }

  sections.push("");

  return sections.join("\n");
}

/**
 * Generate directory structure section
 * @param {Array} treeOutput - Directory tree lines
 * @returns {string} - Markdown directory structure section
 */
function generateDirectoryStructure(treeOutput) {
  return [
    "## 🏗️ Directory Structure",
    "",
    "```",
    ...treeOutput,
    "```",
    ""
  ].join("\n");
}

/**
 * Generate files by category section
 * @param {Object} languageStats - Language statistics
 * @returns {string} - Markdown files by category section
 */
function generateFilesByCategory(languageStats) {
  const sections = ["## 📁 Files by Category", ""];

  const categoryEmojis = {
    "Web Frontend": "🌐",
    "Backend/Server": "⚙️",
    "Systems/Low-level": "🔧",
    "Functional": "🧮",
    "Scripting": "📜",
    "Data/Config": "⚙️",
    "Documentation": "📖",
    "Mobile": "📱",
    "DevOps": "🚀",
    "Other": "📄"
  };

  Object.entries(languageStats.byCategory)
    .sort(([, a], [, b]) => b.count - a.count)
    .forEach(([category, data]) => {
      const emoji = categoryEmojis[category] || "📄";
      sections.push(`### ${emoji} ${category}`);
      sections.push("");
      sections.push(`**Languages:** ${data.languages.join(", ")}  `);
      sections.push(`**File Count:** ${data.count}`);
      sections.push("");
    });

  return sections.join("\n");
}

/**
 * Generate file header with metadata
 * @param {string} filePath - File path
 * @param {Object} stats - File stats
 * @param {Object} detection - Language detection result
 * @returns {string} - Markdown file header
 */
function generateFileHeader(filePath, stats, detection) {
  const relativePath = path.relative(process.cwd(), filePath);
  const fileName = path.basename(filePath);

  return [
    `### 📄 \`${fileName}\``,
    "",
    `**Path:** \`${relativePath}\`  `,
    `**Size:** ${formatFileSize(stats.size)}  `,
    `**Language:** ${detection.language} (${detection.confidence} confidence)  `,
    `**Category:** ${detection.category}  `,
    ""
  ].join("\n");
}

/**
 * Generate file content block
 * @param {string} content - File content
 * @param {Object} detection - Language detection result
 * @returns {string} - Markdown code block
 */
function generateFileContent(content, detection) {
  const language = detection.language === "text" ? "" : detection.language;

  return [`\`\`\`${language}`, content.trim(), "```", ""].join("\n");
}

/**
 * Generate complete file listing section
 * @param {Array} filePaths - Array of file paths
 * @param {Object} options - Processing options
 * @returns {string} - Markdown complete file listing
 */
async function generateCompleteFileListing(filePaths, options = {}) {
  const config = options.config || new Config();
  const sections = [
    "## 📋 Complete File Listing",
    "",
    "The following section contains the complete content of all text files in the project, ",
    "organized with proper syntax highlighting and metadata for optimal LLM processing.",
    ""
  ];

  let processedCount = 0;
  let skippedCount = 0;
  const { progress } = options;

  for (const filePath of filePaths) {
    try {
      // Check if file should be skipped
      const { shouldSkipForContent } = await import("./tree-generator.js");
      const skipInfo = shouldSkipForContent(filePath, { ...options, config });

      const stats = await fs.stat(filePath);
      const detection = detectLanguage(filePath);

      if (skipInfo.skip) {
        // Generate placeholder for skipped files
        sections.push(generateFileHeader(filePath, stats, detection));
        sections.push(`> **⏭️ Skipped:** ${skipInfo.reason}`);
        sections.push("");
        skippedCount++;

        if (progress) {
          progress.reportFileProgress(filePath, 0, "skipped");
        }
        continue;
      }

      // Generate file header
      sections.push(generateFileHeader(filePath, stats, detection));

      // Read and add content
      try {
        let content;
        if (stats.size > config.maxFileSizeBytes) {
          // Use truncation for very large files
          const maxSize = config.options.TRUNCATE_SIZE_BYTES;
          const handle = await fs.open(filePath, "r");
          const buffer = Buffer.alloc(maxSize);
          const { bytesRead } = await handle.read(buffer, 0, maxSize, 0);
          await handle.close();

          content = buffer.subarray(0, bytesRead).toString("utf8");

          if (stats.size > maxSize) {
            content += `\n\n[File truncated - showing first ${formatFileSize(maxSize)} of ${formatFileSize(stats.size)} total]`;
          }
        } else {
          content = await fs.readFile(filePath, "utf8");
        }

        sections.push(generateFileContent(content, detection));
        processedCount++;

        if (progress) {
          progress.reportFileProgress(filePath, stats.size, "processed");
        }
      } catch (readError) {
        sections.push(
          `> **❌ Error:** Could not read file content: ${readError.message}`
        );
        sections.push("");

        if (progress) {
          progress.reportFileProgress(filePath, 0, "error");
        }
      }
    } catch {
      if (progress) {
        progress.reportFileProgress(filePath, 0, "error");
      }
    }
  }

  // Add processing summary
  sections.push("---");
  sections.push("");
  sections.push("### 📊 Processing Summary");
  sections.push("");
  sections.push(`- **Files Processed:** ${processedCount}`);
  sections.push(`- **Files Skipped:** ${skippedCount}`);
  sections.push(`- **Total Files:** ${filePaths.length}`);
  sections.push("");

  return sections.join("\n");
}

/**
 * Format file size in human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string
 */
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Save markdown tree to file with enhanced LLM-friendly formatting
 * @param {string} dirPath - Directory path
 * @param {string} fileName - Output file name
 * @param {Array} treeOutput - Directory tree output
 * @param {Object} options - Options
 */
export async function saveMarkdownTreeToFile(
  dirPath,
  fileName,
  treeOutput,
  options = {}
) {
  try {
    // Generate project statistics
    const { getAllFilePaths } = await import("./tree-generator.js");
    const filePaths = await getAllFilePaths(dirPath, options);
    const languageStats = getLanguageStats(filePaths);

    // Calculate file statistics
    let totalSize = 0;
    let textFiles = 0;
    let binaryFiles = 0;
    let largeFiles = 0;

    for (const filePath of filePaths) {
      try {
        const stats = await fs.stat(filePath);
        totalSize += stats.size;

        const { shouldSkipForContent } = await import("./tree-generator.js");
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

    const stats = {
      totalFiles: filePaths.length,
      textFiles,
      binaryFiles,
      largeFiles,
      totalSizeBytes: totalSize
    };

    // Create categories for TOC
    const categories = Object.entries(languageStats.byCategory)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([name]) => ({
        name,
        emoji: getCategoryEmoji(name)
      }));

    // Generate markdown content
    const projectName = path.basename(path.resolve(dirPath));
    const sections = [
      "# 🚀 Project Analysis Report",
      "",
      `Directory structure for: ${projectName}`,
      "",
      "## 🎯 LLM-Optimized Codebase Analysis",
      "",
      "This document provides a comprehensive, structured analysis of the codebase optimized for ",
      "Large Language Model (LLM) processing. The content is organized with semantic markup, ",
      "proper syntax highlighting, and hierarchical structure for enhanced AI comprehension.",
      "",
      generateTableOfContents(categories),
      generateProjectOverview(dirPath, stats),
      generateStatistics(stats, languageStats),
      generateDirectoryStructure(treeOutput),
      generateFilesByCategory(languageStats)
    ];

    const content = sections.join("\n");
    await fs.writeFile(fileName, content, "utf8");

    if (options.verbose) {
      console.log(`📝 Markdown tree saved to ${fileName}`);
    }
  } catch (error) {
    throw new Error(`Failed to save markdown tree to file: ${error.message}`);
  }
}

/**
 * Append file contents to markdown file with enhanced formatting
 * @param {Array} filePaths - Array of file paths
 * @param {string} outputFilePath - Output file path
 * @param {Object} options - Processing options
 */
export async function appendMarkdownFileContents(
  filePaths,
  outputFilePath,
  options = {}
) {
  if (!Array.isArray(filePaths) || filePaths.length === 0) {
    if (options.verbose) {
      console.log("📝 No files to process for markdown output");
    }
    return;
  }

  try {
    const completeFileListing = await generateCompleteFileListing(
      filePaths,
      options
    );
    await fs.appendFile(outputFilePath, completeFileListing, "utf8");

    if (options.verbose) {
      console.log(`📝 File contents appended to ${outputFilePath}`);
    }
  } catch (error) {
    throw new Error(
      `Failed to append markdown file contents: ${error.message}`
    );
  }
}

/**
 * Get emoji for category
 * @param {string} category - Category name
 * @returns {string} - Emoji
 */
function getCategoryEmoji(category) {
  const emojis = {
    "Web Frontend": "🌐",
    "Backend/Server": "⚙️",
    "Systems/Low-level": "🔧",
    "Functional": "🧮",
    "Scripting": "📜",
    "Data/Config": "⚙️",
    "Documentation": "📖",
    "Mobile": "📱",
    "DevOps": "🚀",
    "Other": "📄"
  };

  return emojis[category] || "📄";
}

export {
  generateTableOfContents,
  generateProjectOverview,
  generateStatistics,
  generateDirectoryStructure,
  generateFilesByCategory,
  generateCompleteFileListing
};

export default {
  saveMarkdownTreeToFile,
  appendMarkdownFileContents,
  generateTableOfContents,
  generateProjectOverview,
  generateStatistics,
  generateDirectoryStructure,
  generateFilesByCategory,
  generateCompleteFileListing
};
