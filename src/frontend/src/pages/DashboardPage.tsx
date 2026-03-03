import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, CheckCircle, FileText, LogOut, ClipboardList, Send, AlertCircle, CreditCard, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AssistanceStatus, type AssistanceRequest } from "../backend";
import { backendService } from "../services/backendService";
import Footer from "@/components/shared/Footer";

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AssistanceStatus }) {
  const styles: Record<AssistanceStatus, { label: string; bg: string; color: string }> = {
    [AssistanceStatus.pending]: { label: "Pending", bg: "oklch(0.40 0.02 250 / 0.3)", color: "oklch(0.78 0.04 250)" },
    [AssistanceStatus.underReview]: { label: "Under Review", bg: "oklch(0.60 0.15 70 / 0.25)", color: "oklch(0.78 0.15 72)" },
    [AssistanceStatus.approved]: { label: "Approved", bg: "oklch(0.50 0.15 145 / 0.25)", color: "oklch(0.72 0.15 145)" },
    [AssistanceStatus.rejected]: { label: "Rejected", bg: "oklch(0.50 0.20 25 / 0.25)", color: "oklch(0.70 0.20 25)" },
  };
  const s = styles[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

function formatDate(time: bigint): string {
  try {
    const ms = Number(time / 1_000_000n);
    return new Date(ms).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "N/A";
  }
}

// ─── Account fields ───────────────────────────────────────────────────────────
interface AccountFields {
  paypalEmail: string;
  wuFullName: string;
  wuCountry: string;
  bankAccountNumber: string;
  bankName: string;
  bankRoutingNumber: string;
  mobileMoneyNumber: string;
  otherDetails: string;
}

const emptyAccountFields: AccountFields = {
  paypalEmail: "",
  wuFullName: "",
  wuCountry: "",
  bankAccountNumber: "",
  bankName: "",
  bankRoutingNumber: "",
  mobileMoneyNumber: "",
  otherDetails: "",
};

function buildAccountDetailsString(paymentMethod: string, fields: AccountFields): string {
  switch (paymentMethod) {
    case "PayPal":
      return `PayPal Email: ${fields.paypalEmail}`;
    case "Western Union":
      return `Western Union Name: ${fields.wuFullName} | Country: ${fields.wuCountry}`;
    case "Bank Transfer":
      return `Account: ${fields.bankAccountNumber} | Bank: ${fields.bankName} | Routing: ${fields.bankRoutingNumber}`;
    case "Mobile Money":
      return `Mobile Money: ${fields.mobileMoneyNumber}`;
    case "Other":
      return `Details: ${fields.otherDetails}`;
    default:
      return "";
  }
}

function validateAccountFields(paymentMethod: string, fields: AccountFields): string | null {
  switch (paymentMethod) {
    case "PayPal":
      if (!fields.paypalEmail.trim()) return "Please enter your PayPal email address.";
      break;
    case "Western Union":
      if (!fields.wuFullName.trim()) return "Please enter your full name for Western Union.";
      if (!fields.wuCountry.trim()) return "Please enter your country for Western Union.";
      break;
    case "Bank Transfer":
      if (!fields.bankAccountNumber.trim()) return "Please enter your account number.";
      if (!fields.bankName.trim()) return "Please enter your bank name.";
      if (!fields.bankRoutingNumber.trim()) return "Please enter your routing number.";
      break;
    case "Mobile Money":
      if (!fields.mobileMoneyNumber.trim()) return "Please enter your mobile money number.";
      break;
    case "Other":
      if (!fields.otherDetails.trim()) return "Please enter your account details.";
      break;
  }
  return null;
}

const inputStyle = {
  background: "oklch(0.20 0.05 262)",
  borderColor: "oklch(0.30 0.07 260)",
  color: "oklch(0.93 0.01 240)",
};

function AccountDetailsFields({
  paymentMethod,
  fields,
  onChange,
}: {
  paymentMethod: string;
  fields: AccountFields;
  onChange: (partial: Partial<AccountFields>) => void;
}) {
  if (!paymentMethod) return null;

  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ background: "oklch(0.28 0.06 260 / 0.6)" }} />
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5" style={{ color: "oklch(0.65 0.12 248)" }} />
          <span className="text-xs font-body font-semibold uppercase tracking-wider" style={{ color: "oklch(0.60 0.06 248)" }}>
            Account Details
          </span>
        </div>
        <div className="h-px flex-1" style={{ background: "oklch(0.28 0.06 260 / 0.6)" }} />
      </div>

      {paymentMethod === "PayPal" && (
        <div className="space-y-1.5">
          <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
            PayPal Email Address <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
          </Label>
          <Input
            type="email"
            placeholder="your@paypal.com"
            value={fields.paypalEmail}
            onChange={(e) => onChange({ paypalEmail: e.target.value })}
            className="font-body h-10"
            style={inputStyle}
          />
        </div>
      )}

      {paymentMethod === "Western Union" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
              Full Name for Western Union <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
            </Label>
            <Input
              type="text"
              placeholder="Name on Western Union account"
              value={fields.wuFullName}
              onChange={(e) => onChange({ wuFullName: e.target.value })}
              className="font-body h-10"
              style={inputStyle}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
              Country <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
            </Label>
            <Input
              type="text"
              placeholder="Your country"
              value={fields.wuCountry}
              onChange={(e) => onChange({ wuCountry: e.target.value })}
              className="font-body h-10"
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {paymentMethod === "Bank Transfer" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                Account Number <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
              </Label>
              <Input
                type="text"
                placeholder="Your account number"
                value={fields.bankAccountNumber}
                onChange={(e) => onChange({ bankAccountNumber: e.target.value })}
                className="font-body h-10"
                style={inputStyle}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                Bank Name <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
              </Label>
              <Input
                type="text"
                placeholder="Name of your bank"
                value={fields.bankName}
                onChange={(e) => onChange({ bankName: e.target.value })}
                className="font-body h-10"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
              Routing Number / Sort Code / SWIFT <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
            </Label>
            <Input
              type="text"
              placeholder="e.g. 021000021 or BOFAUS3N"
              value={fields.bankRoutingNumber}
              onChange={(e) => onChange({ bankRoutingNumber: e.target.value })}
              className="font-body h-10"
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {paymentMethod === "Mobile Money" && (
        <div className="space-y-1.5">
          <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
            Mobile Money Number / Account <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
          </Label>
          <Input
            type="text"
            placeholder="e.g. +2348012345678"
            value={fields.mobileMoneyNumber}
            onChange={(e) => onChange({ mobileMoneyNumber: e.target.value })}
            className="font-body h-10"
            style={inputStyle}
          />
        </div>
      )}

      {paymentMethod === "Other" && (
        <div className="space-y-1.5">
          <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
            Account Details <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
          </Label>
          <Textarea
            placeholder="Please describe how you'd like to receive payment..."
            value={fields.otherDetails}
            onChange={(e) => onChange({ otherDetails: e.target.value })}
            rows={3}
            className="font-body resize-none"
            style={inputStyle}
          />
        </div>
      )}
    </div>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userEmail = localStorage.getItem("worldpay_user_email") ?? "";

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    country: "",
    reason: "",
    description: "",
    amountRequested: "",
    paymentMethod: "",
  });
  const [accountFields, setAccountFields] = useState<AccountFields>(emptyAccountFields);

  // Read from localStorage directly inside queryFn to avoid stale closure issues
  const { data: requests, isLoading: requestsLoading, refetch } = useQuery<AssistanceRequest[]>({
    queryKey: ["user-requests"],
    queryFn: async () => {
      const e = localStorage.getItem("worldpay_user_email") ?? "";
      const p = localStorage.getItem("worldpay_user_password") ?? "";
      if (!e || !p) return [];
      try {
        return await backendService.getUserRequestsByEmail(e, p);
      } catch {
        // Return empty array on error to avoid crashing the UI
        return [];
      }
    },
    enabled: !!userEmail,
    retry: 1,
  });

  function handleLogout() {
    localStorage.removeItem("worldpay_user_logged_in");
    localStorage.removeItem("worldpay_user_email");
    localStorage.removeItem("worldpay_user_password");
    navigate({ to: "/login" });
  }

  function handlePaymentMethodChange(method: string) {
    setForm((p) => ({ ...p, paymentMethod: method }));
    setAccountFields(emptyAccountFields);
  }

  async function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    const { fullName, country, reason, description, amountRequested, paymentMethod } = form;

    if (!fullName.trim() || !country.trim() || !reason || !description.trim() || !amountRequested.trim() || !paymentMethod) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const accountValidationError = validateAccountFields(paymentMethod, accountFields);
    if (accountValidationError) {
      toast.error(accountValidationError);
      return;
    }

    const accountDetailsString = buildAccountDetailsString(paymentMethod, accountFields);

    setSubmitting(true);
    try {
      const submitterEmail = localStorage.getItem("worldpay_user_email") ?? "";
      await backendService.submitAssistanceRequest(
        submitterEmail,
        fullName.trim(),
        country.trim(),
        reason,
        description.trim(),
        amountRequested.trim(),
        paymentMethod,
        accountDetailsString
      );

      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["user-requests"] });
    } catch (err: unknown) {
      console.error("Submit request error:", err);
      const raw = err instanceof Error ? err.message : String(err);
      const msg = raw.toLowerCase();
      if (msg.includes("not found") || msg.includes("user not found")) {
        toast.error("Your session has expired. Please log out and log back in.");
      } else if (msg.includes("incorrect password") || msg.includes("unauthorized")) {
        toast.error("Authentication failed. Please log out and log back in.");
      } else {
        toast.error("Submission failed. Please check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm({ fullName: "", country: "", reason: "", description: "", amountRequested: "", paymentMethod: "" });
    setAccountFields(emptyAccountFields);
    setSubmitted(false);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.12 0.038 262)" }}>
      {/* Dashboard Header */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "oklch(0.12 0.04 265 / 0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.28 0.06 260 / 0.5)"
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
              <img src="/assets/generated/logo-transparent.dim_200x200.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-display font-bold text-base" style={{ color: "oklch(0.93 0.01 240)" }}>
                World Pay Assistance
              </span>
              <span
                className="ml-2 text-xs font-body px-2 py-0.5 rounded-full"
                style={{ background: "oklch(0.38 0.14 258 / 0.2)", color: "oklch(0.65 0.12 248)" }}
              >
                Dashboard
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="font-body font-medium gap-2"
            style={{ color: "oklch(0.60 0.03 250)" }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl md:text-3xl mb-1" style={{ color: "oklch(0.93 0.01 240)" }}>
            My Portal
          </h1>
          <p className="font-body text-sm" style={{ color: "oklch(0.60 0.03 250)" }}>
            Submit and track your humanitarian assistance requests
          </p>
        </div>

        <Tabs defaultValue="submit">
          <TabsList
            className="mb-8 h-11 p-1 w-full sm:w-auto"
            style={{ background: "oklch(0.17 0.045 262)", border: "1px solid oklch(0.26 0.06 260)" }}
          >
            <TabsTrigger
              value="submit"
              className="font-body font-medium text-sm flex items-center gap-2 flex-1 sm:flex-initial data-[state=active]:shadow-none"
              style={{ color: "oklch(0.65 0.03 250)" }}
            >
              <Send className="h-4 w-4" />
              Submit Request
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="font-body font-medium text-sm flex items-center gap-2 flex-1 sm:flex-initial data-[state=active]:shadow-none"
              style={{ color: "oklch(0.65 0.03 250)" }}
            >
              <ClipboardList className="h-4 w-4" />
              My Requests
              {requests && requests.length > 0 && (
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "oklch(0.75 0.12 85)", color: "oklch(0.14 0.04 55)" }}
                >
                  {requests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Submit Request Tab */}
          <TabsContent value="submit">
            {submitted ? (
              <Card
                className="border-0 text-center py-12"
                style={{ background: "oklch(0.16 0.045 262)", border: "1px solid oklch(0.26 0.06 260)" }}
              >
                <CardContent className="px-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: "oklch(0.50 0.15 145 / 0.2)" }}
                  >
                    <CheckCircle className="h-10 w-10" style={{ color: "oklch(0.72 0.15 145)" }} />
                  </div>
                  <h2 className="font-display font-bold text-2xl mb-3" style={{ color: "oklch(0.93 0.01 240)" }}>
                    Request Submitted!
                  </h2>
                  <p className="font-body text-base mb-2 max-w-md mx-auto" style={{ color: "oklch(0.72 0.03 245)" }}>
                    Your request has been received and is under review.
                  </p>
                  <p className="font-body text-sm mb-8 max-w-md mx-auto" style={{ color: "oklch(0.60 0.03 250)" }}>
                    Our team will review your application and update the status in your portal. You can track your request in the "My Requests" tab.
                  </p>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="font-body font-semibold"
                    style={{ borderColor: "oklch(0.75 0.12 85 / 0.4)", color: "oklch(0.75 0.12 85)" }}
                  >
                    Submit Another Request
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card
                className="border-0"
                style={{ background: "oklch(0.16 0.045 262)", border: "1px solid oklch(0.26 0.06 260)" }}
              >
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="font-display font-bold text-xl" style={{ color: "oklch(0.93 0.01 240)" }}>
                    <FileText className="inline h-5 w-5 mr-2" style={{ color: "oklch(0.75 0.12 85)" }} />
                    Assistance Request Form
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <form onSubmit={handleSubmitRequest} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                          Full Name <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="Your full name"
                          value={form.fullName}
                          onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                          required
                          className="font-body h-10"
                          style={inputStyle}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                          Country <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="Your country"
                          value={form.country}
                          onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                          required
                          className="font-body h-10"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                          Reason for Assistance <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
                        </Label>
                        <Select value={form.reason} onValueChange={(v) => setForm((p) => ({ ...p, reason: v }))}>
                          <SelectTrigger
                            className="font-body h-10"
                            style={{ background: "oklch(0.20 0.05 262)", borderColor: "oklch(0.30 0.07 260)", color: form.reason ? "oklch(0.93 0.01 240)" : "oklch(0.50 0.03 250)" }}
                          >
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent style={{ background: "oklch(0.18 0.05 262)", borderColor: "oklch(0.30 0.07 260)" }}>
                            {["Medical", "Education", "Housing", "Food & Basic Needs", "Disaster Relief", "Other"].map((r) => (
                              <SelectItem key={r} value={r} className="font-body" style={{ color: "oklch(0.85 0.02 240)" }}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                          Amount Requested <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
                        </Label>
                        <Input
                          type="text"
                          placeholder="e.g. $500 USD"
                          value={form.amountRequested}
                          onChange={(e) => setForm((p) => ({ ...p, amountRequested: e.target.value }))}
                          required
                          className="font-body h-10"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                        Description of Need <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
                      </Label>
                      <Textarea
                        placeholder="Please describe your situation and need in detail..."
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        required
                        rows={4}
                        className="font-body resize-none"
                        style={inputStyle}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-body text-sm font-semibold" style={{ color: "oklch(0.80 0.02 240)" }}>
                        Preferred Payment Method <span style={{ color: "oklch(0.75 0.12 85)" }}>*</span>
                      </Label>
                      <Select value={form.paymentMethod} onValueChange={handlePaymentMethodChange}>
                        <SelectTrigger
                          className="font-body h-10"
                          style={{ background: "oklch(0.20 0.05 262)", borderColor: "oklch(0.30 0.07 260)", color: form.paymentMethod ? "oklch(0.93 0.01 240)" : "oklch(0.50 0.03 250)" }}
                        >
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent style={{ background: "oklch(0.18 0.05 262)", borderColor: "oklch(0.30 0.07 260)" }}>
                          {["Bank Transfer", "Mobile Money", "PayPal", "Western Union", "Other"].map((m) => (
                            <SelectItem key={m} value={m} className="font-body" style={{ color: "oklch(0.85 0.02 240)" }}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Dynamic account detail fields */}
                    <AccountDetailsFields
                      paymentMethod={form.paymentMethod}
                      fields={accountFields}
                      onChange={(partial) => setAccountFields((prev) => ({ ...prev, ...partial }))}
                    />

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 font-body font-semibold text-base"
                      style={{ background: "oklch(0.75 0.12 85)", color: "oklch(0.14 0.04 55)" }}
                    >
                      {submitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>
                      ) : (
                        <><Send className="mr-2 h-4 w-4" />Submit Request</>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Requests Tab */}
          <TabsContent value="requests">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl" style={{ color: "oklch(0.93 0.01 240)" }}>
                  My Assistance Requests
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  className="font-body text-xs gap-1.5"
                  style={{ color: "oklch(0.55 0.03 250)" }}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </Button>
              </div>

              {requestsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-40 rounded-xl" style={{ background: "oklch(0.17 0.045 262)" }} />
                  ))}
                </div>
              ) : !requests || requests.length === 0 ? (
                <Card
                  className="border-0 text-center py-14"
                  style={{ background: "oklch(0.16 0.045 262)", border: "1px solid oklch(0.26 0.06 260)" }}
                >
                  <CardContent>
                    <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: "oklch(0.45 0.04 250)" }} />
                    <p className="font-display font-semibold text-lg mb-2" style={{ color: "oklch(0.70 0.03 245)" }}>
                      No Requests Yet
                    </p>
                    <p className="font-body text-sm" style={{ color: "oklch(0.55 0.03 250)" }}>
                      You haven't submitted any assistance requests. Use the "Submit Request" tab to get started.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <Card
                      key={String(req.id)}
                      className="border-0"
                      style={{ background: "oklch(0.16 0.045 262)", border: "1px solid oklch(0.26 0.06 260)" }}
                    >
                      <CardContent className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                          <div>
                            <h3 className="font-display font-bold text-base" style={{ color: "oklch(0.93 0.01 240)" }}>
                              {req.fullName}
                            </h3>
                            <p className="font-body text-xs mt-0.5" style={{ color: "oklch(0.55 0.03 250)" }}>
                              Request #{String(req.id)} · Submitted {formatDate(req.submissionDate)}
                            </p>
                          </div>
                          <StatusBadge status={req.status} />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.50 0.04 250)" }}>Country</p>
                            <p className="text-sm font-body font-medium" style={{ color: "oklch(0.80 0.02 240)" }}>{req.country}</p>
                          </div>
                          <div>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.50 0.04 250)" }}>Reason</p>
                            <p className="text-sm font-body font-medium" style={{ color: "oklch(0.80 0.02 240)" }}>{req.reason}</p>
                          </div>
                          <div>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.50 0.04 250)" }}>Amount</p>
                            <p className="text-sm font-body font-medium" style={{ color: "oklch(0.80 0.13 85)" }}>{req.amountRequested}</p>
                          </div>
                          <div>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.50 0.04 250)" }}>Payment</p>
                            <p className="text-sm font-body font-medium" style={{ color: "oklch(0.80 0.02 240)" }}>{req.paymentMethod}</p>
                          </div>
                        </div>

                        {req.accountDetails && (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: "oklch(0.24 0.055 260 / 0.5)" }}>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.50 0.04 250)" }}>Account Details</p>
                            <p className="text-sm font-body font-medium" style={{ color: "oklch(0.70 0.06 248)" }}>{req.accountDetails}</p>
                          </div>
                        )}

                        {req.description && (
                          <div className="mt-3 pt-3 border-t" style={{ borderColor: "oklch(0.24 0.055 260 / 0.5)" }}>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.50 0.04 250)" }}>Description</p>
                            <p className="text-sm font-body leading-relaxed" style={{ color: "oklch(0.70 0.03 245)" }}>
                              {req.description}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
