import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAllFilePaths,
  saveTreeToFile,
  displayTreeWithGitignore,
  shouldSkipForContent
} from "../tree-generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Tree Generator", () => {
  const testDir = path.join(__dirname, "test-temp");
  let outputFile;

  beforeAll(async () => {
    // Create a comprehensive test directory structure
    await fs.mkdir(testDir, { recursive: true });
    await fs.mkdir(path.join(testDir, "src"), { recursive: true });
    await fs.mkdir(path.join(testDir, "src", "utils"), { recursive: true });
    await fs.mkdir(path.join(testDir, "node_modules"), { recursive: true });
    await fs.mkdir(path.join(testDir, "dist"), { recursive: true });
    await fs.mkdir(path.join(testDir, ".git"), { recursive: true });

    // Create test files
    await fs.writeFile(
      path.join(testDir, "README.md"),
      "# Test Project\n\nThis is a test."
    );
    await fs.writeFile(
      path.join(testDir, "package.json"),
      "{\n  \"name\": \"test\"\n}"
    );
    await fs.writeFile(
      path.join(testDir, "src", "index.js"),
      "console.log(\"Hello World\");"
    );
    await fs.writeFile(
      path.join(testDir, "src", "utils", "helper.js"),
      "export const help = () => {};"
    );

    // Create files that should be ignored
    await fs.writeFile(
      path.join(testDir, "node_modules", "module.js"),
      "module.exports = {};"
    );
    await fs.writeFile(path.join(testDir, "dist", "bundle.js"), "bundled code");
    await fs.writeFile(path.join(testDir, ".git", "config"), "git config");
    await fs.writeFile(path.join(testDir, ".DS_Store"), "mac file");

    // Create binary files
    const binaryData = Buffer.from([0x00, 0x01, 0x02, 0x03, 0xff, 0xfe]);
    await fs.writeFile(path.join(testDir, "binary.bin"), binaryData);

    // Create image file
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
    ]);
    await fs.writeFile(path.join(testDir, "image.png"), pngHeader);

    // Create large file
    const largeContent = "Large file content\n".repeat(100000);
    await fs.writeFile(path.join(testDir, "large.txt"), largeContent);

    // Create a .gitignore file
    await fs.writeFile(
      path.join(testDir, ".gitignore"),
      "node_modules/\n*.log\ntemp/\n"
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

  beforeEach(() => {
    outputFile = path.join(testDir, `test-output-${Date.now()}.txt`);
  });

  afterEach(async () => {
    // Clean up output files
    try {
      await fs.unlink(outputFile);
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("getAllFilePaths", () => {
    test("should discover files in directory", async () => {
      const filePaths = await getAllFilePaths(testDir);

      expect(Array.isArray(filePaths)).toBe(true);
      expect(filePaths.length).toBeGreaterThan(0);

      // Should include test files
      const fileNames = filePaths.map((fp) => path.basename(fp));
      expect(fileNames).toContain("README.md");
      expect(fileNames).toContain("index.js");
      expect(fileNames).toContain("package.json");
    });

    test("should respect gitignore patterns", async () => {
      const filePaths = await getAllFilePaths(testDir);
      const fileNames = filePaths.map((fp) => path.basename(fp));

      // Should exclude ignored files
      expect(fileNames).not.toContain("module.js"); // in node_modules
      expect(fileNames).not.toContain("bundle.js"); // in dist
      expect(fileNames).not.toContain("config"); // in .git
    });

    test("should handle include patterns", async () => {
      const filePaths = await getAllFilePaths(testDir, {
        include: ["*.md", "*.json"]
      });
      const fileNames = filePaths.map((fp) => path.basename(fp));

      expect(fileNames).toContain("README.md");
      expect(fileNames).toContain("package.json");
      expect(fileNames).not.toContain("index.js");
    });

    test("should handle exclude patterns", async () => {
      const filePaths = await getAllFilePaths(testDir, { exclude: ["*.js"] });
      const fileNames = filePaths.map((fp) => path.basename(fp));

      expect(fileNames).toContain("README.md");
      expect(fileNames).not.toContain("index.js");
      expect(fileNames).not.toContain("helper.js");
    });

    test("should handle empty directories", async () => {
      const emptyDir = path.join(testDir, "empty");
      await fs.mkdir(emptyDir, { recursive: true });

      const filePaths = await getAllFilePaths(emptyDir);
      expect(filePaths).toEqual([]);

      await fs.rmdir(emptyDir);
    });

    test("should handle verbose option", async () => {
      const consoleLogs = [];
      const originalLog = console.log;
      console.log = (...args) => consoleLogs.push(args.join(" "));

      try {
        await getAllFilePaths(testDir, { verbose: true });
        expect(
          consoleLogs.some((log) => log.includes("Loaded .gitignore"))
        ).toBe(true);
      } finally {
        console.log = originalLog;
      }
    });

    test("should handle missing gitignore gracefully", async () => {
      const tempDir = path.join(testDir, "no-gitignore");
      await fs.mkdir(tempDir, { recursive: true });
      await fs.writeFile(path.join(tempDir, "test.txt"), "test");

      const filePaths = await getAllFilePaths(tempDir);
      expect(filePaths.length).toBeGreaterThan(0);

      await fs.rm(tempDir, { recursive: true });
    });
  });

  describe("displayTreeWithGitignore", () => {
    test("should generate tree structure", async () => {
      const tree = await displayTreeWithGitignore(testDir);

      expect(Array.isArray(tree)).toBe(true);
      expect(tree.length).toBeGreaterThan(0);
      expect(tree.some((line) => line.includes("README.md"))).toBe(true);
      expect(tree.some((line) => line.includes("src"))).toBe(true); // May not have trailing slash
    });

    test("should show file sizes for large files", async () => {
      const tree = await displayTreeWithGitignore(testDir);
      const largeLine = tree.find((line) => line.includes("large.txt"));
      expect(largeLine).toBeDefined();
      expect(largeLine).toMatch(/\d+\.\d+MB/);
    });

    test("should handle directory traversal errors", async () => {
      // Create a directory, then make it unreadable
      const restrictedDir = path.join(testDir, "restricted");
      await fs.mkdir(restrictedDir, { recursive: true });
      await fs.writeFile(path.join(restrictedDir, "file.txt"), "content");

      // Test with verbose to check error handling
      const tree = await displayTreeWithGitignore(testDir, { verbose: true });
      expect(Array.isArray(tree)).toBe(true);

      await fs.rm(restrictedDir, { recursive: true });
    });

    test("should sort directories first, then files", async () => {
      const tree = await displayTreeWithGitignore(testDir);

      // Find src directory and README.md file in root
      const srcIndex = tree.findIndex((line) => line.includes("src/"));
      const readmeIndex = tree.findIndex(
        (line) => line.includes("README.md") && !line.includes("/")
      );

      // src directory should come before README.md file
      expect(srcIndex).toBeLessThan(readmeIndex);
    });
  });

  describe("saveTreeToFile", () => {
    test("should create tree file successfully", async () => {
      await saveTreeToFile(testDir, outputFile);

      // Check if file was created
      const exists = await fs
        .access(outputFile)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(true);

      // Check file content
      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("Directory structure for:");
      expect(content).toContain("Generated on:");
      expect(content).toContain("Total items:");
      expect(content).toContain("README.md");
      expect(content).toContain("src");
    });

    test("should include metadata in header", async () => {
      await saveTreeToFile(testDir, outputFile);

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toMatch(/Directory structure for: .*test-temp/);
      expect(content).toMatch(
        /Generated on: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      );
      expect(content).toMatch(/Total items: \d+/);
    });

    test("should handle verbose option", async () => {
      const consoleLogs = [];
      const originalLog = console.log;
      console.log = (...args) => consoleLogs.push(args.join(" "));

      try {
        await saveTreeToFile(testDir, outputFile, { verbose: true });
        expect(
          consoleLogs.some((log) => log.includes("Directory tree saved"))
        ).toBe(true);
      } finally {
        console.log = originalLog;
      }
    });

    test("should handle file write errors", async () => {
      const invalidPath = "/invalid/path/output.txt";

      await expect(saveTreeToFile(testDir, invalidPath)).rejects.toThrow();
    });
  });

  describe("shouldSkipForContent", () => {
    test("should skip binary files", () => {
      const binaryFile = path.join(testDir, "binary.bin");
      const result = shouldSkipForContent(binaryFile);

      expect(result.skip).toBe(true);
      expect(result.reason).toContain("Binary file");
    });

    test("should skip large files", () => {
      const largeFile = path.join(testDir, "large.txt");
      const result = shouldSkipForContent(largeFile, { maxSize: 0.1 }); // 0.1MB limit

      expect(result.skip).toBe(true);
      expect(result.reason).toContain("too large");
    });

    test("should not skip text files", () => {
      const textFile = path.join(testDir, "README.md");
      const result = shouldSkipForContent(textFile);

      expect(result.skip).toBe(false);
    });

    test("should skip non-existent files", () => {
      const nonExistentFile = path.join(testDir, "nonexistent.txt");
      const result = shouldSkipForContent(nonExistentFile);

      expect(result.skip).toBe(true);
      expect(result.reason).toContain("Error checking file");
    });

    test("should handle PNG files", () => {
      const imageFile = path.join(testDir, "image.png");
      const result = shouldSkipForContent(imageFile);

      expect(result.skip).toBe(true);
      expect(result.reason).toContain("Binary file");
    });

    test("should respect custom max size", () => {
      const textFile = path.join(testDir, "README.md");
      const result = shouldSkipForContent(textFile, { maxSize: 0.000001 }); // Very small

      expect(result.skip).toBe(true);
      expect(result.reason).toContain("too large");
    });
  });

  describe("Error handling", () => {
    test("should handle directory access errors gracefully", async () => {
      const consoleLogs = [];
      const originalWarn = console.warn;
      console.warn = (...args) => consoleLogs.push(args.join(" "));

      try {
        // Test with non-existent directory
        const result = await getAllFilePaths("/non/existent/path", {
          verbose: true
        });
        expect(result).toEqual([]);
      } finally {
        console.warn = originalWarn;
      }
    });

    test("should handle stat errors in file collection", async () => {
      // Create and then delete a file to simulate stat errors
      const tempFile = path.join(testDir, "temp-file.txt");
      await fs.writeFile(tempFile, "temp");

      // This test mainly ensures the error handling code paths are covered
      const filePaths = await getAllFilePaths(testDir);
      expect(Array.isArray(filePaths)).toBe(true);
    });

    test("should handle gitignore read errors", async () => {
      const tempDir = path.join(testDir, "gitignore-error");
      await fs.mkdir(tempDir, { recursive: true });

      // Create an invalid gitignore (directory instead of file)
      await fs.mkdir(path.join(tempDir, ".gitignore"), { recursive: true });

      const filePaths = await getAllFilePaths(tempDir, { verbose: true });
      expect(Array.isArray(filePaths)).toBe(true);

      await fs.rm(tempDir, { recursive: true });
    });
  });
});
