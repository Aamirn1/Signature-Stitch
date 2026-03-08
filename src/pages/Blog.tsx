import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEOHead from "@/components/SEOHead";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog - Signature Stitch | Pakistani Fashion Tips & Guides"
        description="Read expert fashion tips, styling guides, and buying advice for Pakistani men's clothing. Shalwar Kameez, waistcoats, wedding outfits and more."
        canonical="https://signaturestitch.pk/blog"
      />
      <Navbar />
      <CartDrawer />

      <div className="pt-20 lg:pt-24">
        {/* Breadcrumb */}
        <div className="section-padding max-w-7xl mx-auto pt-4 flex items-center gap-2 text-sm font-body">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">Blog</span>
        </div>

        {/* Header */}
        <div className="section-padding max-w-7xl mx-auto py-6">
          <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-2">Fashion & Style</p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            The Signature <span className="text-gold-gradient">Journal</span>
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-3 max-w-2xl">
            Expert styling tips, fabric guides, and fashion advice for the modern Pakistani man.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="section-padding max-w-7xl mx-auto pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`} className="block bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-300">
                  <div className="p-6">
                    <span className="inline-block text-[10px] tracking-wider uppercase font-body font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                      {post.category}
                    </span>
                    <h2 className="font-heading text-lg font-semibold mb-3 group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground font-body text-xs leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-body">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(post.date).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                      </div>
                      <ArrowRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
