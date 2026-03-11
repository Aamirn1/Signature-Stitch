import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Star, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { categories, getProductsByCategory, priceRanges, products as allProducts } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEOHead from "@/components/SEOHead";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = slug ? getProductsByCategory(slug) : allProducts;

  const filteredProducts = useMemo(() => {
    if (selectedPrice === null) return categoryProducts;
    const range = priceRanges[selectedPrice];
    return categoryProducts.filter((p) => p.price >= range.min && p.price < range.max);
  }, [categoryProducts, selectedPrice]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={category ? `${category.title} - Signature Stitch | Pakistani Clothing` : "Shop All - Signature Stitch | Premium Pakistani Fashion"}
        description={category ? `Browse premium ${category.title} at Signature Stitch. ${category.subtitle}. Custom-stitched with free delivery across Pakistan.` : "Shop all premium Pakistani men's clothing. Shalwar Kameez, Waistcoats, 3-Piece Suits with free nationwide delivery."}
        canonical={`https://signaturestitch.pk${slug ? `/category/${slug}` : '/shop'}`}
      />
      <Navbar />
      <CartDrawer />

      <div className="pt-20 lg:pt-24">
        {/* Breadcrumb */}
        <div className="px-6 sm:section-padding max-w-7xl mx-auto pt-4 flex items-center gap-2 text-sm font-body">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <span className="text-muted-foreground">/</span>
          {category ? (
            <>
              <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">Shop</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">{category.title}</span>
            </>
          ) : (
            <span className="text-foreground">Shop</span>
          )}
        </div>

        {/* Header */}
        <div className="px-6 sm:section-padding max-w-7xl mx-auto py-6">
          <p className="text-sm tracking-[0.3em] uppercase text-primary font-body mb-2">
            {category ? category.subtitle : "All Products"}
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            {category ? category.title : "Shop All"}
          </h1>
        </div>

        {/* Filters Bar */}
        <div className="sticky top-16 lg:top-20 z-30 bg-card/90 backdrop-blur-xl border-y border-border">
          {/* Desktop filters */}
          <div className="hidden sm:flex px-6 sm:section-padding max-w-7xl mx-auto py-3 items-center gap-3 overflow-x-auto scrollbar-hide">
            <Link
              to="/shop"
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-body tracking-wider uppercase border transition-all duration-300 ${
                !slug
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-body tracking-wider uppercase border transition-all duration-300 ${
                  slug === cat.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {cat.title}
              </Link>
            ))}

            <div className="w-px h-6 bg-border shrink-0 mx-2" />

            <button
              onClick={() => setPriceDropdownOpen(!priceDropdownOpen)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-body tracking-wider uppercase border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
            >
              <SlidersHorizontal size={14} />
              Price
              {selectedPrice !== null && <span className="w-2 h-2 rounded-full bg-primary" />}
            </button>

            {selectedPrice !== null && (
              <button
                onClick={() => setSelectedPrice(null)}
                className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-full text-xs font-body bg-primary/10 text-primary border border-primary/30"
              >
                {priceRanges[selectedPrice].label}
                <X size={12} />
              </button>
            )}
          </div>

          {/* Mobile filters - dropdown buttons */}
          <div className="sm:hidden px-6 py-3 flex gap-2">
            {/* Category dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => { setCatDropdownOpen(!catDropdownOpen); setPriceDropdownOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-body tracking-wider uppercase border border-border text-foreground bg-secondary"
              >
                <span>{category ? category.title : "All Categories"}</span>
                <ChevronDown size={14} className={`transition-transform ${catDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {catDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <Link
                    to="/shop"
                    onClick={() => setCatDropdownOpen(false)}
                    className={`block px-4 py-3 text-xs font-body tracking-wider uppercase ${!slug ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setCatDropdownOpen(false)}
                      className={`block px-4 py-3 text-xs font-body tracking-wider uppercase border-t border-border ${slug === cat.slug ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                    >
                      {cat.title}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Price dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => { setPriceDropdownOpen(!priceDropdownOpen); setCatDropdownOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-body tracking-wider uppercase border border-border text-foreground bg-secondary"
              >
                <span>{selectedPrice !== null ? priceRanges[selectedPrice].label : "Price"}</span>
                <ChevronDown size={14} className={`transition-transform ${priceDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {priceDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                >
                  <button
                    onClick={() => { setSelectedPrice(null); setPriceDropdownOpen(false); }}
                    className={`block w-full text-left px-4 py-3 text-xs font-body ${selectedPrice === null ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                  >
                    All Prices
                  </button>
                  {priceRanges.map((range, i) => (
                    <button
                      key={range.label}
                      onClick={() => { setSelectedPrice(i); setPriceDropdownOpen(false); }}
                      className={`block w-full text-left px-4 py-3 text-xs font-body border-t border-border ${selectedPrice === i ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"}`}
                    >
                      {range.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Desktop price dropdown */}
          {priceDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="hidden sm:block px-6 sm:section-padding max-w-7xl mx-auto pb-4"
            >
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range, i) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      setSelectedPrice(selectedPrice === i ? null : i);
                      setPriceDropdownOpen(false);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-body border transition-all duration-300 ${
                      selectedPrice === i
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Products Grid */}
        <div className="px-6 sm:section-padding max-w-7xl mx-auto py-10">
          <p className="text-sm text-muted-foreground font-body mb-6">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body">No products match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-4 product-glow">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      {product.tag && (
                        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-wider uppercase font-body font-semibold px-3 py-1 rounded-sm">
                          {product.tag}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} size={12} className={si < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"} />
                        ))}
                        <span className="text-xs text-muted-foreground font-body ml-1">{product.rating}</span>
                      </div>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-heading text-sm font-semibold mb-1 hover:text-primary transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-primary font-body text-sm font-semibold">{product.priceFormatted}</p>
                    </div>
                    <button
                      onClick={() => addItem({ id: product.id, name: product.name, price: product.priceFormatted, image: product.images[0] })}
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Category;
