import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.12 0.038 262)" }}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="font-display font-bold text-4xl mb-3" style={{ color: "oklch(0.93 0.01 240)" }}>
            Terms of Service
          </h1>
          <p className="font-body text-sm" style={{ color: "oklch(0.55 0.03 250)" }}>
            Last updated: February 2026
          </p>
        </div>

        <div
          className="rounded-2xl p-8 space-y-8"
          style={{ background: "oklch(0.15 0.042 262)", border: "1px solid oklch(0.24 0.06 260)" }}
        >
          {[
            {
              title: "1. Acceptance of Terms",
              content: `By accessing and using World Pay Assistance ("the Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. World Pay Assistance reserves the right to modify these terms at any time, and your continued use of the platform constitutes acceptance of any changes.`
            },
            {
              title: "2. Platform Description",
              content: `World Pay Assistance is a humanitarian support request platform that allows individuals worldwide to submit requests for financial assistance. The platform facilitates the review and processing of these requests. We do not guarantee approval of any request, and all decisions are made at the sole discretion of our administrative team.`
            },
            {
              title: "3. Eligibility",
              content: `To use this platform, you must be at least 18 years of age and provide accurate, truthful information during registration and when submitting assistance requests. You must have the legal capacity to enter into binding agreements in your jurisdiction. Submitting false or misleading information may result in permanent suspension of your account.`
            },
            {
              title: "4. User Accounts",
              content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms or engage in fraudulent activity.`
            },
            {
              title: "5. Assistance Request Process",
              content: `Submitting a request does not guarantee approval or disbursement of funds. All requests are subject to review and verification by our administrative team. The review process may take varying amounts of time depending on the volume of requests and available resources. We reserve the right to request additional documentation or information to verify your request.`
            },
            {
              title: "6. Prohibited Uses",
              content: `You agree not to use the platform for any fraudulent or deceptive purposes, to submit false or misleading information, to impersonate any person or entity, to interfere with the operation of the platform, or to engage in any activity that violates applicable local, national, or international laws.`
            },
            {
              title: "7. Limitation of Liability",
              content: `World Pay Assistance shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of, or inability to use, the platform. Our liability shall be limited to the maximum extent permitted by applicable law.`
            },
            {
              title: "8. Privacy",
              content: `Your use of the platform is also governed by our Privacy Policy, which is incorporated by reference into these Terms of Service. Please review our Privacy Policy to understand our practices regarding your personal information.`
            },
            {
              title: "9. Governing Law",
              content: `These Terms of Service shall be governed by and construed in accordance with applicable international humanitarian law and the laws of the jurisdiction in which World Pay Assistance operates. Any disputes shall be resolved through good faith negotiation or, if necessary, binding arbitration.`
            },
            {
              title: "10. Contact Us",
              content: `If you have any questions about these Terms of Service, please contact us through the platform's official communication channels. We are committed to transparency and will respond to all inquiries in a timely manner.`
            },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="font-display font-bold text-xl mb-3" style={{ color: "oklch(0.88 0.01 240)" }}>
                {title}
              </h2>
              <p className="font-body text-sm leading-relaxed" style={{ color: "oklch(0.65 0.03 250)" }}>
                {content}
              </p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
