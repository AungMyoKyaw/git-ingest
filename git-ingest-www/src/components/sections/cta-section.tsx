"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Github,
  Download,
  Star,
  Copy,
  Terminal,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

export function CTASection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("npm install -g git-ingest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-blue-600/5 to-purple-600/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
      <div className="absolute top-20 left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <div className="space-y-8 mb-16">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Ready to Transform
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Your Workflow?
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join thousands of developers who are already using Git-Ingest to
              streamline their codebase analysis and boost productivity.
            </p>

            {/* Installation Card */}
            <Card className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm border-border/50 shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      Get Started in Seconds
                    </h3>
                    <p className="text-muted-foreground">
                      Install Git-Ingest globally and start analyzing projects
                      immediately.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-4">
                    <Terminal className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <code className="text-lg font-mono flex-1 text-center">
                      npm install -g git-ingest
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-10 w-10 p-0 flex-shrink-0"
                    >
                      <Copy
                        className={`w-5 h-5 ${copied ? "text-green-500" : ""}`}
                      />
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="h-14 px-8 text-lg font-medium group"
                    >
                      <Download className="w-6 h-6 mr-2 group-hover:animate-bounce" />
                      Install Now
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 px-8 text-lg font-medium group"
                    >
                      <Github className="w-6 h-6 mr-2" />
                      View Source
                      <Star className="w-4 h-4 ml-2 group-hover:fill-current transition-all" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-sm text-muted-foreground">
                Monthly Downloads
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">GitHub Stars</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">99%</div>
              <div className="text-sm text-muted-foreground">
                Satisfaction Rate
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-950/50 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Zero Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Works out of the box with sensible defaults
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-950/50 rounded-lg flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Cross-Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Works on Windows, macOS, and Linux
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-950/50 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">Open Source</h3>
                <p className="text-sm text-muted-foreground">
                  MIT licensed and community driven
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Final Message */}
          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Join the community of developers transforming how they work with
              code.
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with ❤️ by</span>
              <a
                href="https://github.com/AungMyoKyaw"
                className="font-medium text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aung Myo Kyaw
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
