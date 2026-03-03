import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("worldpay_user_logged_in") === "true";

  function handleLogout() {
    localStorage.removeItem("worldpay_user_logged_in");
    navigate({ to: "/login" });
  }

  return (
    <header className="sticky top-0 z-50 w-full" style={{
      background: "oklch(0.12 0.04 265 / 0.97)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid oklch(0.28 0.06 260 / 0.5)"
    }}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-gold/40">
              <img
                src="/assets/generated/logo-transparent.dim_200x200.png"
                alt="World Pay Assistance"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-display font-bold text-lg leading-tight" style={{ color: "oklch(0.93 0.01 240)" }}>
                World Pay
              </span>
              <br />
              <span className="text-xs font-body font-medium tracking-wider uppercase" style={{ color: "oklch(0.75 0.12 85)" }}>
                Assistance
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-body font-medium transition-colors hover:text-gold-DEFAULT" style={{ color: "oklch(0.80 0.02 240)" }}>
              Home
            </Link>
            <button
              type="button"
              className="text-sm font-body font-medium transition-colors hover:text-gold-DEFAULT bg-transparent border-none p-0 cursor-pointer"
              style={{ color: "oklch(0.80 0.02 240)" }}
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            >
              About
            </button>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-sm font-body font-medium transition-colors" style={{ color: "oklch(0.80 0.02 240)" }}>
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-gold/40 text-gold-DEFAULT hover:bg-gold/10"
                  style={{ borderColor: "oklch(0.75 0.12 85 / 0.4)", color: "oklch(0.75 0.12 85)" }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-body font-medium transition-colors" style={{ color: "oklch(0.80 0.02 240)" }}>
                  Login
                </Link>
                <Button
                  asChild
                  size="sm"
                  className="font-body font-semibold"
                  style={{ background: "oklch(0.75 0.12 85)", color: "oklch(0.14 0.04 55)" }}
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "oklch(0.80 0.02 240)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden mt-3 py-4 border-t flex flex-col gap-3"
            style={{ borderColor: "oklch(0.28 0.06 260 / 0.5)" }}
          >
            <Link
              to="/"
              className="text-sm font-body font-medium px-2 py-1"
              style={{ color: "oklch(0.80 0.02 240)" }}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <button
              type="button"
              className="text-sm font-body font-medium px-2 py-1 text-left"
              style={{ color: "oklch(0.80 0.02 240)" }}
              onClick={() => {
                setMenuOpen(false);
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              About
            </button>
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-body font-medium px-2 py-1"
                  style={{ color: "oklch(0.80 0.02 240)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="mx-2"
                  style={{ borderColor: "oklch(0.75 0.12 85 / 0.4)", color: "oklch(0.75 0.12 85)" }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-body font-medium px-2 py-1"
                  style={{ color: "oklch(0.80 0.02 240)" }}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <div className="px-2">
                  <Button
                    asChild
                    size="sm"
                    className="w-full font-body font-semibold"
                    style={{ background: "oklch(0.75 0.12 85)", color: "oklch(0.14 0.04 55)" }}
                  >
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
