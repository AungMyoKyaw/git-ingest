import { vi } from "vitest";
import {
  ProgressReporter,
  createProgressReporter
} from "../progress-reporter.js";

describe("Progress Reporter Module", () => {
  describe("ProgressReporter Class", () => {
    test("should create progress reporter with default options", () => {
      const reporter = new ProgressReporter();

      expect(reporter.verbose).toBe(false);
      expect(reporter.quiet).toBe(false);
      expect(reporter.stats.startTime).toBeInstanceOf(Date);
    });

    test("should create progress reporter with custom options", () => {
      const reporter = new ProgressReporter({ verbose: true, quiet: true });

      expect(reporter.verbose).toBe(true);
      expect(reporter.quiet).toBe(true);
    });

    test("should track statistics correctly", () => {
      const reporter = new ProgressReporter();

      expect(reporter.stats.filesProcessed).toBe(0);
      expect(reporter.stats.filesSkipped).toBe(0);
      expect(reporter.stats.errors).toBe(0);
      expect(reporter.stats.totalBytes).toBe(0);
    });
  });

  describe("File Progress Reporting", () => {
    test("should track file statistics", () => {
      const reporter = new ProgressReporter({ quiet: true }); // Quiet to avoid console output

      reporter.reportFileProgress("/test/file.txt", 1024, "processed");

      expect(reporter.stats.filesProcessed).toBe(1);
      expect(reporter.stats.totalBytes).toBe(1024);
    });

    test("should track skipped files", () => {
      const reporter = new ProgressReporter({ quiet: true });

      reporter.reportFileProgress("/test/file.bin", 0, "skipped");

      expect(reporter.stats.filesSkipped).toBe(1);
      expect(reporter.stats.totalBytes).toBe(0);
    });

    test("should track errors", () => {
      const reporter = new ProgressReporter({ quiet: true });

      reporter.reportFileProgress("/test/file.txt", 0, "error");

      expect(reporter.stats.errors).toBe(1);
    });

    test("should estimate time remaining", () => {
      const reporter = new ProgressReporter({ quiet: true });

      // Process some files to establish a rate
      reporter.reportFileProgress("/test/file1.txt", 1024, "processed");
      reporter.reportFileProgress("/test/file2.txt", 1024, "processed");

      const eta = reporter.getEstimatedTimeRemaining(10); // 10 total files

      expect(eta).toBeGreaterThan(0);
    });
  });

  describe("Utility Functions", () => {
    test("createProgressReporter should return ProgressReporter instance", () => {
      const reporter = createProgressReporter({ verbose: true });

      expect(reporter).toBeInstanceOf(ProgressReporter);
      expect(reporter.verbose).toBe(true);
    });

    test("should handle zero file processing time", () => {
      const reporter = new ProgressReporter({ quiet: true });

      // Should not throw error with zero elapsed time
      expect(() => {
        reporter.reportSummary();
      }).not.toThrow();
    });
  });

  describe("Progress Operations", () => {
    test("should start, update, and stop progress correctly", () => {
      const reporter = new ProgressReporter({ quiet: false }); // Not quiet so spinner is created

      reporter.start("Starting test");
      expect(reporter.currentSpinner).toBeTruthy();

      reporter.update("Updating test", 5, 10);
      reporter.succeed("Test completed");
      reporter.stop();

      expect(reporter.currentSpinner).toBeNull();
    });

    test("should fail progress operation", () => {
      const reporter = new ProgressReporter({ quiet: true });

      reporter.start("Starting test");
      reporter.fail("Test failed");

      expect(reporter.currentSpinner).toBeNull();
    });

    test("should update progress with percentage", () => {
      const reporter = new ProgressReporter({ quiet: true });

      reporter.start("Test", 100);
      expect(() => {
        reporter.updateProgress(50, 100, "Half way");
      }).not.toThrow();
    });
  });

  describe("Utility Methods", () => {
    test("should format duration correctly", () => {
      const reporter = new ProgressReporter({ quiet: true });

      expect(reporter.formatDuration(500)).toBe("500ms");
      expect(reporter.formatDuration(1500)).toBe("1.5s");
      expect(reporter.formatDuration(65000)).toBe("1m 5s");
      expect(reporter.formatDuration(3665000)).toBe("1h 1m");
    });

    test("should format bytes correctly", () => {
      const reporter = new ProgressReporter({ quiet: true });

      expect(reporter.formatBytes(0)).toBe("0B");
      expect(reporter.formatBytes(512)).toBe("512.0B");
      expect(reporter.formatBytes(1024)).toBe("1.0KB");
      expect(reporter.formatBytes(1048576)).toBe("1.0MB");
      expect(reporter.formatBytes(1073741824)).toBe("1.0GB");
    });

    test("should create progress bar", () => {
      const reporter = new ProgressReporter({ quiet: true });

      const progressBar = reporter.createProgressBar(5, 10, 10);
      expect(progressBar).toContain("[");
      expect(progressBar).toContain("]");
    });

    test("should calculate time estimate", () => {
      const reporter = new ProgressReporter({ quiet: true });
      reporter.startTime = Date.now() - 1000; // 1 second ago

      const estimate = reporter.calculateTimeEstimate(5, 10);
      expect(estimate).toBeTruthy();
    });

    test("should get status icon", () => {
      const reporter = new ProgressReporter({ quiet: true });

      expect(reporter.getStatusIcon("processed")).toContain("✅");
      expect(reporter.getStatusIcon("skipped")).toContain("⏭️");
      expect(reporter.getStatusIcon("error")).toContain("❌");
      expect(reporter.getStatusIcon("unknown")).toBe("ℹ️");
    });

    test("should get relative path", () => {
      const reporter = new ProgressReporter({ quiet: true });

      const relativePath = reporter.getRelativePath("/some/path/file.txt");
      expect(typeof relativePath).toBe("string");
    });
  });

  describe("Logging Methods", () => {
    test("should have verbose and quiet properties", () => {
      const reporter = new ProgressReporter({ verbose: true, quiet: false });

      expect(typeof reporter.verbose).toBe("boolean");
      expect(typeof reporter.quiet).toBe("boolean");
      expect(typeof reporter.info).toBe("function");
      expect(typeof reporter.warn).toBe("function");
      expect(typeof reporter.error).toBe("function");
      expect(typeof reporter.success).toBe("function");
    });

    test("should call logging methods without errors", () => {
      const reporter = new ProgressReporter({ quiet: true });

      expect(() => {
        reporter.info("Test info message");
        reporter.warn("Test warning message");
        reporter.error("Test error message");
        reporter.success("Test success message");
      }).not.toThrow();
    });

    test("should call logging methods in non-quiet mode", () => {
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      const mockConsoleLog = vi.fn();
      const mockConsoleError = vi.fn();
      console.log = mockConsoleLog;
      console.error = mockConsoleError;

      const reporter = new ProgressReporter({ quiet: false });

      reporter.error("Test error message");
      reporter.success("Test success message");

      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining("❌ Test error message")
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining("✅ Test success message")
      );

      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    });
  });

  describe("Statistics Management", () => {
    test("should get and reset statistics", () => {
      const reporter = new ProgressReporter({ quiet: true });

      reporter.reportFileProgress("/test/file.txt", 1024, "processed");

      const stats = reporter.getStats();
      expect(stats.filesProcessed).toBe(1);
      expect(stats.totalBytes).toBe(1024);

      reporter.resetStats();
      const newStats = reporter.getStats();
      expect(newStats.filesProcessed).toBe(0);
      expect(newStats.totalBytes).toBe(0);
    });
  });

  describe("Error Handling", () => {
    test("should handle missing spinner gracefully", () => {
      const reporter = new ProgressReporter({ quiet: true });
      reporter.spinner = null;

      expect(() => {
        reporter.start("Test");
        reporter.succeed("Test");
        reporter.fail("Test");
        reporter.updateProgress(1, 10, "test");
      }).not.toThrow();
    });

    test("should handle invalid file paths in progress reporting", () => {
      const reporter = new ProgressReporter({ quiet: true });

      expect(() => {
        reporter.reportFileProgress("", 1024, "processed");
        reporter.reportFileProgress(null, 1024, "processed");
      }).not.toThrow();
    });

    test("should handle time estimate with no start time", () => {
      const reporter = new ProgressReporter({ quiet: true });
      reporter.startTime = null;

      const estimate = reporter.calculateTimeEstimate(5, 10);
      expect(estimate).toBeNull();
    });

    test("should handle time estimate with zero completed", () => {
      const reporter = new ProgressReporter({ quiet: true });
      reporter.startTime = Date.now();

      const estimate = reporter.calculateTimeEstimate(0, 10);
      expect(estimate).toBeNull();
    });
  });

  describe("Additional Coverage Tests", () => {
    test("should handle reporting summary with non-quiet mode", () => {
      const reporter = new ProgressReporter({ quiet: false });

      // Set some stats to test different branches
      reporter.stats.filesProcessed = 5;
      reporter.stats.filesSkipped = 2;
      reporter.stats.errors = 1;
      reporter.stats.totalBytes = 1048576; // 1MB
      reporter.startTime = Date.now() - 5000; // 5 seconds ago

      expect(() => {
        reporter.reportSummary();
      }).not.toThrow();
    });

    test("should update progress with time estimates", () => {
      const reporter = new ProgressReporter({ quiet: false });
      reporter.startTime = Date.now() - 1000; // 1 second ago

      expect(() => {
        reporter.update("Testing with time estimate", 3, 10);
      }).not.toThrow();
    });

    test("should handle verbose flag impact", () => {
      const reporter = new ProgressReporter({ verbose: true, quiet: false });

      // Test verbose flag impact on reportFileProgress
      expect(() => {
        reporter.reportFileProgress("/test/verbose.txt", 1024, "processed");
      }).not.toThrow();

      // Check that verbose is a boolean property
      expect(typeof reporter.verbose).toBe("boolean");
      expect(reporter.verbose).toBe(true);
    });

    test("should handle getRelativePath error case", () => {
      const reporter = new ProgressReporter({ quiet: true });

      // This returns the relative path from the current working directory
      const result = reporter.getRelativePath("/some/test/path");
      // Since the path is absolute and doesn't actually exist relative to cwd,
      // it will return a relative path with ../.. to navigate to root
      expect(result).toContain("test/path");
    });

    test("should handle file progress with verbose option", () => {
      const reporter = new ProgressReporter({ verbose: true, quiet: false });

      expect(() => {
        reporter.reportFileProgress("/test/file.txt", 1024, "processed");
        reporter.reportFileProgress("/test/file2.txt", 0, "skipped");
        reporter.reportFileProgress("/test/file3.txt", 0, "error");
      }).not.toThrow();
    });

    test("should handle additional edge cases", () => {
      const reporter = new ProgressReporter({ verbose: false, quiet: false });

      // Test updateProgress with total files set
      reporter.stats.totalFiles = 10;
      reporter.stats.filesProcessed = 3;
      reporter.stats.filesSkipped = 1;

      expect(() => {
        reporter.updateProgress(4, 10, "Processing");
      }).not.toThrow();

      // Test with very short duration
      reporter.startTime = Date.now() - 100; // Very short duration

      expect(() => {
        reporter.reportSummary();
      }).not.toThrow();
    });
  });
});
