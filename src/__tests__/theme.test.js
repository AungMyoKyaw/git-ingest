import theme, {
  formatSizeWithColor,
  progressMessages,
  createSectionHeader
} from "../theme.js";
import chalk from "chalk";

describe("theme module", () => {
  it("should apply semantic colors", () => {
    expect(theme.success("ok")).toBe(chalk.green("ok"));
    expect(theme.error("fail")).toBe(chalk.red("fail"));
    expect(theme.warning("warn")).toBe(chalk.yellow("warn"));
    expect(theme.info("info")).toBe(chalk.cyan("info"));
    expect(theme.muted("muted")).toBe(chalk.gray("muted"));
  });

  it("should apply file system related colors", () => {
    expect(theme.filePath("/foo")).toBe(chalk.blue("/foo"));
    expect(theme.fileSize("1MB")).toBe(chalk.magenta("1MB"));
    expect(theme.directory("dir")).toBe(chalk.cyan("dir"));
    expect(theme.binaryFile("bin")).toBe(chalk.yellow("bin"));
    // orange is not a default chalk color, fallback to yellow
    expect(theme.largeFile("big")).toBe(chalk.yellow("big"));
  });

  it("should apply progress indicator colors", () => {
    expect(theme.progressSuccess("done")).toBe(chalk.green("done"));
    expect(theme.progressSkip("skip")).toBe(chalk.yellow("skip"));
    expect(theme.progressError("err")).toBe(chalk.red("err"));
  });

  it("should apply compound styles", () => {
    expect(theme.highlight("hi")).toBe(chalk.bold.cyan("hi"));
    expect(theme.emphasis("em")).toBe(chalk.bold("em"));
    expect(theme.subtle("sub")).toBe(chalk.dim("sub"));
  });

  it("should format status indicators with icons", () => {
    expect(theme.successWithIcon("ok")).toBe(chalk.green("✅ ok"));
    expect(theme.errorWithIcon("fail")).toBe(chalk.red("❌ fail"));
    expect(theme.warningWithIcon("warn")).toBe(chalk.yellow("⚠️ warn"));
    expect(theme.infoWithIcon("info")).toBe(chalk.cyan("ℹ️ info"));
    expect(theme.skipWithIcon("skip")).toBe(chalk.yellow("⏭️ skip"));
  });

  it("should format file processing status", () => {
    expect(theme.fileProcessed("foo")).toBe(chalk.green("✅ foo"));
    expect(theme.fileSkipped("bar")).toBe(chalk.yellow("⏭️ bar"));
    expect(theme.fileError("baz")).toBe(chalk.red("❌ baz"));
  });

  it("should format headers and paths", () => {
    expect(theme.sectionHeader("Section")).toBe(chalk.bold.cyan("Section"));
    expect(theme.subHeader("Sub")).toBe(chalk.bold.blue("Sub"));
    expect(theme.relativePath("rel")).toBe(chalk.blue("rel"));
    expect(theme.absolutePath("abs")).toBe(chalk.cyan("abs"));
    expect(theme.fileName("file")).toBe(chalk.bold.blue("file"));
  });

  it("should format sizes with color", () => {
    expect(theme.sizeSmall("s")).toBe(chalk.green("s"));
    expect(theme.sizeMedium("m")).toBe(chalk.yellow("m"));
    expect(theme.sizeLarge("l")).toBe(chalk.red("l"));
  });

  it("should apply generic formatting helpers", () => {
    expect(theme.bold("b")).toBe(chalk.bold("b"));
    expect(theme.dim("d")).toBe(chalk.dim("d"));
    expect(theme.italic("i")).toBe(chalk.italic("i"));
    expect(theme.underline("u")).toBe(chalk.underline("u"));
  });
});

describe("formatSizeWithColor", () => {
  it("should use sizeSmall for <1MB", () => {
    expect(formatSizeWithColor(100)).toContain("B");
    expect(formatSizeWithColor(100)).toContain("\u001b"); // chalk color
  });
  it("should use sizeMedium for 1MB-10MB", () => {
    expect(formatSizeWithColor(2 * 1024 * 1024)).toContain("MB");
    expect(formatSizeWithColor(2 * 1024 * 1024)).toContain("\u001b");
  });
  it("should use sizeLarge for >=10MB", () => {
    expect(formatSizeWithColor(20 * 1024 * 1024)).toContain("MB");
    expect(formatSizeWithColor(20 * 1024 * 1024)).toContain("\u001b");
  });
});

describe("progressMessages", () => {
  it("should format progress messages", () => {
    expect(progressMessages.start("msg")).toBe(theme.info("🔄 msg"));
    expect(progressMessages.success("msg")).toBe(theme.successWithIcon("msg"));
    expect(progressMessages.skip("msg")).toBe(theme.skipWithIcon("msg"));
    expect(progressMessages.error("msg")).toBe(theme.errorWithIcon("msg"));
    expect(progressMessages.warning("msg")).toBe(theme.warningWithIcon("msg"));
    expect(progressMessages.info("msg")).toBe(theme.infoWithIcon("msg"));
  });
});

describe("createSectionHeader", () => {
  it("should use correct prefix for level 1", () => {
    expect(createSectionHeader("Main", 1)).toContain("🚀 Main");
  });
  it("should use correct prefix for level 2", () => {
    expect(createSectionHeader("Stats", 2)).toContain("📊 Stats");
  });
  it("should use correct prefix for other levels", () => {
    expect(createSectionHeader("Other", 3)).toContain("📋 Other");
  });
});
