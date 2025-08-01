import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  Shield,
  Zap,
  FileText,
  GitBranch,
  Copy,
  Filter,
  Gauge
} from "lucide-react";

const features = [
  {
    icon: Terminal,
    title: "Powerful CLI Interface",
    description:
      "Professional command-line interface with comprehensive options, progress indicators, and colored output for enhanced user experience.",
    badge: "Enhanced"
  },
  {
    icon: Shield,
    title: "Security First",
    description:
      "Built with security in mind - no command injection vulnerabilities, input validation, secure clipboard operations, and path traversal protection.",
    badge: "Secure"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "10x faster than v1.0 with async operations, memory-efficient streaming, and smart caching. Process 10,000+ files in under 60 seconds with p-limit concurrency control.",
    badge: "Performance"
  },
  {
    icon: FileText,
    title: "Markdown Output Format",
    description:
      "NEW: Generate structured, LLM-friendly markdown reports with table of contents, project overview, language statistics, and syntax highlighting.",
    badge: "New in 2.1"
  },
  {
    icon: GitBranch,
    title: "Advanced Language Detection",
    description:
      "Enhanced language detection module identifies file types based on extensions and filenames, providing better categorization and syntax highlighting.",
    badge: "Improved"
  },
  {
    icon: Copy,
    title: "CI/CD Integration",
    description:
      "Built-in GitHub Actions workflow support with automated testing, code coverage reporting, and Codecov integration for continuous quality assurance.",
    badge: "DevOps Ready"
  },
  {
    icon: Filter,
    title: "Advanced Filtering",
    description:
      "Flexible include/exclude patterns, custom file size limits, externalized configuration files, and granular control over what gets analyzed.",
    badge: "Flexible"
  },
  {
    icon: Gauge,
    title: "Memory Efficient",
    description:
      "Streaming architecture prevents memory overflow, constant memory usage regardless of project size, and optimized for large codebases.",
    badge: "Optimized"
  }
];

export function FeaturesSection({ id }: { id?: string }) {
  return (
    <section id={id} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Codebase Analysis
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Git-Ingest v2.1 introduces markdown output format, enhanced language
            detection, and CI/CD integration while maintaining enterprise-grade
            security and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional feature highlights */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">
                Cross-Platform
              </div>
              <p className="text-sm text-muted-foreground">
                Works seamlessly on Windows, macOS, and Linux
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">Zero Config</div>
              <p className="text-sm text-muted-foreground">
                Works out of the box with sensible defaults
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">Open Source</div>
              <p className="text-sm text-muted-foreground">
                MIT licensed and community driven
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
