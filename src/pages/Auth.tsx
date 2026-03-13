import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner";

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authFormLoading, setAuthFormLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/profile");
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      toast.error(error.message);
      console.error("Sign in error:", error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFormLoading(true);
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      if (error) toast.error(error.message);
      else toast.success("Confirmation email sent! Please check your inbox.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) toast.error(error.message);
      else toast.success("Successfully signed in!");
    }
    setAuthFormLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />
      <CartDrawer />

      <div className="pt-28 lg:pt-32 section-padding max-w-md mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-8 shadow-xl"
        >
          <h1 className="font-heading text-3xl font-bold mb-2 text-center">Welcome</h1>
          <p className="text-muted-foreground font-body text-sm mb-8 text-center">
            Sign in to your Signature Stitch account
          </p>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div className="space-y-2 text-left">
              <label className="text-xs font-body tracking-wider uppercase text-muted-foreground ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-xs font-body tracking-wider uppercase text-muted-foreground ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={authFormLoading}
              className="w-full bg-gold-gradient text-primary-foreground font-body tracking-wider uppercase text-sm font-bold py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              {authFormLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/80 border border-border rounded-lg px-6 py-3.5 font-body text-sm font-medium transition-all duration-300 hover:border-primary/30 shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-primary hover:underline font-body transition-all"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground font-body mt-8 px-4">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-primary hover:underline transition-colors">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-primary hover:underline transition-colors">Privacy Policy</a>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
