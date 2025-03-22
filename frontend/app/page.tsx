import Navbar from "@/components/LandingPage/Navbar";
import Hero from "@/components/LandingPage/Hero";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import Pricing from "@/components/LandingPage/Pricing";
import CTA from "@/components/LandingPage/CTA";
import Footer from "@/components/LandingPage/Footer";
export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
