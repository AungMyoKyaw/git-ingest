import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getAllFilePaths, saveTreeToFile } from "../tree-generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Tree Generator", () => {
  const testDir = path.join(__dirname, "test-temp");
  let outputFile;

  beforeAll(async () => {
    // Create a persistent test directory
    await fs.mkdir(testDir, { recursive: true });

    // Create test file structure
    await fs.mkdir(path.join(testDir, "src"), { recursive: true });
    await fs.writeFile(path.join(testDir, "README.md"), "# Test Project");
    await fs.writeFile(path.join(testDir, "src", "index.js"), 'console.log("Hello World");');

    // Create a .gitignore file
    await fs.writeFile(path.join(testDir, ".gitignore"), "node_modules/\n*.log\n");
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
    });

    test("should handle empty directories", async () => {
      const emptyDir = path.join(testDir, "empty");
      await fs.mkdir(emptyDir, { recursive: true });

      const filePaths = await getAllFilePaths(emptyDir);
      expect(filePaths).toEqual([]);

      await fs.rmdir(emptyDir);
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
      expect(content).toContain("README.md");
      expect(content).toContain("src");
    });
  });
});
