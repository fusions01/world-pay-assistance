import { createRouter, createRoute, createRootRoute, Outlet, RouterProvider, redirect } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPanel from "./pages/AdminPanel";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Toaster richColors position="top-right" />
      <Outlet />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => {
    const isLoggedIn = localStorage.getItem("worldpay_user_logged_in") === "true";
    if (!isLoggedIn) {
      throw redirect({ to: "/login" });
    }
  },
  component: DashboardPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: () => {
    const isAdmin = localStorage.getItem("worldpay_admin_logged_in") === "true";
    const hasEmail = !!localStorage.getItem("worldpay_admin_email");
    const hasPassword = !!localStorage.getItem("worldpay_admin_password");
    if (!isAdmin || !hasEmail || !hasPassword) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminPanel,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  dashboardRoute,
  adminLoginRoute,
  adminRoute,
  termsRoute,
  privacyRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
