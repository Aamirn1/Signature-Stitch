import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Ruler, Plus, Trash2, Camera, Check, LogOut, Star, Handshake, ArrowRight, Package } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner";

interface Profile {
  full_name: string;
  phone: string;
  email: string;
  avatar_url: string;
}

interface Measurement {
  id: string;
  label: string;
  chest: number | null;
  waist: number | null;
  hip: number | null;
  shoulder: number | null;
  sleeve_length: number | null;
  shirt_length: number | null;
  trouser_length: number | null;
  trouser_waist: number | null;
  inseam: number | null;
  collar: number | null;
  measurement_photo_url: string | null;
  is_default: boolean;
}

const emptyMeasurement: Omit<Measurement, "id"> = {
  label: "My Measurements",
  chest: null, waist: null, hip: null, shoulder: null,
  sleeve_length: null, shirt_length: null, trouser_length: null,
  trouser_waist: null, inseam: null, collar: null,
  measurement_photo_url: null, is_default: true,
};

const measurementFields = [
  { key: "chest", label: "Chest", unit: "inches" },
  { key: "waist", label: "Waist", unit: "inches" },
  { key: "hip", label: "Hip", unit: "inches" },
  { key: "shoulder", label: "Shoulder", unit: "inches" },
  { key: "sleeve_length", label: "Sleeve Length", unit: "inches" },
  { key: "shirt_length", label: "Shirt Length", unit: "inches" },
  { key: "collar", label: "Collar", unit: "inches" },
  { key: "trouser_waist", label: "Trouser Waist", unit: "inches" },
  { key: "trouser_length", label: "Trouser Length", unit: "inches" },
  { key: "inseam", label: "Inseam", unit: "inches" },
] as const;

