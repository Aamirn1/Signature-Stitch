import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/923205719979"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] flex items-center justify-center shadow-lg hover:shadow-[0_0_30px_hsl(142_70%_45%/0.4)] transition-shadow pulse-ring text-foreground"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} />
    </motion.a>
  );
};

export default WhatsAppButton;
