import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import collectionSK from "@/assets/collection-shalwar-kameez.jpg";
import collectionWC from "@/assets/collection-waistcoats.jpg";
import collection3P from "@/assets/collection-3piece.jpg";
import collectionPants from "@/assets/collection-pants.jpg";

const products = [
  { name: "Royal Navy Waistcoat", price: "PKR 8,500", rating: 4.9, image: collectionWC, tag: "Best Seller" },
  { name: "Classic White Shalwar Kameez", price: "PKR 5,200", rating: 4.8, image: collectionSK, tag: "New" },
  { name: "Premium Black 3-Piece", price: "PKR 15,000", rating: 5.0, image: collection3P, tag: "Popular" },
  { name: "Formal Black Ensemble", price: "PKR 6,800", rating: 4.7, image: collectionPants, tag: null },
];

const BestSellers = () => {
  const { addItem } = useCart();
  return (
    <section className="py-20 lg:py-28 section-padding max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-3">Trending</p>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
          Best <span className="text-gold-gradient">Sellers</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {product.tag && (
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-wider uppercase font-body font-semibold px-3 py-1 rounded-sm">
                  {product.tag}
                </span>
              )}
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300 flex items-center justify-center">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => addItem({ id: product.name, name: product.name, price: product.price, image: product.image })}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary text-primary-foreground px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase font-body font-semibold flex items-center gap-2"
                >
                  <ShoppingBag size={14} /> Add to Cart
                </motion.button>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, si) => (
                <Star key={si} size={12} className={si < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"} />
              ))}
              <span className="text-xs text-muted-foreground font-body ml-1">{product.rating}</span>
            </div>
            <h3 className="font-heading text-sm font-semibold mb-1">{product.name}</h3>
            <p className="text-primary font-body text-sm font-semibold">{product.price}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
