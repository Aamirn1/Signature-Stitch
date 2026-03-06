import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, Menu, X, ChevronRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/hooks/useCart";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Shop", href: "#collections" },
  { label: "Collections", href: "#collections" },
  { label: "About", href: "#founders" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, toggleCart } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border"
    >
      <div className="max-w-7xl mx-auto section-padding flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="Signature Stitch" className="h-12 lg:h-14 w-auto brightness-125 contrast-110" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-body tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button className="text-muted-foreground hover:text-primary transition-colors" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="text-muted-foreground hover:text-primary transition-colors" aria-label="Account">
            <User size={20} />
          </button>
          <button
            onClick={toggleCart}
            className="relative text-muted-foreground hover:text-primary transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-body font-bold"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          <button
            className="lg:hidden text-foreground p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border overflow-hidden"
          >
            <nav className="flex flex-col py-6 section-padding gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between py-3 px-4 rounded-lg text-sm font-body tracking-widest uppercase text-foreground hover:text-primary hover:bg-card transition-all duration-200"
                >
                  <span>{link.label}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </motion.a>
              ))}
              <div className="border-t border-border mt-4 pt-4 px-4">
                <p className="text-xs text-muted-foreground font-body tracking-wider">
                  WhatsApp: +92 320 5719979
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
