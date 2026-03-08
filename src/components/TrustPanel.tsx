import { motion } from "framer-motion";
import { Shield, Truck, RotateCcw, Award } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

const trustItems = [
  { icon: Award, title: "Premium Quality", desc: "What you see is what you get" },
  { icon: Shield, title: "Secure Shopping", desc: "100% safe & encrypted payments" },
  { icon: Truck, title: "Fast Delivery", desc: "Nationwide shipping across Pakistan" },
  { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free return policy" },
];

const stats = [
  { value: 5000, suffix: "+", label: "Happy Customers" },
  { value: 12000, suffix: "+", label: "Orders Delivered" },
  { value: 50, suffix: "+", label: "Cities Covered" },
  { value: 99, suffix: "%", label: "Satisfaction Rate" },
];

const TrustPanel = () => {
  return (
    <section className="py-16 border-y border-border bg-secondary">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30 mb-4 shadow-[0_0_20px_hsl(var(--gold)/0.15)]"
              >
                <item.icon size={22} className="text-primary" />
              </motion.div>
              <h3 className="font-heading text-base font-semibold mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Animated Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-border">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                className="font-heading text-2xl sm:text-3xl font-bold text-primary"
              />
              <p className="text-xs text-muted-foreground font-body mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustPanel;
