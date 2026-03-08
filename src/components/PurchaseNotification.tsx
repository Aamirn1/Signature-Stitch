import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { products } from "@/data/products";

const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar"];
const names = ["Ahmed", "Ali", "Usman", "Hassan", "Bilal", "Hamza", "Saad", "Zain", "Fahad", "Owais"];

const PurchaseNotification = () => {
  const [notification, setNotification] = useState<{ name: string; product: string; city: string } | null>(null);

  useEffect(() => {
    const showNotification = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const product = products[Math.floor(Math.random() * products.length)].name;
      const city = cities[Math.floor(Math.random() * cities.length)];
      setNotification({ name, product, city });
      setTimeout(() => setNotification(null), 4000);
    };

    // First notification after 15s, then every 30-60s
    const initialTimeout = setTimeout(showNotification, 15000);
    const interval = setInterval(showNotification, 30000 + Math.random() * 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-24 left-4 z-40 max-w-[280px] bg-card border border-border rounded-lg p-3 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingBag size={14} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-body text-foreground leading-relaxed">
                <span className="font-semibold">{notification.name}</span> from {notification.city} just bought{" "}
                <span className="text-primary font-semibold">{notification.product}</span>
              </p>
              <p className="text-[10px] text-muted-foreground font-body mt-1">Just now</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchaseNotification;
