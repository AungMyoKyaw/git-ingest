import {
  GitIngestError,
  DirectoryError,
  FileProcessingError,
  ConfigurationError,
  ResourceLimitError,
  ErrorHandler,
  createErrorHandler,
  setupGlobalErrorHandlers
} from "../error-handler.js";

describe("Error Handler Module", () => {
  describe("Custom Error Classes", () => {
    test("GitIngestError should extend Error with details", () => {
      const error = new GitIngestError("Test error", "TEST_CODE", {
        key: "value"
      });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(GitIngestError);
      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_CODE");
      expect(error.details).toEqual({ key: "value" });
    });

    test("DirectoryError should include path information", () => {
      const testPath = "/test/path";
      const originalError = new Error("Original error");
      const error = new DirectoryError(
        "Directory error",
        testPath,
        originalError
      );

      expect(error).toBeInstanceOf(GitIngestError);
      expect(error).toBeInstanceOf(DirectoryError);
      expect(error.path).toBe(testPath);
      expect(error.originalError).toBe(originalError);
      expect(error.code).toBe("DIRECTORY_ERROR");
    });

    test("FileProcessingError should include file path", () => {
      const filePath = "/test/file.txt";
      const originalError = new Error("File error");
      const error = new FileProcessingError(
        "Processing error",
        filePath,
        originalError
      );

      expect(error).toBeInstanceOf(GitIngestError);
      expect(error).toBeInstanceOf(FileProcessingError);
      expect(error.filePath).toBe(filePath);
      expect(error.originalError).toBe(originalError);
      expect(error.code).toBe("FILE_PROCESSING_ERROR");
    });

    test("ConfigurationError should include option and value", () => {
      const error = new ConfigurationError(
        "Config error",
        "maxSize",
        "invalid"
      );

      expect(error).toBeInstanceOf(GitIngestError);
      expect(error).toBeInstanceOf(ConfigurationError);
      expect(error.option).toBe("maxSize");
      expect(error.value).toBe("invalid");
      expect(error.code).toBe("CONFIGURATION_ERROR");
    });

    test("ResourceLimitError should include resource and limits", () => {
      const error = new ResourceLimitError(
        "Memory limit exceeded",
        "memory",
        1000,
        1500
      );

      expect(error).toBeInstanceOf(GitIngestError);
      expect(error).toBeInstanceOf(ResourceLimitError);
      expect(error.resource).toBe("memory");
      expect(error.limit).toBe(1000);
      expect(error.actual).toBe(1500);
      expect(error.code).toBe("RESOURCE_LIMIT_ERROR");
    });
  });

  describe("ErrorHandler Class", () => {
    test("should create error handler with default options", () => {
      const handler = new ErrorHandler();

      expect(handler.verbose).toBe(false);
      expect(handler.quiet).toBe(false);
    });

    test("should create error handler with custom options", () => {
      const handler = new ErrorHandler({ verbose: true, quiet: true });

      expect(handler.verbose).toBe(true);
      expect(handler.quiet).toBe(true);
    });

    test("should handle errors without throwing", () => {
      const handler = new ErrorHandler({ quiet: true }); // Quiet to avoid console output
      const error = new Error("Test error");

      expect(() => {
        handler.handle(error);
      }).not.toThrow();
    });
  });

  describe("Validation Methods", () => {
    let handler;

    beforeEach(() => {
      handler = new ErrorHandler();
    });

    test("validateConfig should throw ConfigurationError on invalid config", () => {
      expect(() => {
        handler.validateConfig(false, "Invalid value", "option", "value");
      }).toThrow(ConfigurationError);
    });

    test("validateConfig should not throw on valid config", () => {
      expect(() => {
        handler.validateConfig(true, "Valid", "option", "value");
      }).not.toThrow();
    });

    test("checkResourceLimit should throw ResourceLimitError when exceeded", () => {
      expect(() => {
        handler.checkResourceLimit(150, 100, "memory");
      }).toThrow(ResourceLimitError);
    });

    test("checkResourceLimit should not throw when within limits", () => {
      expect(() => {
        handler.checkResourceLimit(50, 100, "memory");
      }).not.toThrow();
    });
  });

  describe("Safe Operation Wrappers", () => {
    let handler;

    beforeEach(() => {
      handler = new ErrorHandler();
    });

    test("safeAsyncWrapper should wrap errors", async () => {
      const failingFn = async () => {
        throw new Error("Original error");
      };

      const wrappedFn = handler.safeAsyncWrapper(failingFn, "test operation");

      await expect(wrappedFn()).rejects.toThrow(GitIngestError);
      await expect(wrappedFn()).rejects.toThrow("Failed to test operation");
    });

    test("safeFileOperation should wrap file errors", async () => {
      const failingOperation = async () => {
        throw new Error("File error");
      };

      const wrappedOperation = handler.safeFileOperation(
        failingOperation,
        "/test/file"
      );

      await expect(wrappedOperation()).rejects.toThrow(FileProcessingError);
    });

    test("safeDirectoryOperation should wrap directory errors", async () => {
      const failingOperation = async () => {
        throw new Error("Directory error");
      };

      const wrappedOperation = handler.safeDirectoryOperation(
        failingOperation,
        "/test/dir"
      );

      await expect(wrappedOperation()).rejects.toThrow(DirectoryError);
    });
  });

  describe("Logging Methods", () => {
    test("should log warnings without throwing", () => {
      const handler = new ErrorHandler({ quiet: true }); // Quiet to avoid console output

      expect(() => {
        handler.warn("Test warning");
      }).not.toThrow();
    });

    test("should log info messages without throwing", () => {
      const handler = new ErrorHandler({ quiet: true });

      expect(() => {
        handler.info("Test info");
      }).not.toThrow();
    });

    test("should log success messages without throwing", () => {
      const handler = new ErrorHandler({ quiet: true });

      expect(() => {
        handler.success("Test success");
      }).not.toThrow();
    });
  });

  describe("Utility Functions", () => {
    test("createErrorHandler should return ErrorHandler instance", () => {
      const handler = createErrorHandler({ verbose: true });

      expect(handler).toBeInstanceOf(ErrorHandler);
      expect(handler.verbose).toBe(true);
    });

    test("setupGlobalErrorHandlers should not throw", () => {
      const handler = new ErrorHandler();

      expect(() => {
        setupGlobalErrorHandlers(handler);
      }).not.toThrow();
    });
  });
});
