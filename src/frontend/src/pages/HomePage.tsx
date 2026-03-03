import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Globe, FileText, CheckCircle, Shield, Users, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.12 0.038 262)" }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "500px" }}>
        <img
          src="/assets/generated/hero-world-map.dim_1200x500.jpg"
          alt="World Map"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, oklch(0.10 0.04 265 / 0.92) 0%, oklch(0.16 0.06 258 / 0.82) 60%, oklch(0.12 0.04 260 / 0.88) 100%)"
          }}
        />

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-24 md:py-36 flex flex-col items-center text-center">
          <div className="animate-fade-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-body font-semibold uppercase tracking-widest mb-6"
              style={{
                background: "oklch(0.75 0.12 85 / 0.15)",
                border: "1px solid oklch(0.75 0.12 85 / 0.35)",
                color: "oklch(0.85 0.10 88)"
              }}
            >
              <Globe className="h-3.5 w-3.5" />
              Global Humanitarian Platform
            </div>

            <h1
              className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 max-w-3xl"
              style={{ color: "oklch(0.96 0.005 240)" }}
            >
              Global Humanitarian{" "}
              <span style={{ color: "oklch(0.80 0.13 85)" }}>Assistance</span>
            </h1>

            <p
              className="font-body text-lg md:text-xl mb-10 max-w-2xl leading-relaxed"
              style={{ color: "oklch(0.78 0.03 240)" }}
            >
              Providing support to those in need around the world. A transparent, secure, and dignified platform for financial assistance requests.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="font-body font-semibold text-base px-8"
                style={{ background: "oklch(0.75 0.12 85)", color: "oklch(0.14 0.04 55)" }}
              >
                <Link to="/signup">Apply for Assistance</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-body font-semibold text-base px-8"
                style={{ borderColor: "oklch(0.75 0.12 85 / 0.5)", color: "oklch(0.85 0.10 88)", background: "transparent" }}
              >
                <Link to="/login">Login to Portal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="about" className="py-20" aria-label="About">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div
              className="inline-block text-xs font-body font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "oklch(0.75 0.12 85 / 0.15)", color: "oklch(0.80 0.13 85)" }}
            >
              Our Mission
            </div>
            <h2
              className="font-display font-bold text-3xl md:text-4xl mb-6"
              style={{ color: "oklch(0.93 0.01 240)" }}
            >
              Bridging the Gap Between Need and Support
            </h2>
            <p
              className="font-body text-base md:text-lg leading-relaxed"
              style={{ color: "oklch(0.65 0.03 250)" }}
            >
              World Pay Assistance is a transparent humanitarian support request platform dedicated to helping individuals worldwide access financial assistance. We believe that everyone, regardless of their location or circumstance, deserves dignity and the opportunity to receive help when they need it most. Our platform connects those in need with a structured, fair, and transparent review process.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Transparent Process",
                desc: "Every request is reviewed openly. You can track your application status in real time through your personal portal."
              },
              {
                icon: Users,
                title: "Global Reach",
                desc: "We serve individuals from over 190 countries, providing assistance across all continents and communities."
              },
              {
                icon: Heart,
                title: "Human-Centered",
                desc: "Our team reviews each application with care and compassion, ensuring fair consideration for all requests."
              }
            ].map(({ icon: Icon, title, desc }) => (
              <Card
                key={title}
                className="border-0 animate-fade-up"
                style={{ background: "oklch(0.17 0.045 260)", border: "1px solid oklch(0.26 0.06 260)" }}
              >
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "oklch(0.75 0.12 85 / 0.15)" }}
                  >
                    <Icon className="h-6 w-6" style={{ color: "oklch(0.80 0.13 85)" }} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2" style={{ color: "oklch(0.93 0.01 240)" }}>
                    {title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: "oklch(0.60 0.03 250)" }}>
                    {desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" style={{ background: "oklch(0.14 0.042 262)" }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div
              className="inline-block text-xs font-body font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: "oklch(0.38 0.14 258 / 0.2)", color: "oklch(0.65 0.12 248)" }}
            >
              How It Works
            </div>
            <h2
              className="font-display font-bold text-3xl md:text-4xl"
              style={{ color: "oklch(0.93 0.01 240)" }}
            >
              Three Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                icon: Users,
                title: "Register",
                desc: "Create your account with your name, email, and phone number. It only takes a few minutes to get started."
              },
              {
                step: "02",
                icon: FileText,
                title: "Submit Request",
                desc: "Fill out your assistance request form with details about your need, amount requested, and preferred payment method."
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Await Review",
                desc: "Our team reviews your application carefully. Track your application status — Pending, Under Review, Approved, or Rejected — in your dashboard."
              }
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative"
                  style={{ background: "oklch(0.38 0.14 258 / 0.2)", border: "1px solid oklch(0.45 0.12 258 / 0.3)" }}
                >
                  <Icon className="h-8 w-8" style={{ color: "oklch(0.65 0.12 248)" }} />
                  <span
                    className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold"
                    style={{ background: "oklch(0.75 0.12 85)", color: "oklch(0.14 0.04 55)" }}
                  >
                    {step.replace("0", "")}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl mb-3" style={{ color: "oklch(0.93 0.01 240)" }}>
                  {title}
                </h3>
                <p className="font-body text-sm leading-relaxed max-w-xs" style={{ color: "oklch(0.60 0.03 250)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div
            className="max-w-3xl mx-auto text-center rounded-2xl p-10 md:p-16"
            style={{
              background: "linear-gradient(135deg, oklch(0.17 0.06 262) 0%, oklch(0.22 0.08 255) 100%)",
              border: "1px solid oklch(0.30 0.08 258 / 0.5)"
            }}
          >
            <Globe className="h-12 w-12 mx-auto mb-6" style={{ color: "oklch(0.75 0.12 85)" }} />
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4" style={{ color: "oklch(0.93 0.01 240)" }}>
              Ready to Apply?
            </h2>
            <p className="font-body text-base mb-8 leading-relaxed" style={{ color: "oklch(0.65 0.03 250)" }}>
              Join thousands of individuals who have trusted World Pay Assistance for humanitarian support. Register today and submit your application.
            </p>
            <Button
              asChild
              size="lg"
              className="font-body font-semibold px-10 text-base"
              style={{ background: "oklch(0.75 0.12 85)", color: "oklch(0.14 0.04 55)" }}
            >
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
