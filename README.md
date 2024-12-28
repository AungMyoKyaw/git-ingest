# 📜 Git-Ingest: A Handy CLI Tool for Ingesting Your Project into a File

## 🌟 Features

- 📂 Generate directory structure with .gitignore support.
- 📝 Append file contents to the directory tree.
- 📋 Copy results to clipboard for quick sharing (with --copy flag).
- ⛔ Automatically ignores image files and dynamically created files like git-ingest outputs.

## 🔧 Installation

Install Git-Ingest globally using npm:

```bash
npm install -g git-ingest
```

or use npx without installing globally:

```bash
npx git-ingest
```

## 🚀 Usage

Run Git-Ingest from your terminal:

### Basic Usage

```bash
git-ingest
```

This will generate a file with your project structure and contents appended.

### Copy Results to Clipboard

Add the --copy flag to copy the output directly to your clipboard:

```bash
git-ingest --copy
```

or using npx:

```bash
npx git-ingest --copy
```

## 📂 Output File

- The generated file will be named with a timestamp, e.g., git-ingest-1688291234.txt.
- The file contains:
- The directory structure.
- The contents of all files, appended with clear separators.

## 🛠 Development Features

### .gitignore Support

- Automatically excludes files and directories listed in your .gitignore.
- Dynamically excludes generated git-ingest files and common image formats (.jpg, .png, etc.).

### Clipboard Support

- Automatically copies output to clipboard on supported platforms:
- 🖥 MacOS: Uses pbcopy.
- 🪟 Windows: Uses clip.
- 🐧 Linux: Uses xclip.

### Additional Usage

- Run Git-Ingest without global installation using npx.

```bash
npx git-ingest
```

### 📜 Example

Run Git-Ingest in a sample project:

```bash
git-ingest --copy
```

Output file will look like this:

```txt
Directory structure:
├── LICENSE
├── package.json
└── src
    ├── cli.js
    ├── read-file-and-append.js
    └── tree-generator.js

================================================
File: LICENSE
================================================

MIT License

...license content...

================================================
File: package.json
================================================

{
  "name": "git-ingest",
  "version": "1.0.0",
  ...
}
```

## 🖋 Author

Developed with ❤️ by [Aung Myo Kyaw](https://github.com/AungMyoKyaw)

## 📜 Licensed under the MIT License.
