import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(-1)}
      className="w-9 h-9 rounded-full bg-transparent border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors duration-300 flex items-center justify-center hover:shadow-[0_0_20px_hsl(var(--gold)/0.2)]"
      aria-label="Go back"
    >
      <ArrowLeft size={18} strokeWidth={1.5} />
    </motion.button>
  );
};

export default BackButton;
