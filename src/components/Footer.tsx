import { Facebook, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-card py-12 px-6 sm:section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-muted-foreground text-xs font-body leading-relaxed">
              Pakistan's most trusted online clothing brand. Premium quality, exactly as you see it.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Shop All", href: "/shop" },
                { label: "Shalwar Kameez", href: "/category/shalwar-kameez" },
                { label: "Waistcoats", href: "/category/waistcoats" },
                { label: "3-Piece Suits", href: "/category/3-piece" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-xs text-muted-foreground hover:text-primary font-body transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary">Support</h4>
            <ul className="space-y-2">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Blog", href: "/blog" },
                { label: "Return Policy", href: "/return-policy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-xs text-muted-foreground hover:text-primary font-body transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 text-primary">Legal</h4>
            <ul className="space-y-2 mb-6">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-xs text-muted-foreground hover:text-primary font-body transition-colors">{link.label}</Link>
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

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} Signature Stitch. All rights reserved. Prices in PKR.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="text-[10px] text-muted-foreground hover:text-primary font-body transition-colors">Privacy</Link>
            <Link to="/terms" className="text-[10px] text-muted-foreground hover:text-primary font-body transition-colors">Terms</Link>
            <Link to="/return-policy" className="text-[10px] text-muted-foreground hover:text-primary font-body transition-colors">Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
