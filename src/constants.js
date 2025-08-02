/**
 * Central constants for git-ingest
 * Eliminates magic numbers and provides consistent values across the codebase
 */

export const PERFORMANCE_CONSTANTS = {
  // Concurrency limits for file processing
  DEFAULT_CONCURRENCY_LIMIT: 10,
  MAX_CONCURRENCY_LIMIT: 50,

  // File processing thresholds
  LARGE_FILE_THRESHOLD_KB: 1024, // 1MB
  MAX_CONCURRENT_READS: 20,

  // Memory management
  BUFFER_SIZE_KB: 64,
  MAX_MEMORY_USAGE_MB: 200
};

export const FORMAT_CONSTANTS = {
  // Separator formatting
  SEPARATOR_LENGTH: 48,
  SEPARATOR_CHAR: "=",

  // Size formatting
  BYTES_PER_KB: 1024,
  BYTES_PER_MB: 1024 * 1024,
  BYTES_PER_GB: 1024 * 1024 * 1024
};

export const FILE_PROCESSING_CONSTANTS = {
  // File size limits (in MB)
  DEFAULT_MAX_FILE_SIZE_MB: 10,
  DEFAULT_TRUNCATE_SIZE_KB: 2048,

  // Error handling
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 100
};

export const MESSAGES = {
  // Error messages
  DIRECTORY_NOT_FOUND: "Directory does not exist",
  DIRECTORY_ACCESS_DENIED: "Permission denied: Cannot read directory",
  FILE_TOO_LARGE: "File is too large to process",
  BINARY_FILE_SKIPPED: "Binary file skipped",

  // Success messages
  PROCESSING_COMPLETE: "File processing completed successfully",
  DIRECTORY_ANALYZED: "Directory analysis completed",

  // Progress messages
  GENERATING_TREE: "Generating directory tree...",
  DISCOVERING_FILES: "Discovering files...",
  PROCESSING_CONTENT: "Processing file contents...",
  COPYING_CLIPBOARD: "Copying to clipboard..."
};

export const REGEX_PATTERNS = {
  // File extension patterns
  IMAGE_EXTENSIONS: /\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|tiff)$/iu,
  VIDEO_EXTENSIONS: /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/iu,
  AUDIO_EXTENSIONS: /\.(mp3|wav|ogg|aac|flac|m4a)$/iu,
  ARCHIVE_EXTENSIONS: /\.(zip|tar|gz|rar|7z|bz2|xz)$/iu,
  BINARY_EXTENSIONS: /\.(exe|dll|so|dylib|class|jar|bin)$/iu,

  // Path patterns
  HIDDEN_FILE: /^\..*$/u,
  TEMP_FILE: /\.(tmp|temp|bak|swp|swo)$/iu
};

export const COLOR_THEME = {
  // Primary colors
  SUCCESS: "green",
  ERROR: "red",
  WARNING: "yellow",
  INFO: "cyan",
  MUTED: "gray",

  // Specific use cases
  FILE_PATH: "blue",
  FILE_SIZE: "magenta",
  DIRECTORY: "cyan",
  BINARY_FILE: "yellow",
  LARGE_FILE: "orange",

  // Progress indicators
  PROGRESS_SUCCESS: "green",
  PROGRESS_SKIP: "yellow",
  PROGRESS_ERROR: "red"
};

export default {
  PERFORMANCE_CONSTANTS,
  FORMAT_CONSTANTS,
  FILE_PROCESSING_CONSTANTS,
  MESSAGES,
  REGEX_PATTERNS,
  COLOR_THEME
};
