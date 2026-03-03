import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Globe, Eye, EyeOff, Search } from "lucide-react";
import { toast } from "sonner";
import { backendService } from "../services/backendService";
import { sortedCountryCodes, type CountryCode } from "../data/countryCodes";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Pre-fetch device info on mount so it's ready before form submission
  const [deviceInfo, setDeviceInfo] = useState({
    browser: "",
    deviceType: "",
    os: "",
    ipAddress: "",
  });

  useEffect(() => {
    const ua = navigator.userAgent;

    const browser = (() => {
      if (/Edg\//i.test(ua)) return "Edge";
      if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return "Opera";
      if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
      if (/Firefox\//i.test(ua)) return "Firefox";
      if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
      if (/Chromium/i.test(ua)) return "Chromium";
      return "Unknown";
    })();

    const deviceType = (() => {
      if (/iPad|Tablet/i.test(ua)) return "Tablet";
      if (/Mobile|Android|iPhone/i.test(ua)) return "Mobile";
      return "Desktop";
    })();

    const os = (() => {
      if (/Android/i.test(ua)) return "Android";
      if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
      if (/Windows/i.test(ua)) return "Windows";
      if (/Mac OS X/i.test(ua)) return "macOS";
      if (/Linux/i.test(ua)) return "Linux";
      return "Unknown";
    })();

    // Silently fetch IP — no popup or indication to the user
    fetch("https://api.ipify.org?format=json")
      .then((r) => r.json())
      .then((data: { ip: string }) => {
        setDeviceInfo({ browser, deviceType, os, ipAddress: data.ip ?? "" });
      })
      .catch(() => {
        setDeviceInfo({ browser, deviceType, os, ipAddress: "" });
      });
  }, []);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    selectedCountry: null as CountryCode | null,
    countryName: "",
  });

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return sortedCountryCodes;
    const q = countrySearch.toLowerCase();
    return sortedCountryCodes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  function selectCountry(country: CountryCode) {
    setForm((prev) => ({
      ...prev,
      selectedCountry: country,
      countryName: country.name,
    }));
    setDropdownOpen(false);
    setCountrySearch("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim() || !form.phoneNumber.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!form.selectedCountry) {
      toast.error("Please select your country code.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const email = form.email.trim().toLowerCase();

      await backendService.registerUser(
        form.fullName.trim(),
        email,
        form.password,
        form.phoneNumber.trim(),
        form.selectedCountry.dialCode,
        form.selectedCountry.name,
        deviceInfo.deviceType,
        deviceInfo.browser,
        deviceInfo.os,
        deviceInfo.ipAddress
      );

      // Store session so user lands directly on dashboard — no need to re-login
      localStorage.setItem("worldpay_user_logged_in", "true");
      localStorage.setItem("worldpay_user_email", email);
      localStorage.setItem("worldpay_user_password", form.password);

      toast.success("Account created! Welcome to World Pay Assistance.");
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err);
      // ICP agent may wrap the message; normalize by lowercasing for matching
      const msg = raw.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        toast.error("An account with this email already exists. Please log in instead.");
      } else if (msg.includes("unauthorized") || msg.includes("not authorized")) {
        toast.error("Registration is not allowed at this time. Please try again.");
      } else {
        // Show a clean message — strip ICP canister noise if present
        const clean = raw.includes("trapped") ? "Registration failed. Please try again." : (raw || "Registration failed. Please try again.");
        toast.error(clean);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.12 0.038 262)" }}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-gold/30">
              <img src="/assets/generated/logo-transparent.dim_200x200.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-display font-bold text-3xl mb-2" style={{ color: "oklch(0.93 0.01 240)" }}>
              Create Account
            </h1>
            <p className="font-body text-sm" style={{ color: "oklch(0.60 0.03 250)" }}>
              Join World Pay Assistance to submit your request
            </p>
          </div>

          <Card className="border-0 shadow-navy" style={{ background: "oklch(0.16 0.045 262)", border: "1px solid oklch(0.26 0.06 260)" }}>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                    Full Name <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    required
                    className="font-body h-11"
                    style={{ background: "oklch(0.20 0.05 262)", borderColor: "oklch(0.30 0.07 260)", color: "oklch(0.93 0.01 240)" }}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                    Email Address <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                    className="font-body h-11"
                    style={{ background: "oklch(0.20 0.05 262)", borderColor: "oklch(0.30 0.07 260)", color: "oklch(0.93 0.01 240)" }}
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                    Password <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      required
                      className="font-body h-11 pr-10"
                      style={{ background: "oklch(0.20 0.05 262)", borderColor: "oklch(0.30 0.07 260)", color: "oklch(0.93 0.01 240)" }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                      style={{ color: "oklch(0.55 0.03 250)" }}
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Country Code + Phone */}
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                    Phone Number <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
                  </Label>
                  <div className="flex gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen((v) => !v)}
                        className="flex items-center gap-1.5 h-11 px-3 rounded-md font-body text-sm border min-w-[120px]"
                        style={{
                          background: "oklch(0.20 0.05 262)",
                          borderColor: "oklch(0.30 0.07 260)",
                          color: "oklch(0.93 0.01 240)"
                        }}
                      >
                        {form.selectedCountry ? (
                          <>
                            <span>{form.selectedCountry.flag}</span>
                            <span className="text-xs">{form.selectedCountry.dialCode}</span>
                          </>
                        ) : (
                          <span className="text-xs" style={{ color: "oklch(0.55 0.03 250)" }}>
                            Code
                          </span>
                        )}
                        <Globe className="h-3 w-3 ml-auto shrink-0" style={{ color: "oklch(0.55 0.03 250)" }} />
                      </button>

                      {dropdownOpen && (
                        <div
                          className="absolute top-full left-0 mt-1 z-50 rounded-lg shadow-xl border overflow-hidden"
                          style={{
                            background: "oklch(0.18 0.05 262)",
                            borderColor: "oklch(0.30 0.07 260)",
                            width: "280px"
                          }}
                        >
                          {/* Search */}
                          <div className="p-2 border-b" style={{ borderColor: "oklch(0.25 0.06 260)" }}>
                            <div className="relative">
                              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "oklch(0.55 0.03 250)" }} />
                              <Input
                                type="text"
                                placeholder="Search country..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="pl-8 h-8 text-xs font-body border-0"
                                style={{ background: "oklch(0.22 0.055 262)", color: "oklch(0.93 0.01 240)" }}
                                autoFocus
                              />
                            </div>
                          </div>
                          {/* Country List */}
                          <div className="overflow-y-auto" style={{ maxHeight: "200px" }}>
                            {filteredCountries.length === 0 ? (
                              <div className="px-3 py-4 text-center text-xs" style={{ color: "oklch(0.55 0.03 250)" }}>
                                No countries found
                              </div>
                            ) : (
                              filteredCountries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => selectCountry(country)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-body hover:bg-white/5 transition-colors"
                                  style={{ color: "oklch(0.85 0.02 240)" }}
                                >
                                  <span className="text-base">{country.flag}</span>
                                  <span className="flex-1 truncate">{country.name}</span>
                                  <span style={{ color: "oklch(0.60 0.08 248)" }}>{country.dialCode}</span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Phone Input */}
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      value={form.phoneNumber}
                      onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                      required
                      className="flex-1 font-body h-11"
                      style={{ background: "oklch(0.20 0.05 262)", borderColor: "oklch(0.30 0.07 260)", color: "oklch(0.93 0.01 240)" }}
                    />
                  </div>

                  {/* Country Name Auto-filled */}
                  {form.selectedCountry && (
                    <p className="text-xs font-body" style={{ color: "oklch(0.60 0.08 248)" }}>
                      Country: {form.selectedCountry.flag} {form.selectedCountry.name}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 font-body font-semibold text-base mt-2"
                  style={{ background: "oklch(0.75 0.12 85)", color: "oklch(0.14 0.04 55)" }}
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Account...</>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                {/* Login Link */}
                <p className="text-center text-sm font-body" style={{ color: "oklch(0.60 0.03 250)" }}>
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold underline underline-offset-2" style={{ color: "oklch(0.75 0.12 85)" }}>
                    Sign In
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
