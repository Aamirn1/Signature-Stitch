import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const faqs = [
  {
    q: "What payment methods do you accept?",
    a: "We accept bank transfer (full payment) and Cash on Delivery (COD) with a mandatory 25% advance payment. We also accept Easypaisa and JazzCash.",
  },
  {
    q: "How long does delivery take?",
    a: "We deliver nationwide across Pakistan within 3-5 business days. Delivery is free on all orders.",
  },
  {
    q: "What is your return policy?",
    a: "Returns are accepted within 7 days for defective or wrong items. Products must be unused and in original packaging. Custom-stitched items are non-returnable unless defective.",
  },
  {
    q: "Do you offer custom stitching?",
    a: "Yes! You can provide your custom measurements via WhatsApp at +92 320 5719979. A 25% advance deposit is required for all custom orders.",
  },
  {
    q: "How can I track my order?",
    a: "After your order is confirmed, we'll share tracking details via WhatsApp. You can also contact us anytime for updates.",
  },
  {
    q: "What sizes do you offer?",
    a: "We offer sizes from S to XXL. Check our size guide on any product page for detailed measurements. For custom fits, share your measurements via WhatsApp.",
  },
  {
    q: "Why is a 25% advance required for COD?",
    a: "As a made-to-order brand, we require a 25% deposit to confirm serious orders and begin crafting your garment. The remaining amount is collected upon delivery.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can be cancelled within 24 hours of placement. After that, especially for custom-stitched items, cancellation may not be possible.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <div className="pt-24 pb-20 section-padding max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-8">
          Frequently Asked <span className="text-gold-gradient">Questions</span>
        </h1>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-heading text-sm font-semibold text-foreground pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-primary shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-5 pb-5"
                >
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
