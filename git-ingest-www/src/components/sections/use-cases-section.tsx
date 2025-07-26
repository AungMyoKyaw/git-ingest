import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Users,
  FileSearch,
  RefreshCw,
  BookOpen,
  MessageSquare
} from "lucide-react";

const useCases = [
  {
    icon: Bot,
    title: "AI Analysis",
    description:
      "Perfect for feeding entire codebases to AI tools like ChatGPT, Claude, or GitHub Copilot for analysis, documentation, or refactoring suggestions.",
    examples: [
      "Code review automation",
      "Documentation generation",
      "Refactoring suggestions",
      "Bug detection patterns"
    ],
    badge: "Popular",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: MessageSquare,
    title: "Code Reviews",
    description:
      "Generate comprehensive project overviews for code reviews, sharing complete project context in a single, structured document.",
    examples: [
      "Pull request context",
      "Architecture reviews",
      "Security audits",
      "Compliance checks"
    ],
    badge: "Enterprise",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description:
      "Create snapshot documentation of project structure and content for onboarding new team members or archival purposes.",
    examples: [
      "Onboarding guides",
      "Project snapshots",
      "Architecture docs",
      "Knowledge transfer"
    ],
    badge: "Teams",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: RefreshCw,
    title: "Project Migration",
    description:
      "Analyze and understand legacy codebases before migration or modernization efforts, getting complete visibility into existing systems.",
    examples: [
      "Legacy assessment",
      "Modernization planning",
      "Technology migration",
      "Risk analysis"
    ],
    badge: "Enterprise",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share project context quickly with team members, stakeholders, or external consultants without complex setup or access requirements.",
    examples: [
      "Stakeholder reports",
      "Consultant briefings",
      "Remote collaboration",
      "Context sharing"
    ],
    badge: "Collaboration",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: FileSearch,
    title: "Quality Assurance",
    description:
      "Comprehensive codebase analysis for quality assurance, identifying patterns, inconsistencies, and potential improvements across large projects.",
    examples: [
      "Code pattern analysis",
      "Consistency checking",
      "Technical debt assessment",
      "Best practice validation"
    ],
    badge: "Quality",
    gradient: "from-teal-500 to-blue-500"
  }
];

export function UseCasesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Use Cases for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Every Workflow
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From AI analysis to team collaboration, Git-Ingest transforms how
            you work with codebases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase) => {
            const IconComponent = useCase.icon;
            return (
              <Card
                key={useCase.title}
                className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden relative"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${useCase.gradient} opacity-60`}
                />

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${useCase.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                    >
                      <IconComponent className="w-7 h-7 text-foreground" />
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 bg-primary/5"
                    >
                      {useCase.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {useCase.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Perfect For:
                    </h4>
                    <ul className="space-y-2">
                      {useCase.examples.map((example) => (
                        <li key={example} className="flex items-center text-sm">
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${useCase.gradient} mr-3 flex-shrink-0`}
                          />
                          <span className="text-muted-foreground">
                            {example}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Success Stories */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Real Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold">85% Faster Reviews</h4>
              <p className="text-muted-foreground">
                Teams report significantly faster code reviews with complete
                context
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold">50% Less Onboarding</h4>
              <p className="text-muted-foreground">
                New developers get up to speed twice as fast with comprehensive
                docs
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold">90% Migration Success</h4>
              <p className="text-muted-foreground">
                Higher success rate for legacy system migrations with complete
                analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
