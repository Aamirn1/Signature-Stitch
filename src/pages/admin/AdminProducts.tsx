import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, Download, ImagePlus, Loader2, FileDown, FileUp } from "lucide-react";

const categories = [
  { slug: "shalwar-kameez", name: "Shalwar Kameez" },
  { slug: "waistcoats", name: "Waistcoats" },
  { slug: "3-piece", name: "3-Piece Suits" },
  { slug: "trousers", name: "Trousers & Shirts" },
];

interface ProductForm {
  name: string;
  slug: string;
  price: string;
  category_slug: string;
  image_url: string;
  description: string;
  is_active: boolean;
}

const initialForm: ProductForm = {
  name: "",
  slug: "",
  price: "",
  category_slug: "shalwar-kameez",
  image_url: "",
  description: "",
  is_active: true,
};

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [imageUploading, setImageUploading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createProduct = useMutation({
    mutationFn: async (product: Omit<ProductForm, "price"> & { price: number }) => {
      const { error } = await supabase.from("products").insert([product]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product created successfully");
      setOpen(false);
      setForm(initialForm);
    },
    onError: (err: any) => toast.error(err.message || "Failed to create product"),
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...product }: { id: string } & Omit<ProductForm, "price"> & { price: number }) => {
      const { error } = await supabase.from("products").update(product).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product updated successfully");
      setOpen(false);
      setEditingId(null);
      setForm(initialForm);
    },
    onError: (err: any) => toast.error(err.message || "Failed to update product"),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setImageUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `product-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, image_url: publicUrl }));
      toast.success("Image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: parseFloat(form.price),
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
    };
    if (editingId) {
      updateProduct.mutate({ id: editingId, ...productData });
    } else {
      createProduct.mutate(productData);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      category_slug: product.category_slug,
      image_url: product.image_url,
      description: product.description || "",
      is_active: product.is_active ?? true,
    });
    setOpen(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingId(null);
      setForm(initialForm);
    }
  };

  // ── CSV Export ──────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (!products || products.length === 0) {
      toast.error("No products to export");
      return;
    }
    const headers = ["name", "slug", "price", "category_slug", "image_url", "description", "is_active"];
    const rows = products.map((p) =>
      headers.map((h) => {
        const val = (p as any)[h];
        if (typeof val === "string" && (val.includes(",") || val.includes('"') || val.includes("\n"))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val ?? "";
      }).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${products.length} products`);
  };

  // ── CSV Import ──────────────────────────────────────────────────────────────
  const handleImport = async (file: File) => {
    setImportLoading(true);
    try {
      const text = await file.text();
      const lines = text.trim().split("\n");
      if (lines.length < 2) throw new Error("CSV must have a header row and at least one product");

      const parseCSVRow = (row: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < row.length; i++) {
          if (row[i] === '"') {
            if (inQuotes && row[i + 1] === '"') { current += '"'; i++; }
            else inQuotes = !inQuotes;
          } else if (row[i] === "," && !inQuotes) {
            result.push(current.trim()); current = "";
          } else {
            current += row[i];
          }
        }
        result.push(current.trim());
        return result;
      };

      const headers = parseCSVRow(lines[0]);
      const rows = lines.slice(1).map((line) => {
        const values = parseCSVRow(line);
        return headers.reduce((acc, header, idx) => {
          (acc as any)[header.trim()] = values[idx] ?? "";
          return acc;
        }, {} as any);
      });

      const toInsert = rows.map((r) => ({
        name: r.name,
        slug: r.slug || r.name?.toLowerCase().replace(/\s+/g, "-"),
        price: parseFloat(r.price) || 0,
        category_slug: r.category_slug || "shalwar-kameez",
        image_url: r.image_url || "https://via.placeholder.com/400x500",
        description: r.description || null,
        is_active: r.is_active === "false" ? false : true,
      }));

      const { error } = await supabase.from("products").insert(toInsert);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(`Imported ${toInsert.length} products successfully`);
    } catch (err: any) {
      toast.error(err.message || "Import failed");
    } finally {
      setImportLoading(false);
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-playfair">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog ({products?.length ?? 0} products)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Export CSV */}
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <FileDown className="h-4 w-4" /> Export CSV
          </Button>

          {/* Import CSV */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => importInputRef.current?.click()}
            disabled={importLoading}
            className="gap-2"
          >
            {importLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            Import CSV
          </Button>
          <input
            ref={importInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])}
          />

          {/* Add Product */}
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Product Image *</Label>
                  <div className="flex gap-3 items-start">
                    {/* Image preview / placeholder */}
                    <div
                      className="relative w-24 h-24 border-2 border-dashed border-border rounded-lg overflow-hidden flex items-center justify-center bg-muted cursor-pointer hover:border-primary transition-colors shrink-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imageUploading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      ) : form.image_url ? (
                        <img
                          src={form.image_url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      ) : (
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      )}
                      <div className="absolute inset-0 bg-background/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                      >
                        <Upload className="h-4 w-4" />
                        {imageUploading ? "Uploading..." : "Upload Image"}
                      </Button>
                      <p className="text-[10px] text-muted-foreground">JPG, PNG, WebP. Or paste a URL below.</p>
                      <Input
                        value={form.image_url}
                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                        placeholder="https://... (paste URL)"
                        className="text-xs"
                      />
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Royal Navy Waistcoat"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="auto-generated if empty"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (PKR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="8500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={form.category_slug}
                      onValueChange={(value) => setForm({ ...form, category_slug: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Product description..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active (visible to customers)</Label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createProduct.isPending || updateProduct.isPending || imageUploading}
                >
                  {editingId ? "Update Product" : "Create Product"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* CSV template hint */}
      <div className="bg-muted/40 border border-border rounded-lg p-3 text-xs text-muted-foreground">
        <strong className="text-foreground">CSV Import format:</strong> Headers must be:{" "}
        <code className="bg-muted px-1 rounded">name, slug, price, category_slug, image_url, description, is_active</code>
        <span className="ml-2 text-primary cursor-pointer hover:underline" onClick={handleExport}>
          Export existing products as template →
        </span>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No products yet. Click "Add Product" or import a CSV.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-14 rounded object-cover"
                      onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="capitalize text-sm text-muted-foreground">
                    {categories.find(c => c.slug === product.category_slug)?.name ?? product.category_slug}
                  </TableCell>
                  <TableCell>Rs. {Number(product.price).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Active' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteProduct.mutate(product.id)}
                        disabled={deleteProduct.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
