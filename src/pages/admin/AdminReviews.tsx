import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminReviews() {
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("reviews") as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const { data: returns, isLoading: returnsLoading } = useQuery({
    queryKey: ["admin-returns"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("return_requests") as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const updateReviewStatus = async (id: string, status: string) => {
    const { error } = await (supabase.from("reviews") as any).update({ status }).eq("id", id);
    if (error) toast.error("Failed to update");
    else {
      toast.success(`Review ${status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    }
  };

  const updateReturnStatus = async (id: string, status: string) => {
    const { error } = await (supabase.from("return_requests") as any).update({ status, reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) toast.error("Failed to update");
    else {
      toast.success(`Return ${status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-returns"] });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">Reviews & Returns</h1>
        <p className="text-muted-foreground mt-1">Manage customer reviews and return requests</p>
      </div>

      {/* Reviews */}
      <div>
        <h2 className="text-xl font-semibold font-heading mb-4">Customer Reviews ({reviews?.length || 0})</h2>
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : reviews?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No reviews yet</TableCell></TableRow>
              ) : (
                reviews?.map((review: any) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={12} className={s <= review.rating ? "fill-primary text-primary" : "text-muted-foreground"} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">{review.review_text || "—"}</TableCell>
                    <TableCell>
                      {review.review_image_url ? (
                        <img src={review.review_image_url} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={review.status === "approved" ? "default" : review.status === "rejected" ? "destructive" : "secondary"} className="text-xs">
                        {review.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(review.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {review.status !== "approved" && (
                          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-green-400" onClick={() => updateReviewStatus(review.id, "approved")}>
                            <CheckCircle size={12} /> Approve
                          </Button>
                        )}
                        {review.status !== "rejected" && (
                          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-destructive" onClick={() => updateReviewStatus(review.id, "rejected")}>
                            <XCircle size={12} /> Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Returns */}
      <div>
        <h2 className="text-xl font-semibold font-heading mb-4">Return Requests ({returns?.length || 0})</h2>
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Complaint</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returnsLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : returns?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No return requests</TableCell></TableRow>
              ) : (
                returns?.map((ret: any) => (
                  <TableRow key={ret.id}>
                    <TableCell className="font-mono text-xs">{ret.order_id?.slice(0, 8)}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">{ret.complaint}</TableCell>
                    <TableCell>
                      {ret.damage_image_url ? (
                        <img src={ret.damage_image_url} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={ret.status === "approved" ? "default" : ret.status === "rejected" ? "destructive" : "secondary"} className="text-xs">
                        {ret.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(ret.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {ret.status === "pending" && (
                          <>
                            <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-green-400" onClick={() => updateReturnStatus(ret.id, "approved")}>
                              <CheckCircle size={12} /> Approve
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-destructive" onClick={() => updateReturnStatus(ret.id, "rejected")}>
                              <XCircle size={12} /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
