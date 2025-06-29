// Jest setup file for global test configuration
process.env.NODE_ENV = "test";

// In ES modules mode, jest global is not available in setup files
// Individual tests can still use jest.setTimeout if needed

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  // Uncomment to ignore console.log statements in tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
