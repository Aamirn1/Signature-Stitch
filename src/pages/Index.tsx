import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustPanel from "@/components/TrustPanel";
import FeaturedCollections from "@/components/FeaturedCollections";
import BestSellers from "@/components/BestSellers";
import FoundersSection from "@/components/FoundersSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Signature Stitch - Premium Pakistani Clothing | Custom Stitched"
        description="Shop premium custom-stitched Pakistani men's clothing. Shalwar Kameez, Waistcoats, 3-Piece Suits with free nationwide delivery. Quality you can trust."
        canonical="https://signaturestitch.pk/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ClothingStore",
          "name": "Signature Stitch",
          "url": "https://signaturestitch.pk",
          "description": "Premium custom-stitched Pakistani men's clothing brand",
          "priceRange": "PKR 4,200 - PKR 15,000",
          "address": { "@type": "PostalAddress", "addressCountry": "PK" },
          "telephone": "+92-320-5719979"
        }}
      />
      <Navbar />
      <CartDrawer />
      <HeroSection />
      <TrustPanel />
      <FeaturedCollections />
      <BestSellers />
      <FoundersSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
