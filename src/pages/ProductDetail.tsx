import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Minus, Plus, Truck, Shield, RotateCcw, ZoomIn, Ruler } from "lucide-react";
import { getProductById } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AIChatAssistant from "@/components/AIChatAssistant";
import ScrollToTop from "@/components/ScrollToTop";
import RelatedProducts from "@/components/RelatedProducts";
import SizeGuideModal from "@/components/SizeGuideModal";
import ImageZoomModal from "@/components/ImageZoomModal";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-primary font-body underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.priceFormatted, image: product.images[0] });
    }
  };

  const whatsAppMessage = `Hi! I'm interested in ${product.name} (${product.priceFormatted})${selectedSize ? `, Size: ${selectedSize}` : ""}. Please share more details.`;
  const whatsAppUrl = `https://wa.me/923205719979?text=${encodeURIComponent(whatsAppMessage)}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="pt-20 lg:pt-24 section-padding max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="py-4 flex items-center gap-2 text-sm font-body">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <span className="text-muted-foreground">/</span>
          <Link to={`/category/${product.categorySlug}`} className="text-muted-foreground hover:text-primary transition-colors">{product.category}</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pb-10">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-4 product-glow cursor-zoom-in group"
              onClick={() => setZoomOpen(true)}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={16} className="text-foreground" />
              </div>
              {!product.inStock && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <span className="font-heading text-lg font-bold text-foreground">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                    selectedImage === i ? "border-primary" : "border-transparent hover:border-primary/30"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            {product.tag && (
              <span className="inline-block w-fit bg-primary text-primary-foreground text-[10px] tracking-wider uppercase font-body font-semibold px-3 py-1 rounded-sm mb-4">
                {product.tag}
              </span>
            )}

            <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-body">{product.rating} Rating</span>
            </div>

            <p className="text-gold-gradient font-heading text-3xl font-bold mb-2">{product.priceFormatted}</p>
            <p className="text-xs text-muted-foreground font-body mb-6">25% advance required for COD orders</p>

            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Product details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-1">Fabric</p>
                <p className="font-body text-sm">{product.fabric}</p>
              </div>
              <div>
                <p className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-1">Category</p>
                <p className="font-body text-sm">{product.category}</p>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-body tracking-wider uppercase text-muted-foreground">Select Size</p>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-xs text-primary font-body hover:underline"
                >
                  <Ruler size={12} /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border text-sm font-body font-semibold transition-all duration-300 ${
                      selectedSize === size
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-body text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-primary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                size="lg"
                disabled={!product.inStock}
                className="flex-1 bg-gold-gradient text-primary-foreground font-body tracking-widest uppercase text-sm py-6 hover:opacity-90 flex items-center gap-2"
              >
                <ShoppingBag size={18} /> Add to Cart
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="flex-1 border-primary text-primary font-body tracking-widest uppercase text-sm py-6 hover:bg-primary hover:text-primary-foreground"
              >
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                  Order via WhatsApp
                </a>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck size={20} className="mx-auto text-primary mb-2" />
                <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield size={20} className="mx-auto text-primary mb-2" />
                <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="mx-auto text-primary mb-2" />
                <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} categorySlug={product.categorySlug} />

      <Footer />
      <WhatsAppButton />
      <AIChatAssistant />
      <ScrollToTop />
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <ImageZoomModal
        images={product.images}
        selectedIndex={selectedImage}
        isOpen={zoomOpen}
        onClose={() => setZoomOpen(false)}
        onNavigate={setSelectedImage}
      />
    </div>
  );
};

export default ProductDetail;
