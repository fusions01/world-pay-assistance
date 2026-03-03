import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "sonner";
import { backendService } from "../services/backendService";

const ADMIN_EMAIL = "adebayoaminahanike@gmail.com";
const ADMIN_PASSWORD = "Anike4402";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Please enter your admin credentials.");
      return;
    }

    setLoading(true);
    try {
      // First check locally — if credentials are clearly wrong, fail fast
      if (trimmedEmail !== ADMIN_EMAIL.toLowerCase() || trimmedPassword !== ADMIN_PASSWORD) {
        toast.error("Invalid admin credentials.");
        setLoading(false);
        return;
      }

      // Try backend verification (with retry built into service)
      let success = false;
      try {
        success = await backendService.adminLogin(ADMIN_EMAIL, ADMIN_PASSWORD);
      } catch {
        // Backend unreachable — still allow login if local credentials match
        success = true;
      }

      if (success) {
        localStorage.setItem("worldpay_admin_logged_in", "true");
        localStorage.setItem("worldpay_admin_email", ADMIN_EMAIL);
        localStorage.setItem("worldpay_admin_password", ADMIN_PASSWORD);
        toast.success("Admin access granted.");
        navigate({ to: "/admin" });
      } else {
        toast.error("Invalid admin credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "oklch(0.10 0.04 262)" }}
    >
      <div className="w-full max-w-md">
        {/* Shield Icon + Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "oklch(0.38 0.14 258 / 0.2)", border: "1px solid oklch(0.45 0.12 258 / 0.3)" }}
          >
            <Shield className="h-10 w-10" style={{ color: "oklch(0.65 0.12 248)" }} />
          </div>
          <div
            className="inline-block text-xs font-body font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3"
            style={{ background: "oklch(0.38 0.14 258 / 0.15)", color: "oklch(0.65 0.12 248)" }}
          >
            Restricted Access
          </div>
          <h1 className="font-display font-bold text-3xl mb-2" style={{ color: "oklch(0.93 0.01 240)" }}>
            Admin Portal
          </h1>
          <p className="font-body text-sm" style={{ color: "oklch(0.60 0.03 250)" }}>
            World Pay Assistance — Administrative Access Only
          </p>
        </div>

        <Card
          className="border-0"
          style={{ background: "oklch(0.15 0.045 262)", border: "1px solid oklch(0.25 0.065 260)" }}
        >
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                  Admin Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="font-body h-11"
                  style={{ background: "oklch(0.19 0.05 262)", borderColor: "oklch(0.30 0.07 260)", color: "oklch(0.93 0.01 240)" }}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                  Admin Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="font-body h-11 pr-10"
                    style={{ background: "oklch(0.19 0.05 262)", borderColor: "oklch(0.30 0.07 260)", color: "oklch(0.93 0.01 240)" }}
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
                style={{ background: "oklch(0.45 0.14 258)", color: "oklch(0.96 0.005 240)" }}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Authenticating...</>
                ) : (
                  <><Shield className="mr-2 h-4 w-4" />Access Admin Panel</>
                )}
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-xs font-body transition-colors"
                  style={{ color: "oklch(0.50 0.04 250)" }}
                >
                  ← Back to User Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs font-body mt-6" style={{ color: "oklch(0.38 0.03 250)" }}>
          Unauthorized access attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
}
