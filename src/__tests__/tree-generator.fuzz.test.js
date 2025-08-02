import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAllFilePaths,
  displayTreeWithGitignore
} from "../tree-generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Tree Generator Fuzz/Edge Case Tests", () => {
  const testDir = path.join(__dirname, "tree-fuzz-temp");

  let longNameCreated = false;
  let longName = "a".repeat(255) + ".js";
  // Move these to describe scope so they're accessible in tests
  let conCreated = true,
    auxCreated = true;
  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(path.join(testDir, "file with spaces.txt"), "test");
    await fs.writeFile(path.join(testDir, "file.日本語.md"), "test");
    await fs.writeFile(path.join(testDir, "file.😀.js"), "test");
    await fs.writeFile(path.join(testDir, ".hiddenfile"), "test");
    await fs.writeFile(path.join(testDir, "file...js"), "test");
    // Handle reserved filenames on Windows
    try {
      await fs.writeFile(path.join(testDir, "CON"), "test");
    } catch (err) {
      if (
        process.platform === "win32" &&
        (err.code === "EPERM" || err.code === "EINVAL")
      ) {
        conCreated = false;
      } else {
        throw err;
      }
    }
    try {
      await fs.writeFile(path.join(testDir, "AUX.txt"), "test");
    } catch (err) {
      if (
        process.platform === "win32" &&
        (err.code === "EPERM" || err.code === "EINVAL")
      ) {
        auxCreated = false;
      } else {
        throw err;
      }
    }
    await fs.writeFile(path.join(testDir, "file."), "test");
    // Very long filename (handle ENAMETOOLONG gracefully)
    try {
      await fs.writeFile(path.join(testDir, longName), "test");
      longNameCreated = true;
    } catch (err) {
      if (err.code === "ENAMETOOLONG") {
        longNameCreated = false;
        // Skip long filename related assertions
      } else {
        throw err;
      }
    }
    // Deeply nested directories
    let deepDir = testDir;
    for (let i = 0; i < 10; i++) {
      deepDir = path.join(deepDir, `nested${i}`);
      await fs.mkdir(deepDir, { recursive: true });
      await fs.writeFile(path.join(deepDir, `file${i}.txt`), "test");
    }
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test("should not throw for directories with special/unicode/long names", async () => {
    await expect(getAllFilePaths(testDir)).resolves.toBeInstanceOf(Array);
    await expect(displayTreeWithGitignore(testDir)).resolves.toBeInstanceOf(
      Array
    );
  });

  test("should include all special files in file list", async () => {
    const files = await getAllFilePaths(testDir);
    expect(files.some((f) => f.includes("file with spaces.txt"))).toBe(true);
    expect(files.some((f) => f.includes("file.日本語.md"))).toBe(true);
    expect(files.some((f) => f.includes("file.😀.js"))).toBe(true);
    expect(files.some((f) => f.includes(".hiddenfile"))).toBe(true);
    expect(files.some((f) => f.includes("file...js"))).toBe(true);
    if (conCreated) {
      expect(files.some((f) => f.includes("CON"))).toBe(true);
    }
    if (auxCreated) {
      expect(files.some((f) => f.includes("AUX.txt"))).toBe(true);
    }
    expect(files.some((f) => f.includes("file."))).toBe(true);
    if (longNameCreated) {
      expect(files.some((f) => f.includes(longName))).toBe(true);
    }
  });

  test("should traverse deeply nested directories", async () => {
    const files = await getAllFilePaths(testDir);
    for (let i = 0; i < 10; i++) {
      const nestedPath = path.join(`nested${i}`, `file${i}.txt`);
      expect(files.some((f) => f.includes(nestedPath))).toBe(true);
    }
  });
});
