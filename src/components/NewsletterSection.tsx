import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NewsletterSection = () => {
  return (
    <section className="py-20 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl mx-auto text-center"
      >
        <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
          Stay in <span className="text-gold-gradient">Style</span>
        </h2>
        <p className="text-muted-foreground font-body text-sm mb-6">
          Subscribe for exclusive drops, early access, and style inspiration.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <Input
            type="email"
            placeholder="Your email address"
            className="bg-secondary border-border text-foreground font-body placeholder:text-muted-foreground flex-1"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button type="submit" className="bg-gold-gradient text-primary-foreground font-body tracking-widest uppercase text-xs px-6 btn-gold-glow">
              Subscribe
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
