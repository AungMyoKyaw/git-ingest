"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Terminal, Copy, Package, PlayCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

const installMethods = [
  {
    title: "Global Installation",
    description: "Install once, use anywhere on your system",
    command: "npm install -g git-ingest",
    badge: "Recommended"
  },
  {
    title: "One-time Usage",
    description: "Use without installing globally",
    command: "npx git-ingest",
    badge: "Quick Start"
  },
  {
    title: "Project Dependency",
    description: "Add to your project's dependencies",
    command: "npm install --save-dev git-ingest",
    badge: "For Teams"
  }
];

const usageExamples = [
  {
    title: "Analyze Current Directory",
    command: "git-ingest",
    description: "Analyze the current working directory"
  },
  {
    title: "Analyze Specific Directory",
    command: "git-ingest /path/to/project",
    description: "Analyze a specific project directory"
  },
  {
    title: "Copy to Clipboard",
    command: "git-ingest --copy",
    description: "Analyze and copy results to clipboard"
  },
  {
    title: "Filter File Types",
    command: 'git-ingest --include "*.js" "*.ts"',
    description: "Only include JavaScript and TypeScript files"
  }
];

export function InstallationSection({ id }: { id?: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id={id} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get Started in
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Seconds
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose your preferred installation method and start analyzing
            codebases immediately.
          </p>
        </div>

        {/* Installation Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {installMethods.map((method, index) => (
            <Card
              key={method.title}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <Package className="w-8 h-8 text-primary mb-2" />
                  <Badge
                    variant={index === 0 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {method.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                  <Terminal className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <code className="text-sm font-mono flex-1 truncate">
                    {method.command}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(method.command, index)}
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    {copiedIndex === index ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Examples */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">
            Common Usage Examples
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usageExamples.map((example, index) => (
              <Card
                key={example.title}
                className="group hover:shadow-md transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">{example.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">
                    {example.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 bg-muted/30 rounded-md p-2">
                    <Terminal className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <code className="text-sm font-mono flex-1 truncate">
                      {example.command}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(example.command, index + 100)}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      {copiedIndex === index + 100 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Start CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-primary/5 border border-primary/20 rounded-lg p-6">
            <div className="text-left">
              <h4 className="font-semibold text-lg mb-1">
                Ready to get started?
              </h4>
              <p className="text-sm text-muted-foreground">
                Install Git-Ingest and analyze your first project in under a
                minute.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => handleCopy("npm install -g git-ingest", -1)}
              className="whitespace-nowrap"
            >
              {copiedIndex === -1 ? "Copied!" : "Copy Install Command"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
