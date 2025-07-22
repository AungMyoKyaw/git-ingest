"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { Filter, File, Clipboard, Code2, FileText, Star } from "lucide-react";

// Dynamically import XTerm to avoid SSR issues

// ...existing code...
// ...existing code...
import { motion } from "framer-motion";

// Helper component for Get Started steps
function GetStartedStep(props: {
  readonly number: number;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly command: string;
  readonly color: string;
}) {
  const { number, label, icon, command, color } = props;
  const [copied, setCopied] = useState(false);
  return (
    <li
      className="backdrop-blur-lg bg-white/5 border border-[#2563EB]/30 rounded-2xl p-8 flex flex-col gap-4 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden"
      style={{ boxShadow: "0 8px 32px 0 rgba(37,99,235,0.10)" }}
    >
      <div className="flex items-center gap-4 mb-2">
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-full font-mono font-bold text-xl shadow-lg border-2 border-white/20"
          style={{
            background: color,
            color: "#fff",
            boxShadow: "0 2px 8px 0 rgba(37,99,235,0.10)"
          }}
        >
          {number}
        </span>
        <span
          className="text-lg font-semibold flex items-center gap-2"
          style={{ color: "#fff" }}
        >
          <span className="inline-flex items-center justify-center w-7 h-7">
            {icon}
          </span>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <code className="bg-gradient-to-r from-[#232B41]/90 to-[#1E2A44]/90 text-[#D1D5DB] font-mono px-4 py-2 rounded-lg text-base select-all border border-[#2563EB]/20 shadow-inner tracking-wide">
          {command}
        </code>
        <button
          type="button"
          aria-label={`Copy command: ${command}`}
          className={`ml-2 flex items-center justify-center w-10 h-10 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-base font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 border border-[#2563EB]/40 transition-all duration-150 shadow-lg`}
          onClick={async () => {
            await navigator.clipboard.writeText(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? (
            <span className="font-mono text-xs">Copied!</span>
          ) : (
            <Clipboard size={20} />
          )}
        </button>
      </div>
    </li>
  );
}

export default function Home() {
  // ...existing code...

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-0 font-sans"
      style={{ background: "var(--background)", color: "var(--text-primary)" }}
    >
      {/* Hero Section */}
      <section
        className="w-full flex flex-col items-center text-center gap-8 py-32 px-4"
        style={{ background: "var(--background)" }}
      >
        <h1
          className="h1 font-mono font-extrabold tracking-tight mb-4"
          style={{
            color: "var(--text-primary)",
            fontFamily: "JetBrains Mono, monospace",
            fontWeight: 700,
            letterSpacing: "-0.03em"
          }}
        >
          Ingest your codebase with Git Ingest
        </h1>
        <p
          className="body font-sans max-w-2xl mx-auto mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          A CLI tool to analyze and ingest project codebases into structured
          text, streamlining code reviews, AI analysis, and collaboration.
        </p>
        {/* Animated Terminal Window */}
        <div className="w-full max-w-lg mx-auto bg-[var(--background-secondary)] rounded-lg shadow-lg border border-[var(--accent-primary)]/20 p-0 overflow-hidden relative">
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--background)]/80 border-b border-[var(--background-secondary)]">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <span className="ml-4 text-xs text-[var(--text-secondary)] font-mono">
              git-ingest [options] [directory]
            </span>
          </div>
          <div
            className="px-6 py-6 text-left font-mono text-base text-[var(--text-secondary)] min-h-[80px] flex items-center"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            <TypeAnimation
              sequence={[
                "$ npx git-ingest",
                1000,
                "✅ Directory validated: /Users/aungmyokyaw/Desktop/life/repos/git-ingest/git-ingest-www",
                1200,
                "\uD83D\uDD0D Analyzing project: /Users/aungmyokyaw/Desktop/life/repos/git-ingest/git-ingest-www",
                1200,
                "\uD83D\uDCC4 Output file: git-ingest-1753197982.txt",
                1000,
                "✔ Directory tree generated",
                800,
                "✔ Found 16 files",
                800,
                "⠋ Processing file contents...",
                1000,
                "\uD83D\uDCCA File processing summary:",
                800,
                "   ✅ Processed: 16 files",
                800,
                "✔ File contents processed",
                800,
                "✅ File generated successfully: git-ingest-1753197982.txt",
                1200,
                "ℹ️  Use --copy flag to copy content to clipboard",
                1000,
                "ℹ️  File size: 248.98 KB",
                800,
                "ℹ️  Files processed: 16",
                800,
                "\uD83D\uDCCA Processing Summary:",
                800,
                "   ✅ Processed: 16 files",
                800,
                "   \uD83D\uDCC1 Total size: 246.4KB",
                800,
                "   ⏱️  Duration: 14ms",
                800,
                "   🚀 Throughput: 17.2MB/s",
                1200,
                "",
                600
              ]}
              wrapper="span"
              speed={32}
              repeat={Infinity}
              cursor={true}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            />
          </div>
        </div>
        <a
          href="#get-started"
          className="mt-8 inline-block px-10 py-5 rounded-lg font-mono text-lg font-bold bg-[var(--accent-primary)] text-white shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 transition-colors duration-200 animate-pulse"
          style={{ boxShadow: "0 4px 24px 0 var(--accent-primary)33" }}
          aria-label="Get Started"
        >
          Get Started
        </a>
      </section>

      {/* Key Features Section */}
      <section
        id="features"
        className="w-full max-w-4xl py-20 flex flex-col items-center"
      >
        <h2
          className="h2 font-bold mb-10"
          style={{ color: "var(--accent-primary)" }}
        >
          Key Features
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 16px 2px var(--accent-primary)33`,
              rotate: 2
            }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="bg-[var(--background-secondary)] rounded-xl p-10 flex flex-col items-center shadow-lg border border-[var(--accent-primary)]/20"
            tabIndex={0}
            aria-label="Advanced Gitignore Support"
          >
            <Filter
              size={48}
              color="var(--accent-primary)"
              strokeWidth={2.5}
              className="mb-3 transition-transform duration-200 group-hover:rotate-6"
              aria-hidden="true"
            />
            <h3
              className="h3 font-semibold mb-2"
              style={{ color: "var(--accent-primary)" }}
            >
              Advanced Gitignore Support
            </h3>
            <p
              className="body text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              Easily exclude files and directories using{" "}
              <code className="font-mono">.gitignore</code> patterns.
            </p>
          </motion.div>
          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 16px 2px var(--accent-secondary)33`,
              rotate: 2
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              delay: 0.1
            }}
            className="bg-[var(--background-secondary)] rounded-xl p-10 flex flex-col items-center shadow-lg border border-[var(--accent-secondary)]/20"
            tabIndex={0}
            aria-label="Binary File Detection"
          >
            <File
              size={48}
              color="var(--accent-secondary)"
              strokeWidth={2.5}
              className="mb-3 transition-transform duration-200 group-hover:rotate-6"
              aria-hidden="true"
            />
            <h3
              className="h3 font-semibold mb-2"
              style={{ color: "var(--accent-secondary)" }}
            >
              Binary File Detection
            </h3>
            <p
              className="body text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              Skip binary files automatically for cleaner output.
            </p>
          </motion.div>
          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 16px 2px var(--accent-primary)33`,
              rotate: 2
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
              delay: 0.2
            }}
            className="bg-[var(--background-secondary)] rounded-xl p-10 flex flex-col items-center shadow-lg border border-[var(--accent-primary)]/20"
            tabIndex={0}
            aria-label="Clipboard Integration"
          >
            <Clipboard
              size={48}
              color="var(--accent-primary)"
              strokeWidth={2.5}
              className="mb-3 transition-transform duration-200 group-hover:rotate-6"
              aria-hidden="true"
            />
            <h3
              className="h3 font-semibold mb-2"
              style={{ color: "var(--accent-primary)" }}
            >
              Clipboard Integration
            </h3>
            <p
              className="body text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              Copy output to clipboard for instant sharing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Get Started Section */}
      <section
        id="get-started"
        className="w-full max-w-3xl py-20 flex flex-col items-center"
      >
        <h2 className="h2 font-extrabold mb-12 tracking-tight bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text drop-shadow-lg">
          Get Started
        </h2>
        <ol className="w-full flex flex-col gap-12">
          <GetStartedStep
            number={1}
            label="Install Globally"
            icon={<Star size={24} color="var(--accent-primary)" />}
            command="npm install -g git-ingest"
            color="var(--accent-primary)"
          />
          <GetStartedStep
            number={2}
            label="Analyze a Directory"
            icon={<File size={24} color="var(--accent-primary)" />}
            command="git-ingest ./my-project"
            color="var(--accent-primary)"
          />
          <GetStartedStep
            number={3}
            label="Copy Output to Clipboard"
            icon={<Clipboard size={24} color="var(--accent-secondary)" />}
            command="git-ingest --copy"
            color="var(--accent-secondary)"
          />
        </ol>
      </section>

      {/* Visual Demo Section */}
      <section
        id="demo"
        className="w-full max-w-3xl py-20 flex flex-col items-center"
      >
        <h2
          className="h2 font-bold mb-8 relative"
          style={{ color: "var(--accent-secondary)" }}
        >
          <span className="relative z-10">Visual Demo</span>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-2 bg-gradient-to-r from-[var(--accent-secondary)]/30 to-transparent blur-lg opacity-60 z-0"></span>
        </h2>
        <div className="relative bg-gradient-to-br from-[var(--background-secondary)] to-[var(--background)] rounded-2xl shadow-2xl border border-[var(--accent-primary)]/20 p-10 flex flex-col items-center w-full overflow-hidden">
          <video
            width={400}
            height={225}
            className="rounded-xl border-2 border-[var(--accent-secondary)] shadow-xl mb-4"
            controls
            autoPlay
            loop
            muted
            poster="/file.svg"
            style={{
              borderImage:
                "linear-gradient(to right, var(--accent-primary), var(--accent-secondary)) 1"
            }}
          >
            <source src="/demos/demo.mp4" type="video/mp4" />
            <source src="/demos/demo.webm" type="video/webm" />
            <span className="text-base text-[var(--accent-primary)] bg-[var(--background-secondary)] px-2 py-1 rounded">
              Sorry, your browser does not support embedded videos.{" "}
              <a href="/demos/demo.mp4" className="underline">
                Download the video
              </a>{" "}
              .
            </span>
          </video>
          <span
            className="text-base mt-1 mb-2"
            style={{ color: "var(--accent-primary)" }}
          >
            Watch Git-Ingest in Action
          </span>
          <a
            href="/demos/demo.mp4"
            className="text-xs underline"
            style={{ color: "var(--accent-primary)" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download video
          </a>
        </div>
      </section>

      {/* Docs/Usage Section */}
      <section
        id="docs"
        className="w-full max-w-3xl py-20 flex flex-col items-center"
      >
        <h2
          className="h2 font-bold mb-8 relative"
          style={{ color: "var(--accent-primary)" }}
        >
          <span className="relative z-10">Docs & Usage</span>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-2 bg-gradient-to-r from-[var(--accent-primary)]/30 to-transparent blur-lg opacity-60 z-0"></span>
        </h2>
        <div
          className="w-full rounded-2xl shadow-xl border border-[var(--accent-primary)]/20 p-10 flex flex-col md:flex-row gap-10 items-start"
          style={{
            background:
              "linear-gradient(to bottom right, var(--background), var(--background-secondary))"
          }}
        >
          <div className="flex-1">
            <h3
              className="h3 font-semibold mb-2"
              style={{ color: "var(--accent-primary)" }}
            >
              Basic Usage
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <Code2 size={20} color="var(--accent-primary)" />
                <span className="font-mono text-lg text-[var(--accent-primary)]">
                  git-ingest [options] [directory]
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">
                  Analyze and ingest your project codebase (default directory:
                  ./).
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FileText size={20} color="var(--accent-primary)" />
                <span className="font-mono text-lg text-[var(--accent-primary)]">
                  -o, --output &lt;filename&gt;
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">
                  Specify output filename.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Clipboard size={20} color="var(--accent-primary)" />
                <span className="font-mono text-lg text-[var(--accent-primary)]">
                  -c, --copy
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">
                  Copy output to clipboard.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Filter size={20} color="var(--accent-primary)" />
                <span className="font-mono text-lg text-[var(--accent-primary)]">
                  -i, --include &lt;patterns...&gt;
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">
                  Include files matching patterns.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Filter size={20} color="var(--accent-primary)" />
                <span className="font-mono text-lg text-[var(--accent-primary)]">
                  -e, --exclude &lt;patterns...&gt;
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">
                  Exclude files matching patterns.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FileText size={20} color="var(--accent-primary)" />
                <span className="font-mono text-lg text-[var(--accent-primary)]">
                  --max-size &lt;size&gt;
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">
                  Maximum file size to include (in MB, default: 10).
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Code2 size={20} color="var(--accent-primary)" />
                <span className="font-mono text-lg text-[var(--accent-primary)]">
                  -v, --verbose
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">
                  Verbose output.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Code2 size={20} color="var(--accent-primary)" />
                <span className="font-mono text-lg text-[var(--accent-primary)]">
                  -q, --quiet
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">
                  Quiet mode.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Code2 size={20} color="var(--accent-primary)" />
                <span className="font-mono text-lg text-[var(--accent-primary)]">
                  -V, --version
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">
                  Output the version number.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Code2 size={20} color="var(--accent-primary)" />
                <span className="font-mono text-lg text-[var(--accent-primary)]">
                  -h, --help
                </span>
                <span className="ml-2 text-[var(--text-secondary)]">
                  Display help for command.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer
        className="w-full py-10 mt-8 flex flex-col items-center border-t border-[var(--accent-primary)]/20"
        style={{ background: "var(--background-secondary)" }}
      >
        <div className="flex flex-wrap gap-12 mb-4">
          <a
            href="https://github.com/AungMyoKyaw/git-ingest"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-medium transition-colors duration-150"
            aria-label="GitHub Repository"
          >
            <Code2 size={20} /> GitHub Repository
          </a>
          <a
            href="https://github.com/AungMyoKyaw/git-ingest/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-medium transition-colors duration-150"
            aria-label="MIT License"
          >
            <FileText size={20} /> MIT License
          </a>
        </div>
        <div className="mb-2 text-[var(--text-secondary)]">
          Built by Aung Myo Kyaw with{" "}
          <span className="text-[var(--accent-secondary)]">❤️</span>
        </div>
        <div className="mt-2">
          <span
            className="font-semibold"
            style={{ color: "var(--accent-primary)" }}
          >
            <Star
              size={18}
              className="inline-block mr-1 transition-transform duration-200 hover:rotate-12"
            />{" "}
            ⭐ Star us on GitHub!
          </span>
        </div>
      </footer>
    </div>
  );
}
