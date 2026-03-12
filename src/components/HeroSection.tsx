import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import heroBannerMobile from "@/assets/hero-banner-mobile.png";
import { Button } from "@/components/ui/button";

const line1 = "Where Tradition Meets";
const line2 = "Elegance";
const charDelay = 0.06;
const startDelay = 0.5;
const HeroSection = () => {

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden ambient-glow">
      {/* Background Image - Desktop */}
      <div className="absolute inset-0 hidden md:block">
        <img
          src={heroBanner}
          alt="Signature Stitch Premium Pakistani Clothing Collection - Shalwar Kameez, Waistcoats & 3-Piece Suits"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-overlay-dark" />
      </div>
      {/* Background - Mobile */}
      <div className="absolute inset-0 md:hidden">
        <img
          src={heroBannerMobile}
          alt="Signature Stitch Premium Pakistani Clothing"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(0,0%,0%)/0.3] via-[hsl(0,0%,0%)/0.4] to-[hsl(0,0%,0%)/0.7]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center md:text-center px-8 md:px-4 max-w-4xl mx-auto md:flex md:items-center md:justify-center">
        {/* Mobile: left-aligned like reference, Desktop: centered */}
        <div className="text-left md:text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-xs sm:text-base tracking-[0.3em] uppercase text-foreground/80 font-body mb-4">
              Premium Pakistani Fashion
            </p>
          </motion.div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="block sm:whitespace-nowrap">
              {line1.split("").map((char, i) => (
                <motion.span
                  key={`c1-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: startDelay + i * charDelay, duration: 0.05 }}
                  className="inline-block"
                  style={{ width: char === " " ? "0.3em" : undefined }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            <span className="block text-gold-gradient pb-3">
              {line2.split("").map((char, i) => (
                <motion.span
                  key={`c2-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: startDelay + (line1.length + 1) * charDelay + i * charDelay, duration: 0.05 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="text-muted-foreground text-xs sm:text-base md:text-lg max-w-2xl md:mx-auto mb-8 font-body"
          >
            Discover meticulously crafted Shalwar Kameez, Waistcoats & 3-Piece Suits.
            <span className="hidden sm:inline"> What you see is what you get — quality you can trust.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="flex flex-row gap-3 sm:gap-4 justify-start md:justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 md:flex-none">
              <Button asChild size="lg" className="bg-gold-gradient font-body tracking-widest uppercase text-xs sm:text-sm px-6 sm:px-8 py-5 sm:py-6 transition-all text-primary-foreground font-semibold btn-gold-glow glow-pulse w-full md:w-auto">
                <Link to="/shop">Shop Now</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 md:flex-none">
              <Button asChild size="lg" variant="outline" className="border-primary text-primary font-body tracking-widest uppercase text-xs sm:text-sm px-6 sm:px-8 py-5 sm:py-6 hover:bg-primary hover:text-primary-foreground transition-all w-full md:w-auto">
                <a href="#collections">View Collections</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
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
