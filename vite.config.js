/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    // Enable Jest-compatible globals (describe, it, expect, etc.)
    globals: true,

    // Use Node environment for CLI tool testing
    environment: "node",

    // Setup files to run before each test file
    setupFiles: ["./vitest.setup.js"],

    // Test file patterns
    include: ["src/**/*.{test,spec}.{js,ts}"],

    // Exclude patterns
    exclude: ["node_modules", "dist", "coverage"],

    // Coverage configuration for 100% coverage goal
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "coverage",

      // Include all source files for coverage
      include: ["src/**/*.js"],

      // Exclude test files and CLI entry point from coverage
      exclude: [
        "src/**/*.{test,spec}.js",
        "src/cli.js" // CLI entry point is tested via integration tests
      ],

      // Set coverage thresholds (aiming for 100% but starting with current levels)
      thresholds: {
        global: {
          branches: 85,
          functions: 95,
          lines: 90,
          statements: 90
        }
      },

      // Fail if coverage is below threshold
      all: true
    },

    // Test timeout
    testTimeout: 10000,

    // Pool options for better performance
    pool: "threads",

    // Reporter configuration
    reporter: ["verbose"],

    // Watch mode exclusions
    watchExclude: ["**/node_modules/**", "**/dist/**", "**/coverage/**"]
  }
});
