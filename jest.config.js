export default {
  testEnvironment: "node",
  transform: {},
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/**/*.spec.js",
    "!src/cli.js" // Exclude CLI entry point since it's tested via integration tests
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  verbose: true,
  collectCoverage: false,
  coverageThreshold: {
    global: {
      branches: 73,
      functions: 80,
      lines: 75,
      statements: 75
    }
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // Ensure proper cleanup
  forceExit: false,
  detectOpenHandles: true
};
