import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories } from "@/data/products";

const FeaturedCollections = () => {
  return (
    <section id="collections" className="py-20 lg:py-28 section-padding max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-3">Explore</p>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
          Our <span className="text-gold-gradient">Collections</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {categories.map((col, i) => (
          <motion.div
            key={col.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              to={`/category/${col.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer block product-glow"
            >
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs tracking-[0.2em] uppercase text-primary font-body mb-1">{col.subtitle}</p>
                <h3 className="font-heading text-xl font-semibold text-foreground">{col.title}</h3>
              </div>
              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 rounded-lg transition-all duration-500" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollections;
