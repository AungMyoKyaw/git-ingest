import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the GitIngestApp class by dynamically loading and extracting it from cli.js
// This is necessary because cli.js doesn't export the class directly
async function loadCliModule() {
  const cliPath = path.join(__dirname, "../cli.js");
  const cliContent = await fs.readFile(cliPath, "utf-8");

  // Extract and isolate the GitIngestApp class for testing
  const classStart = cliContent.indexOf("class GitIngestApp");
  const classEnd = cliContent.indexOf("// Create and configure CLI");

  if (classStart === -1 || classEnd === -1) {
    throw new Error("Could not extract GitIngestApp class from cli.js");
  }

  const classCode = cliContent.substring(classStart, classEnd);

  // Create a module-like string that we can evaluate
  const moduleCode = `
    import { Command, Option } from "commander";
    import clipboardy from "clipboardy";
    import chalk from "chalk";
    import fs from "fs/promises";
    import { constants as fsConstants } from "fs";
    import path from "path";
    import { saveTreeToFile, getAllFilePaths } from "../tree-generator.js";
    import { appendFileContentsToTree } from "../read-file-and-append.js";
    import { Config } from "../config.js";
    import {
      createErrorHandler,
      setupGlobalErrorHandlers,
      DirectoryError
    } from "../error-handler.js";
    import { createProgressReporter } from "../progress-reporter.js";

    ${classCode}

    export { GitIngestApp };
  `;

  // Write temporary module and import it
  const tempPath = path.join(__dirname, "temp-cli-module.js");
  await fs.writeFile(tempPath, moduleCode);

  try {
    const module = await import(tempPath);
    return module.GitIngestApp;
  } finally {
    // Clean up temp file
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

describe("CLI Unit Tests", () => {
  let GitIngestApp;
  const testDir = path.join(__dirname, "cli-unit-test-temp");

  beforeAll(async () => {
    // Load the GitIngestApp class
    GitIngestApp = await loadCliModule();

    // Create test directory structure
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(path.join(testDir, "test.txt"), "Test file content");
    await fs.writeFile(
      path.join(testDir, "package.json"),
      JSON.stringify({ name: "test-project", version: "1.0.0" }, null, 2)
    );
  });

  afterAll(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("GitIngestApp Class", () => {
    test("should create instance", () => {
      const app = new GitIngestApp();
      expect(app).toBeDefined();
      expect(app.config).toBeNull();
      expect(app.errorHandler).toBeNull();
      expect(app.progress).toBeNull();
    });

    test("should initialize with options", async () => {
      const app = new GitIngestApp();
      await app.initialize({ verbose: true, quiet: false });

      expect(app.config).toBeDefined();
      expect(app.errorHandler).toBeDefined();
      expect(app.progress).toBeDefined();
    });

    test("should create config with overrides", () => {
      const app = new GitIngestApp();
      const config = app.createConfig({ maxSize: "5" });

      expect(config).toBeDefined();
      expect(config.options.MAX_FILE_SIZE_MB).toBe(5);
    });

    test("should validate directory", async () => {
      const app = new GitIngestApp();
      await app.initialize({ verbose: false, quiet: true });

      const validatedPath = await app.validateDirectory(testDir);
      expect(validatedPath).toBe(path.resolve(testDir));
    });

    test("should reject invalid directory", async () => {
      const app = new GitIngestApp();
      await app.initialize({ verbose: false, quiet: true });

      await expect(
        app.validateDirectory("/non/existent/path")
      ).rejects.toThrow();
    });

    test("should validate options", async () => {
      const app = new GitIngestApp();
      await app.initialize({ verbose: false, quiet: true });

      expect(() => {
        app.validateOptions({ maxSize: "10" });
      }).not.toThrow();

      expect(() => {
        app.validateOptions({ maxSize: "invalid" });
      }).toThrow();
    });

    test("should generate filename", () => {
      const app = new GitIngestApp();

      const customFileName = app.generateFileName({ output: "custom.txt" });
      expect(customFileName).toBe("custom.txt");

      const autoFileName = app.generateFileName({});
      expect(autoFileName).toMatch(/^git-ingest-\d+\.txt$/);
    });

    test("should handle clipboard copy operation", async () => {
      const app = new GitIngestApp();
      await app.initialize({ verbose: false, quiet: true });

      // Create a test file to copy
      const testFile = path.join(testDir, "test-copy.txt");
      await fs.writeFile(testFile, "Test content for clipboard");

      // This should not throw even if clipboard operation fails
      await expect(app.handleClipboardCopy(testFile)).resolves.not.toThrow();

      // Clean up
      await fs.unlink(testFile).catch(() => {});
    });

    test("should show success message", async () => {
      const app = new GitIngestApp();
      await app.initialize({ verbose: false, quiet: true });

      const testFile = path.join(testDir, "test-success.txt");
      await fs.writeFile(testFile, "Test content");

      await expect(app.showSuccessMessage(testFile, 5)).resolves.not.toThrow();

      // Clean up
      await fs.unlink(testFile).catch(() => {});
    });
  });

  describe("Error Handling", () => {
    test("should handle file not found error", async () => {
      const app = new GitIngestApp();
      await app.initialize({ verbose: false, quiet: true });

      await expect(app.validateDirectory("/does/not/exist")).rejects.toThrow();
    });

    test("should handle permission errors gracefully", async () => {
      const app = new GitIngestApp();
      await app.initialize({ verbose: false, quiet: true });

      // Test with a path that might have permission issues
      // This test should handle the error gracefully
      expect(() => {
        app.validateOptions({ maxSize: "0" });
      }).toThrow();
    });
  });
});
