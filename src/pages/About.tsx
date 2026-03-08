import Navbar from "@/components/Navbar";
import FoundersSection from "@/components/FoundersSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEOHead from "@/components/SEOHead";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Us - Signature Stitch"
        description="Meet the founders of Signature Stitch. Built with passion and a commitment to redefining Pakistani fashion."
        canonical="https://signaturestitch.pk/about"
      />
      <Navbar />
      <CartDrawer />
      <div className="pt-20 lg:pt-24">
        <FoundersSection />
      </div>
      <Footer />
    </div>
  );
};

export default About;
