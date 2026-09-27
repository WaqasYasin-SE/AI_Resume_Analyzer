import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Trust from "@/components/landing/Trust";
import Problem from "@/components/landing/Problem";
import Analyzer from "@/components/landing/Analyzer";
import ATS from "@/components/landing/ATS";
import JobMatch from "@/components/landing/JobMatch";
import JobTracker from "@/components/landing/JobTracker";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureGrid from "@/components/landing/FeatureGrid";
import DashboardPreview from "@/components/landing/DashboardPreview";
import ComingSoon from "@/components/landing/ComingSoon";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Trust />
      <Problem />
      <Analyzer />
      <ATS />
      <JobMatch />
      <JobTracker />
      <HowItWorks />
      <FeatureGrid />
      <DashboardPreview />
      <ComingSoon />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
