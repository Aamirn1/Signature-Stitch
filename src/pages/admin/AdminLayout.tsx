import { Outlet, Navigate, NavLink } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, ShoppingCart, Users, Package, LogOut, Wallet, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const { user, loading: authLoading } = useAuth();
  const { data: role, isLoading: roleLoading } = useRole();

  if (authLoading || roleLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <Sidebar>
          <SidebarContent>
            <div className="p-6">
              <h2 className="text-xl font-bold font-playfair">Admin Panel</h2>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin" end className={({ isActive }) => isActive ? "bg-muted" : ""}>
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "bg-muted" : ""}>
                        <ShoppingCart />
                        <span>Orders</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin/partners" className={({ isActive }) => isActive ? "bg-muted" : ""}>
                        <Users />
                        <span>Partners</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin/products" className={({ isActive }) => isActive ? "bg-muted" : ""}>
                        <Package />
                        <span>Products</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin/payouts" className={({ isActive }) => isActive ? "bg-muted" : ""}>
                        <Wallet />
                        <span>Payouts</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink to="/admin/reviews" className={({ isActive }) => isActive ? "bg-muted" : ""}>
                        <Star />
                        <span>Reviews</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <div className="mt-auto p-4">
              <Button variant="outline" className="w-full" asChild>
                <NavLink to="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  Exit Admin
                </NavLink>
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
