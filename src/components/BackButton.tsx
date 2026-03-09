import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(-1)}
      className="fixed top-24 left-4 z-40 w-11 h-11 rounded-full bg-background/40 backdrop-blur-md border border-border text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 flex items-center justify-center hover:shadow-[0_0_30px_hsl(45_93%_47%/0.3)]"
      aria-label="Go back"
    >
      <ArrowLeft size={20} />
    </motion.button>
  );
};

export default BackButton;
