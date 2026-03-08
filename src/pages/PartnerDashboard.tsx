import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, Package, DollarSign, Plus, ArrowRight,
  Wallet, Clock, CheckCircle2, XCircle, Send, Minus
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner";
import { products } from "@/data/products";

interface PartnerOrder {
  id: string;
  product_name: string;
  base_price: number;
  markup_amount: number;
  final_price: number;
  quantity: number;
  customer_name: string | null;
  status: string;
  created_at: string;
}

interface Payout {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
  processing: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

const PartnerDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PartnerOrder[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "new-order" | "payouts">("overview");

  // New order form
  const [selectedProduct, setSelectedProduct] = useState("");
  const [markupAmount, setMarkupAmount] = useState<number>(0);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");

  // Payout form
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(0);
  const [payoutMethod, setPayoutMethod] = useState<"easypaisa" | "jazzcash" | "bank_transfer">("easypaisa");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountTitle, setAccountTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchPayouts();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("partner_orders")
      .select("*")
      .eq("partner_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setOrders(data as PartnerOrder[]);
  };

  const fetchPayouts = async () => {
    const { data } = await supabase
      .from("partner_payouts")
      .select("*")
      .eq("partner_id", user!.id)
      .order("created_at", { ascending: false });
    if (data) setPayouts(data as Payout[]);
  };

  const totalEarnings = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + Number(o.markup_amount) * o.quantity, 0);

  const pendingEarnings = orders
    .filter((o) => ["pending", "confirmed", "shipped"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.markup_amount) * o.quantity, 0);

  const paidOut = payouts
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const availableBalance = totalEarnings - paidOut;

  const selectedProductData = products.find((p) => p.id === selectedProduct);

