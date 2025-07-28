import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, ExternalLink } from "lucide-react";

const navigation = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Installation", href: "#installation" },
    { name: "Performance", href: "#performance" },
    { name: "Security", href: "#security" }
  ],
  resources: [
    {
      name: "Documentation",
      href: "https://github.com/AungMyoKyaw/git-ingest#readme",
      external: true
    },
    {
      name: "GitHub Repository",
      href: "https://github.com/AungMyoKyaw/git-ingest",
      external: true
    },
    {
      name: "NPM Package",
      href: "https://npmjs.com/package/git-ingest",
      external: true
    },
    {
      name: "Contributing Guide",
      href: "https://github.com/AungMyoKyaw/git-ingest/blob/master/CONTRIBUTING.md",
      external: true
    }
  ],
  support: [
    {
      name: "Issues",
      href: "https://github.com/AungMyoKyaw/git-ingest/issues",
      external: true
    },
    {
      name: "Discussions",
      href: "https://github.com/AungMyoKyaw/git-ingest/discussions",
      external: true
    },
    {
      name: "Release Notes",
      href: "https://github.com/AungMyoKyaw/git-ingest/releases",
      external: true
    },
    {
      name: "License",
      href: "https://github.com/AungMyoKyaw/git-ingest/blob/master/LICENSE",
      external: true
    }
  ]
};

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/AungMyoKyaw",
    icon: Github
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/aungmyokyaw",
    icon: Linkedin
  }
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted/50 border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">GI</span>
              </div>
              <span className="text-xl font-bold">Git-Ingest</span>
            </div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Transform any codebase into AI-ready format with advanced
              analysis, security, and performance. The developer tool trusted by
              thousands worldwide.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:col-span-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Product
              </h3>
              <ul className="space-y-3">
                {navigation.product.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Resources
              </h3>
              <ul className="space-y-3">
                {navigation.resources.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1"
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      {item.name}
                      {item.external && <ExternalLink className="w-3 h-3" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Support
              </h3>
              <ul className="space-y-3">
                {navigation.support.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1"
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      {item.name}
                      {item.external && <ExternalLink className="w-3 h-3" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
            <p>&copy; {currentYear} Git-Ingest. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/AungMyoKyaw/git-ingest/blob/master/PRIVACY.md"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="https://github.com/AungMyoKyaw/git-ingest/blob/master/LICENSE"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <span className="text-red-500">♥</span>
            <span>using</span>
            <a
              href="https://nextjs.org"
              className="font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js
            </a>
            <span>&</span>
            <a
              href="https://tailwindcss.com"
              className="font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tailwind CSS
            </a>
          </div>
        </div>

        {/* Installation Reminder */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 ">
            <code className="text-sm font-mono">npm install -g git-ingest</code>
            <span className="text-xs text-muted-foreground">
              • Start transforming codebases today
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
