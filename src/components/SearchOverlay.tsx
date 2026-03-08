import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-[61] bg-card border-b border-border shadow-2xl"
          >
            <div className="max-w-3xl mx-auto p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <Search size={20} className="text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories, fabrics..."
                  className="flex-1 bg-transparent text-foreground font-body text-lg placeholder:text-muted-foreground focus:outline-none"
                />
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              {results.length > 0 && (
                <div className="mt-4 border-t border-border pt-4 space-y-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <img src={product.images[0]} alt={product.name} className="w-12 h-14 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-semibold truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground font-body">{product.category}</p>
                      </div>
                      <p className="text-primary font-body text-sm font-semibold shrink-0">{product.priceFormatted}</p>
                    </Link>
                  ))}
                </div>
              )}

              {query.length >= 2 && results.length === 0 && (
                <div className="mt-4 border-t border-border pt-6 text-center">
                  <p className="text-muted-foreground font-body text-sm">No products found for "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