  const handlePlaceOrder = async () => {
    if (!selectedProductData || !customerName || !customerPhone || !customerAddress || !customerCity) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("partner_orders").insert({
      partner_id: user!.id,
      product_id: selectedProductData.id,
      product_name: selectedProductData.name,
      base_price: selectedProductData.price,
      markup_amount: markupAmount,
      quantity: orderQuantity,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      customer_city: customerCity,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to place order");
      return;
    }
    toast.success("Order placed successfully!");
    setSelectedProduct("");
    setMarkupAmount(0);
    setOrderQuantity(1);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerCity("");
    setActiveTab("orders");
    fetchOrders();
  };

  const handleRequestPayout = async () => {
    if (payoutAmount <= 0 || payoutAmount > availableBalance) {
      toast.error("Invalid payout amount");
      return;
    }
    if (!accountNumber || !accountTitle) {
      toast.error("Please fill account details");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("partner_payouts").insert({
      partner_id: user!.id,
      amount: payoutAmount,
      payment_method: payoutMethod,
      account_number: accountNumber,
      account_title: accountTitle,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to request payout");
      return;
    }
    toast.success("Payout request submitted!");
    setShowPayoutForm(false);
    setPayoutAmount(0);
    setAccountNumber("");
    setAccountTitle("");
    fetchPayouts();
  };

  if (loading || !user) return null;

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: TrendingUp },
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "new-order" as const, label: "New Order", icon: Plus },
    { id: "payouts" as const, label: "Payouts", icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="pt-20 lg:pt-24 section-padding max-w-6xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-6 mt-4">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold">
            <span className="text-gold-gradient">Partner Dashboard</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-card rounded-lg p-1 border border-border mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-body tracking-wider uppercase transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Earnings", value: `PKR ${totalEarnings.toLocaleString()}`, icon: TrendingUp, color: "text-green-400" },
                { label: "Pending Earnings", value: `PKR ${pendingEarnings.toLocaleString()}`, icon: Clock, color: "text-yellow-400" },
                { label: "Available Balance", value: `PKR ${availableBalance.toLocaleString()}`, icon: Wallet, color: "text-primary" },
                { label: "Total Orders", value: String(orders.length), icon: Package, color: "text-blue-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-body tracking-wider uppercase text-muted-foreground">{stat.label}</span>
                    <stat.icon size={16} className={stat.color} />
                  </div>
                  <p className="font-heading text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-sm font-semibold">Recent Orders</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-primary font-body hover:underline flex items-center gap-1">
                    View All <ArrowRight size={12} />
                  </button>
                </div>
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="font-body text-xs font-semibold">{order.product_name}</p>
                      <p className="text-[10px] text-muted-foreground font-body">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-body font-semibold">+PKR {(Number(order.markup_amount) * order.quantity).toLocaleString()}</p>
                      <span className={`text-[10px] font-body px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-sm text-muted-foreground font-body text-center py-6">No orders yet</p>}
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-heading text-sm font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button onClick={() => setActiveTab("new-order")} className="w-full bg-gold-gradient text-primary-foreground font-body text-xs tracking-wider uppercase hover:opacity-90 gap-2">
                      <Plus size={14} /> Place New Order
                    </Button>
                    <Button onClick={() => { setActiveTab("payouts"); setShowPayoutForm(true); }} variant="outline" className="w-full border-primary text-primary font-body text-xs tracking-wider uppercase hover:bg-primary hover:text-primary-foreground gap-2">
                      <Wallet size={14} /> Request Payout
                    </Button>
                  </div>
                </div>

                <div className="bg-card border border-primary/20 rounded-xl p-5">
                  <h3 className="font-heading text-sm font-semibold mb-2">How It Works</h3>
                  <ol className="space-y-2 text-xs font-body text-muted-foreground">
                    <li className="flex gap-2"><span className="text-primary font-bold">1.</span> Select a product and set your markup (profit)</li>
                    <li className="flex gap-2"><span className="text-primary font-bold">2.</span> Enter your customer's details</li>
                    <li className="flex gap-2"><span className="text-primary font-bold">3.</span> Pay 25% advance on the base price</li>
                    <li className="flex gap-2"><span className="text-primary font-bold">4.</span> We deliver to your customer, collect full amount</li>
                    <li className="flex gap-2"><span className="text-primary font-bold">5.</span> Your profit is credited to your balance</li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {orders.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-10 text-center">
                <Package size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="font-body text-sm text-muted-foreground mb-4">No orders placed yet</p>
                <Button onClick={() => setActiveTab("new-order")} className="bg-gold-gradient text-primary-foreground font-body text-xs tracking-wider uppercase hover:opacity-90">
                  Place Your First Order
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-sm font-semibold">{order.product_name}</h3>
                        <p className="text-[10px] text-muted-foreground font-body mt-1">
                          Customer: {order.customer_name} • Qty: {order.quantity}
                        </p>
                      </div>
                      <span className={`text-[10px] font-body px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border/50">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-body">Base Price</p>
                        <p className="text-xs font-body font-semibold">PKR {Number(order.base_price).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-body">Your Markup</p>
                        <p className="text-xs font-body font-semibold text-primary">+PKR {Number(order.markup_amount).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground font-body">Customer Pays</p>
                        <p className="text-xs font-body font-semibold">PKR {Number(order.final_price).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-body mt-2">
                      {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* New Order Tab */}
        {activeTab === "new-order" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="bg-card border border-border rounded-xl p-6 space-y-5">
              <h2 className="font-heading text-lg font-semibold">Place Partner Order</h2>

              {/* Product Selection */}
              <div>
                <Label className="text-xs font-body tracking-wider uppercase text-muted-foreground">Select Product *</Label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="mt-1 w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Choose a product...</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {p.priceFormatted}</option>
                  ))}
                </select>
              </div>

              {selectedProductData && (
                <>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
                    <div className="flex gap-4">
                      <img src={selectedProductData.images[0]} alt="" className="w-16 h-20 object-cover rounded" />
                      <div>
                        <p className="font-heading text-sm font-semibold">{selectedProductData.name}</p>
                        <p className="text-xs text-muted-foreground font-body">{selectedProductData.category}</p>
                        <p className="text-sm font-body font-bold text-primary mt-1">Base: {selectedProductData.priceFormatted}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-body tracking-wider uppercase text-muted-foreground">Your Markup (PKR) *</Label>
                      <Input type="number" value={markupAmount || ""} onChange={(e) => setMarkupAmount(Number(e.target.value))} placeholder="e.g. 500" className="mt-1 bg-secondary border-border font-body" />
                    </div>
                    <div>
                      <Label className="text-xs font-body tracking-wider uppercase text-muted-foreground">Quantity</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-primary transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="font-body text-sm font-semibold w-8 text-center">{orderQuantity}</span>
                        <button onClick={() => setOrderQuantity(orderQuantity + 1)} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-primary transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-1">
                    <div className="flex justify-between text-xs font-body">
                      <span className="text-muted-foreground">Base Price</span>
                      <span>PKR {selectedProductData.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-body">
                      <span className="text-muted-foreground">Your Markup</span>
                      <span className="text-primary">+PKR {markupAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-body">
                      <span className="text-muted-foreground">Quantity</span>
                      <span>× {orderQuantity}</span>
                    </div>
                    <div className="border-t border-border/50 pt-2 mt-2 flex justify-between font-body font-bold text-sm">
                      <span>Customer Pays</span>
                      <span className="text-gold-gradient">PKR {((selectedProductData.price + markupAmount) * orderQuantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-body text-primary">
                      <span>Your Profit</span>
                      <span>PKR {(markupAmount * orderQuantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-body text-muted-foreground">
                      <span>25% Advance (you pay now)</span>
                      <span>PKR {Math.ceil(selectedProductData.price * 0.25 * orderQuantity).toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Customer Details */}
              <div>
                <h3 className="font-heading text-sm font-semibold mb-3">Customer Details</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer Name *" className="bg-secondary border-border font-body" />
                    <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Customer Phone *" className="bg-secondary border-border font-body" />
                  </div>
                  <Input value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Delivery Address *" className="bg-secondary border-border font-body" />
                  <Input value={customerCity} onChange={(e) => setCustomerCity(e.target.value)} placeholder="City *" className="bg-secondary border-border font-body" />
                </div>
              </div>

              <Button onClick={handlePlaceOrder} disabled={submitting || !selectedProduct} className="w-full bg-gold-gradient text-primary-foreground font-body tracking-wider uppercase text-xs py-5 hover:opacity-90 gap-2">
                <Send size={14} /> {submitting ? "Placing Order..." : "Place Partner Order"}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Payouts Tab */}
        {activeTab === "payouts" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-[10px] font-body tracking-wider uppercase text-muted-foreground mb-1">Available Balance</p>
                <p className="font-heading text-2xl font-bold text-primary">PKR {availableBalance.toLocaleString()}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-[10px] font-body tracking-wider uppercase text-muted-foreground mb-1">Total Paid Out</p>
                <p className="font-heading text-2xl font-bold">PKR {paidOut.toLocaleString()}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 flex items-center">
                <Button onClick={() => setShowPayoutForm(!showPayoutForm)} disabled={availableBalance <= 0} className="w-full bg-gold-gradient text-primary-foreground font-body text-xs tracking-wider uppercase hover:opacity-90 gap-2">
                  <Wallet size={14} /> Request Payout
                </Button>
              </div>
            </div>

            {showPayoutForm && (
              <div className="bg-card border border-primary/20 rounded-xl p-6 mb-6 max-w-lg">
                <h3 className="font-heading text-sm font-semibold mb-4">Request Payout</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs font-body tracking-wider uppercase text-muted-foreground">Amount (PKR)</Label>
                    <Input type="number" value={payoutAmount || ""} onChange={(e) => setPayoutAmount(Number(e.target.value))} placeholder={`Max: ${availableBalance}`} className="mt-1 bg-secondary border-border font-body" />
                  </div>
                  <div>
                    <Label className="text-xs font-body tracking-wider uppercase text-muted-foreground">Payment Method</Label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value as any)}
                      className="mt-1 w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="easypaisa">Easypaisa</option>
                      <option value="jazzcash">JazzCash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <Input value={accountTitle} onChange={(e) => setAccountTitle(e.target.value)} placeholder="Account Title *" className="bg-secondary border-border font-body" />
                  <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account / Phone Number *" className="bg-secondary border-border font-body" />
                  <div className="flex gap-3">
                    <Button onClick={handleRequestPayout} disabled={submitting} className="bg-gold-gradient text-primary-foreground font-body text-xs tracking-wider uppercase hover:opacity-90">
                      {submitting ? "Submitting..." : "Submit Request"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowPayoutForm(false)} className="font-body text-xs">Cancel</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Payout History */}
            <div className="bg-card border border-border rounded-xl">
              <div className="p-5 border-b border-border">
                <h3 className="font-heading text-sm font-semibold">Payout History</h3>
              </div>
              {payouts.length === 0 ? (
                <p className="text-sm text-muted-foreground font-body text-center py-8">No payout requests yet</p>
              ) : (
                <div className="divide-y divide-border/50">
                  {payouts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-5">
                      <div>
                        <p className="font-body text-sm font-semibold">PKR {Number(p.amount).toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground font-body capitalize">{p.payment_method.replace("_", " ")} • {new Date(p.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <span className={`text-[10px] font-body px-2.5 py-1 rounded-full ${statusColors[p.status]}`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PartnerDashboard;
