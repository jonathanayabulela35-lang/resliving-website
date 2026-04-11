import HeroSection from "../components/home/HeroSection";
import ValueProposition from "../components/home/ValueProposition";
import HowItWorksPreview from "../components/home/HowItWorksPreview";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ValueProposition />
      <HowItWorksPreview />
      <CTASection />
    </div>
  );
}