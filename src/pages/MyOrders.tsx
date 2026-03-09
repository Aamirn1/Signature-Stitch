import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, CheckCircle, AlertCircle, Image, Truck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BackButton from "@/components/BackButton";
import OrderTrackingSteps from "@/components/OrderTrackingSteps";

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

// Map order status to tracking step index (0-based)
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

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    const { data } = await (supabase.from("orders") as any)
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
    setFetching(false);
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
                  <div className="flex items-center gap-3 mt-3">
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
                        className="text-xs text-primary font-body font-semibold hover:underline"
                      >
                        {isTrackingOpen ? "Hide Tracking" : "Track Delivery →"}
                      </button>
                    )}
                  </div>

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
                        <OrderTrackingSteps currentStep={currentStep} orderDate={order.created_at} />
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
