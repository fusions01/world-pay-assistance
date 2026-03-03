import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.12 0.038 262)" }}>
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-10">
          <h1 className="font-display font-bold text-4xl mb-3" style={{ color: "oklch(0.93 0.01 240)" }}>
            Privacy Policy
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
              title: "1. Information We Collect",
              content: `We collect information you provide directly to us when you register for an account or submit an assistance request. This includes your full name, email address, phone number, country of residence, and details about your assistance needs. We also collect information about how you use the platform, including log data, device information, and usage patterns.`
            },
            {
              title: "2. How We Use Your Information",
              content: `We use the information we collect to process your assistance requests and manage your account; to communicate with you about your requests and account status; to improve and optimize our platform; to detect and prevent fraud, abuse, and other harmful activities; and to comply with legal obligations. We do not sell your personal information to third parties.`
            },
            {
              title: "3. Information Sharing",
              content: `We may share your information with our administrative staff who need access to process your requests. We may also share information when required by law or legal process, to protect the rights, property, or safety of World Pay Assistance, our users, or others, and with your consent or at your direction. We implement appropriate safeguards for any data sharing arrangements.`
            },
            {
              title: "4. Data Security",
              content: `We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no internet transmission is completely secure. We encourage you to use strong, unique passwords for your account and to keep your login credentials confidential. Please notify us immediately if you suspect any unauthorized access to your account.`
            },
            {
              title: "5. Data Retention",
              content: `We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including to satisfy any legal, accounting, or reporting requirements. When determining the appropriate retention period, we consider the amount, nature, and sensitivity of the data, and the potential risk of harm from unauthorized use or disclosure.`
            },
            {
              title: "6. Your Rights",
              content: `Depending on your location, you may have certain rights regarding your personal information, including the right to access the personal information we hold about you; to request correction of inaccurate data; to request deletion of your data in certain circumstances; and to object to or restrict certain processing activities. To exercise these rights, please contact us through the platform.`
            },
            {
              title: "7. Cookies and Tracking",
              content: `We use local storage and session storage technologies to maintain your login session and remember your preferences. We do not use third-party tracking cookies or advertising pixels. You can clear your browser's local storage at any time, which will log you out of the platform.`
            },
            {
              title: "8. International Data Transfers",
              content: `As a global platform, your information may be processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place to protect your information.`
            },
            {
              title: "9. Children's Privacy",
              content: `Our platform is not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.`
            },
            {
              title: "10. Changes to This Policy",
              content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on the platform and updating the "last updated" date. Your continued use of the platform after any changes constitutes your acceptance of the updated policy.`
            },
            {
              title: "11. Contact Us",
              content: `If you have any questions about this Privacy Policy or our data practices, please contact us through the platform's official communication channels. We take privacy concerns seriously and will respond to your inquiries promptly.`
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
