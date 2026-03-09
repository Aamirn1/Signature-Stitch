import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Eye, Truck, Package, Search, Filter } from "lucide-react";
import { format } from "date-fns";

const STATUS_OPTIONS = [
  { value: "pending_payment", label: "Pending Payment", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { value: "payment_submitted", label: "Payment Submitted", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { value: "under_review", label: "Under Review", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { value: "approved", label: "Approved", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { value: "stitching", label: "Stitching", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { value: "shipped", label: "Shipped", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { value: "delivered", label: "Delivered", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

function getStatusBadge(status: string) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status);
  return (
    <Badge variant="outline" className={`text-xs font-medium border ${opt?.color || "bg-muted text-muted-foreground"}`}>
      {opt?.label || status}
    </Badge>
  );
}

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("orders") as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus } as any).eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      refetch();
    }
  };

  const saveTracking = async () => {
    if (!trackingOrderId) return;
    const { error } = await (supabase.from("orders") as any).update({ tracking_number: trackingInput }).eq("id", trackingOrderId);
    if (error) {
      toast.error("Failed to save tracking number");
    } else {
      toast.success("Tracking number saved");
      setTrackingOrderId(null);
      setTrackingInput("");
      refetch();
    }
  };

  const filtered = orders?.filter((o: any) => {
    const matchesSearch =
      !searchQuery ||
      o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone?.includes(searchQuery) ||
      o.id.includes(searchQuery) ||
      o.tracking_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderItems = (items: any) => {
    try {
      return Array.isArray(items) ? items : JSON.parse(items);
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading">Orders Management</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package size={16} />
          <span>{orders?.length || 0} total orders</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, order ID, tracking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary border-border"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-secondary border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">Order ID</TableHead>
              <TableHead className="min-w-[140px]">Customer</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-[140px]">Tracking</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered?.map((order: any) => (
              <TableRow key={order.id} className="hover:bg-secondary/50">
                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                <TableCell>
                  <div className="font-medium text-sm">{order.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                </TableCell>
                <TableCell className="text-sm">{order.customer_city}</TableCell>
                <TableCell>
                  <div className="text-sm font-semibold">PKR {Number(order.subtotal).toLocaleString()}</div>
                  {order.payment_method === "advance" && (
                    <div className="text-[10px] text-muted-foreground">
                      Advance: PKR {Number(order.advance_amount).toLocaleString()}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-xs capitalize">{order.payment_method}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  {order.tracking_number ? (
                    <div className="flex items-center gap-1.5">
                      <Truck size={14} className="text-primary" />
                      <span className="text-xs font-mono">{order.tracking_number}</span>
                      <button
                        onClick={() => { setTrackingOrderId(order.id); setTrackingInput(order.tracking_number || ""); }}
                        className="text-[10px] text-primary underline ml-1"
                      >
                        edit
                      </button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs gap-1"
                      onClick={() => { setTrackingOrderId(order.id); setTrackingInput(""); }}
                    >
                      <Truck size={12} /> Add
                    </Button>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(order.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select defaultValue={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                      <SelectTrigger className="w-[130px] h-8 text-xs bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedOrder(order)}>
                      <Eye size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered?.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Tracking Number Dialog */}
      <Dialog open={!!trackingOrderId} onOpenChange={(open) => { if (!open) setTrackingOrderId(null); }}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Truck size={18} className="text-primary" /> Add Tracking Number
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="e.g. TCS-12345678"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="bg-secondary border-border font-mono"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTrackingOrderId(null)}>Cancel</Button>
              <Button onClick={saveTracking} disabled={!trackingInput.trim()} className="bg-primary text-primary-foreground">
                Save Tracking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading">Order Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground text-xs">Order ID</p>
                    <p className="font-mono text-xs">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Date</p>
                    <p>{format(new Date(selectedOrder.created_at), "MMM d, yyyy h:mm a")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Payment</p>
                    <p className="capitalize">{selectedOrder.payment_method}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground mb-1">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                  <p className="text-muted-foreground">{selectedOrder.customer_phone}</p>
                  {selectedOrder.customer_email && <p className="text-muted-foreground">{selectedOrder.customer_email}</p>}
                  <p className="text-muted-foreground">{selectedOrder.customer_address}, {selectedOrder.customer_city}</p>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground mb-2">Items</p>
                  <div className="space-y-2">
                    {orderItems(selectedOrder.items).map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-secondary/50 rounded-lg p-2">
                        <div>
                          <p className="font-medium text-xs">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-xs font-semibold">{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>PKR {Number(selectedOrder.subtotal).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Advance Paid</span><span>PKR {Number(selectedOrder.advance_amount).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Remaining</span><span>PKR {Number(selectedOrder.remaining_amount).toLocaleString()}</span></div>
                  {selectedOrder.is_reseller && (
                    <div className="flex justify-between text-primary"><span>Reseller Profit</span><span>PKR {Number(selectedOrder.profit_amount || 0).toLocaleString()}</span></div>
                  )}
                </div>

                {selectedOrder.tracking_number && (
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-1">Tracking Number</p>
                    <div className="flex items-center gap-2">
                      <Truck size={14} className="text-primary" />
                      <span className="font-mono">{selectedOrder.tracking_number}</span>
                    </div>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </div>
                )}

                {selectedOrder.payment_screenshot_url && (
                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-2">Payment Screenshot</p>
                    <img src={selectedOrder.payment_screenshot_url} alt="Payment" className="rounded-lg max-h-48 object-contain" />
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
