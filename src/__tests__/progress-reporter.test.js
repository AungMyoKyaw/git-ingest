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
  });
});
