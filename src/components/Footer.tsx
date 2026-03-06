import { Facebook, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-card py-12 section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="Signature Stitch" className="h-8 w-auto" />
              <span className="font-heading text-base tracking-wider">SIGNATURE STITCH</span>
            </div>
            <p className="text-muted-foreground text-xs font-body leading-relaxed">
              Pakistan's most trusted online clothing brand. Premium quality, exactly as you see it.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              {["Shop All", "New Arrivals", "Best Sellers", "Size Guide"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary font-body transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary">Support</h4>
            <ul className="space-y-2">
              {["Contact Us", "FAQ", "Shipping Info", "Return Policy"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary font-body transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary">Legal</h4>
            <ul className="space-y-2 mb-6">
              {["Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-muted-foreground hover:text-primary font-body transition-colors">{link}</a>
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="YouTube"><Youtube size={18} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} Signature Stitch. All rights reserved. Prices in PKR.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
