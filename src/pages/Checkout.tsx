import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Banknote, Percent, TrendingUp, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BackButton from "@/components/BackButton";
import { toast } from "sonner";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<"full" | "advance">("advance");
  const [isPartner, setIsPartner] = useState(false);
  const [isReselling, setIsReselling] = useState(false);
  const [profitAmount, setProfitAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      supabase.from("partner_applications").select("status").eq("user_id", user.id).eq("status", "approved").maybeSingle()
        .then(({ data }) => setIsPartner(!!data));
    }
  }, [user]);

  const subtotal = items.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[^0-9]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  const customerTotal = isReselling ? subtotal + profitAmount : subtotal;
  const advanceAmount = Math.ceil(subtotal * 0.25);
  const remainingAmount = subtotal - advanceAmount;
  const payableNow = paymentMethod === "advance" ? advanceAmount : subtotal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        measurementId: i.measurementId,
        measurementLabel: i.measurementLabel,
      }));

      const { data, error } = await (supabase.from("orders") as any).insert({
        user_id: user.id,
        items: orderItems,
        subtotal,
        advance_amount: payableNow,
        remaining_amount: paymentMethod === "advance" ? remainingAmount : 0,
        payment_method: paymentMethod,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || null,
        customer_address: formData.address,
        customer_city: formData.city,
        notes: formData.notes || null,
        is_reseller: isReselling,
        profit_amount: isReselling ? profitAmount : 0,
      }).select("id").single();

      if (error) throw error;

      clearCart();
      navigate("/payment", {
        state: {
          orderId: data.id,
          advanceAmount: payableNow,
          subtotal,
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center section-padding">
          <h1 className="font-heading text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/shop" className="text-primary font-body underline">Continue Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />
      <BackButton />

      <div className="pt-20 lg:pt-24 section-padding max-w-5xl mx-auto pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-body mb-6 mt-4 transition-colors">
          <ChevronLeft size={16} /> Back to Shopping
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {["Cart", "Shipping", "Payment", "Review"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-bold ${
                i <= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs font-body tracking-wider uppercase hidden sm:inline ${
                i <= 1 ? "text-primary" : "text-muted-foreground"
              }`}>{step}</span>
              {i < 3 && <div className={`w-8 sm:w-12 h-px ${i < 1 ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <h1 className="font-heading text-3xl lg:text-4xl font-bold mb-10">
          <span className="text-gold-gradient">Checkout</span>
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border space-y-4">
              <h2 className="font-heading text-lg font-semibold mb-2">Delivery Details</h2>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name *" required className="bg-secondary border-border font-body" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number *" required className="bg-secondary border-border font-body" />
                <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email (optional)" type="email" className="bg-secondary border-border font-body" />
              </div>
              <Input name="address" value={formData.address} onChange={handleChange} placeholder="Full Address *" required className="bg-secondary border-border font-body" />
              <Input name="city" value={formData.city} onChange={handleChange} placeholder="City *" required className="bg-secondary border-border font-body" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Order notes (optional)"
                rows={3}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="font-heading text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("advance")}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 text-left ${
                    paymentMethod === "advance"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "advance" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Percent size={18} />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold">25% Advance Payment</p>
                    <p className="text-xs text-muted-foreground font-body">Pay PKR {advanceAmount.toLocaleString()} now, rest on delivery (COD)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("full")}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 text-left ${
                    paymentMethod === "full"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "full" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Banknote size={18} />
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold">Full Payment</p>
                    <p className="text-xs text-muted-foreground font-body">Pay the full amount upfront</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Reseller Profit Section */}
            {isPartner && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" />
                    <h2 className="font-heading text-lg font-semibold">Reseller Profit</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsReselling(!isReselling); if (isReselling) setProfitAmount(0); }}
                    className={`relative w-10 h-5 rounded-full transition-colors ${isReselling ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-primary-foreground transition-transform ${isReselling ? "translate-x-5" : ""}`} />
                  </button>
                </div>
                {isReselling ? (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground font-body">
                      Set your profit margin. This amount will be added to the customer's price.
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-body text-muted-foreground">PKR</span>
                      <Input
                        type="number"
                        value={profitAmount || ""}
                        onChange={(e) => setProfitAmount(Number(e.target.value))}
                        placeholder="e.g. 500"
                        className="bg-secondary border-border font-body"
                      />
                    </div>
                    {profitAmount > 0 && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs font-body space-y-1">
                        <div className="flex justify-between"><span className="text-muted-foreground">Base Price</span><span>PKR {subtotal.toLocaleString()}</span></div>
                        <div className="flex justify-between text-primary"><span>Your Profit</span><span>+PKR {profitAmount.toLocaleString()}</span></div>
                        <div className="flex justify-between font-semibold border-t border-border pt-1 mt-1"><span>Customer Pays</span><span>PKR {customerTotal.toLocaleString()}</span></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground font-body">
                    Buying for yourself? Leave this off. Toggle on to set a resale profit margin.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 border border-border sticky top-24">
              <h2 className="font-heading text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.measurementId || ''}`} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-16 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity}</p>
                      {item.measurementLabel && (
                        <p className="text-[10px] text-muted-foreground font-body">📐 {item.measurementLabel}</p>
                      )}
                    </div>
                    <p className="font-body text-xs font-semibold">{item.price}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
                {paymentMethod === "advance" && (
                  <>
                    <div className="flex justify-between font-body text-sm text-primary">
                      <span>25% Advance</span>
                      <span>PKR {advanceAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-body text-xs text-muted-foreground">
                      <span>Remaining (COD)</span>
                      <span>PKR {remainingAmount.toLocaleString()}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between font-body font-bold text-lg pt-2 border-t border-border">
                  <span>Pay Now</span>
                  <span className="text-gold-gradient">PKR {payableNow.toLocaleString()}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full mt-6 bg-gold-gradient text-primary-foreground font-body tracking-widest uppercase text-sm py-6 hover:opacity-90"
              >
                {submitting ? (
                  <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Processing...</span>
                ) : (
                  "Pay Now"
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground font-body text-center mt-3">
                You'll be redirected to complete payment after placing your order.
              </p>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
