import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { products, Product } from "@/data/products";

interface RelatedProductsProps {
  currentProductId: string;
  categorySlug: string;
}

const RelatedProducts = ({ currentProductId, categorySlug }: RelatedProductsProps) => {
  const { addItem } = useCart();

  const related = products
    .filter((p) => p.id !== currentProductId && p.categorySlug === categorySlug)
    .slice(0, 4);

  // If not enough from same category, fill from other products
  const filler = related.length < 4
    ? products.filter((p) => p.id !== currentProductId && !related.find((r) => r.id === p.id)).slice(0, 4 - related.length)
    : [];

  const allRelated = [...related, ...filler];

  if (allRelated.length === 0) return null;

  return (
    <section className="py-16 section-padding max-w-7xl mx-auto border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="font-heading text-2xl sm:text-3xl font-bold">
          You May Also <span className="text-gold-gradient">Like</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {allRelated.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group cursor-pointer"
          >
            <Link to={`/product/${product.id}`}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-3 product-glow">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-wider uppercase font-body font-semibold px-3 py-1 rounded-sm">
                    {product.tag}
                  </span>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star key={si} size={10} className={si < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"} />
              ))}
            </div>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-heading text-xs sm:text-sm font-semibold mb-1 hover:text-primary transition-colors">{product.name}</h3>
            </Link>
            <p className="text-primary font-body text-xs sm:text-sm font-semibold">{product.priceFormatted}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
