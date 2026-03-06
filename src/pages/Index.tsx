import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustPanel from "@/components/TrustPanel";
import FeaturedCollections from "@/components/FeaturedCollections";
import BestSellers from "@/components/BestSellers";
import FoundersSection from "@/components/FoundersSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustPanel />
      <FeaturedCollections />
      <BestSellers />
      <FoundersSection />
      <NewsletterSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
