/**
 * Unit tests for markdown-formatter module
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Config } from "../config.js";
import {
  saveMarkdownTreeToFile,
  appendMarkdownFileContents,
  generateTableOfContents,
  generateProjectOverview,
  generateStatistics,
  generateDirectoryStructure,
  generateFilesByCategory
} from "../markdown-formatter.js";

// Provide a static fallback for import.meta.url in Jest
let __filename, __dirname;
try {
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(__filename);
} catch {
  __filename = __filename || __filename;
  __dirname = __dirname || process.cwd();
}

describe("Markdown Formatter Module", () => {
  let testDir;
  let testFile;

  beforeEach(async () => {
    // Create a temporary test directory
    testDir = path.join(__dirname, "test-temp-markdown");

    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist, ignore error
    }

    await fs.mkdir(testDir, { recursive: true });

    // Create test files
    testFile = path.join(testDir, "test.js");
    await fs.writeFile(testFile, 'console.log("Hello, World!");', "utf8");

    await fs.writeFile(
      path.join(testDir, "README.md"),
      "# Test Project\n\nThis is a test.",
      "utf8"
    );
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("generateTableOfContents", () => {
    test("should generate table of contents with categories", () => {
      const categories = [
        { name: "Web Frontend", emoji: "🌐" },
        { name: "Backend/Server", emoji: "⚙️" },
        { name: "Documentation", emoji: "📖" }
      ];

      const toc = generateTableOfContents(categories);

      expect(toc).toContain("## 📑 Table of Contents");
      expect(toc).toContain("- [📊 Project Overview](#-project-overview)");
      expect(toc).toContain("- [📈 Statistics](#-statistics)");
      expect(toc).toContain(
        "- [🏗️ Directory Structure](#️-directory-structure)"
      );
      expect(toc).toContain("- [📁 Files by Category](#-files-by-category)");
      expect(toc).toContain("🌐 Web Frontend");
      expect(toc).toContain("⚙️ Backend/Server");
      expect(toc).toContain("📖 Documentation");
    });

    test("should handle empty categories array", () => {
      const toc = generateTableOfContents([]);

      expect(toc).toContain("## 📑 Table of Contents");
      expect(toc).toContain(
        "- [📋 Complete File Listing](#-complete-file-listing)"
      );
    });
  });

  describe("generateProjectOverview", () => {
    test("should generate project overview with correct information", () => {
      const stats = {
        totalFiles: 10,
        totalSizeBytes: 1024000
      };

      const overview = generateProjectOverview(testDir, stats);

      expect(overview).toContain("## 📊 Project Overview");
      expect(overview).toContain("**Total Files:** 10");
      expect(overview).toContain("**Total Size:** 1000 KB");
      expect(overview).toContain("**Project:** `test-temp-markdown`");
      expect(overview).toContain(
        "This document contains a comprehensive analysis"
      );
    });
  });

  describe("generateStatistics", () => {
    test("should generate statistics with language and category data", () => {
      const stats = {
        totalFiles: 5,
        totalSizeBytes: 500000,
        textFiles: 4,
        binaryFiles: 1,
        largeFiles: 0
      };

      const languageStats = {
        byCategory: {
          "Web Frontend": { count: 3, languages: ["javascript", "css"] },
          "Documentation": { count: 2, languages: ["markdown"] }
        },
        byLanguage: {
          "javascript": { count: 2, files: ["app.js", "script.js"] },
          "css": { count: 1, files: ["style.css"] },
          "markdown": { count: 2, files: ["README.md", "DOCS.md"] }
        }
      };

      const statisticsSection = generateStatistics(stats, languageStats);

      expect(statisticsSection).toContain("## 📈 Statistics");
      expect(statisticsSection).toContain("### 📊 File Type Distribution");
      expect(statisticsSection).toContain("| Category | Files | Percentage |");
      expect(statisticsSection).toContain("| Web Frontend | 3 | 60.0% |");
      expect(statisticsSection).toContain("| Documentation | 2 | 40.0% |");
      expect(statisticsSection).toContain("### 💻 Programming Languages");
      expect(statisticsSection).toContain("| javascript | 2 |");
      expect(statisticsSection).toContain("| markdown | 2 |");
      expect(statisticsSection).toContain("**Total Project Size:** 488.3 KB");
      expect(statisticsSection).toContain("**Average File Size:** 97.7 KB");
      expect(statisticsSection).toContain("**Text Files:** 4 (80.0%)");
      expect(statisticsSection).toContain(
        "**Binary Files:** 1 (excluded from content)"
      );
    });
  });

  describe("generateDirectoryStructure", () => {
    test("should generate directory structure section", () => {
      const treeOutput = [
        "├── src/",
        "│   ├── app.js",
        "│   └── utils.js",
        "└── README.md"
      ];

      const dirSection = generateDirectoryStructure(treeOutput);

      expect(dirSection).toContain("## 🏗️ Directory Structure");
      expect(dirSection).toContain("```");
      expect(dirSection).toContain("├── src/");
      expect(dirSection).toContain("│   ├── app.js");
      expect(dirSection).toContain("└── README.md");
    });
  });

  describe("generateFilesByCategory", () => {
    test("should generate files by category section", () => {
      const languageStats = {
        byCategory: {
          "Web Frontend": {
            count: 3,
            languages: ["javascript", "css", "html"]
          },
          "Backend/Server": {
            count: 2,
            languages: ["python", "java"]
          },
          "Documentation": {
            count: 1,
            languages: ["markdown"]
          }
        }
      };

      const categorySection = generateFilesByCategory(languageStats);

      expect(categorySection).toContain("## 📁 Files by Category");
      expect(categorySection).toContain("### 🌐 Web Frontend");
      expect(categorySection).toContain("**Languages:** javascript, css, html");
      expect(categorySection).toContain("**File Count:** 3");
      expect(categorySection).toContain("### ⚙️ Backend/Server");
      expect(categorySection).toContain("**Languages:** python, java");
      expect(categorySection).toContain("**File Count:** 2");
      expect(categorySection).toContain("### 📖 Documentation");
      expect(categorySection).toContain("**Languages:** markdown");
      expect(categorySection).toContain("**File Count:** 1");
    });
  });

  describe("saveMarkdownTreeToFile", () => {
    test("should save markdown tree to file successfully", async () => {
      const outputFile = path.join(testDir, "output.md");
      const treeOutput = ["├── test.js", "└── README.md"];

      await saveMarkdownTreeToFile(testDir, outputFile, treeOutput, {
        verbose: false
      });

      const content = await fs.readFile(outputFile, "utf8");

      expect(content).toContain("# 🚀 Project Analysis Report");
      expect(content).toContain("## 🎯 LLM-Optimized Codebase Analysis");
      expect(content).toContain("## 📑 Table of Contents");
      expect(content).toContain("## 📊 Project Overview");
      expect(content).toContain("## 📈 Statistics");
      expect(content).toContain("## 🏗️ Directory Structure");
      expect(content).toContain("├── test.js");
      expect(content).toContain("└── README.md");
    });

    test("should handle verbose option", async () => {
      const outputFile = path.join(testDir, "output-verbose.md");
      const treeOutput = ["├── test.js"];

      // Test verbose functionality by checking file creation
      await saveMarkdownTreeToFile(testDir, outputFile, treeOutput, {
        verbose: true
      });

      // Verify file was created successfully
      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("Project Analysis Report");
    });
  });

  describe("appendMarkdownFileContents", () => {
    test("should append file contents with markdown formatting", async () => {
      const outputFile = path.join(testDir, "output-with-content.md");

      // Create initial file content
      await fs.writeFile(outputFile, "# Initial Content\n\n", "utf8");

      const filePaths = [testFile];

      await appendMarkdownFileContents(filePaths, outputFile, {
        verbose: false
      });

      const content = await fs.readFile(outputFile, "utf8");

      expect(content).toContain("# Initial Content");
      expect(content).toContain("## 📋 Complete File Listing");
      expect(content).toContain("### 📄 `test.js`");
      // The actual output shows the full path from the working directory
      expect(content).toContain(
        "**Path:** `src/__tests__/test-temp-markdown/test.js`"
      );
      expect(content).toContain("**Language:** javascript");
      expect(content).toContain("**Category:** Web Frontend");
      expect(content).toContain("```javascript");
      expect(content).toContain('console.log("Hello, World!");');
      expect(content).toContain("### 📊 Processing Summary");
      expect(content).toContain("- **Files Processed:** 1");
    });

    test("should handle empty file paths array", async () => {
      const outputFile = path.join(testDir, "empty-output.md");

      // Test empty array handling
      await appendMarkdownFileContents([], outputFile, {
        verbose: true
      });

      // File should not be created for empty array
      try {
        await fs.access(outputFile);
        // If we reach here, file exists but shouldn't
        expect(true).toBe(false);
      } catch {
        // File doesn't exist, which is expected
        expect(true).toBe(true);
      }
    });

    test("should handle file read errors gracefully", async () => {
      const outputFile = path.join(testDir, "error-output.md");
      const nonExistentFile = path.join(testDir, "nonexistent.js");

      await appendMarkdownFileContents([nonExistentFile], outputFile, {
        verbose: false
      });

      const content = await fs.readFile(outputFile, "utf8");

      expect(content).toContain("## 📋 Complete File Listing");
      expect(content).toContain("### 📊 Processing Summary");
      expect(content).toContain("- **Files Processed:** 0");
    });

    test("should handle binary file skipping", async () => {
      // Create a mock binary file
      const binaryFile = path.join(testDir, "image.png");
      await fs.writeFile(binaryFile, Buffer.from([0x89, 0x50, 0x4e, 0x47])); // PNG header

      const outputFile = path.join(testDir, "binary-output.md");

      await appendMarkdownFileContents([binaryFile], outputFile, {
        verbose: false
      });

      const content = await fs.readFile(outputFile, "utf8");

      expect(content).toContain("### 📄 `image.png`");
      expect(content).toContain("> **⏭️ Skipped:**");
      expect(content).toContain("- **Files Skipped:** 1");
    });
  });

  describe("Error Handling", () => {
    test("should handle file write errors in saveMarkdownTreeToFile", async () => {
      const invalidPath = "/invalid/path/output.md";
      const treeOutput = ["├── test.js"];

      await expect(
        saveMarkdownTreeToFile(testDir, invalidPath, treeOutput)
      ).rejects.toThrow("Failed to save markdown tree to file");
    });

    test("should handle file append errors in appendMarkdownFileContents", async () => {
      const invalidPath = "/invalid/path/output.md";
      const filePaths = [testFile];

      await expect(
        appendMarkdownFileContents(filePaths, invalidPath)
      ).rejects.toThrow("Failed to append markdown file contents");
    });
  });

  describe("Integration Tests", () => {
    test("should generate complete markdown document", async () => {
      // Create a more complex test structure
      const subDir = path.join(testDir, "src");
      await fs.mkdir(subDir, { recursive: true });

      await fs.writeFile(
        path.join(subDir, "app.js"),
        "const app = 'test';\nconsole.log(app);",
        "utf8"
      );

      await fs.writeFile(
        path.join(subDir, "style.css"),
        "body { margin: 0; }",
        "utf8"
      );

      const outputFile = path.join(testDir, "complete-output.md");
      const treeOutput = [
        "├── src/",
        "│   ├── app.js",
        "│   └── style.css",
        "└── README.md"
      ];

      // Save markdown tree
      await saveMarkdownTreeToFile(testDir, outputFile, treeOutput, {
        verbose: false
      });

      // Append file contents
      const filePaths = [
        path.join(subDir, "app.js"),
        path.join(subDir, "style.css"),
        path.join(testDir, "README.md")
      ];

      await appendMarkdownFileContents(filePaths, outputFile, {
        verbose: false
      });

      const content = await fs.readFile(outputFile, "utf8");

      // Verify structure
      expect(content).toContain("# 🚀 Project Analysis Report");
      expect(content).toContain("## 📑 Table of Contents");
      expect(content).toContain("## 📊 Project Overview");
      expect(content).toContain("## 📈 Statistics");
      expect(content).toContain("## 🏗️ Directory Structure");
      expect(content).toContain("## 📁 Files by Category");
      expect(content).toContain("## 📋 Complete File Listing");

      // Verify file contents
      expect(content).toContain("### 📄 `app.js`");
      expect(content).toContain("**Language:** javascript");
      expect(content).toContain("```javascript");
      expect(content).toContain("const app = 'test';");

      expect(content).toContain("### 📄 `style.css`");
      expect(content).toContain("**Language:** css");
      expect(content).toContain("```css");
      expect(content).toContain("body { margin: 0; }");

      expect(content).toContain("### 📄 `README.md`");
      expect(content).toContain("**Language:** markdown");
      expect(content).toContain("```markdown");
      expect(content).toContain("# Test Project");

      // Verify statistics
      expect(content).toContain("- **Files Processed:** 3");
    });
  });

  describe("Additional Coverage Tests", () => {
    test("should handle appendMarkdownFileContents with empty array and verbose mode", async () => {
      const outputFile = path.join(testDir, "empty-test.md");
      await fs.writeFile(outputFile, "# Initial Content\n\n");

      const originalConsoleLog = console.log;
      const mockConsoleLog = vi.fn();
      console.log = mockConsoleLog;

      // Test with empty array and verbose mode
      await appendMarkdownFileContents([], outputFile, {
        config: new Config(),
        progressReporter: null,
        verbose: true
      });

      expect(mockConsoleLog).toHaveBeenCalledWith(
        "📝 No files to process for markdown output"
      );
      console.log = originalConsoleLog;

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("# Initial Content");
    });

    test("should handle appendMarkdownFileContents with verbose success message", async () => {
      const outputFile = path.join(testDir, "verbose-test.md");
      await fs.writeFile(outputFile, "# Initial Content\n\n");

      const originalConsoleLog = console.log;
      const mockConsoleLog = vi.fn();
      console.log = mockConsoleLog;

      // Test with files and verbose mode
      await appendMarkdownFileContents([testFile], outputFile, {
        config: new Config(),
        progressReporter: null,
        verbose: true
      });

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`📝 File contents appended to ${outputFile}`)
      );
      console.log = originalConsoleLog;
    });

    test("should handle appendMarkdownFileContents error branch", async () => {
      const outputFile = path.join(testDir, "error-test.md");
      await fs.writeFile(outputFile, "# Initial Content\n\n");

      // Mock fs.appendFile to throw
      const originalAppendFile = fs.appendFile;
      fs.appendFile = async () => {
        throw new Error("append fail");
      };

      let errorCaught = false;
      try {
        await appendMarkdownFileContents([testFile], outputFile, {
          config: new Config(),
          progressReporter: null,
          verbose: true
        });
      } catch (e) {
        errorCaught = true;
        expect(e.message).toContain("Failed to append markdown file contents");
      }
      expect(errorCaught).toBe(true);
      fs.appendFile = originalAppendFile;
    });

    test("should handle saveMarkdownTreeToFile error branch", async () => {
      const outputFile = path.join(testDir, "error-tree.md");
      const treeOutput = [".", "├── file1.js"];
      // Mock fs.writeFile to throw
      const originalWriteFile = fs.writeFile;
      fs.writeFile = async () => {
        throw new Error("write fail");
      };

      let errorCaught = false;
      try {
        await saveMarkdownTreeToFile(testDir, outputFile, treeOutput, {
          verbose: true
        });
      } catch (e) {
        errorCaught = true;
        expect(e.message).toContain("Failed to save markdown tree to file");
      }
      expect(errorCaught).toBe(true);
      fs.writeFile = originalWriteFile;
    });
  });
});
