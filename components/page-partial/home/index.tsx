import Navbar from "@/components/layout/Navbar";
import Hero from "./Hero";
import Feature from "./Feature";
import Pricing from "./Pricing";
import CallToAction from "./CallToAction";
import Footer from "@/components/layout/Footer";

export default function HomePagePartial() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />
      <Hero />
      <Feature />
      <Pricing />
      <CallToAction />
      <Footer />
    </div>
  );
}
