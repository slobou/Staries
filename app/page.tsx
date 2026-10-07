import Audience from "@/components/landing/Audience";
import BeforeAfter from "@/components/landing/BeforeAfter";
import FinalCta from "@/components/landing/FinalCta";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Mission from "@/components/landing/Mission";
import Obstacles from "@/components/landing/Obstacles";
import Offerings from "@/components/landing/Offerings";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Mission />
      <Obstacles />
      <HowItWorks />
      <BeforeAfter />
      <Offerings />
      <Audience />
      <FinalCta />
    </main>
  );
}
