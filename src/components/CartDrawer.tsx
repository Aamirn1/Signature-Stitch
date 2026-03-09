import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const CartDrawer = () => {
  const { items, isOpen, toggleCart, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[^0-9]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    toggleCart();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-[61] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-heading text-xl font-bold">Shopping Cart</h2>
              <button onClick={toggleCart} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-muted-foreground mb-4" />
                  <p className="text-muted-foreground font-body">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.measurementId || ''}-${item.customization?.clothType || ''}`} className="flex gap-4 p-3 rounded-lg bg-background/50">
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-heading text-sm font-semibold">{item.name}</h3>
                        <p className="text-primary font-body text-sm mt-1">{item.price}</p>
                        {item.customization && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-body">
                              {item.customization.clothType === "stitched" ? "Stitched" : "Unstitched"}
                            </span>
                            {item.customization.clothType === "stitched" && (
                              <>
                                <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-body">
                                  {item.customization.collarType === "collar" ? "Collar" : "Cuff"}
                                </span>
                                <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-body">
                                  {item.customization.buttonType === "fancy" ? "Fancy" : "Simple"} Btn
                                </span>
                                <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-body">
                                  {item.customization.flareType === "circular" ? "Circular" : "Slit"}
                                </span>
                                <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-body">
                                  {item.customization.pleatType === "double" ? "Double" : "Single"} Pleat
                                </span>
                              </>
                            )}
                          </div>
                        )}
                        {item.measurementLabel && (
                          <p className="text-[10px] text-muted-foreground font-body mt-0.5">📐 {item.measurementLabel}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.measurementId, -1)}
                            className="w-6 h-6 rounded bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-body">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.measurementId, 1)}
                            className="w-6 h-6 rounded bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id, item.measurementId)} className="text-muted-foreground hover:text-destructive transition-colors self-start">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex justify-between font-body">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">PKR {total.toLocaleString()}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gold-gradient text-primary-foreground font-body tracking-widest uppercase text-sm py-6 hover:opacity-90"
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
