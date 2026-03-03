import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, LogOut, Shield, Users, ClipboardList, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AssistanceStatus, type AssistanceRequest, type User } from "../backend";
import { backendService } from "../services/backendService";

// Hardcoded admin credentials — used directly so admin panel always works
const ADMIN_EMAIL = "adebayoaminahanike@gmail.com";
const ADMIN_PASSWORD = "Anike4402";

function getAdminCredentials(): { email: string; password: string } {
  return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
}

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
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-semibold whitespace-nowrap"
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

function RequestStatusUpdater({ request }: { request: AssistanceRequest }) {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);
  const [selected, setSelected] = useState<AssistanceStatus>(request.status);

  async function handleUpdate() {
    if (selected === request.status) {
      toast.info("Status is already set to this value.");
      return;
    }
    setUpdating(true);
    const { email, password } = getAdminCredentials();
    try {
      await backendService.adminUpdateRequestStatus(email, password, request.id, selected);
      toast.success(`Request #${String(request.id)} status updated to "${selected}".`);
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={selected} onValueChange={(v) => setSelected(v as AssistanceStatus)}>
        <SelectTrigger
          className="h-8 w-36 font-body text-xs"
          style={{ background: "oklch(0.22 0.055 262)", borderColor: "oklch(0.30 0.07 260)", color: "oklch(0.85 0.02 240)" }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent style={{ background: "oklch(0.18 0.05 262)", borderColor: "oklch(0.30 0.07 260)" }}>
          <SelectItem value={AssistanceStatus.pending} className="font-body text-xs" style={{ color: "oklch(0.85 0.02 240)" }}>Pending</SelectItem>
          <SelectItem value={AssistanceStatus.underReview} className="font-body text-xs" style={{ color: "oklch(0.85 0.02 240)" }}>Under Review</SelectItem>
          <SelectItem value={AssistanceStatus.approved} className="font-body text-xs" style={{ color: "oklch(0.85 0.02 240)" }}>Approved</SelectItem>
          <SelectItem value={AssistanceStatus.rejected} className="font-body text-xs" style={{ color: "oklch(0.85 0.02 240)" }}>Rejected</SelectItem>
        </SelectContent>
      </Select>
      <Button
        size="sm"
        onClick={handleUpdate}
        disabled={updating}
        className="h-8 font-body text-xs font-semibold"
        style={{ background: "oklch(0.38 0.14 258)", color: "oklch(0.96 0.005 240)" }}
      >
        {updating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Update"}
      </Button>
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { email, password } = getAdminCredentials();

  useEffect(() => {
    // Check localStorage flag — set by admin login page
    const isLoggedIn = localStorage.getItem("worldpay_admin_logged_in") === "true";
    if (!isLoggedIn) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["admin-users", email],
    queryFn: () => backendService.adminGetAllUsers(email, password),
    enabled: !!email && !!password,
    retry: 3,
    retryDelay: (attempt) => attempt * 1000,
  });

  const { data: userCount } = useQuery<bigint>({
    queryKey: ["admin-user-count", email],
    queryFn: () => backendService.adminGetTotalUserCount(email, password),
    enabled: !!email && !!password,
    retry: 3,
    retryDelay: (attempt) => attempt * 1000,
  });

  const { data: requests, isLoading: requestsLoading } = useQuery<AssistanceRequest[]>({
    queryKey: ["admin-requests", email],
    queryFn: () => backendService.adminGetAllRequests(email, password),
    enabled: !!email && !!password,
    retry: 3,
    retryDelay: (attempt) => attempt * 1000,
  });

  function handleLogout() {
    localStorage.removeItem("worldpay_admin_logged_in");
    localStorage.removeItem("worldpay_admin_email");
    localStorage.removeItem("worldpay_admin_password");
    navigate({ to: "/admin/login" });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.10 0.038 262)" }}>
      {/* Admin Header */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "oklch(0.10 0.04 265 / 0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.25 0.065 260 / 0.6)"
        }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.38 0.14 258 / 0.2)" }}
            >
              <Shield className="h-5 w-5" style={{ color: "oklch(0.65 0.12 248)" }} />
            </div>
            <div>
              <span className="font-display font-bold text-base" style={{ color: "oklch(0.93 0.01 240)" }}>
                Admin Panel
              </span>
              <span
                className="ml-2 text-xs font-body px-2 py-0.5 rounded-full"
                style={{ background: "oklch(0.38 0.14 258 / 0.2)", color: "oklch(0.65 0.12 248)" }}
              >
                World Pay Assistance
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

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl md:text-3xl mb-1" style={{ color: "oklch(0.93 0.01 240)" }}>
            Administration Centre
          </h1>
          <p className="font-body text-sm" style={{ color: "oklch(0.55 0.03 250)" }}>
            Manage users and assistance requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: userCount !== undefined ? String(userCount) : "...",
              icon: Users,
              accent: "oklch(0.65 0.12 248)"
            },
            {
              label: "Total Requests",
              value: requests ? String(requests.length) : "...",
              icon: ClipboardList,
              accent: "oklch(0.75 0.12 85)"
            },
            {
              label: "Approved",
              value: requests ? String(requests.filter(r => r.status === AssistanceStatus.approved).length) : "...",
              icon: ClipboardList,
              accent: "oklch(0.72 0.15 145)"
            },
            {
              label: "Pending Review",
              value: requests ? String(requests.filter(r => r.status === AssistanceStatus.pending || r.status === AssistanceStatus.underReview).length) : "...",
              icon: ClipboardList,
              accent: "oklch(0.78 0.15 72)"
            },
          ].map(({ label, value, icon: Icon, accent }) => (
            <Card
              key={label}
              className="border-0"
              style={{ background: "oklch(0.15 0.045 262)", border: "1px solid oklch(0.24 0.06 260)" }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4" style={{ color: accent }} />
                  <span className="text-xs font-body uppercase tracking-wide" style={{ color: "oklch(0.55 0.03 250)" }}>{label}</span>
                </div>
                <p className="font-display font-bold text-3xl" style={{ color: "oklch(0.93 0.01 240)" }}>
                  {value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users">
          <TabsList
            className="mb-8 h-11 p-1"
            style={{ background: "oklch(0.16 0.045 262)", border: "1px solid oklch(0.26 0.06 260)" }}
          >
            <TabsTrigger
              value="users"
              className="font-body font-medium text-sm flex items-center gap-2 data-[state=active]:shadow-none"
              style={{ color: "oklch(0.65 0.03 250)" }}
            >
              <Users className="h-4 w-4" />
              Users
              {userCount !== undefined && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "oklch(0.38 0.14 258 / 0.3)", color: "oklch(0.65 0.12 248)" }}
                >
                  {String(userCount)}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="font-body font-medium text-sm flex items-center gap-2 data-[state=active]:shadow-none"
              style={{ color: "oklch(0.65 0.03 250)" }}
            >
              <ClipboardList className="h-4 w-4" />
              Requests
              {requests && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "oklch(0.75 0.12 85 / 0.2)", color: "oklch(0.80 0.13 85)" }}
                >
                  {requests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card
              className="border-0"
              style={{ background: "oklch(0.14 0.042 262)", border: "1px solid oklch(0.24 0.06 260)" }}
            >
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="font-display font-bold text-lg" style={{ color: "oklch(0.93 0.01 240)" }}>
                  Registered Users
                  {userCount !== undefined && (
                    <span
                      className="ml-3 text-sm font-body font-normal px-2.5 py-0.5 rounded-full"
                      style={{ background: "oklch(0.38 0.14 258 / 0.2)", color: "oklch(0.65 0.12 248)" }}
                    >
                      Total: {String(userCount)}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {usersLoading ? (
                  <div className="px-6 pb-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12" style={{ background: "oklch(0.18 0.05 262)" }} />
                    ))}
                  </div>
                ) : !users || users.length === 0 ? (
                  <div className="px-6 pb-10 text-center">
                    <AlertCircle className="h-10 w-10 mx-auto mb-3 mt-4" style={{ color: "oklch(0.40 0.04 250)" }} />
                    <p className="font-body text-sm" style={{ color: "oklch(0.55 0.03 250)" }}>No users registered yet.</p>
                  </div>
                ) : (
                  <div className="px-4 pb-6 space-y-4">
                    {users.map((user, idx) => (
                      <div
                        key={String(user.id)}
                        className="rounded-xl p-5 mb-4"
                        style={{
                          background: "oklch(0.18 0.045 262)",
                          border: "1px solid oklch(0.28 0.065 260)"
                        }}
                      >
                        {/* Card Header: #N — Full Name + badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span
                            className="font-display font-bold text-lg"
                            style={{ color: "oklch(0.93 0.01 240)" }}
                          >
                            #{idx + 1} — {user.fullName}
                          </span>
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-semibold"
                            style={{ background: "oklch(0.35 0.12 145)", color: "oklch(0.96 0.005 145)" }}
                          >
                            Phone ✓
                          </span>
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-body font-semibold"
                            style={{ background: "oklch(0.35 0.12 145)", color: "oklch(0.96 0.005 145)" }}
                          >
                            Email ✓
                          </span>
                        </div>

                        {/* Detail rows */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                          {[
                            { label: "Phone", value: `${user.countryCode} ${user.phoneNumber}` },
                            { label: "Country", value: user.countryName },
                            { label: "Email", value: user.email },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex items-baseline gap-1.5">
                              <span
                                className="text-sm font-body shrink-0"
                                style={{ color: "oklch(0.55 0.03 250)" }}
                              >
                                {label}:
                              </span>
                              <span
                                className="text-sm font-body font-bold break-all"
                                style={{ color: "oklch(0.90 0.01 240)" }}
                              >
                                {value || "—"}
                              </span>
                            </div>
                          ))}

                          {/* Password in monospace amber */}
                          <div className="flex items-baseline gap-1.5">
                            <span
                              className="text-sm font-body shrink-0"
                              style={{ color: "oklch(0.55 0.03 250)" }}
                            >
                              Password:
                            </span>
                            <span
                              className="text-sm font-mono font-bold break-all"
                              style={{ color: "oklch(0.78 0.15 72)" }}
                            >
                              {user.password || "—"}
                            </span>
                          </div>

                          {[
                            { label: "Device Type", value: user.deviceType },
                            { label: "Browser", value: user.browser },
                            { label: "OS", value: user.os },
                            { label: "IP Address", value: user.ipAddress },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex items-baseline gap-1.5">
                              <span
                                className="text-sm font-body shrink-0"
                                style={{ color: "oklch(0.55 0.03 250)" }}
                              >
                                {label}:
                              </span>
                              <span
                                className="text-sm font-body font-bold break-all"
                                style={{ color: "oklch(0.90 0.01 240)" }}
                              >
                                {value || "—"}
                              </span>
                            </div>
                          ))}

                          {/* Registration Date */}
                          <div className="flex items-baseline gap-1.5">
                            <span
                              className="text-sm font-body shrink-0"
                              style={{ color: "oklch(0.55 0.03 250)" }}
                            >
                              Registration Date:
                            </span>
                            <span
                              className="text-sm font-body font-bold"
                              style={{ color: "oklch(0.90 0.01 240)" }}
                            >
                              {formatDate(user.registrationDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests">
            <Card
              className="border-0"
              style={{ background: "oklch(0.14 0.042 262)", border: "1px solid oklch(0.24 0.06 260)" }}
            >
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="font-display font-bold text-lg" style={{ color: "oklch(0.93 0.01 240)" }}>
                  Assistance Requests
                  {requests && (
                    <span
                      className="ml-3 text-sm font-body font-normal px-2.5 py-0.5 rounded-full"
                      style={{ background: "oklch(0.75 0.12 85 / 0.15)", color: "oklch(0.80 0.13 85)" }}
                    >
                      Total: {requests.length}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {requestsLoading ? (
                  <div className="px-6 pb-6 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12" style={{ background: "oklch(0.18 0.05 262)" }} />
                    ))}
                  </div>
                ) : !requests || requests.length === 0 ? (
                  <div className="px-6 pb-10 text-center">
                    <AlertCircle className="h-10 w-10 mx-auto mb-3 mt-4" style={{ color: "oklch(0.40 0.04 250)" }} />
                    <p className="font-body text-sm" style={{ color: "oklch(0.55 0.03 250)" }}>No assistance requests submitted yet.</p>
                  </div>
                ) : (
                  <div className="px-4 pb-6 space-y-4">
                    {requests.map((req) => (
                      <div
                        key={String(req.id)}
                        className="rounded-xl p-5"
                        style={{ background: "oklch(0.17 0.045 262)", border: "1px solid oklch(0.25 0.06 260)" }}
                      >
                        {/* Header row */}
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-xs font-body font-semibold px-2 py-0.5 rounded"
                                style={{ background: "oklch(0.22 0.055 260)", color: "oklch(0.60 0.04 250)" }}
                              >
                                ID #{String(req.id)}
                              </span>
                              <StatusBadge status={req.status} />
                            </div>
                            <h3 className="font-display font-bold text-base" style={{ color: "oklch(0.93 0.01 240)" }}>
                              {req.fullName}
                            </h3>
                            <p className="font-body text-xs" style={{ color: "oklch(0.50 0.03 250)" }}>
                              Submitted {formatDate(req.submissionDate)}
                            </p>
                          </div>
                          <RequestStatusUpdater request={req} />
                        </div>

                        {/* Details grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                          <div>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.45 0.04 250)" }}>Country</p>
                            <p className="text-sm font-body font-medium" style={{ color: "oklch(0.80 0.02 240)" }}>{req.country}</p>
                          </div>
                          <div>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.45 0.04 250)" }}>Reason</p>
                            <p className="text-sm font-body font-medium" style={{ color: "oklch(0.80 0.02 240)" }}>{req.reason}</p>
                          </div>
                          <div>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.45 0.04 250)" }}>Amount</p>
                            <p className="text-sm font-body font-medium" style={{ color: "oklch(0.80 0.13 85)" }}>{req.amountRequested}</p>
                          </div>
                          <div>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.45 0.04 250)" }}>Payment</p>
                            <p className="text-sm font-body font-medium" style={{ color: "oklch(0.80 0.02 240)" }}>{req.paymentMethod}</p>
                          </div>
                        </div>

                        {req.accountDetails && (
                          <div className="pt-3 border-t mb-3" style={{ borderColor: "oklch(0.23 0.055 260 / 0.5)" }}>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.45 0.04 250)" }}>Account Details</p>
                            <p className="text-sm font-body font-medium" style={{ color: "oklch(0.72 0.10 248)" }}>
                              {req.accountDetails}
                            </p>
                          </div>
                        )}

                        {req.description && (
                          <div className="pt-3 border-t" style={{ borderColor: "oklch(0.23 0.055 260 / 0.5)" }}>
                            <p className="text-xs font-body uppercase tracking-wide mb-1" style={{ color: "oklch(0.45 0.04 250)" }}>Description</p>
                            <p className="text-sm font-body leading-relaxed" style={{ color: "oklch(0.68 0.03 245)" }}>
                              {req.description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer
        className="py-4 text-center"
        style={{ borderTop: "1px solid oklch(0.20 0.05 260 / 0.5)" }}
      >
        <p className="text-xs font-body" style={{ color: "oklch(0.38 0.03 250)" }}>
          World Pay Assistance Admin Panel · Built with{" "}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "oklch(0.50 0.05 250)" }}>
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
