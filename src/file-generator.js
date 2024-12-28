import fs from "fs";
import { execSync } from "child_process";

import { generateTree, getAllFilePaths } from "./tree-utils.js";
import { appendFileContents } from "./file-utils.js";

// Generate Tree File
function generateTreeFile(directory, fileName) {
  const treeStructure = generateTree(directory);
  const header = "Directory structure:";
  const fileContent = [header, ...treeStructure].join("\n");

  fs.writeFileSync(fileName, `${fileContent}\n\n`, "utf8");
  console.log(`Directory tree saved to ${fileName}`);

  const filePaths = getAllFilePaths(directory);
  appendFileContents(filePaths, fileName);
}

// Copy File Content to Clipboard
function copyFileToClipboard(fileName) {
  try {
    const platformCommands = {
      darwin: `cat "${fileName}" | pbcopy`, // MacOS
      win32: `type "${fileName}" | clip`, // Windows
      linux: `cat "${fileName}" | xclip -selection clipboard`, // Linux
    };

    const command = platformCommands[process.platform];

    if (command) {
      execSync(command, { shell: true });
      console.log("File content copied to clipboard.");
    } else {
      console.warn("Copy to clipboard is not supported on this platform.");
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error.message);
  }
}

export { generateTreeFile, copyFileToClipboard };
