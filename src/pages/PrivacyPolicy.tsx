import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <CartDrawer />
    <div className="pt-24 pb-20 section-padding max-w-3xl mx-auto">
      <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-8">
        <span className="text-gold-gradient">Privacy</span> Policy
      </h1>
      <div className="space-y-6 font-body text-sm text-muted-foreground leading-relaxed">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Information We Collect</h2>
          <p>We collect personal information you provide during checkout (name, phone, email, address) and browsing data to improve your shopping experience. We do not sell your data to third parties.</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Processing and delivering your orders</li>
            <li>Sending order status updates via WhatsApp/SMS</li>
            <li>Improving our products and services</li>
            <li>Sending promotional offers (with your consent)</li>
          </ul>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Data Security</h2>
          <p>All transactions are encrypted via SSL. We implement industry-standard security measures to protect your personal information.</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Contact</h2>
          <p>For privacy-related queries, contact us at <span className="text-primary font-semibold">+92 320 5719979</span> via WhatsApp.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default PrivacyPolicy;
