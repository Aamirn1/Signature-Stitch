import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const ReturnPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <CartDrawer />
    <div className="pt-24 pb-20 section-padding max-w-3xl mx-auto">
      <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-8">
        <span className="text-gold-gradient">Return</span> Policy
      </h1>
      <div className="space-y-6 font-body text-sm text-muted-foreground leading-relaxed">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Return Eligibility</h2>
          <p>Returns are accepted only for valid reasons such as manufacturing defects, wrong item shipped, or significant variation from the product shown. Items must be returned within <span className="text-primary font-semibold">7 days</span> of delivery.</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Conditions</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Product must be unused and in original packaging</li>
            <li>Tags must be attached and undamaged</li>
            <li>Custom-stitched items are non-returnable unless defective</li>
            <li>Exchanges are not offered — only refunds or replacement of same item</li>
          </ul>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">How to Return</h2>
          <p>Contact us via WhatsApp at <span className="text-primary font-semibold">+92 320 5719979</span> with your order details and photos of the item. Our team will guide you through the process within 24 hours.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default ReturnPolicy;
