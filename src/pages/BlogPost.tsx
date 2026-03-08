import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { getBlogBySlug, blogPosts } from "@/data/blog";
import { getProductById } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEOHead from "@/components/SEOHead";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogBySlug(slug || "");

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-primary font-body underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = post.relatedProducts.map(id => getProductById(id)).filter(Boolean);
  const otherPosts = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${post.title} | Signature Stitch Blog`}
        description={post.excerpt}
        canonical={`https://signaturestitch.pk/blog/${post.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": post.date,
          "author": { "@type": "Organization", "name": "Signature Stitch" },
          "publisher": { "@type": "Organization", "name": "Signature Stitch" },
          "keywords": post.keywords.join(", ")
        }}
      />
      <Navbar />
      <CartDrawer />

      <div className="pt-20 lg:pt-24">
        {/* Breadcrumb */}
        <div className="section-padding max-w-3xl mx-auto pt-4 flex items-center gap-2 text-sm font-body">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <span className="text-muted-foreground">/</span>
          <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground truncate">{post.title}</span>
        </div>

        {/* Article */}
        <article className="section-padding max-w-3xl mx-auto py-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-xs text-primary font-body mb-6 hover:underline">
            <ArrowLeft size={14} /> Back to all articles
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block text-[10px] tracking-wider uppercase font-body font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-body mb-8">
              <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-PK', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
            </div>

            <div className="space-y-5">
              {post.content.map((paragraph, i) => (
                <p key={i} className="text-muted-foreground font-body text-sm leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="font-heading text-xl font-semibold mb-4">Shop the Look</h2>
              <div className="grid grid-cols-2 gap-4">
                {relatedProducts.map(product => product && (
                  <Link key={product.id} to={`/product/${product.id}`} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all group">
                    <div className="aspect-[3/4] rounded-md overflow-hidden mb-3">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <h3 className="font-heading text-xs font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-primary font-body text-xs font-semibold mt-1">{product.priceFormatted}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* More Articles */}
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="font-heading text-xl font-semibold mb-4">More Articles</h2>
            <div className="space-y-3">
              {otherPosts.map(p => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="block bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-all">
                  <span className="text-[10px] text-primary font-body uppercase tracking-wider">{p.category}</span>
                  <h3 className="font-heading text-sm font-semibold mt-1 hover:text-primary transition-colors">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPost;
