import { motion } from "framer-motion";
import founderAamir from "@/assets/founder-aamir.webp";
import founderSheryar from "@/assets/founder-sheryar.jpg";

const founders = [
  { name: "Muhammad Aamir", role: "Co-Founder", image: founderAamir },
  { name: "Sheryar Rajpoot", role: "Co-Founder", image: founderSheryar },
];

const FoundersSection = () => {
  return (
    <section id="founders" className="py-20 lg:py-28 section-padding bg-secondary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-3">The Visionaries</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            Meet the <span className="text-gold-gradient">Founders</span>
          </h2>
          <p className="text-muted-foreground font-body mt-4 max-w-xl mx-auto text-sm">
            Built with passion and a commitment to redefining Pakistani fashion — delivering quality you can see and feel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-16 max-w-3xl mx-auto">
          {founders.map((founder, i) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center group"
            >
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-6 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors duration-500">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-1">{founder.name}</h3>
              <p className="text-primary text-sm font-body tracking-wider uppercase">{founder.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
