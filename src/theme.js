/**
 * Centralized chalk color theme for consistent styling across the application
 * Eliminates direct chalk calls and provides semantic color usage
 */

import chalk from "chalk";
import { COLOR_THEME } from "./constants.js";

/**
 * Centralized color theme using chalk
 */
export const theme = {
  // Primary semantic colors
  success: chalk[COLOR_THEME.SUCCESS],
  error: chalk[COLOR_THEME.ERROR],
  warning: chalk[COLOR_THEME.WARNING],
  info: chalk[COLOR_THEME.INFO],
  muted: chalk[COLOR_THEME.MUTED],

  // File system related
  filePath: chalk[COLOR_THEME.FILE_PATH],
  fileSize: chalk[COLOR_THEME.FILE_SIZE],
  directory: chalk[COLOR_THEME.DIRECTORY],
  binaryFile: chalk[COLOR_THEME.BINARY_FILE],
  largeFile: chalk[COLOR_THEME.LARGE_FILE],

  // Progress indicators
  progressSuccess: chalk[COLOR_THEME.PROGRESS_SUCCESS],
  progressSkip: chalk[COLOR_THEME.PROGRESS_SKIP],
  progressError: chalk[COLOR_THEME.PROGRESS_ERROR],

  // Compound styles
  highlight: chalk.bold.cyan,
  emphasis: chalk.bold,
  subtle: chalk.dim,

  // Status indicators with emojis
  successWithIcon: (text) => chalk.green(`✅ ${text}`),
  errorWithIcon: (text) => chalk.red(`❌ ${text}`),
  warningWithIcon: (text) => chalk.yellow(`⚠️ ${text}`),
  infoWithIcon: (text) => chalk.cyan(`ℹ️ ${text}`),
  skipWithIcon: (text) => chalk.yellow(`⏭️ ${text}`),

  // File processing specific
  fileProcessed: (text) => chalk.green(`✅ ${text}`),
  fileSkipped: (text) => chalk.yellow(`⏭️ ${text}`),
  fileError: (text) => chalk.red(`❌ ${text}`),

  // Headers and sections
  sectionHeader: chalk.bold.cyan,
  subHeader: chalk.bold.blue,

  // Path formatting
  relativePath: (path) => chalk.blue(path),
  absolutePath: (path) => chalk.cyan(path),
  fileName: (name) => chalk.bold.blue(name),

  // Size formatting
  sizeSmall: chalk.green,
  sizeMedium: chalk.yellow,
  sizeLarge: chalk.red,

  // Generic formatting helpers
  bold: chalk.bold,
  dim: chalk.dim,
  italic: chalk.italic,
  underline: chalk.underline
};

/**
 * Format file size with appropriate color based on size
 */
export function formatSizeWithColor(sizeBytes, thresholds = {}) {
  const { small = 1024 * 1024, large = 10 * 1024 * 1024 } = thresholds; // 1MB, 10MB

  if (sizeBytes < small) {
    return theme.sizeSmall(formatFileSize(sizeBytes));
  } else if (sizeBytes < large) {
    return theme.sizeMedium(formatFileSize(sizeBytes));
  } else {
    return theme.sizeLarge(formatFileSize(sizeBytes));
  }
}

/**
 * Format file size in human readable format
 */
function formatFileSize(sizeBytes) {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  } else if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  } else if (sizeBytes < 1024 * 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
}

/**
 * Create consistent progress messages
 */
export const progressMessages = {
  start: (message) => theme.info(`🔄 ${message}`),
  success: (message) => theme.successWithIcon(message),
  skip: (message) => theme.skipWithIcon(message),
  error: (message) => theme.errorWithIcon(message),
  warning: (message) => theme.warningWithIcon(message),
  info: (message) => theme.infoWithIcon(message)
};

/**
 * Create consistent section headers
 */
export function createSectionHeader(text, level = 1) {
  const prefix = level === 1 ? "🚀" : level === 2 ? "📊" : "📋";
  return theme.sectionHeader(`\n${prefix} ${text}`);
}

export default theme;
