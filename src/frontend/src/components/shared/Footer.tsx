import { Link } from "@tanstack/react-router";
import { Heart, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="w-full py-10 mt-auto"
      style={{
        background: "oklch(0.11 0.04 262)",
        borderTop: "1px solid oklch(0.22 0.055 260 / 0.6)"
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                <img
                  src="/assets/generated/logo-transparent.dim_200x200.png"
                  alt="World Pay Assistance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-display font-bold text-base leading-tight" style={{ color: "oklch(0.93 0.01 240)" }}>
                  World Pay Assistance
                </span>
              </div>
            </div>
            <p className="text-sm font-body leading-relaxed" style={{ color: "oklch(0.60 0.03 250)" }}>
              A transparent humanitarian support request platform helping individuals worldwide access financial assistance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-3 uppercase tracking-wider" style={{ color: "oklch(0.75 0.12 85)" }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm font-body transition-colors hover:text-gold" style={{ color: "oklch(0.60 0.03 250)" }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm font-body transition-colors hover:text-gold" style={{ color: "oklch(0.60 0.03 250)" }}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm font-body transition-colors hover:text-gold" style={{ color: "oklch(0.60 0.03 250)" }}>
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm font-body transition-colors hover:text-gold" style={{ color: "oklch(0.60 0.03 250)" }}>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-3 uppercase tracking-wider" style={{ color: "oklch(0.75 0.12 85)" }}>
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm font-body transition-colors hover:text-gold" style={{ color: "oklch(0.60 0.03 250)" }}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm font-body transition-colors hover:text-gold" style={{ color: "oklch(0.60 0.03 250)" }}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "oklch(0.22 0.055 260 / 0.6)" }}
        >
          <p className="text-xs font-body" style={{ color: "oklch(0.50 0.02 250)" }}>
            © 2026 World Pay Assistance. All rights reserved.
          </p>
          <p className="text-xs font-body flex items-center gap-1" style={{ color: "oklch(0.50 0.02 250)" }}>
            Built with <Heart className="h-3 w-3 inline" style={{ color: "oklch(0.75 0.12 85)" }} /> using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors"
              style={{ color: "oklch(0.65 0.10 85)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
