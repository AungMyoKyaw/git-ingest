import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  appendFileContentsToTree,
  appendFileContentsStreaming,
  getFileStats
} from "../read-file-and-append.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Read File and Append Module", () => {
  const testDir = path.join(__dirname, "append-test-temp");
  let outputFile;

  beforeAll(async () => {
    // Create test directory structure
    await fs.mkdir(testDir, { recursive: true });
    await fs.mkdir(path.join(testDir, "src"), { recursive: true });

    // Create various test files
    await fs.writeFile(path.join(testDir, "small.txt"), "Small file content");
    await fs.writeFile(
      path.join(testDir, "medium.txt"),
      `${"A".repeat(1000)}\nMedium file content\n${"B".repeat(1000)}`
    );
    await fs.writeFile(
      path.join(testDir, "large.txt"),
      "Large file content\n".repeat(50000)
    );
    await fs.writeFile(
      path.join(testDir, "src", "code.js"),
      'function hello() {\n  console.log("Hello World");\n}\n\nexport default hello;'
    );
    await fs.writeFile(
      path.join(testDir, "README.md"),
      "# Test Project\n\nThis is a **markdown** file."
    );

    // Create a binary file
    const binaryData = Buffer.from([0x00, 0x01, 0x02, 0x03, 0xff, 0xfe]);
    await fs.writeFile(path.join(testDir, "binary.bin"), binaryData);

    // Create an image file (PNG header)
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
    ]);
    await fs.writeFile(path.join(testDir, "image.png"), pngHeader);
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

  describe("appendFileContentsToTree", () => {
    test("should append text file contents", async () => {
      const filePaths = [
        path.join(testDir, "small.txt"),
        path.join(testDir, "README.md")
      ];

      await appendFileContentsToTree(filePaths, outputFile);

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("File: ");
      expect(content).toContain("small.txt");
      expect(content).toContain("Small file content");
      expect(content).toContain("README.md");
      expect(content).toContain("# Test Project");
      expect(content).toContain("**markdown**");
    });

    test("should handle empty file list", async () => {
      await appendFileContentsToTree([], outputFile);

      const exists = await fs
        .access(outputFile)
        .then(() => true)
        .catch(() => false);
      expect(exists).toBe(false);
    });

    test("should skip binary files", async () => {
      const filePaths = [
        path.join(testDir, "small.txt"),
        path.join(testDir, "binary.bin"),
        path.join(testDir, "image.png")
      ];

      await appendFileContentsToTree(filePaths, outputFile);

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("Small file content");
      expect(content).toContain("[Binary file]");
      expect(content).toContain("binary.bin");
      expect(content).toContain("image.png");
    });

    test("should handle large files with truncation", async () => {
      const filePaths = [path.join(testDir, "large.txt")];

      await appendFileContentsToTree(filePaths, outputFile, { maxSize: 0.1 }); // 0.1MB

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("large.txt");
      expect(content).toContain("[File too large");
    });

    test("should handle files that are too large", async () => {
      const filePaths = [path.join(testDir, "large.txt")];

      await appendFileContentsToTree(filePaths, outputFile, { maxSize: 0.001 }); // Very small

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("large.txt");
      expect(content).toContain("[File too large");
    });

    test("should handle file read errors gracefully", async () => {
      const filePaths = [
        path.join(testDir, "small.txt"),
        path.join(testDir, "nonexistent.txt")
      ];

      await appendFileContentsToTree(filePaths, outputFile);

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("Small file content");
      expect(content).toContain("Cannot access file");
    });

    test("should show processing summary in verbose mode", async () => {
      const filePaths = [
        path.join(testDir, "small.txt"),
        path.join(testDir, "binary.bin")
      ];

      // Capture console output
      const consoleLogs = [];
      const originalLog = console.log;
      console.log = (...args) => consoleLogs.push(args.join(" "));

      try {
        await appendFileContentsToTree(filePaths, outputFile, {
          verbose: true
        });

        expect(consoleLogs.some((log) => log.includes("Processed"))).toBe(true);
        expect(consoleLogs.some((log) => log.includes("Skipped"))).toBe(true);
      } finally {
        console.log = originalLog;
      }
    });

    test("should work in quiet mode", async () => {
      const filePaths = [path.join(testDir, "small.txt")];

      // Capture console output
      const consoleLogs = [];
      const originalLog = console.log;
      console.log = (...args) => consoleLogs.push(args.join(" "));

      try {
        await appendFileContentsToTree(filePaths, outputFile, { quiet: true });

        // Should not have verbose output
        expect(consoleLogs.length).toBe(0);
      } finally {
        console.log = originalLog;
      }
    });
  });

  describe("appendFileContentsStreaming", () => {
    test("should stream file contents efficiently", async () => {
      const filePaths = [
        path.join(testDir, "small.txt"),
        path.join(testDir, "medium.txt")
      ];

      await appendFileContentsStreaming(filePaths, outputFile);

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("Small file content");
      expect(content).toContain("Medium file content");
    });

    test("should handle streaming errors", async () => {
      const filePaths = [
        path.join(testDir, "small.txt"),
        path.join(testDir, "nonexistent.txt")
      ];

      await appendFileContentsStreaming(filePaths, outputFile);

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("Small file content");
      expect(content).toContain("Cannot access file");
    });
  });

  describe("getFileStats", () => {
    test("should calculate file statistics", async () => {
      const filePaths = [
        path.join(testDir, "small.txt"),
        path.join(testDir, "medium.txt"),
        path.join(testDir, "binary.bin"),
        path.join(testDir, "image.png")
      ];

      const stats = await getFileStats(filePaths);

      expect(stats.totalFiles).toBe(4);
      expect(stats.textFiles).toBeGreaterThan(0);
      expect(stats.binaryFiles).toBeGreaterThan(0);
      expect(stats.totalSizeBytes).toBeGreaterThan(0);
      expect(stats.totalSizeMB).toBeGreaterThan(0);
    });

    test("should handle large files in statistics", async () => {
      const filePaths = [path.join(testDir, "large.txt")];

      const stats = await getFileStats(filePaths, { maxSize: 0.001 });

      expect(stats.totalFiles).toBe(1);
      expect(stats.largeFiles).toBe(1);
      expect(stats.textFiles).toBe(0);
    });

    test("should handle inaccessible files", async () => {
      const filePaths = [
        path.join(testDir, "small.txt"),
        path.join(testDir, "nonexistent.txt")
      ];

      const stats = await getFileStats(filePaths);

      expect(stats.totalFiles).toBe(2);
      expect(stats.textFiles).toBe(1);
    });

    test("should return correct size calculations", async () => {
      const filePaths = [path.join(testDir, "small.txt")];
      const smallFileSize = (await fs.stat(path.join(testDir, "small.txt")))
        .size;

      const stats = await getFileStats(filePaths);

      expect(stats.totalSizeBytes).toBe(smallFileSize);
      expect(stats.totalSizeMB).toBeCloseTo(smallFileSize / (1024 * 1024), 6);
    });
  });

  describe("File formatting", () => {
    test("should format file headers correctly", async () => {
      const filePath = path.join(testDir, "header.txt");
      await fs.writeFile(filePath, "header content");

      await appendFileContentsToTree([filePath], outputFile, { verbose: true });

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("File:");
      expect(content).toContain("header.txt");
    });

    test("should use relative paths in file headers", async () => {
      const filePath = path.join(testDir, "relative.txt");
      await fs.writeFile(filePath, "relative content");

      await appendFileContentsToTree([filePath], outputFile, {
        verbose: false
      });

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("relative.txt");
    });

    test("should handle errors during processing", async () => {
      // Create valid and invalid files
      const validFile = path.join(testDir, "valid.txt");
      const invalidFile = path.join(testDir, "nonexistent.txt");

      await fs.writeFile(validFile, "valid content");
      // Don't create invalidFile - it will cause a read error

      // The function should handle the error gracefully and still process valid files
      await appendFileContentsToTree([validFile, invalidFile], outputFile, {
        verbose: true
      });

      const content = await fs.readFile(outputFile, "utf8");
      expect(content).toContain("valid content");
    });
  });
});
