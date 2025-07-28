import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Eye,
  CheckCircle,
  AlertTriangle,
  UserCheck
} from "lucide-react";

const securityFeatures = [
  {
    icon: Shield,
    title: "No Command Injection",
    description:
      "Eliminated all command injection vulnerabilities through secure clipboard operations and input sanitization.",
    status: "Resolved",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: UserCheck,
    title: "Input Validation",
    description:
      "Comprehensive validation of all user inputs prevents malicious data from being processed.",
    status: "Enhanced",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Lock,
    title: "Path Traversal Protection",
    description:
      "Advanced path validation prevents directory traversal attacks and unauthorized file access.",
    status: "Secured",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Eye,
    title: "Permission Respect",
    description:
      "Works strictly within user permissions, never attempting to access restricted areas.",
    status: "Compliant",
    gradient: "from-orange-500 to-red-500"
  }
];

const securityPrinciples = [
  {
    title: "Zero Trust Architecture",
    description:
      "All inputs are validated, all operations are secured, no assumptions about safety."
  },
  {
    title: "Least Privilege Principle",
    description:
      "Operates with minimal necessary permissions, reducing potential attack surface."
  },
  {
    title: "Secure by Default",
    description:
      "Conservative defaults that prioritize security over convenience."
  },
  {
    title: "Transparent Operations",
    description:
      "All operations are logged and can be audited for security compliance."
  }
];

const vulnerabilityFixes = [
  {
    issue: "Command Injection via Clipboard",
    severity: "Critical",
    fix: "Replaced shell commands with native Node.js APIs",
    status: "Fixed"
  },
  {
    issue: "Path Traversal Vulnerabilities",
    severity: "High",
    fix: "Added comprehensive path validation and sanitization",
    status: "Fixed"
  },
  {
    issue: "Unsafe File Operations",
    severity: "Medium",
    fix: "Implemented secure file handling with proper error checking",
    status: "Fixed"
  },
  {
    issue: "Input Sanitization Missing",
    severity: "Medium",
    fix: "Added input validation for all user-provided data",
    status: "Fixed"
  }
];

export function SecuritySection({ id }: { id?: string }) {
  return (
    <section id={id} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Security
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              First Design
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Git-Ingest v2.0 was built from the ground up with enterprise-grade
            security as the top priority.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm relative overflow-hidden"
              >
                {/* Gradient accent */}
                <div
                  className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${feature.gradient}`}
                />

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                    >
                      <IconComponent className="w-6 h-6 text-foreground" />
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Security Principles */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            Core Security Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityPrinciples.map((principle) => (
              <Card
                key={principle.title}
                className="group hover:shadow-md transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <CardTitle className="text-lg">{principle.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {principle.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Vulnerability Fixes */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Security Vulnerabilities Addressed
          </h3>
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-xl text-center">
                Complete Security Audit & Remediation
              </CardTitle>
              <CardDescription className="text-center text-base">
                All known security issues from v1.0 have been identified and
                resolved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vulnerabilityFixes.map((vuln) => (
                  <div
                    key={vuln.issue}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-background/60 rounded-lg border"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {vuln.severity === "Critical" && (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                      {vuln.severity === "High" && (
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                      )}
                      {vuln.severity === "Medium" && (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{vuln.issue}</h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              vuln.severity === "Critical"
                                ? "border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-300 dark:bg-red-950/30"
                                : vuln.severity === "High"
                                  ? "border-orange-200 text-orange-700 bg-orange-50 dark:border-orange-800 dark:text-orange-300 dark:bg-orange-950/30"
                                  : "border-yellow-200 text-yellow-700 bg-yellow-50 dark:border-yellow-800 dark:text-yellow-300 dark:bg-yellow-950/30"
                            }
                          >
                            {vuln.severity}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {vuln.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {vuln.fix}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Guarantee */}
        <div className="text-center mt-16">
          <Card className="inline-block bg-primary/5 border-primary/20 p-8 max-w-2xl">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Security Guarantee</h3>
            <p className="text-muted-foreground mb-6">
              Git-Ingest v2.0 has undergone comprehensive security testing and
              follows industry best practices. We&apos;re committed to
              maintaining the highest security standards.
            </p>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800 text-sm px-4 py-2"
            >
              ✓ Security Audited & Verified
            </Badge>
          </Card>
        </div>
      </div>
    </section>
  );
}
