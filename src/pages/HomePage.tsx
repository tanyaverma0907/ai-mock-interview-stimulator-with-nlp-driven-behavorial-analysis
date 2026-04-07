import { AdvancedFeatures } from "../components/home/AdvancedFeatures";
import { AnalyticsPreview } from "../components/home/AnalyticsPreview";
import { BenefitsSection } from "../components/home/BenefitsSection";
import { CTASection } from "../components/home/CTASection";
import { DemoSection } from "../components/home/DemoSection";
import { FeaturesSection } from "../components/home/FeaturesSection";
import { Footer } from "../components/home/Footer";
import HeroSection from "../components/home/HeroSection";
import { HowItWorks } from "../components/home/HowItWorks";
import Navbar from "../components/home/Navbar";
import { QuickStartCard } from "../components/home/QuickStartCard";
import { Testimonials } from "../components/home/Testimonials";

const HomePage = () => {
  return (
    <div className="text-7xl">
      <Navbar />
      <HeroSection />
      <QuickStartCard />
      <HowItWorks />
      <FeaturesSection />
      <AnalyticsPreview />
      <DemoSection />
      <AdvancedFeatures />
      <BenefitsSection />
      <Testimonials />
      <CTASection />
      <Footer />
      
    </div>
  )
}

export default HomePage;