import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <CartDrawer />
    <div className="pt-24 pb-20 section-padding max-w-3xl mx-auto">
      <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-8">
        <span className="text-gold-gradient">Terms</span> of Service
      </h1>
      <div className="space-y-6 font-body text-sm text-muted-foreground leading-relaxed">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">General Terms</h2>
          <p>By using the Signature Stitch website, you agree to these terms. All products are subject to availability. Prices are in PKR and may change without notice.</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Orders & Payment</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>A 25% advance payment is required for all COD orders</li>
            <li>Full payment option is available via bank transfer</li>
            <li>Orders are confirmed only after advance payment is received</li>
            <li>Custom-stitched orders cannot be cancelled after 24 hours</li>
          </ul>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Shipping</h2>
          <p>We offer fast delivery nationwide across Pakistan, typically within 3-5 business days. Free shipping on all orders.</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Intellectual Property</h2>
          <p>All content, images, and designs on this website are property of Signature Stitch. Unauthorized reproduction is prohibited.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default TermsOfService;
