// Jest setup file for global test configuration
process.env.NODE_ENV = "test";

// Increase timeout for async operations
jest.setTimeout(30000);

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  // Uncomment to ignore console.log statements in tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
