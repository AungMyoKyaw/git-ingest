import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TerminalIcon from "@/components/ui/icons/TerminalIcon";
import ShieldIcon from "@/components/ui/icons/ShieldIcon";
import ZapIcon from "@/components/ui/icons/ZapIcon";
import FileTextIcon from "@/components/ui/icons/FileTextIcon";
import GitBranchIcon from "@/components/ui/icons/GitBranchIcon";
import CopyIcon from "@/components/ui/icons/CopyIcon";
import FilterIcon from "@/components/ui/icons/FilterIcon";
import GaugeIcon from "@/components/ui/icons/GaugeIcon";

const features = [
  {
    icon: TerminalIcon,
    title: "Powerful CLI Interface",
    description:
      "Professional command-line interface with comprehensive options, progress indicators, and colored output for enhanced user experience.",
    badge: "Enhanced"
  },
  {
    icon: ShieldIcon,
    title: "Security First",
    description:
      "Built with security in mind - no command injection vulnerabilities, input validation, secure clipboard operations, and path traversal protection.",
    badge: "Secure"
  },
  {
    icon: ZapIcon,
    title: "Lightning Fast",
    description:
      "10x faster than v1.0 with async operations, memory-efficient streaming, and smart caching. Process 10,000+ files in under 60 seconds with p-limit concurrency control.",
    badge: "Performance"
  },
  {
    icon: FileTextIcon,
    title: "Markdown Output Format",
    description:
      "NEW: Generate structured, LLM-friendly markdown reports with table of contents, project overview, language statistics, and syntax highlighting.",
    badge: "New in 2.1"
  },
  {
    icon: GitBranchIcon,
    title: "Advanced Language Detection",
    description:
      "Enhanced language detection module identifies file types based on extensions and filenames, providing better categorization and syntax highlighting.",
    badge: "Improved"
  },
  {
    icon: CopyIcon,
    title: "CI/CD Integration",
    description:
      "Built-in GitHub Actions workflow support with automated testing, code coverage reporting, and Codecov integration for continuous quality assurance.",
    badge: "DevOps Ready"
  },
  {
    icon: FilterIcon,
    title: "Advanced Filtering",
    description:
      "Flexible include/exclude patterns, custom file size limits, externalized configuration files, and granular control over what gets analyzed.",
    badge: "Flexible"
  },
  {
    icon: GaugeIcon,
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
            // Choose variant based on badge label for demo purposes
            type VariantType =
              | "default"
              | "secondary"
              | "success"
              | "warning"
              | "destructive"
              | "outline";
            let variant: VariantType = "secondary";
            if (feature.badge?.toLowerCase().includes("secure"))
              variant = "success";
            if (feature.badge?.toLowerCase().includes("performance"))
              variant = "warning";
            if (feature.badge?.toLowerCase().includes("devops"))
              variant = "default";
            if (feature.badge?.toLowerCase().includes("improved"))
              variant = "outline";
            if (feature.badge?.toLowerCase().includes("new"))
              variant = "destructive";

            return (
              <Card
                key={feature.title}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-border/40 bg-gradient-to-br from-card/60 to-muted/40 backdrop-blur-xl"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors shadow-sm">
                      <IconComponent width={24} height={24} />
                    </div>
                    <Badge
                      variant={variant}
                      size="md"
                      icon={<IconComponent width={18} height={18} />}
                      className="font-bold shadow-md"
                      aria-label={feature.badge}
                    >
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
