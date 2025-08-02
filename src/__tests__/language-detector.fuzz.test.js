import { detectLanguage } from "../language-detector.js";

describe("Language Detector Fuzz/Property Tests", () => {
  test("should not throw for random unicode and control character filenames", () => {
    const weirdNames = [
      "\u0000\u0001\u0002file.js",
      "\u202Egnp.exe", // Right-to-left override
      "file with spaces.txt",
      "file.verylongextensionthatdoesnotexist",
      "file.日本語.md",
      "file.😀.js",
      "file...js",
      ".hiddenfile",
      "CON", // Windows reserved
      "AUX.txt",
      "nul",
      "file."
    ];
    for (const name of weirdNames) {
      expect(() => detectLanguage(name)).not.toThrow();
      const result = detectLanguage(name);
      expect(result).toHaveProperty("language");
      expect(result).toHaveProperty("confidence");
      expect(result).toHaveProperty("source");
      expect(result).toHaveProperty("category");
    }
  });

  test("should handle very long filenames and paths", () => {
    const longName = "a".repeat(255) + ".js";
    const longPath = "/tmp/" + Array(20).fill(longName).join("/");
    expect(() => detectLanguage(longPath)).not.toThrow();
    const result = detectLanguage(longPath);
    expect(result).toHaveProperty("language");
  });

  test("should handle filenames with multiple dots and no extension", () => {
    const names = [
      "file..js",
      "file...",
      "file",
      ".file",
      "file.name.with.many.dots"
    ];
    for (const name of names) {
      expect(() => detectLanguage(name)).not.toThrow();
      const result = detectLanguage(name);
      expect(result).toHaveProperty("language");
    }
  });
});
