import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEOHead from "@/components/SEOHead";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="Contact Signature Stitch | WhatsApp +92 320 5719979"
      description="Reach Signature Stitch via WhatsApp, phone or email. Fast response for orders, custom stitching inquiries & support. Nationwide delivery across Pakistan."
      canonical="https://signaturestitch.pk/contact"
    />
    <Navbar />
    <CartDrawer />
    <div className="pt-24 pb-20 section-padding max-w-4xl mx-auto">
      <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-10">
        <span className="text-gold-gradient">Contact</span> Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { icon: Phone, title: "WhatsApp / Phone", detail: "+92 320 5719979", sub: "Available for orders & inquiries" },
          { icon: Mail, title: "Email", detail: "info@signaturestitch.pk", sub: "We reply within 24 hours" },
          { icon: MapPin, title: "Location", detail: "Pakistan", sub: "Nationwide delivery available" },
          { icon: Clock, title: "Business Hours", detail: "Mon - Sat: 10AM - 10PM", sub: "Sunday: 12PM - 8PM" },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-lg p-6 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-semibold mb-1">{item.title}</h3>
              <p className="font-body text-sm text-foreground">{item.detail}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 bg-card border border-border rounded-lg p-6 text-center"
      >
        <p className="font-body text-sm text-muted-foreground mb-4">For the fastest response, reach out via WhatsApp</p>
        <a
          href="https://wa.me/923205719979"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gold-gradient text-primary-foreground font-body tracking-widest uppercase text-xs px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Chat on WhatsApp
        </a>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default Contact;
