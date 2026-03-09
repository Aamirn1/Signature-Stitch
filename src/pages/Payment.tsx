import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Upload, CheckCircle, Copy, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { toast } from "sonner";

const ACCOUNT_DETAILS = {
  bankName: "JazzCash / EasyPaisa",
  accountTitle: "Signature Stitch",
  accountNumber: "03205719979",
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const orderData = location.state as {
    orderId: string;
    advanceAmount: number;
    subtotal: number;
  } | null;

  useEffect(() => {
    if (!orderData || !user) navigate("/");
  }, [orderData, user]);

  if (!orderData || !user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleSubmit = async () => {
    if (!screenshotFile) {
      toast.error("Please upload your payment screenshot");
      return;
    }

    setUploading(true);
    try {
      const ext = screenshotFile.name.split(".").pop();
      const path = `${user.id}/${orderData.orderId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(path, screenshotFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("payment-screenshots")
        .getPublicUrl(path);

      const { error: updateError } = await (supabase.from("orders") as any)
        .update({
          payment_screenshot_url: urlData.publicUrl,
          status: "payment_submitted",
        })
        .eq("id", orderData.orderId);

      if (updateError) throw updateError;

      setSubmitted(true);
      toast.success("Payment screenshot submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload screenshot");
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 section-padding max-w-lg mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
            <CheckCircle size={64} className="text-primary mx-auto mb-6" />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold mb-4">Payment Submitted!</h1>
          <p className="text-muted-foreground font-body mb-2">
            Your order has been placed and payment screenshot received.
          </p>
          <p className="text-muted-foreground font-body mb-8 text-sm">
            We will verify your payment and confirm your order via WhatsApp shortly.
          </p>
          <Button onClick={() => navigate("/")} className="bg-gold-gradient text-primary-foreground font-body tracking-widest uppercase hover:opacity-90">
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />
      <div className="pt-20 lg:pt-24 section-padding max-w-lg mx-auto pb-20">
        <Link to="/checkout" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary font-body mb-6 mt-4 transition-colors">
          <ChevronLeft size={16} /> Back to Checkout
        </Link>

        <h1 className="font-heading text-3xl font-bold mb-2">
          <span className="text-gold-gradient">Complete Payment</span>
        </h1>
        <p className="text-muted-foreground font-body text-sm mb-8">
          Transfer the advance amount and upload your payment screenshot below.
        </p>

        {/* Amount to Pay */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-5 mb-6 text-center">
          <p className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-1">Amount to Pay (25% Advance)</p>
          <p className="text-3xl font-heading font-bold text-gold-gradient">
            PKR {orderData.advanceAmount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Out of total PKR {orderData.subtotal.toLocaleString()}
          </p>
        </div>

        {/* Account Details */}
        <div className="bg-card rounded-lg p-6 border border-border mb-6 space-y-4">
          <h2 className="font-heading text-lg font-semibold">Transfer To</h2>
          {[
            { label: "Platform", value: ACCOUNT_DETAILS.bankName },
            { label: "Account Title", value: ACCOUNT_DETAILS.accountTitle },
            { label: "Account Number", value: ACCOUNT_DETAILS.accountNumber },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-body">{row.label}</p>
                <p className="font-body text-sm font-semibold">{row.value}</p>
              </div>
              <button
                onClick={() => copyToClipboard(row.value)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Copy size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Upload Screenshot */}
        <div className="bg-card rounded-lg p-6 border border-border mb-6">
          <h2 className="font-heading text-lg font-semibold mb-4">Upload Payment Screenshot</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary/50 transition-colors">
            {preview ? (
              <img src={preview} alt="Screenshot preview" className="max-h-48 rounded-lg mb-3 object-contain" />
            ) : (
              <>
                <Upload size={32} className="text-muted-foreground mb-3" />
                <p className="text-sm font-body text-muted-foreground">Click to upload screenshot</p>
                <p className="text-xs text-muted-foreground font-body mt-1">JPG, PNG up to 5MB</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {preview && (
            <p className="text-xs text-primary font-body mt-2 text-center">Screenshot selected ✓</p>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={uploading || !screenshotFile}
          size="lg"
          className="w-full bg-gold-gradient text-primary-foreground font-body tracking-widest uppercase text-sm py-6 hover:opacity-90"
        >
          {uploading ? (
            <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Uploading...</span>
          ) : (
            "Submit Payment"
          )}
        </Button>

        <p className="text-[10px] text-muted-foreground font-body text-center mt-3">
          Your order will be confirmed after payment verification via WhatsApp.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
