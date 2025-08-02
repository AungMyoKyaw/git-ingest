/**
 * Unit tests for language-detector module
 */

import {
  detectLanguage,
  getSupportedLanguages,
  getLanguageStats,
  formatLanguageDetection
} from "../language-detector.js";

describe("Language Detector Module", () => {
  describe("detectLanguage", () => {
    test("should detect JavaScript files correctly", () => {
      const result = detectLanguage("app.js");
      expect(result.language).toBe("javascript");
      expect(result.confidence).toBe("medium");
      expect(result.source).toBe("extension");
      expect(result.category).toBe("Web Frontend");
    });

    test("should detect TypeScript files correctly", () => {
      const result = detectLanguage("component.tsx");
      expect(result.language).toBe("tsx");
      expect(result.confidence).toBe("medium");
      expect(result.source).toBe("extension");
      expect(result.category).toBe("Web Frontend");
    });

    test("should detect Python files correctly", () => {
      const result = detectLanguage("script.py");
      expect(result.language).toBe("python");
      expect(result.confidence).toBe("medium");
      expect(result.source).toBe("extension");
      expect(result.category).toBe("Backend/Server");
    });

    test("should detect special filenames with high confidence", () => {
      const result = detectLanguage("Dockerfile");
      expect(result.language).toBe("dockerfile");
      expect(result.confidence).toBe("high");
      expect(result.source).toBe("filename");
      expect(result.category).toBe("DevOps");
    });

    test("should detect package.json with high confidence", () => {
      const result = detectLanguage("package.json");
      expect(result.language).toBe("json");
      expect(result.confidence).toBe("high");
      expect(result.source).toBe("filename");
      expect(result.category).toBe("Data/Config");
    });

    test("should detect shell scripts", () => {
      const result = detectLanguage("deploy.sh");
      expect(result.language).toBe("bash");
      expect(result.confidence).toBe("medium");
      expect(result.source).toBe("extension");
      expect(result.category).toBe("Scripting");
    });

    test("should detect CSS files", () => {
      const result = detectLanguage("styles.css");
      expect(result.language).toBe("css");
      expect(result.confidence).toBe("medium");
      expect(result.source).toBe("extension");
      expect(result.category).toBe("Web Frontend");
    });

    test("should detect Markdown files", () => {
      const result = detectLanguage("README.md");
      expect(result.language).toBe("markdown");
      expect(result.confidence).toBe("medium");
      expect(result.source).toBe("extension");
      expect(result.category).toBe("Documentation");
    });

    test("should handle unknown file extensions", () => {
      const result = detectLanguage("unknown.xyz");
      expect(result.language).toBe("text");
      expect(result.confidence).toBe("low");
      expect(result.source).toBe("unknown");
      expect(result.category).toBe("Other");
    });

    test("should handle files without extensions", () => {
      const result = detectLanguage("somefile");
      expect(result.language).toBe("text");
      expect(result.confidence).toBe("low");
      expect(result.source).toBe("fallback");
      expect(result.category).toBe("Other");
    });

    test("should prioritize filename patterns over extensions", () => {
      const result = detectLanguage("webpack.config.js");
      expect(result.language).toBe("javascript");
      expect(result.confidence).toBe("high");
      expect(result.source).toBe("filename");
    });

    test("should detect various config files", () => {
      const configs = [
        { file: "tsconfig.json", expected: "json" },
        { file: ".eslintrc", expected: "json" },
        { file: ".babelrc", expected: "json" },
        { file: "jest.config.js", expected: "javascript" },
        { file: "tailwind.config.js", expected: "javascript" }
      ];

      configs.forEach(({ file, expected }) => {
        const result = detectLanguage(file);
        expect(result.language).toBe(expected);
        expect(result.confidence).toBe("high");
        expect(result.source).toBe("filename");
      });
    });

    test("should detect multiple programming languages", () => {
      const languages = [
        { file: "main.go", expected: "go" },
        { file: "app.rb", expected: "ruby" },
        { file: "script.php", expected: "php" },
        { file: "component.swift", expected: "swift" },
        { file: "main.rs", expected: "rust" },
        { file: "app.kt", expected: "kotlin" },
        { file: "script.lua", expected: "lua" },
        { file: "main.cpp", expected: "cpp" },
        { file: "app.cs", expected: "csharp" }
      ];

      languages.forEach(({ file, expected }) => {
        const result = detectLanguage(file);
        expect(result.language).toBe(expected);
        expect(result.confidence).toBe("medium");
        expect(result.source).toBe("extension");
      });
    });
  });

  describe("getSupportedLanguages", () => {
    test("should return array of supported languages", () => {
      const languages = getSupportedLanguages();
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(50);
      expect(languages).toContain("javascript");
      expect(languages).toContain("python");
      expect(languages).toContain("typescript");
      expect(languages).toContain("markdown");
    });

    test("should return sorted languages", () => {
      const languages = getSupportedLanguages();
      const sortedLanguages = [...languages].sort();
      expect(languages).toEqual(sortedLanguages);
    });
  });

  describe("getLanguageStats", () => {
    test("should calculate language statistics correctly", () => {
      const filePaths = [
        "app.js",
        "component.jsx",
        "styles.css",
        "README.md",
        "package.json",
        "script.py",
        "test.py"
      ];

      const stats = getLanguageStats(filePaths);

      expect(stats.total).toBe(7);
      expect(stats.byLanguage.javascript.count).toBe(1);
      expect(stats.byLanguage.jsx.count).toBe(1);
      expect(stats.byLanguage.python.count).toBe(2);
      expect(stats.byLanguage.css.count).toBe(1);
      expect(stats.byLanguage.markdown.count).toBe(1);
      expect(stats.byLanguage.json.count).toBe(1);
    });

    test("should calculate category statistics correctly", () => {
      const filePaths = [
        "app.js",
        "component.jsx",
        "styles.css",
        "README.md",
        "script.py"
      ];

      const stats = getLanguageStats(filePaths);

      expect(stats.byCategory["Web Frontend"].count).toBe(3);
      expect(stats.byCategory["Backend/Server"].count).toBe(1);
      expect(stats.byCategory["Documentation"].count).toBe(1);
    });

    test("should handle empty file paths array", () => {
      const stats = getLanguageStats([]);
      expect(stats.total).toBe(0);
      expect(Object.keys(stats.byLanguage)).toHaveLength(0);
      expect(Object.keys(stats.byCategory)).toHaveLength(0);
      expect(stats.unknown).toBe(0);
    });

    test("should count unknown files correctly", () => {
      const filePaths = ["unknown.xyz", "somefile", "app.js"];

      const stats = getLanguageStats(filePaths);
      expect(stats.unknown).toBe(2);
    });
  });

  describe("formatLanguageDetection", () => {
    test("should format high confidence detection", () => {
      const detection = {
        language: "javascript",
        confidence: "high",
        source: "filename",
        category: "Web Frontend"
      };

      const formatted = formatLanguageDetection(detection);
      expect(formatted).toBe("javascript ✓ (filename)");
    });

    test("should format medium confidence detection", () => {
      const detection = {
        language: "python",
        confidence: "medium",
        source: "extension",
        category: "Backend/Server"
      };

      const formatted = formatLanguageDetection(detection);
      expect(formatted).toBe("python ~ (extension)");
    });

    test("should format low confidence detection", () => {
      const detection = {
        language: "text",
        confidence: "low",
        source: "unknown",
        category: "Other"
      };

      const formatted = formatLanguageDetection(detection);
      expect(formatted).toBe("text ? (unknown)");
    });
  });

  describe("Language Categories", () => {
    test("should categorize web frontend languages correctly", () => {
      const webFiles = [
        "app.js",
        "component.jsx",
        "styles.css",
        "template.html"
      ];

      webFiles.forEach((file) => {
        const result = detectLanguage(file);
        expect(result.category).toBe("Web Frontend");
      });
    });

    test("should categorize backend languages correctly", () => {
      const backendFiles = ["app.py", "server.java", "api.php"];

      backendFiles.forEach((file) => {
        const result = detectLanguage(file);
        expect(result.category).toBe("Backend/Server");
      });
    });

    test("should categorize scripting languages correctly", () => {
      const scriptFiles = ["deploy.sh", "script.ps1", "task.pl"];

      scriptFiles.forEach((file) => {
        const result = detectLanguage(file);
        expect(result.category).toBe("Scripting");
      });
    });

    test("should categorize data/config files correctly", () => {
      const configFiles = ["config.json", "settings.yaml", "data.xml"];

      configFiles.forEach((file) => {
        const result = detectLanguage(file);
        expect(result.category).toBe("Data/Config");
      });
    });
  });

  describe("Edge Cases", () => {
    test("should handle paths with directories", () => {
      const result = detectLanguage("/path/to/src/app.js");
      expect(result.language).toBe("javascript");
      expect(result.category).toBe("Web Frontend");
    });

    test("should handle case sensitivity in extensions", () => {
      const resultLower = detectLanguage("app.js");
      const resultUpper = detectLanguage("app.JS");

      expect(resultLower.language).toBe("javascript");
      expect(resultUpper.language).toBe("javascript");
    });

    test("should handle multiple dots in filename", () => {
      const result = detectLanguage("app.test.js");
      expect(result.language).toBe("javascript");
    });

    test("should handle hidden files", () => {
      const result = detectLanguage(".gitignore");
      expect(result.language).toBe("ignore");
    });
  });
});
