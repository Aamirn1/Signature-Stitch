import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminPartners() {
  const { data: applications, refetch } = useQuery({
    queryKey: ["admin-partner-applications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partner_applications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("partner_applications").update({ 
      status: newStatus,
      reviewed_at: new Date().toISOString()
    }).eq("id", id);
    
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Application ${newStatus}`);
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-playfair">Partner Applications</h1>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications?.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.business_name}</TableCell>
                <TableCell>{app.phone}</TableCell>
                <TableCell>{app.city}</TableCell>
                <TableCell>
                  <Badge variant={app.status === 'approved' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {app.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(app.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatus(app.id, 'rejected')}>Reject</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {applications?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No applications found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
