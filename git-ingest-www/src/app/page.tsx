import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { InstallationSection } from "@/components/sections/installation-section";
import { UseCasesSection } from "@/components/sections/use-cases-section";
import { PerformanceSection } from "@/components/sections/performance-section";
import { SecuritySection } from "@/components/sections/security-section";
import { CTASection } from "@/components/sections/cta-section";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection id="features" />
      <InstallationSection id="installation" />
      <UseCasesSection />
      <PerformanceSection id="performance" />
      <SecuritySection id="security" />
      <CTASection />
      <Footer />
    </div>
  );
}
