import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Clock,
  HardDrive,
  TrendingUp,
  CheckCircle,
  Activity
} from "lucide-react";

const benchmarks = [
  {
    size: "Small",
    files: "< 100",
    time: "< 2 seconds",
    memory: "< 50MB",
    icon: Zap,
    color: "text-green-500"
  },
  {
    size: "Medium",
    files: "1,000",
    time: "< 10 seconds",
    memory: "< 100MB",
    icon: Clock,
    color: "text-blue-500"
  },
  {
    size: "Large",
    files: "10,000",
    time: "< 60 seconds",
    memory: "< 200MB",
    icon: HardDrive,
    color: "text-purple-500"
  }
];

const improvements = [
  {
    metric: "Processing Speed",
    improvement: "10x Faster",
    description:
      "Complete rewrite with async operations, streaming architecture, and p-limit concurrency control for optimal performance",
    icon: TrendingUp
  },
  {
    metric: "Memory Usage",
    improvement: "Constant",
    description:
      "Memory-efficient streaming prevents overflow regardless of project size with smart memory pool management",
    icon: Activity
  },
  {
    metric: "Concurrency Control",
    improvement: "Smart Limiting",
    description:
      "Advanced p-limit integration manages concurrent file operations preventing system overload while maximizing throughput",
    icon: CheckCircle
  }
];

const technicalFeatures = [
  "Streaming Architecture",
  "P-limit Concurrency Control",
  "Advanced Language Detection",
  "Markdown Output Format",
  "Binary File Detection",
  "Memory Pool Management",
  "CI/CD Integration",
  "Code Coverage Reporting"
];

export function PerformanceSection({ id }: { id?: string }) {
  return (
    <section id={id} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Built for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Performance
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Git-Ingest v2.1.0 delivers exceptional performance with
            enterprise-grade reliability, enhanced concurrency control, and
            advanced language processing.
          </p>
        </div>

        {/* Performance Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benchmarks.map((benchmark) => {
            const IconComponent = benchmark.icon;
            return (
              <Card
                key={benchmark.size}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                      <IconComponent className={`w-8 h-8 ${benchmark.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {benchmark.size} Projects
                  </CardTitle>
                  <CardDescription className="text-lg font-semibold text-muted-foreground">
                    {benchmark.files} files
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Processing Time:
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                      >
                        {benchmark.time}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Memory Usage:
                      </span>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                      >
                        {benchmark.memory}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Version 2.0 Improvements */}
        <div className="max-w-5xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            Version 2.1.0 Performance Improvements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {improvements.map((improvement) => {
              const IconComponent = improvement.icon;
              return (
                <Card
                  key={improvement.metric}
                  className="group hover:shadow-md transition-all duration-300 text-center"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-3">
                      <IconComponent className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="text-lg">
                      {improvement.metric}
                    </CardTitle>
                    <div className="text-2xl font-bold text-primary">
                      {improvement.improvement}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {improvement.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 to-blue-600/5 border-primary/20">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold">
                Advanced Technical Architecture
              </CardTitle>
              <CardDescription className="text-base">
                Built with modern Node.js patterns for maximum performance and
                reliability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {technicalFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center space-x-2 p-3 bg-background/60 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Comparison */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">v1.0 vs v2.1.0 Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-muted-foreground">
                Version 1.0
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span>10,000 files:</span>
                  <span className="text-red-500">~10 minutes</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span>Memory usage:</span>
                  <span className="text-red-500">~1GB+</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/30 rounded">
                  <span>Output format:</span>
                  <span className="text-red-500">Text only</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-primary">
                Version 2.1.0
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-primary/5 border border-primary/20 rounded">
                  <span>10,000 files:</span>
                  <span className="text-green-500 font-semibold">
                    &lt;60 seconds
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-primary/5 border border-primary/20 rounded">
                  <span>Memory usage:</span>
                  <span className="text-green-500 font-semibold">
                    &lt;200MB
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-primary/5 border border-primary/20 rounded">
                  <span>Output format:</span>
                  <span className="text-green-500 font-semibold">
                    Text + Markdown
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
