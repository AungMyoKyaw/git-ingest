"use client";
import React from "react";
import {
  Folder,
  Globe,
  File,
  Clipboard,
  Video,
  Code2,
  FileText,
  Star
} from "lucide-react";

export default function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    // Set initial state
    setIsVideoPlaying(!video.paused && !video.ended);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // 2025 color palette
  const palette = {
    peach: "#FFBE98",
    blue: "#4960A8",
    green: "#2D4633",
    pink: "#F6D6D6",
    neutral: "#F5F3EF",
    honey: "#B6864B",
    coral: "#FF6F61",
    dark: "#181818",
    gray: "#232323",
    white: "#fff"
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 font-sans"
      style={{
        background: `linear-gradient(180deg, ${palette.peach} 0%, ${palette.neutral} 60%, ${palette.dark} 100%)`,
        color: palette.dark
      }}
    >
      {/* Hero Section */}
      <section className="w-full max-w-3xl flex flex-col items-center text-center gap-8 py-20">
        <h1
          className="text-5xl sm:text-6xl font-extrabold mb-2 tracking-tight"
          style={{ color: palette.blue, letterSpacing: "-0.03em" }}
        >
          Ingest Your Project with Ease
        </h1>
        <p
          className="text-xl sm:text-2xl text-gray-700 max-w-2xl mb-4"
          style={{ color: palette.green }}
        >
          Git-Ingest is a powerful CLI tool that analyzes and ingests your
          project codebases into structured text files, simplifying code
          reviews, AI analysis, and collaboration.
        </p>
        <div className="my-6 flex items-center justify-center animate-fade-in">
          <Folder
            size={80}
            color={palette.honey}
            strokeWidth={2.5}
            className="drop-shadow-lg"
          />
        </div>
        <a
          href="#get-started"
          className="mt-4 inline-block px-10 py-4 rounded-full font-semibold text-lg shadow-lg transition-colors"
          style={{
            background: palette.coral,
            color: palette.white,
            boxShadow: `0 4px 24px 0 ${palette.coral}33`
          }}
        >
          Install Now
        </a>
      </section>

      {/* Key Features Section */}
      <section className="w-full max-w-4xl py-12 flex flex-col items-center">
        <h2
          className="text-3xl font-bold mb-8"
          style={{ color: palette.honey }}
        >
          Key Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
          {/* Feature 1 */}
          <div className="bg-white/80 rounded-xl p-8 flex flex-col items-center shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-200">
            <Globe
              size={40}
              color={palette.blue}
              strokeWidth={2.5}
              className="mb-3"
            />
            <h3
              className="font-semibold text-lg mb-2"
              style={{ color: palette.blue }}
            >
              Advanced Gitignore Support
            </h3>
            <p className="text-gray-700 text-center text-base">
              Easily exclude files and directories using .gitignore patterns.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-white/80 rounded-xl p-8 flex flex-col items-center shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-200">
            <File
              size={40}
              color={palette.coral}
              strokeWidth={2.5}
              className="mb-3"
            />
            <h3
              className="font-semibold text-lg mb-2"
              style={{ color: palette.coral }}
            >
              Binary File Detection
            </h3>
            <p className="text-gray-700 text-center text-base">
              Automatically skip binary files to focus on code.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-white/80 rounded-xl p-8 flex flex-col items-center shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-200">
            <Clipboard
              size={40}
              color={palette.green}
              strokeWidth={2.5}
              className="mb-3"
            />
            <h3
              className="font-semibold text-lg mb-2"
              style={{ color: palette.green }}
            >
              Clipboard Integration
            </h3>
            <p className="text-gray-700 text-center text-base">
              Copy the output directly to your clipboard for seamless sharing.
            </p>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section
        id="get-started"
        className="w-full max-w-3xl py-12 flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold mb-8" style={{ color: palette.blue }}>
          Get Started
        </h2>
        <ol className="w-full flex flex-col gap-8">
          {/* Step 1 */}
          <li className="bg-white/90 rounded-lg p-8 flex flex-col gap-2 shadow border border-gray-200">
            <span className="font-semibold text-base mb-1 flex items-center gap-2">
              <Star size={18} color={palette.honey} /> 1. Install Globally
            </span>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 text-[${palette.coral}] font-mono px-3 py-2 rounded text-sm select-all">
                npm install -g git-ingest
              </code>
              <button
                type="button"
                className="ml-2 px-2 py-1 rounded bg-gray-200 text-xs text-black hover:bg-gray-300 border border-gray-300"
                onClick={() =>
                  navigator.clipboard.writeText("npm install -g git-ingest")
                }
              >
                Copy
              </button>
            </div>
          </li>
          {/* Step 2 */}
          <li className="bg-white/90 rounded-lg p-8 flex flex-col gap-2 shadow border border-gray-200">
            <span className="font-semibold text-base mb-1 flex items-center gap-2">
              <File size={18} color={palette.blue} /> 2. Run in Your Project
            </span>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 text-[${palette.blue}] font-mono px-3 py-2 rounded text-sm select-all">
                git-ingest
              </code>
              <button
                type="button"
                className="ml-2 px-2 py-1 rounded bg-gray-200 text-xs text-black hover:bg-gray-300 border border-gray-300"
                onClick={() => navigator.clipboard.writeText("git-ingest")}
              >
                Copy
              </button>
            </div>
          </li>
          {/* Step 3 */}
          <li className="bg-white/90 rounded-lg p-8 flex flex-col gap-2 shadow border border-gray-200">
            <span className="font-semibold text-base mb-1 flex items-center gap-2">
              <Clipboard size={18} color={palette.green} /> 3. Copy to Clipboard
            </span>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 text-[${palette.green}] font-mono px-3 py-2 rounded text-sm select-all">
                git-ingest --copy
              </code>
              <button
                type="button"
                className="ml-2 px-2 py-1 rounded bg-gray-200 text-xs text-black hover:bg-gray-300 border border-gray-300"
                onClick={() =>
                  navigator.clipboard.writeText("git-ingest --copy")
                }
              >
                Copy
              </button>
            </div>
          </li>
        </ol>
      </section>

      {/* Visual Demo Section */}
      <section className="w-full max-w-3xl py-12 flex flex-col items-center">
        <h2
          className="text-3xl font-bold mb-8 relative"
          style={{ color: palette.coral }}
        >
          <span className="relative z-10">Visual Demo</span>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-2 bg-gradient-to-r from-[#FFBE98]/30 to-transparent blur-lg opacity-60 z-0"></span>
        </h2>
        <div className="relative bg-gradient-to-br from-[#F6D6D6] to-[#F5F3EF] rounded-2xl shadow-2xl border border-gray-200 p-8 flex flex-col items-center w-full overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-80 h-80 bg-[#FFBE98]/10 rounded-full blur-3xl absolute -top-24 -left-24 animate-pulse"></div>
            <div className="w-60 h-60 bg-[#4960A8]/10 rounded-full blur-2xl absolute -bottom-16 -right-16 animate-pulse"></div>
          </div>
          <div className="w-full flex justify-center mb-4 relative z-10">
            <div className="relative group">
              <video
                ref={videoRef}
                width={480}
                height={270}
                className="rounded-xl border-2 border-[#4960A8] shadow-xl transition-transform group-hover:scale-105"
                controls
                autoPlay
                loop
                muted
                poster="/file.svg"
              >
                <source src="/demos/demo.mp4" type="video/mp4" />
                <source src="/demos/demo.webm" type="video/webm" />
                Sorry, your browser does not support embedded videos. Please try
                a different browser or{" "}
                <a href="/demos/demo.mp4">download the video</a>.
              </video>
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Video
                    size={64}
                    color={palette.coral}
                    className="opacity-80 animate-bounce"
                  />
                </div>
              )}
            </div>
          </div>
          <span className="text-gray-700 text-base mt-2 font-medium relative z-10">
            See Git-Ingest at Work
          </span>
        </div>
      </section>
      {/* Footer */}
      <footer
        className="w-full py-10 mt-8 flex flex-col items-center border-t border-gray-200"
        style={{
          background: `linear-gradient(180deg, ${palette.neutral} 0%, ${palette.peach} 100%)`
        }}
      >
        <div className="flex flex-wrap gap-8 mb-4">
          <a
            href="https://github.com/AungMyoKyaw/git-ingest"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-700 hover:underline font-medium"
          >
            <Code2 size={20} /> GitHub Repository
          </a>
          <a
            href="https://github.com/AungMyoKyaw/git-ingest/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-700 hover:underline font-medium"
          >
            <FileText size={20} /> MIT License
          </a>
        </div>
        <div className="mb-2 text-gray-700">
          Made with <span className="text-red-500">❤️</span> by Aung Myo Kyaw
        </div>
        <div className="mt-2">
          <span className="font-semibold" style={{ color: palette.coral }}>
            <Star size={18} className="inline-block mr-1" /> Star us on GitHub
            if you find Git-Ingest useful!
          </span>
        </div>
      </footer>
    </div>
  );
}
