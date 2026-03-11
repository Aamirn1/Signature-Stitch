import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, CheckCircle, AlertCircle, Image, Truck, Star, Upload, RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BackButton from "@/components/BackButton";
import OrderTrackingSteps from "@/components/OrderTrackingSteps";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Order {
  id: string;
  status: string;
  subtotal: number;
  advance_amount: number;
  remaining_amount: number;
  items: any[];
  created_at: string;
  payment_screenshot_url: string | null;
  customer_name: string;
  customer_city: string;
  tracking_number: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending_payment: { label: "Pending Payment", color: "text-yellow-400", icon: Clock },
  payment_submitted: { label: "Payment Submitted", color: "text-blue-400", icon: Image },
  under_review: { label: "Under Review", color: "text-cyan-400", icon: Clock },
  approved: { label: "Approved", color: "text-primary", icon: CheckCircle },
  stitching: { label: "Being Stitched", color: "text-accent", icon: Package },
  shipped: { label: "Shipped", color: "text-primary", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-400", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-destructive", icon: AlertCircle },
};

const statusToStep: Record<string, number> = {
  pending_payment: 0,
  payment_submitted: 0,
  under_review: 0,
  approved: 1,
  stitching: 2,
  shipped: 3,
  delivered: 4,
};

const MyOrders = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
  const [returnText, setReturnText] = useState("");
  const [returnImage, setReturnImage] = useState<File | null>(null);
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [existingReviews, setExistingReviews] = useState<Record<string, boolean>>({});
  const [existingReturns, setExistingReturns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchExistingReviewsAndReturns();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data } = await (supabase.from("orders") as any)
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
    setFetching(false);
  };

  const fetchExistingReviewsAndReturns = async () => {
    const [reviewsRes, returnsRes] = await Promise.all([
      (supabase.from("reviews") as any).select("order_id").eq("user_id", user!.id),
      (supabase.from("return_requests") as any).select("order_id").eq("user_id", user!.id),
    ]);
    const revMap: Record<string, boolean> = {};
    (reviewsRes.data || []).forEach((r: any) => { revMap[r.order_id] = true; });
    setExistingReviews(revMap);
    const retMap: Record<string, boolean> = {};
    (returnsRes.data || []).forEach((r: any) => { retMap[r.order_id] = true; });
    setExistingReturns(retMap);
  };

  const isReturnWindowOpen = (order: Order) => {
    if (order.status !== "delivered") return false;
    const deliveredTime = new Date(order.created_at).getTime();
    const now = Date.now();
    return now - deliveredTime < 24 * 60 * 60 * 1000;
  };

  const submitReview = async (order: Order) => {
    if (!user) return;
    setSubmittingReview(true);
    try {
      let imageUrl = null;
      if (reviewImage) {
        const ext = reviewImage.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("review-images").upload(path, reviewImage);
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from("review-images").getPublicUrl(path).data.publicUrl;
      }
      const items = Array.isArray(order.items) ? order.items : [];
      const productId = items[0]?.id || "unknown";
      const { error } = await (supabase.from("reviews") as any).insert({
        user_id: user.id,
        order_id: order.id,
        product_id: productId,
        rating: reviewRating,
        review_text: reviewText || null,
        review_image_url: imageUrl,
      });
      if (error) throw error;
      toast.success("Thank you for your review! It will be visible after approval.");
      setReviewOrderId(null);
      setReviewRating(5);
      setReviewText("");
      setReviewImage(null);
      setExistingReviews((prev) => ({ ...prev, [order.id]: true }));
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const submitReturn = async (order: Order) => {
    if (!user || !returnText.trim()) return;
    setSubmittingReturn(true);
    try {
      let imageUrl = null;
      if (returnImage) {
        const ext = returnImage.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("return-images").upload(path, returnImage);
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from("return-images").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await (supabase.from("return_requests") as any).insert({
        user_id: user.id,
        order_id: order.id,
        complaint: returnText,
        damage_image_url: imageUrl,
      });
      if (error) throw error;
      toast.success("Return request submitted. We'll review it shortly.");
      setReturnOrderId(null);
      setReturnText("");
      setReturnImage(null);
      setExistingReturns((prev) => ({ ...prev, [order.id]: true }));
    } catch (err: any) {
      toast.error(err.message || "Failed to submit return request");
    } finally {
      setSubmittingReturn(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="pt-20 lg:pt-24 section-padding max-w-4xl mx-auto pb-20">
        <div className="flex items-center gap-3 mt-4 mb-8">
          <BackButton />
          <h1 className="font-heading text-3xl lg:text-4xl font-bold">
            <span className="text-gold-gradient">My Orders</span>
          </h1>
        </div>

        {fetching ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center">
            <Package size={40} className="mx-auto text-muted-foreground mb-4" />
            <p className="font-body text-muted-foreground mb-4">No orders yet</p>
            <Link to="/shop" className="text-primary font-body text-sm underline">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const config = statusConfig[order.status] || statusConfig.pending_payment;
              const StatusIcon = config.icon;
              const items = Array.isArray(order.items) ? order.items : [];
              const isTrackingOpen = trackingOrderId === order.id;
              const currentStep = statusToStep[order.status] ?? 0;
              const isDelivered = order.status === "delivered";
              const hasReview = existingReviews[order.id];
              const hasReturn = existingReturns[order.id];
              const canReturn = isReturnWindowOpen(order) && !hasReturn;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground font-body">
                        {new Date(order.created_at).toLocaleDateString("en-PK", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-body mt-0.5">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 ${config.color}`}>
                      <StatusIcon size={14} />
                      <span className="text-xs font-body font-semibold">{config.label}</span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                    {items.slice(0, 4).map((item: any, j: number) => (
                      <div key={j} className="shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded border border-border" />
                        ) : (
                          <div className="w-12 h-14 bg-secondary rounded border border-border flex items-center justify-center">
                            <Package size={14} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {items.length > 4 && (
                      <div className="w-12 h-14 bg-secondary rounded border border-border flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-muted-foreground font-body">+{items.length - 4}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs font-body">
                    <div className="text-muted-foreground">
                      {items.length} item{items.length > 1 ? "s" : ""} · {order.customer_city}
                    </div>
                    <div className="font-semibold">
                      PKR {order.subtotal?.toLocaleString()}
                    </div>
                  </div>

                  {/* Tracking number display */}
                  {order.tracking_number && order.status === "shipped" && (
                    <div className="mt-3 flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                      <Truck size={14} className="text-primary" />
                      <span className="text-xs font-body text-muted-foreground">Tracking:</span>
                      <span className="text-xs font-mono font-semibold text-foreground">{order.tracking_number}</span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {order.status === "pending_payment" && (
                      <Link
                        to="/payment"
                        state={{ orderId: order.id, advanceAmount: order.advance_amount, subtotal: order.subtotal }}
                        className="text-xs text-primary font-body font-semibold hover:underline"
                      >
                        Complete Payment →
                      </Link>
                    )}
                    {order.status !== "pending_payment" && order.status !== "cancelled" && (
                      <button
                        onClick={() => setTrackingOrderId(isTrackingOpen ? null : order.id)}
                        className={`text-xs font-body font-semibold hover:underline ${isDelivered ? "text-muted-foreground" : "text-primary"}`}
                        disabled={false}
                      >
                        {isTrackingOpen ? "Hide Tracking" : isDelivered ? "✓ Delivered" : "Track Delivery →"}
                      </button>
                    )}
                    {isDelivered && !hasReview && (
                      <button
                        onClick={() => setReviewOrderId(reviewOrderId === order.id ? null : order.id)}
                        className="text-xs text-primary font-body font-semibold hover:underline flex items-center gap-1"
                      >
                        <Star size={12} /> Write a Review
                      </button>
                    )}
                    {isDelivered && hasReview && (
                      <span className="text-xs text-muted-foreground font-body">✓ Review Submitted</span>
                    )}
                    {canReturn && (
                      <button
                        onClick={() => setReturnOrderId(returnOrderId === order.id ? null : order.id)}
                        className="text-xs text-destructive font-body font-semibold hover:underline flex items-center gap-1"
                      >
                        <RotateCcw size={12} /> Return
                      </button>
                    )}
                    {isDelivered && hasReturn && (
                      <span className="text-xs text-muted-foreground font-body">✓ Return Requested</span>
                    )}
                  </div>

                  {/* Review Form */}
                  <AnimatePresence>
                    {reviewOrderId === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border overflow-hidden"
                      >
                        <p className="text-sm font-heading font-semibold mb-3">Write Your Review</p>
                        <div className="flex gap-1 mb-3">
                          {[1,2,3,4,5].map((s) => (
                            <button key={s} onClick={() => setReviewRating(s)}>
                              <Star size={20} className={s <= reviewRating ? "fill-primary text-primary" : "text-muted-foreground"} />
                            </button>
                          ))}
                        </div>
                        <Textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your experience..."
                          rows={3}
                          className="bg-secondary border-border font-body text-sm mb-3"
                          maxLength={500}
                        />
                        <div className="flex items-center gap-3 mb-3">
                          <label className="text-xs text-muted-foreground font-body flex items-center gap-2 cursor-pointer border border-border rounded-lg px-3 py-2 hover:border-primary/30 transition-colors">
                            <Upload size={14} />
                            {reviewImage ? reviewImage.name.slice(0, 20) : "Upload Photo (optional)"}
                            <input
                              type="file"
                              accept="image/png,image/jpeg"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && setReviewImage(e.target.files[0])}
                            />
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => submitReview(order)}
                            disabled={submittingReview}
                            className="bg-gold-gradient text-primary-foreground font-body text-xs tracking-wider"
                          >
                            {submittingReview ? "Submitting..." : "Submit Review"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setReviewOrderId(null)} className="font-body text-xs">
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Return Form */}
                  <AnimatePresence>
                    {returnOrderId === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border overflow-hidden"
                      >
                        <p className="text-sm font-heading font-semibold mb-2 text-destructive">Return Request</p>
                        <p className="text-[10px] text-muted-foreground font-body mb-3">You have 24 hours from delivery to submit a return request.</p>
                        <Textarea
                          value={returnText}
                          onChange={(e) => setReturnText(e.target.value)}
                          placeholder="Describe the issue with your product..."
                          rows={3}
                          className="bg-secondary border-border font-body text-sm mb-3"
                          maxLength={500}
                          required
                        />
                        <div className="flex items-center gap-3 mb-3">
                          <label className="text-xs text-muted-foreground font-body flex items-center gap-2 cursor-pointer border border-border rounded-lg px-3 py-2 hover:border-primary/30 transition-colors">
                            <Upload size={14} />
                            {returnImage ? returnImage.name.slice(0, 20) : "Upload Damage Photo"}
                            <input
                              type="file"
                              accept="image/png,image/jpeg"
                              className="hidden"
                              onChange={(e) => e.target.files?.[0] && setReturnImage(e.target.files[0])}
                            />
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => submitReturn(order)}
                            disabled={submittingReturn || !returnText.trim()}
                            className="font-body text-xs tracking-wider"
                          >
                            {submittingReturn ? "Submitting..." : "Submit Return Request"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setReturnOrderId(null)} className="font-body text-xs">
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tracking Steps */}
                  <AnimatePresence>
                    {isTrackingOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-border overflow-hidden"
                      >
                        <OrderTrackingSteps currentStep={currentStep} orderDate={order.created_at} isDelivered={isDelivered} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyOrders;
