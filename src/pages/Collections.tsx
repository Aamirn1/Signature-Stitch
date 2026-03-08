import Navbar from "@/components/Navbar";
import FeaturedCollections from "@/components/FeaturedCollections";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEOHead from "@/components/SEOHead";

const Collections = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Collections - Signature Stitch"
        description="Explore our premium collections of custom-stitched Pakistani men's clothing including Shalwar Kameez, Waistcoats, 3-Piece Suits and more."
        canonical="https://signaturestitch.pk/collections"
      />
      <Navbar />
      <CartDrawer />
      <div className="pt-20 lg:pt-24">
        <FeaturedCollections />
      </div>
      <Footer />
    </div>
  );
};

export default Collections;
