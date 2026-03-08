import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sizeData = [
  { size: "S", chest: "36\"", shoulder: "17\"", length: "28\"", trouser: "38\"" },
  { size: "M", chest: "38\"", shoulder: "18\"", length: "29\"", trouser: "40\"" },
  { size: "L", chest: "40\"", shoulder: "19\"", length: "30\"", trouser: "42\"" },
  { size: "XL", chest: "42\"", shoulder: "20\"", length: "31\"", trouser: "44\"" },
  { size: "XXL", chest: "44\"", shoulder: "21\"", length: "32\"", trouser: "46\"" },
];

const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-[70]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[71] w-[90vw] max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Ruler size={18} className="text-primary" />
                <h3 className="font-heading text-lg font-bold">Size Guide</h3>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-primary font-semibold text-xs uppercase tracking-wider">Size</th>
                    <th className="text-left py-2 px-3 text-primary font-semibold text-xs uppercase tracking-wider">Chest</th>
                    <th className="text-left py-2 px-3 text-primary font-semibold text-xs uppercase tracking-wider">Shoulder</th>
                    <th className="text-left py-2 px-3 text-primary font-semibold text-xs uppercase tracking-wider">Length</th>
                    <th className="text-left py-2 px-3 text-primary font-semibold text-xs uppercase tracking-wider">Trouser</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map((row) => (
                    <tr key={row.size} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold">{row.size}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{row.chest}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{row.shoulder}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{row.length}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{row.trouser}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-muted-foreground mt-4 font-body">
                Measurements are approximate. For custom stitching, please provide your exact measurements via WhatsApp.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SizeGuideModal;
