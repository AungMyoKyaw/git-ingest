"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Download, Copy, Terminal, Sparkles } from "lucide-react";
import { useState } from "react";

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("npm install -g git-ingest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center animate-fade-in">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5 whitespace-normal max-w-xs sm:max-w-none"
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Version 2.1 - Now with Markdown Output & Language Detection
            </Badge>
          </div>

          {/* Main Headline */}
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
              Transform Any
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Codebase
              </span>
              into AI-Ready Format
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A powerful CLI tool that analyzes and ingests entire project
              codebases into structured text or markdown files. Perfect for AI
              analysis, code reviews, documentation, and team collaboration with
              enhanced language detection.
            </p>
          </div>

          {/* Installation Command */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <div className="flex items-center gap-2 bg-card border rounded-lg p-3 w-full sm:w-auto min-w-[300px]">
              <Terminal className="w-5 h-5 text-muted-foreground" />
              <code className="text-sm font-mono truncate">
                npm install -g git-ingest
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="ml-auto h-8 w-8 p-0"
              >
                <Copy className={`w-4 h-4 ${copied ? "text-green-500" : ""}`} />
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <a
              href="https://github.com/AungMyoKyaw/git-ingest"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center h-12 px-8 text-base font-medium bg-primary text-white rounded-md justify-center transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <Download className="w-5 h-5 mr-2" />
              Get Started Now
            </a>

            <a
              href="https://github.com/AungMyoKyaw/git-ingest"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center h-12 px-8 text-base font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </a>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 animate-fade-in-up delay-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10x</div>
              <div className="text-sm text-muted-foreground">
                Faster than v1.0
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">&lt;60s</div>
              <div className="text-sm text-muted-foreground">
                Process 10k files
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">
                Security focused
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/30 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
