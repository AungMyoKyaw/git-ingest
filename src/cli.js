#!/usr/bin/env node

import { generateTreeFile, copyFileToClipboard } from "./file-generator.js";

// Constants
const DEFAULT_DIRECTORY = "./";

// Parse Command-Line Arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const copyFlagIndex = args.indexOf("--copy");
  const copyFlag = copyFlagIndex !== -1;

  if (copyFlag) args.splice(copyFlagIndex, 1);

  const targetDirectory = args[0] || DEFAULT_DIRECTORY;

  return { targetDirectory, copyFlag };
}

// Main Execution
function main() {
  const { targetDirectory, copyFlag } = parseArgs();
  const timestamp = Math.floor(Date.now() / 1000);
  const fileName = `git-ingest-${timestamp}.txt`;

  try {
    generateTreeFile(targetDirectory, fileName);

    if (copyFlag) {
      copyFileToClipboard(fileName);
    } else {
      console.log(
        "Use --copy option to copy the file content to the clipboard.",
      );
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

main();
