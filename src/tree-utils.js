import fs from "fs";
import path from "path";

// Generate Tree with .gitignore Support
function generateTree(
  directory,
  rules = null,
  prefix = "",
  depth = 0,
  output = [],
) {
  const items = getDirectoryContents(directory, rules);

  items.forEach((item, index) => {
    const itemPath = path.join(directory, item);
    const isDir = fs.lstatSync(itemPath).isDirectory();
    const isLast = index === items.length - 1;

    output.push(`${prefix}${isLast ? "└── " : "├── "}${item}`);

    if (isDir) {
      generateTree(
        itemPath,
        rules,
        `${prefix}${isLast ? "    " : "│   "}`,
        depth + 1,
        output,
      );
    }
  });

  return output;
}

// Get All File Paths
function getAllFilePaths(directory, rules = null, filePaths = []) {
  const items = getDirectoryContents(directory, rules);

  items.forEach((item) => {
    const itemPath = path.join(directory, item);
    const isDir = fs.lstatSync(itemPath).isDirectory();

    if (isDir) {
      getAllFilePaths(itemPath, rules, filePaths);
    } else {
      filePaths.push(itemPath);
    }
  });

  return filePaths;
}

// Retrieve Directory Contents Excluding Ignored Files
function getDirectoryContents(directory, rules) {
  if (!rules) rules = loadGitignoreRules(directory);

  return fs
    .readdirSync(directory)
    .filter((item) => !isIgnored(path.join(directory, item), rules, directory));
}

// Load .gitignore Rules
function loadGitignoreRules(directory) {
  const gitignorePath = path.join(directory, ".gitignore");

  const rules = fs.existsSync(gitignorePath)
    ? fs
        .readFileSync(gitignorePath, "utf8")
        .split("\n")
        .map(normalizeRule)
        .filter(Boolean) // Remove null entries
    : [];

  // Always ignore .git, dynamically generated files, and common patterns
  return [
    ...rules,
    "^\\.git$", // Ignore .git directory
    "^\\.gitignore$", // Ignore .gitignore file
    "^git-ingest-.*\\.txt$", // Ignore dynamically generated files
    ...getImageFileRules(),
    ...getLockFileRules(),
  ];
}

// Normalize Rule for Regex Parsing
function normalizeRule(rule) {
  const trimmedRule = rule.trim();
  if (!trimmedRule || trimmedRule.startsWith("#")) return null; // Ignore comments and empty lines

  // Escape special regex characters
  const escapedRule = trimmedRule.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");

  // Handle trailing slashes for directories
  if (trimmedRule.endsWith("/")) {
    return `^${escapedRule}.*$`; // Match the directory and everything under it
  }

  // Replace wildcard '*' with '.*' for pattern matching
  return `^${escapedRule.replace(/\*/g, ".*")}$`;
}

// Check If File or Directory is Ignored
function isIgnored(filePath, rules, baseDir) {
  const relativePath = path.relative(baseDir, filePath).replace(/\\/g, "/");

  // Check rules against both the relative path and its directory form
  return rules.some((rule) => {
    const isMatch = new RegExp(rule).test(relativePath);
    const isDirMatch = new RegExp(rule).test(`${relativePath}/`);
    return isMatch || isDirMatch;
  });
}

// Get Rules for Ignoring Image Files
function getImageFileRules() {
  const extensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "ico"];
  return extensions.map((ext) => `.*\\.${ext}`);
}

// Get Rules for Ignoring Lock Files
function getLockFileRules() {
  return [
    "^package-lock\\.json$", // npm lock file
    "^yarn\\.lock$", // Yarn lock file
    "^pnpm-lock\\.yaml$", // pnpm lock file
    "^Cargo\\.lock$", // Rust (Cargo) lock file
    "^composer\\.lock$", // PHP (Composer) lock file
    "^Gemfile\\.lock$", // Ruby (Bundler) lock file
    "^Pipfile\\.lock$", // Python (Pipenv) lock file
    "^poetry\\.lock$", // Python (Poetry) lock file
    "^go\\.mod$", // Go modules lock file
    "^go\\.sum$", // Go checksum file
    "^mix\\.lock$", // Elixir (Mix) lock file
  ];
}

export { generateTree, getAllFilePaths };