const Profile = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "", email: "", avatar_url: "" });
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [editingMeasurement, setEditingMeasurement] = useState<Omit<Measurement, "id"> & { id?: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState<string | null>(null);

  const [converting, setConverting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMeasurements();
      fetchPartnerStatus();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
    if (data) setProfile({ full_name: data.full_name || "", phone: data.phone || "", email: data.email || "", avatar_url: data.avatar_url || "" });
  };

  const fetchMeasurements = async () => {
    const { data } = await supabase.from("measurements").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    if (data) setMeasurements(data as Measurement[]);
  };

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      phone: profile.phone,
      updated_at: new Date().toISOString(),
    }).eq("id", user!.id);
    setSaving(false);
    if (error) toast.error("Failed to save profile");
    else toast.success("Profile updated");
  };

  const saveMeasurement = async () => {
    if (!editingMeasurement) return;
    setSaving(true);

    const payload = {
      user_id: user!.id,
      label: editingMeasurement.label,
      chest: editingMeasurement.chest,
      waist: editingMeasurement.waist,
      hip: editingMeasurement.hip,
      shoulder: editingMeasurement.shoulder,
      sleeve_length: editingMeasurement.sleeve_length,
      shirt_length: editingMeasurement.shirt_length,
      trouser_length: editingMeasurement.trouser_length,
      trouser_waist: editingMeasurement.trouser_waist,
      inseam: editingMeasurement.inseam,
      collar: editingMeasurement.collar,
      measurement_photo_url: editingMeasurement.measurement_photo_url,
      is_default: editingMeasurement.is_default,
      updated_at: new Date().toISOString(),
    };

    if (editingMeasurement.id) {
      await supabase.from("measurements").update(payload).eq("id", editingMeasurement.id);
    } else {
      // If setting as default, unset others first
      if (payload.is_default) {
        await supabase.from("measurements").update({ is_default: false }).eq("user_id", user!.id);
      }
      await supabase.from("measurements").insert(payload);
    }

    setSaving(false);
    setEditingMeasurement(null);
    fetchMeasurements();
    toast.success("Measurements saved");
  };

  const deleteMeasurement = async (id: string) => {
    await supabase.from("measurements").delete().eq("id", id);
    fetchMeasurements();
    toast.success("Measurement deleted");
  };

  const setDefault = async (id: string) => {
    await supabase.from("measurements").update({ is_default: false }).eq("user_id", user!.id);
    await supabase.from("measurements").update({ is_default: true }).eq("id", id);
    fetchMeasurements();
    toast.success("Default measurement updated");
  };

  const uploadPhoto = async (file: File) => {
    if (!user || !editingMeasurement) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("measurement-photos").upload(path, file);
    if (error) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("measurement-photos").getPublicUrl(path);
    setEditingMeasurement({ ...editingMeasurement, measurement_photo_url: publicUrl });
    setUploading(false);
    toast.success("Photo uploaded");
  };

  const fetchPartnerStatus = async () => {
    const { data } = await supabase.from("partner_applications").select("status").eq("user_id", user!.id).maybeSingle();
    setPartnerStatus(data?.status ?? null);
  };

  const convertToPartner = async () => {
    setConverting(true);
    const { error } = await supabase.from("partner_applications").insert({
      user_id: user!.id,
      business_name: profile.full_name || "Partner",
      phone: profile.phone || "",
      city: "",
      status: "approved",
    });
    setConverting(false);
    if (error) {
      toast.error("Conversion failed. You may already be a partner.");
      return;
    }
    toast.success("You're now a partner! Access your dashboard to start reselling.");
    setPartnerStatus("approved");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <div className="pt-20 lg:pt-24 section-padding max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between mb-8 mt-4">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold">
            <span className="text-gold-gradient">My Profile</span>
          </h1>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 font-body text-xs">
            <LogOut size={14} /> Sign Out
          </Button>
        </div>

        {/* Profile Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <User size={18} className="text-primary" />
              )}
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold">Personal Details</h2>
              <p className="text-xs text-muted-foreground font-body">{profile.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-body tracking-wider uppercase text-muted-foreground">Full Name</Label>
              <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="mt-1 bg-secondary border-border font-body" />
            </div>
            <div>
              <Label className="text-xs font-body tracking-wider uppercase text-muted-foreground">Phone</Label>
              <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+92 3XX XXXXXXX" className="mt-1 bg-secondary border-border font-body" />
            </div>
          </div>
          <Button onClick={saveProfile} disabled={saving} className="mt-4 bg-gold-gradient text-primary-foreground font-body tracking-wider uppercase text-xs hover:opacity-90">
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </motion.div>

        {/* My Orders Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
          <Link to="/my-orders" className="bg-card border border-border rounded-xl p-6 flex items-center justify-between hover:border-primary/30 transition-colors group block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Package size={18} className="text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold">My Orders</h2>
                <p className="text-xs text-muted-foreground font-body">Track your orders and payments</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </motion.div>

        {/* Measurements Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ruler size={20} className="text-primary" />
              <h2 className="font-heading text-xl font-semibold">My Measurements</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingMeasurement({ ...emptyMeasurement })}
              className="gap-2 font-body text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus size={14} /> Add Measurements
            </Button>
          </div>

          <p className="text-xs text-muted-foreground font-body mb-6">
            Save your body measurements for custom-stitched orders. You can also upload a photo of measurements from your tailor.
          </p>

          {/* Existing measurements list */}
          {measurements.length === 0 && !editingMeasurement && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <Ruler size={32} className="mx-auto text-muted-foreground mb-3" />
              <p className="font-body text-sm text-muted-foreground mb-4">No measurements saved yet</p>
              <Button
                onClick={() => setEditingMeasurement({ ...emptyMeasurement })}
                className="bg-gold-gradient text-primary-foreground font-body tracking-wider uppercase text-xs hover:opacity-90"
              >
                Add Your First Measurement
              </Button>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {measurements.map((m) => (
              <div key={m.id} className="bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-heading text-sm font-semibold">{m.label}</h3>
                    {m.is_default && (
                      <span className="inline-flex items-center gap-1 bg-primary/20 text-primary text-[10px] font-body font-semibold px-2 py-0.5 rounded-full">
                        <Star size={10} /> Default
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-1 text-xs font-body text-muted-foreground">
                    {measurementFields.map(({ key, label }) => {
                      const val = m[key as keyof Measurement];
                      return val ? <span key={key}>{label}: {String(val)}"</span> : null;
                    })}
                  </div>
                  {m.measurement_photo_url && (
                    <a href={m.measurement_photo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-primary font-body hover:underline">
                      <Camera size={12} /> View tailor's measurement photo
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!m.is_default && (
                    <button onClick={() => setDefault(m.id)} className="text-xs text-primary font-body hover:underline">Set Default</button>
                  )}
                  <button
                    onClick={() => setEditingMeasurement({ ...m })}
                    className="text-xs text-muted-foreground font-body hover:text-foreground"
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteMeasurement(m.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit/Add Measurement Form */}
          {editingMeasurement && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-card border border-primary/30 rounded-xl p-6"
            >
              <h3 className="font-heading text-lg font-semibold mb-4">
                {editingMeasurement.id ? "Edit Measurements" : "Add New Measurements"}
              </h3>

              <div className="mb-4">
                <Label className="text-xs font-body tracking-wider uppercase text-muted-foreground">Label</Label>
                <Input
                  value={editingMeasurement.label}
                  onChange={(e) => setEditingMeasurement({ ...editingMeasurement, label: e.target.value })}
                  placeholder="e.g. Summer Kameez, Wedding Suit"
                  className="mt-1 bg-secondary border-border font-body"
                />
              </div>

              <p className="text-xs text-muted-foreground font-body mb-3">All measurements in inches</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {measurementFields.map(({ key, label }) => (
                  <div key={key}>
                    <Label className="text-[10px] font-body tracking-wider uppercase text-muted-foreground">{label}</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={(editingMeasurement[key as keyof typeof editingMeasurement] as number | null) ?? ""}
                      onChange={(e) => setEditingMeasurement({
                        ...editingMeasurement,
                        [key]: e.target.value ? parseFloat(e.target.value) : null,
                      })}
                      placeholder='0"'
                      className="mt-1 bg-secondary border-border font-body text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Photo Upload */}
              <div className="mb-6">
                <Label className="text-xs font-body tracking-wider uppercase text-muted-foreground mb-2 block">
                  Tailor's Measurement Photo (optional)
                </Label>
                <p className="text-[10px] text-muted-foreground font-body mb-2">
                  Upload a photo of measurements taken by your tailor for reference
                </p>
                {editingMeasurement.measurement_photo_url ? (
                  <div className="flex items-center gap-3">
                    <img src={editingMeasurement.measurement_photo_url} alt="Measurement" className="w-20 h-20 object-cover rounded-lg border border-border" />
                    <button
                      onClick={() => setEditingMeasurement({ ...editingMeasurement, measurement_photo_url: null })}
                      className="text-xs text-destructive font-body hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/30 transition-colors">
                    <Camera size={20} className="text-muted-foreground" />
                    <span className="text-sm font-body text-muted-foreground">
                      {uploading ? "Uploading..." : "Click to upload photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={editingMeasurement.is_default}
                  onChange={(e) => setEditingMeasurement({ ...editingMeasurement, is_default: e.target.checked })}
                  className="accent-[hsl(var(--primary))]"
                />
                <span className="text-xs font-body text-muted-foreground">Set as default measurement</span>
              </div>

              <div className="flex gap-3">
                <Button onClick={saveMeasurement} disabled={saving} className="bg-gold-gradient text-primary-foreground font-body tracking-wider uppercase text-xs hover:opacity-90 gap-2">
                  <Check size={14} /> {saving ? "Saving..." : "Save Measurements"}
                </Button>
                <Button variant="outline" onClick={() => setEditingMeasurement(null)} className="font-body text-xs">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Partner Program Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Handshake size={20} className="text-primary" />
            <h2 className="font-heading text-xl font-semibold">Reseller Program</h2>
          </div>

          {partnerStatus === "approved" ? (
            <div className="bg-card border border-primary/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Check size={16} className="text-green-400" />
                <p className="font-body text-sm font-semibold text-green-400">You're an approved partner!</p>
              </div>
              <p className="text-xs text-muted-foreground font-body mb-4">
                Access your dashboard to place orders, track commissions, and request payouts.
              </p>
              <Link to="/partner">
                <Button className="bg-gold-gradient text-primary-foreground font-body text-xs tracking-wider uppercase hover:opacity-90 gap-2">
                  Open Partner Dashboard <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          ) : partnerStatus === "pending" ? (
            <div className="bg-card border border-yellow-500/20 rounded-xl p-6">
              <p className="font-body text-sm font-semibold text-yellow-400 mb-1">Application Under Review</p>
              <p className="text-xs text-muted-foreground font-body">
                Your partner application is being reviewed. We'll notify you once it's approved.
              </p>
            </div>
          ) : partnerStatus === "rejected" ? (
            <div className="bg-card border border-destructive/20 rounded-xl p-6">
              <p className="font-body text-sm font-semibold text-destructive mb-1">Application Not Approved</p>
              <p className="text-xs text-muted-foreground font-body">
                Unfortunately your application was not approved. Contact us on WhatsApp for details.
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="font-body text-sm mb-2">
                Start reselling Signature Stitch products — set your own prices, earn on every sale!
              </p>
              <ul className="text-xs text-muted-foreground font-body space-y-1 mb-4">
                <li>• Set your own profit margin on each product</li>
                <li>• We handle stitching, quality, and delivery</li>
                <li>• Track your earnings and request payouts</li>
              </ul>
              <Button onClick={convertToPartner} disabled={converting} className="bg-gold-gradient text-primary-foreground font-body text-xs tracking-wider uppercase hover:opacity-90 gap-2">
                <Handshake size={14} /> {converting ? "Converting..." : "Convert to Partner Profile"}
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
