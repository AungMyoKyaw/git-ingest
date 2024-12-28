import fs from "fs";
import path from "path";

// Parse `.gitignore` rules into regex patterns
function parseGitignore(gitignorePath) {
  let rules = [];

  if (fs.existsSync(gitignorePath)) {
    rules = fs
      .readFileSync(gitignorePath, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")); // Ignore comments and empty lines
  }

  // Add hardcoded dynamic rule
  rules.push("git-ingest-*.txt"); // Dynamically ignore `git-ingest` files

  // Add .gitignore file itself
  rules.push(".gitignore");

  // Ignore All Image Files for Development
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "ico"];
  imageExtensions.forEach((ext) => {
    rules.push(`*.${ext}`);
  });

  return rules.map((rule) => {
    const isDirectory = rule.endsWith("/");
    const normalizedRule = rule.replace(/\/$/, ""); // Remove trailing slash for directories
    const regex = new RegExp(
      "^" +
        normalizedRule
          .replace(/\./g, "\\.") // Escape dots
          .replace(/\*\*/g, ".*") // Match multiple directories
          .replace(/\*/g, "[^/]*") + // Match any file or folder name
        (isDirectory ? "(\\/.*)?$" : "$"), // Match entire directories if rule ends with '/'
      "i",
    );
    return { pattern: regex, isDirectory };
  });
}

// Check if a path is ignored based on `.gitignore` rules
function isIgnored(filePath, rules, baseDir) {
  const relativePath = path.relative(baseDir, filePath).replace(/\\/g, "/"); // Normalize for cross-platform

  // Always ignore `.git` directory
  if (relativePath === ".git" || relativePath.startsWith(".git/")) {
    return true;
  }

  // Apply `.gitignore` rules
  return rules.some(({ pattern }) => pattern.test(relativePath));
}

// Recursive tree display with `.gitignore` support
function displayTreeWithGitignore(
  dirPath,
  depth = 0,
  prefix = "",
  rules = null,
  output = [],
) {
  const directory = dirPath || __dirname;

  // Load `.gitignore` rules if not already loaded
  if (!rules) {
    const gitignorePath = path.join(directory, ".gitignore");
    rules = parseGitignore(gitignorePath);
  }

  // Read directory contents
  const items = fs.readdirSync(directory).filter((item) => {
    const fullPath = path.join(directory, item);
    return !isIgnored(fullPath, rules, dirPath); // Apply `.gitignore` rules
  });

  // Iterate through items
  items.forEach((item, index) => {
    const itemPath = path.join(directory, item);
    const isDir = fs.lstatSync(itemPath).isDirectory();

    // Check if this is the last item
    const isLast = index === items.length - 1;

    // Tree symbols
    const branch = isLast ? "└── " : "├── ";
    const newPrefix = prefix + (isLast ? "    " : "│   ");

    // Append the current item to output
    output.push(`${prefix}${branch}${item}`);

    // If it's a directory, recursively process its contents
    if (isDir) {
      displayTreeWithGitignore(itemPath, depth + 1, newPrefix, rules, output);
    }
  });

  return output;
}

// Retrieve all file paths in a directory
function getAllFilePaths(dirPath, rules = null, filePaths = []) {
  const directory = dirPath || __dirname;

  // Load `.gitignore` rules if not already loaded
  if (!rules) {
    const gitignorePath = path.join(directory, ".gitignore");
    rules = parseGitignore(gitignorePath);
  }

  // Read directory contents
  const items = fs.readdirSync(directory).filter((item) => {
    const fullPath = path.join(directory, item);
    return !isIgnored(fullPath, rules, dirPath); // Apply `.gitignore` rules
  });

  // Iterate through items
  items.forEach((item) => {
    const itemPath = path.join(directory, item);
    const isDir = fs.lstatSync(itemPath).isDirectory();

    if (isDir) {
      // If it's a directory, recursively collect its file paths
      getAllFilePaths(itemPath, rules, filePaths);
    } else {
      // If it's a file, add its path to the list
      filePaths.push(itemPath);
    }
  });

  return filePaths;
}

// Save the tree to a file
function saveTreeToFile(dirPath, fileName = "git-ingest-unixtime.txt") {
  const output = displayTreeWithGitignore(dirPath);
  const header = `Directory structure:`;
  output.unshift(header);

  // Write to file
  fs.writeFileSync(fileName, output.join("\n"), "utf8");

  // append new two lines
  fs.appendFileSync(fileName, "\n\n", "utf8");
  console.log(`Directory tree saved to ${fileName}`);
}

export { displayTreeWithGitignore, saveTreeToFile, getAllFilePaths };
