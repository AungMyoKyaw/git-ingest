// Vitest setup file for global test configuration
import { beforeEach, vi } from "vitest";

// Set test environment
process.env.NODE_ENV = "test";

// Global test setup - runs before each test
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

// Mock console methods to reduce noise in tests (optional)
// You can uncomment these if you want to suppress console output during tests
// global.console = {
//   ...console,
//   log: vi.fn(),
//   warn: vi.fn(),
//   error: vi.fn(),
// };

// Global test utilities that might be useful
global.testUtils = {
  // Helper to create temporary directories or files if needed
  createTempDir: () => {
    // Implementation would go here
  },

  // Helper to clean up test artifacts
  cleanup: () => {
    // Implementation would go here
  }
};
