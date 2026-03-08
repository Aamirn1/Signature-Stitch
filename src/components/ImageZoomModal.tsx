import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageZoomModalProps {
  images: string[];
  selectedIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const ImageZoomModal = ({ images, selectedIndex, isOpen, onClose, onNavigate }: ImageZoomModalProps) => {
  const handlePrev = () => onNavigate(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  const handleNext = () => onNavigate(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 sm:inset-10 z-[71] flex items-center justify-center"
          >
            <button
              onClick={onClose}
              className="absolute top-0 right-0 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-0 sm:left-4 z-10 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <img
              src={images[selectedIndex]}
              alt={`Product image ${selectedIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            <button
              onClick={handleNext}
              className="absolute right-0 sm:right-4 z-10 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === selectedIndex ? "bg-primary w-6" : "bg-muted-foreground/50"}`}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImageZoomModal;
