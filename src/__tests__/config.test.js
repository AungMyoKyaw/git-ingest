import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Config } from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("Config Module", () => {
  const testDir = path.join(__dirname, "config-test-temp");
  let testConfigFile;

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
    testConfigFile = path.join(testDir, "test-config.json");
  });

  afterAll(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("Default Configuration", () => {
    test("should create default config with correct values", () => {
      const config = new Config();

      expect(config.options.MAX_FILE_SIZE_MB).toBe(10);
      expect(config.options.TRUNCATE_SIZE_BYTES).toBe(2048 * 1024);
      expect(config.options.OUTPUT_FORMATS).toEqual(["text", "json", "markdown"]);
      expect(config.maxFileSizeBytes).toBe(10 * 1024 * 1024);
    });

    test("should provide default ignore patterns", () => {
      const config = new Config();
      const patterns = config.getIgnorePatterns();

      expect(patterns).toContain("node_modules");
      expect(patterns).toContain(".git");
      expect(patterns).toContain("*.log");
      expect(patterns).toContain("dist");
    });

    test("should calculate file size limits correctly", () => {
      const config = new Config();

      expect(config.maxFileSizeBytes).toBe(10 * 1024 * 1024); // 10MB in bytes
      expect(config.options.TRUNCATE_SIZE_BYTES).toBe(2048 * 1024); // 2MB in bytes
    });
  });

  describe("Custom Configuration", () => {
    test("should accept custom options in constructor", () => {
      const customOptions = {
        MAX_FILE_SIZE_MB: 5,
        TRUNCATE_SIZE_BYTES: 1024 * 1024,
      };

      const config = new Config(customOptions);

      expect(config.options.MAX_FILE_SIZE_MB).toBe(5);
      expect(config.options.TRUNCATE_SIZE_BYTES).toBe(1024 * 1024);
      expect(config.maxFileSizeBytes).toBe(5 * 1024 * 1024);
    });

    test("should merge custom options with defaults", () => {
      const customOptions = {
        MAX_FILE_SIZE_MB: 20,
      };

      const config = new Config(customOptions);

      expect(config.options.MAX_FILE_SIZE_MB).toBe(20);
      expect(config.options.TRUNCATE_SIZE_BYTES).toBe(2048 * 1024); // Should keep default
      expect(config.options.OUTPUT_FORMATS).toEqual(["text", "json", "markdown"]); // Should keep default
    });
  });

  describe("Configuration Validation", () => {
    test("should validate max file size", () => {
      expect(() => new Config({ MAX_FILE_SIZE_MB: -1 })).toThrow();
      expect(() => new Config({ MAX_FILE_SIZE_MB: 0 })).toThrow();
      expect(() => new Config({ MAX_FILE_SIZE_MB: "invalid" })).toThrow();
    });

    test("should validate truncate size", () => {
      expect(() => new Config({ TRUNCATE_SIZE_BYTES: -1 })).toThrow();
      expect(() => new Config({ TRUNCATE_SIZE_BYTES: "invalid" })).toThrow();
    });

    test("should validate output formats", () => {
      expect(() => new Config({ OUTPUT_FORMATS: "invalid" })).toThrow();
      expect(() => new Config({ OUTPUT_FORMATS: [] })).toThrow();
    });
  });

  describe("File Operations", () => {
    test("should save configuration to file", async () => {
      const config = new Config({ MAX_FILE_SIZE_MB: 15 });

      await config.saveToFile(testConfigFile);

      const content = await fs.readFile(testConfigFile, "utf8");
      const savedConfig = JSON.parse(content);

      expect(savedConfig.MAX_FILE_SIZE_MB).toBe(15);
    });

    test("should load configuration from file", async () => {
      const testConfig = {
        MAX_FILE_SIZE_MB: 25,
        TRUNCATE_SIZE_BYTES: 512 * 1024,
      };

      await fs.writeFile(testConfigFile, JSON.stringify(testConfig, null, 2));

      const config = await Config.loadFromFile(testConfigFile);

      expect(config.options.MAX_FILE_SIZE_MB).toBe(25);
      expect(config.options.TRUNCATE_SIZE_BYTES).toBe(512 * 1024);
      expect(config.maxFileSizeBytes).toBe(25 * 1024 * 1024);
    });

    test("should handle missing config file", async () => {
      const nonExistentFile = path.join(testDir, "missing.json");

      await expect(Config.loadFromFile(nonExistentFile)).rejects.toThrow();
    });

    test("should handle invalid JSON in config file", async () => {
      const invalidConfigFile = path.join(testDir, "invalid.json");
      await fs.writeFile(invalidConfigFile, "{ invalid json }");

      await expect(Config.loadFromFile(invalidConfigFile)).rejects.toThrow();
    });
  });

  describe("Utility Methods", () => {
    test("should format file sizes correctly", () => {
      const config = new Config();

      expect(config.formatFileSize(1024)).toBe("1.00 KB");
      expect(config.formatFileSize(1024 * 1024)).toBe("1.00 MB");
      expect(config.formatFileSize(1024 * 1024 * 1024)).toBe("1.00 GB");
      expect(config.formatFileSize(500)).toBe("500 B");
    });

    test("should create separators correctly", () => {
      const config = new Config();

      const separator = config.createSeparator();
      expect(separator).toContain("=");
      expect(separator.length).toBeGreaterThan(40);

      const customSeparator = config.createSeparator(20, "-");
      expect(customSeparator).toContain("-");
      expect(customSeparator.length).toBe(20);
    });

    test("should check file size limits", () => {
      const config = new Config({ MAX_FILE_SIZE_MB: 1 });

      const smallFileCheck = config.checkFileSize(500 * 1024); // 500KB
      expect(smallFileCheck.exceedsLimit).toBe(false);
      expect(smallFileCheck.formattedSize).toBe("500.00 KB");

      const largeFileCheck = config.checkFileSize(2 * 1024 * 1024); // 2MB
      expect(largeFileCheck.exceedsLimit).toBe(true);
      expect(largeFileCheck.formattedSize).toBe("2.00 MB");
    });
  });

  describe("Configuration Cloning", () => {
    test("should clone configuration with overrides", () => {
      const originalConfig = new Config({ MAX_FILE_SIZE_MB: 10 });
      const clonedConfig = originalConfig.clone({ MAX_FILE_SIZE_MB: 20 });

      expect(originalConfig.options.MAX_FILE_SIZE_MB).toBe(10);
      expect(clonedConfig.options.MAX_FILE_SIZE_MB).toBe(20);
      expect(clonedConfig.maxFileSizeBytes).toBe(20 * 1024 * 1024);
    });

    test("should clone configuration without overrides", () => {
      const originalConfig = new Config({ MAX_FILE_SIZE_MB: 15 });
      const clonedConfig = originalConfig.clone();

      expect(clonedConfig.options.MAX_FILE_SIZE_MB).toBe(15);
      expect(clonedConfig.maxFileSizeBytes).toBe(15 * 1024 * 1024);
    });
  });
});
