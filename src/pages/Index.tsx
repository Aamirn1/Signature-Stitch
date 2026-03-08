import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustPanel from "@/components/TrustPanel";
import FeaturedCollections from "@/components/FeaturedCollections";
import BestSellers from "@/components/BestSellers";
import FoundersSection from "@/components/FoundersSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CartDrawer from "@/components/CartDrawer";
import ScrollToTop from "@/components/ScrollToTop";
import AIChatAssistant from "@/components/AIChatAssistant";
import PurchaseNotification from "@/components/PurchaseNotification";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <HeroSection />
      <TrustPanel />
      <FeaturedCollections />
      <BestSellers />
      <FoundersSection />
      <NewsletterSection />
      <Footer />
      <WhatsAppButton />
      <AIChatAssistant />
      <ScrollToTop />
      <PurchaseNotification />
    </div>
  );
};

export default Index;
