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
import { vi } from "vitest";
vi.mock("../theme.js", () => ({
  theme: {
    warning: (msg) => msg,
    blue: (msg) => msg,
    green: (msg) => msg,
    error: (msg) => msg,
    muted: (msg) => msg
  }
}));

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
      const handler = new ErrorHandler();
      expect(() => {
        handler.checkResourceLimit(50, 100, "memory");
      }).not.toThrow();
    });
  });

  // --- Additional tests for 100% coverage (moved out of nested test) ---
  test("should handle handle() with no suggestions and no stack", () => {
    const handler = new ErrorHandler({ verbose: false, quiet: false });
    const error = new Error("No suggestions");
    error.stack = undefined;
    expect(() => handler.handle(error)).not.toThrow();
  });

  test("should handle handle() with custom error details", () => {
    const handler = new ErrorHandler({ verbose: true, quiet: false });
    const error = new GitIngestError("Custom error", "CUSTOM", { foo: "bar" });
    expect(() => handler.handle(error)).not.toThrow();
  });

  test("should formatError with unknown error code", () => {
    const handler = new ErrorHandler({ quiet: true });
    const error = new Error("unknown error");
    error.code = "SOME_UNKNOWN_CODE";
    const formatted = handler.formatError(error);
    expect(formatted.suggestions).toEqual([]);
  });

  test("should formatError with clipboard error message", () => {
    const handler = new ErrorHandler({ quiet: true });
    const error = new Error("clipboard");
    const formatted = handler.formatError(error);
    expect(formatted.suggestions.some((s) => s.includes("clipboard"))).toBe(
      true
    );
  });

  test("should not log in quiet mode for warn/info/success", () => {
    const handler = new ErrorHandler({ quiet: true });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    handler.warn("should not log");
    handler.info("should not log");
    handler.success("should not log");
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  test("should handle error in safeFileOperation and safeDirectoryOperation", async () => {
    const handler = new ErrorHandler();
    const failOp = async () => {
      throw new Error("fail");
    };
    const safeFile = handler.safeFileOperation(failOp, "file.txt");
    const safeDir = handler.safeDirectoryOperation(failOp, "dir");
    await expect(safeFile()).rejects.toThrow(FileProcessingError);
    await expect(safeDir()).rejects.toThrow(DirectoryError);
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

// --- Additional tests for 100% coverage (moved into their own describe block) ---
describe("Additional Coverage", () => {
  test("should handle handle() with no suggestions and no stack", () => {
    const handler = new ErrorHandler({ verbose: false, quiet: false });
    const error = new Error("No suggestions");
    error.stack = undefined;
    expect(() => handler.handle(error)).not.toThrow();
  });

  test("should handle handle() with custom error details", () => {
    const handler = new ErrorHandler({ verbose: true, quiet: false });
    const error = new GitIngestError("Custom error", "CUSTOM", { foo: "bar" });
    expect(() => handler.handle(error)).not.toThrow();
  });

  test("should formatError with unknown error code", () => {
    const handler = new ErrorHandler({ quiet: true });
    const error = new Error("unknown error");
    error.code = "SOME_UNKNOWN_CODE";
    const formatted = handler.formatError(error);
    expect(formatted.suggestions).toEqual([]);
  });

  test("should formatError with clipboard error message", () => {
    const handler = new ErrorHandler({ quiet: true });
    const error = new Error("clipboard");
    const formatted = handler.formatError(error);
    expect(formatted.suggestions.some((s) => s.includes("clipboard"))).toBe(
      true
    );
  });

  test("should not log in quiet mode for warn/info/success", () => {
    const handler = new ErrorHandler({ quiet: true });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    handler.warn("should not log");
    handler.info("should not log");
    handler.success("should not log");
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  test("should handle error in safeFileOperation and safeDirectoryOperation", async () => {
    const handler = new ErrorHandler();
    const failOp = async () => {
      throw new Error("fail");
    };
    const safeFile = handler.safeFileOperation(failOp, "file.txt");
    const safeDir = handler.safeDirectoryOperation(failOp, "dir");
    await expect(safeFile()).rejects.toThrow(FileProcessingError);
    await expect(safeDir()).rejects.toThrow(DirectoryError);
  });
});

test("should log warnings in non-quiet mode", () => {
  const handler = new ErrorHandler({ quiet: false });
  const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
  handler.warn("Test warning");
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test("should log info in non-quiet mode", () => {
  const handler = new ErrorHandler({ quiet: false });
  const spy = vi.spyOn(console, "log").mockImplementation(() => {});
  handler.info("Test info");
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

test("should log success in non-quiet mode", () => {
  const handler = new ErrorHandler({ quiet: false });
  const spy = vi.spyOn(console, "log").mockImplementation(() => {});
  handler.success("Test success");
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

describe("Global Error Handlers", () => {
  test("should handle uncaughtException", () => {
    const handler = new ErrorHandler({ quiet: true });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const origProcessOn = process.on;
    let called = false;
    process.on = (event, _cb) => {
      if (event === "uncaughtException") {
        called = true;
      }
    };
    setupGlobalErrorHandlers(handler);
    expect(called).toBe(true);
    process.on = origProcessOn;
    spy.mockRestore();
  });

  test("should handle unhandledRejection", () => {
    const handler = new ErrorHandler({ quiet: true });
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const origProcessOn = process.on;
    let called = false;
    process.on = (event, _cb) => {
      if (event === "unhandledRejection") {
        called = true;
      }
    };
    setupGlobalErrorHandlers(handler);
    expect(called).toBe(true);
    process.on = origProcessOn;
    spy.mockRestore();
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

describe("Error Formatting", () => {
  test("should format different error types correctly", () => {
    const handler = new ErrorHandler({ quiet: true });

    const directoryError = new DirectoryError(
      "Directory not found",
      "/nonexistent"
    );
    const fileError = new FileProcessingError("File read failed", "/test.txt");
    const configError = new ConfigurationError(
      "Invalid config",
      "maxSize",
      "invalid"
    );
    const resourceError = new ResourceLimitError(
      "Memory exceeded",
      "memory",
      100,
      150
    );

    expect(() => {
      handler.formatError(directoryError);
      handler.formatError(fileError);
      handler.formatError(configError);
      handler.formatError(resourceError);
      handler.formatError(new Error("Generic error"));
    }).not.toThrow();
  });
});

describe("Error Wrappers", () => {
  test("should wrap async functions with error handling", async () => {
    const handler = new ErrorHandler({ quiet: true });

    const failingFn = async () => {
      throw new Error("Async operation failed");
    };

    const wrappedFn = handler.safeAsyncWrapper(failingFn, "test operation");

    await expect(wrappedFn()).rejects.toThrow(GitIngestError);
  });

  test("should handle direct wrapAsync method", async () => {
    const handler = new ErrorHandler({ quiet: true });

    const failingFn = async () => {
      throw new Error("Direct wrap failed");
    };

    await expect(handler.wrapAsync(failingFn, "test")).rejects.toThrow(
      GitIngestError
    );
  });

  test("should handle error in safe wrappers", async () => {
    const handler = new ErrorHandler({ quiet: true });

    const failingOperation = async () => {
      throw new Error("Operation failed");
    };

    const safeFile = handler.safeFileOperation(failingOperation, "/test.txt");
    await expect(safeFile()).rejects.toThrow(FileProcessingError);

    const safeDir = handler.safeDirectoryOperation(failingOperation, "/test");
    await expect(safeDir()).rejects.toThrow(DirectoryError);
  });
});

describe("Error Handling with Verbose Mode", () => {
  test("should handle errors with verbose output", () => {
    const handler = new ErrorHandler({ verbose: true, quiet: false });

    const gitIngestError = new GitIngestError("Test error", "TEST_CODE", {
      detail: "test"
    });

    expect(() => {
      handler.handle(gitIngestError);
    }).not.toThrow();
  });

  test("should handle errors with stack traces", () => {
    const handler = new ErrorHandler({ verbose: true, quiet: false });

    const error = new Error("Error with stack");

    expect(() => {
      handler.handle(error);
    }).not.toThrow();
  });
});

describe("Error Suggestions", () => {
  test("should provide suggestions for common errors", () => {
    const handler = new ErrorHandler({ quiet: true });

    // Test clipboard error suggestions
    const clipboardError = new Error("clipboard operation failed clipboard");
    const formatted = handler.formatError(clipboardError);
    expect(formatted.suggestions.length).toBeGreaterThan(0);
  });
});

describe("JSON Serialization", () => {
  test("should serialize GitIngestError to JSON", () => {
    const error = new GitIngestError("Test error", "TEST_CODE", {
      key: "value"
    });
    const json = error.toJSON();

    expect(json.name).toBe("GitIngestError");
    expect(json.message).toBe("Test error");
    expect(json.code).toBe("TEST_CODE");
    expect(json.details).toEqual({ key: "value" });
    expect(json.timestamp).toBeTruthy();
  });
});

describe("Additional Branch Coverage", () => {
  test("should handle errors with exit process flag", () => {
    const handler = new ErrorHandler({ quiet: true });

    // Mock process.exit to prevent actual exit
    const originalExit = process.exit;
    let exitCalled = false;
    process.exit = () => {
      exitCalled = true;
    };

    try {
      const error = new Error("Test error");
      handler.handle(error, true); // This should call process.exit
      expect(exitCalled).toBe(true);
    } finally {
      process.exit = originalExit;
    }
  });

  test("should handle quiet mode errors", () => {
    const handler = new ErrorHandler({ quiet: true });

    const error = new Error("Test error");
    expect(() => {
      handler.handle(error, false);
    }).not.toThrow();
  });

  test("should format errors with empty suggestions", () => {
    const handler = new ErrorHandler({ quiet: true });

    const error = new Error("Unknown error type");
    const formatted = handler.formatError(error);

    expect(formatted.message).toMatch(/❌ Error:/);
    expect(formatted.suggestions).toEqual([]);
  });

  test("should handle wrapAsync success case", async () => {
    const handler = new ErrorHandler({ quiet: true });

    const successFn = async () => "success result";
    const result = await handler.wrapAsync(successFn, "test operation");

    expect(result).toBe("success result");
  });

  test("should handle safe operation success cases", async () => {
    const handler = new ErrorHandler({ quiet: true });

    const successOperation = async () => "operation success";

    const safeFile = handler.safeFileOperation(successOperation, "/test.txt");
    const fileResult = await safeFile();
    expect(fileResult).toBe("operation success");

    const safeDir = handler.safeDirectoryOperation(successOperation, "/test");
    const dirResult = await safeDir();
    expect(dirResult).toBe("operation success");
  });

  test("should handle different error types in formatError", () => {
    const handler = new ErrorHandler({ quiet: true });

    // Test different error code paths
    const permissionError = new Error("permission denied");
    const memoryError = new Error("out of memory something");
    const networkError = new Error("network timeout");

    expect(() => {
      handler.formatError(permissionError);
      handler.formatError(memoryError);
      handler.formatError(networkError);
    }).not.toThrow();
  });

  test("should handle ResourceLimitError formatting", () => {
    const handler = new ErrorHandler({ quiet: true });

    const resourceError = new ResourceLimitError(
      "Limit exceeded",
      "files",
      100,
      150
    );
    const formatted = handler.formatError(resourceError);

    expect(formatted.message).toMatch(/❌ Error:/);
    expect(formatted.message).toContain("Limit exceeded");
  });

  test("should exercise more error code paths", () => {
    const handler = new ErrorHandler({ quiet: true });

    // Test different error message patterns to hit more branches
    const errors = [
      new Error("permission denied"),
      new Error("EACCES"),
      new Error("ENOENT"),
      new Error("out of memory heap"),
      new Error("memory"),
      new Error("clipboard failed"),
      new Error("random error")
    ];

    errors.forEach((error) => {
      expect(() => {
        handler.formatError(error);
      }).not.toThrow();
    });
  });

  test("should handle handle() with different verbosity settings", () => {
    const handlerVerbose = new ErrorHandler({ verbose: true, quiet: false });
    const handlerQuiet = new ErrorHandler({ verbose: false, quiet: true });

    const error = new GitIngestError("Test error", "TEST", {
      detail: "test"
    });

    expect(() => {
      handlerVerbose.handle(error);
      handlerQuiet.handle(error);
    }).not.toThrow();
  });
});
