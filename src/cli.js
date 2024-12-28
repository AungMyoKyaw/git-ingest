#!/usr/bin/env node

import { saveTreeToFile, getAllFilePaths } from "./tree-generator.js";
import { appendFileContentsToTree } from "./read-file-and-append.js";

const timestamp = Math.floor(Date.now() / 1000);
const fileName = `git-ingest-${timestamp}.txt`;

const targetDirectory = process.argv[2] || "./"; // Default to current directory if no argument

// Save the tree to a file
saveTreeToFile(targetDirectory, fileName);

// Get all file paths and append their contents
const filePaths = getAllFilePaths(targetDirectory);
appendFileContentsToTree(filePaths, fileName);
