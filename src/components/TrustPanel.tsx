import { motion } from "framer-motion";
import { Shield, Truck, RotateCcw, Award } from "lucide-react";

const trustItems = [
  { icon: Award, title: "Premium Quality", desc: "What you see is what you get" },
  { icon: Shield, title: "Secure Shopping", desc: "100% safe & encrypted payments" },
  { icon: Truck, title: "Fast Delivery", desc: "Nationwide shipping across Pakistan" },
  { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free return policy" },
];

const TrustPanel = () => {
  return (
    <section className="py-16 border-y border-border bg-secondary">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-primary/30 mb-4">
                <item.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-heading text-base font-semibold mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustPanel;
