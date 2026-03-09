import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { ShoppingCart, Users, Package, TrendingUp, DollarSign, Clock, CheckCircle, Truck } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

const COLORS = ["hsl(45,93%,47%)", "hsl(210,80%,60%)", "hsl(142,70%,45%)", "hsl(280,70%,60%)"];

export default function AdminDashboard() {
  const { data: orders } = useQuery({
    queryKey: ["admin-all-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, subtotal, status, created_at, is_reseller, profit_amount")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [ordersReq, partnersReq, productsReq, payoutsReq] = await Promise.all([
        supabase.from("orders").select("id, subtotal, status", { count: "exact" }),
        supabase.from("partner_applications").select("id", { count: "exact" }).eq("status", "approved"),
        supabase.from("products").select("id", { count: "exact" }).eq("is_active", true),
        supabase.from("partner_payouts").select("id, amount").eq("status", "pending"),
      ]);
      const totalRevenue = ordersReq.data?.filter((o: any) => !['pending_payment', 'payment_uploaded', 'payment_submitted'].includes(o.status ?? '')).filter((o: any) => !['pending_payment', 'payment_uploaded', 'payment_submitted'].includes(o.status ?? '')).reduce((sum, o) => sum + Number(o.subtotal), 0) ?? 0;
      const pendingPayouts = payoutsReq.data?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;
      return {
        orders: ordersReq.count ?? 0,
        partners: partnersReq.count ?? 0,
        products: productsReq.count ?? 0,
        totalRevenue,
        pendingPayouts,
        pendingPayoutsCount: payoutsReq.count ?? 0,
      };
    }
  });

  // Build last-14-days chart data from orders
  const revenueChartData = (() => {
    const days: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const day = startOfDay(subDays(new Date(), i));
      days.push({ date: format(day, "MMM d"), revenue: 0, orders: 0 });
    }
    if (orders) {
      orders.forEach((order) => {
        const orderDay = format(startOfDay(new Date(order.created_at)), "MMM d");
        const bucket = days.find((d) => d.date === orderDay);
        if (bucket) {
          bucket.revenue += Number(order.subtotal);
          bucket.orders += 1;
        }
      });
    }
    return days;
  })();

  // Status breakdown
  const statusBreakdown = (() => {
    const map: Record<string, number> = {};
    orders?.forEach((o) => { map[o.status] = (map[o.status] ?? 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name: name.replace(/_/g, " "), value }));
  })();

  // Partner vs regular orders
  const partnerVsRegular = [
    { name: "Regular Orders", value: orders?.filter((o) => !o.is_reseller).length ?? 0 },
    { name: "Partner/Reseller", value: orders?.filter((o) => o.is_reseller).length ?? 0 },
  ];

  // Monthly revenue for bar chart (last 6 months)
  const monthlyRevenue = (() => {
    const months: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ month: format(d, "MMM yy"), revenue: 0 });
    }
    orders?.forEach((order) => {
      const m = format(new Date(order.created_at), "MMM yy");
      const bucket = months.find((mo) => mo.month === m);
      if (bucket) bucket.revenue += Number(order.subtotal);
    });
    return months;
  })();

  const statCards = [
    { title: "Total Orders", value: stats?.orders ?? 0, icon: ShoppingCart, suffix: "" },
    { title: "Total Revenue", value: `Rs. ${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, suffix: "" },
    { title: "Active Partners", value: stats?.partners ?? 0, icon: Users, suffix: "" },
    { title: "Active Products", value: stats?.products ?? 0, icon: Package, suffix: "" },
    { title: "Pending Payouts", value: `Rs. ${(stats?.pendingPayouts ?? 0).toLocaleString()}`, icon: TrendingUp, suffix: "", highlight: (stats?.pendingPayoutsCount ?? 0) > 0 },
  ];

  const getStatusIcon = (status: string) => {
    if (status.includes("pending")) return <Clock className="h-3 w-3" />;
    if (status.includes("completed") || status.includes("delivered")) return <CheckCircle className="h-3 w-3" />;
    if (status.includes("shipped")) return <Truck className="h-3 w-3" />;
    return null;
  };

  const recentOrders = orders?.slice(0, 8) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-playfair">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Signature Stitch — Business Overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <Card key={card.title} className={card.highlight ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.highlight ? "text-primary" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${card.highlight ? "text-primary" : ""}`}>{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Revenue — Last 14 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(45,93%,47%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(45,93%,47%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(45,93%,47%)" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {statusBreakdown.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No orders yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {statusBreakdown.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    formatter={(v: any, name: any) => [v, name]}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Revenue Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Monthly Revenue — Last 6 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  formatter={(v: any) => [`Rs. ${Number(v).toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="hsl(45,93%,47%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Partner vs Regular */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Partner vs Regular Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {partnerVsRegular.every((d) => d.value === 0) ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">No orders yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={partnerVsRegular} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={3}>
                    {partnerVsRegular.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-2 text-xs text-muted-foreground font-medium">Order ID</th>
                    <th className="pb-2 text-xs text-muted-foreground font-medium">Amount</th>
                    <th className="pb-2 text-xs text-muted-foreground font-medium">Status</th>
                    <th className="pb-2 text-xs text-muted-foreground font-medium">Type</th>
                    <th className="pb-2 text-xs text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-2 font-mono text-xs text-muted-foreground">{order.id.slice(0, 8)}…</td>
                      <td className="py-2 font-semibold">Rs. {Number(order.subtotal).toLocaleString()}</td>
                      <td className="py-2">
                        <span className="inline-flex items-center gap-1 text-xs capitalize px-2 py-0.5 rounded-full bg-muted">
                          {getStatusIcon(order.status)}
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-2">
                        {order.is_reseller ? (
                          <span className="text-xs text-primary font-medium">Partner</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Regular</span>
                        )}
                      </td>
                      <td className="py-2 text-xs text-muted-foreground">
                        {format(new Date(order.created_at), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
