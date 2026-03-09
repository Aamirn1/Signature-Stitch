import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Check, X, Clock, Banknote } from "lucide-react";

export default function AdminPayouts() {
  const queryClient = useQueryClient();

  const { data: payouts, isLoading } = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_payouts")
        .select(`
          *,
          profiles:partner_id (full_name, email)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status };
      if (status === "completed") {
        updates.processed_at = new Date().toISOString();
      }
      const { error } = await supabase
        .from("partner_payouts")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
      toast.success("Payout status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "processing":
        return <Badge variant="secondary" className="gap-1"><Banknote className="h-3 w-3" /> Processing</Badge>;
      case "completed":
        return <Badge variant="default" className="gap-1"><Check className="h-3 w-3" /> Completed</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><X className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingCount = payouts?.filter(p => p.status === "pending").length || 0;
  const totalPending = payouts
    ?.filter(p => p.status === "pending")
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-playfair">Partner Payouts</h1>
          <p className="text-muted-foreground mt-1">Manage partner withdrawal requests</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending Requests</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pending Amount</p>
          <p className="text-2xl font-bold">Rs. {totalPending.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Payouts</p>
          <p className="text-2xl font-bold">{payouts?.length || 0}</p>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Account Details</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : payouts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No payout requests yet
                </TableCell>
              </TableRow>
            ) : (
              payouts?.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{(payout.profiles as any)?.full_name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{(payout.profiles as any)?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">Rs. {Number(payout.amount).toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{payout.payment_method}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{payout.account_title}</p>
                      <p className="text-muted-foreground">{payout.account_number}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(payout.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                  <TableCell>
                    {payout.status === "pending" && (
                      <Select
                        onValueChange={(value) => updateStatus.mutate({ id: payout.id, status: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {payout.status === "processing" && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus.mutate({ id: payout.id, status: "completed" })}
                      >
                        Mark Completed
                      </Button>
                    )}
                    {payout.processed_at && (
                      <p className="text-xs text-muted-foreground">
                        Processed: {format(new Date(payout.processed_at), "MMM d, yyyy")}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
