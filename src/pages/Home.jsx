import { Helmet } from "react-helmet";
import HeroSection from "../components/home/HeroSection";
import ValueProposition from "../components/home/ValueProposition";
import HowItWorksPreview from "../components/home/HowItWorksPreview";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>ResLiving | Smart Student Accommodation Management</title>
        <meta
          name="description"
          content="ResLiving is a smart student accommodation management platform that helps buildings manage communication, security, visitors, maintenance, and daily operations in one system."
        />
      </Helmet>

      <HeroSection />
      <ValueProposition />
      <HowItWorksPreview />
      <CTASection />
    </div>
  );
}
