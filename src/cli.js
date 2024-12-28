#!/usr/bin/env node

import { execSync } from "child_process";
import { saveTreeToFile, getAllFilePaths } from "./tree-generator.js";
import { appendFileContentsToTree } from "./read-file-and-append.js";

// Parse command-line arguments
const args = process.argv.slice(2);
const copyFlagIndex = args.indexOf("--copy");
const copyFlag = copyFlagIndex !== -1; // Check if --copy flag is present
if (copyFlag) args.splice(copyFlagIndex, 1); // Remove --copy from args

const targetDirectory = args[0] || "./"; // Use first argument as directory or default to "./"

// Generate a timestamped file name
const timestamp = Math.floor(Date.now() / 1000);
const fileName = `git-ingest-${timestamp}.txt`;

try {
  // Save the tree to a file
  saveTreeToFile(targetDirectory, fileName);

  // Get all file paths and append their contents
  const filePaths = getAllFilePaths(targetDirectory);
  appendFileContentsToTree(filePaths, fileName);

  console.log(`\nFile generated: ${fileName}`);

  if (copyFlag) {
    try {
      const platform = process.platform;

      if (platform === "darwin") {
        // MacOS: Pipe file content to clipboard
        execSync(`cat "${fileName}" | pbcopy`);
        console.log("File content copied to clipboard via pbcopy.");
      } else if (platform === "win32") {
        // Windows: Use clip command
        execSync(`type "${fileName}" | clip`, { shell: true });
        console.log("File content copied to clipboard via clip.");
      } else if (platform === "linux") {
        // Linux: Use xclip command
        execSync(`cat "${fileName}" | xclip -selection clipboard`);
        console.log("File content copied to clipboard via xclip.");
      } else {
        console.warn("Copy to clipboard is not supported on this platform.");
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error.message);
    }
  } else {
    console.log("Use --copy option to copy the file content to the clipboard.");
  }
} catch (error) {
  console.error("An error occurred while generating the file:", error.message);
}
