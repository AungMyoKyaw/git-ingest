import fs from "fs";
import path from "path";

// Append File Contents to Tree File
function appendFileContents(filePaths, outputFilePath) {
  const separator = "=".repeat(48);
  const output = [];

  filePaths.forEach((filePath) => {
    const relativePath = path.relative(process.cwd(), filePath);
    output.push(`${separator}\nFile: ${relativePath}\n${separator}`);

    try {
      const content = fs.readFileSync(filePath, "utf8");
      output.push(content);
    } catch (error) {
      output.push(`Error reading file: ${error.message}`);
    }
  });

  fs.appendFileSync(outputFilePath, output.join("\n\n"), "utf8");
}

export { appendFileContents };
