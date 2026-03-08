import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";

const words1 = ["Where", "Tradition", "Meets"];
const word2 = "Elegance";

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.5 + i * 0.3, duration: 0.5, ease: "easeOut" as const },
  }),
};

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Signature Stitch Premium Pakistani Clothing Collection - Shalwar Kameez, Waistcoats & 3-Piece Suits"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-overlay-dark" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center section-padding max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-primary font-body mb-4">
            Premium Pakistani Fashion
          </p>
        </motion.div>

        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          <span className="whitespace-nowrap">
            {words1.map((word, i) => (
              <motion.span
                key={`w-${i}`}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block text-gold-gradient">
            <motion.span
              custom={words1.length}
              variants={wordVariants}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              {word2}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8 font-body"
        >
          Discover meticulously crafted Shalwar Kameez, Waistcoats & 3-Piece Suits.
          What you see is what you get — quality you can trust.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="bg-gold-gradient font-body tracking-widest uppercase text-sm px-8 py-6 hover:opacity-90 transition-opacity text-background font-semibold">
            <Link to="/shop">Shop Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary font-body tracking-widest uppercase text-sm px-8 py-6 hover:bg-primary hover:text-primary-foreground transition-all">
            <a href="#collections">View Collections</a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 bg-primary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
