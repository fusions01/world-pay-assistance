import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { backendService } from "../services/backendService";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const success = await backendService.loginUser(email.trim().toLowerCase(), password);
      if (success) {
        localStorage.setItem("worldpay_user_logged_in", "true");
        localStorage.setItem("worldpay_user_email", email.trim().toLowerCase());
        localStorage.setItem("worldpay_user_password", password);
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.12 0.038 262)" }}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4">
              <img src="/assets/generated/logo-transparent.dim_200x200.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-display font-bold text-3xl mb-2" style={{ color: "oklch(0.93 0.01 240)" }}>
              Welcome Back
            </h1>
            <p className="font-body text-sm" style={{ color: "oklch(0.60 0.03 250)" }}>
              Sign in to your World Pay Assistance account
            </p>
          </div>

          <Card className="border-0" style={{ background: "oklch(0.16 0.045 262)", border: "1px solid oklch(0.26 0.06 260)" }}>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="font-body h-11"
                    style={{ background: "oklch(0.20 0.05 262)", borderColor: "oklch(0.30 0.07 260)", color: "oklch(0.93 0.01 240)" }}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="font-body h-11 pr-10"
                      style={{ background: "oklch(0.20 0.05 262)", borderColor: "oklch(0.30 0.07 260)", color: "oklch(0.93 0.01 240)" }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "oklch(0.55 0.03 250)" }}
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 font-body font-semibold text-base"
                  style={{ background: "oklch(0.75 0.12 85)", color: "oklch(0.14 0.04 55)" }}
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing In...</>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <p className="text-center text-sm font-body" style={{ color: "oklch(0.60 0.03 250)" }}>
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-semibold underline underline-offset-2" style={{ color: "oklch(0.75 0.12 85)" }}>
                    Sign Up
                  </Link>
                </p>

                <div className="text-center">
                  <Link
                    to="/admin/login"
                    className="text-xs font-body transition-colors"
                    style={{ color: "oklch(0.50 0.04 250)" }}
                  >
                    Admin Portal →
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
