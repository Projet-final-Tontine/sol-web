import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth";
import { AppShell } from "@/components/layout/AppShell";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const ForbiddenPage = lazy(() => import("@/features/auth/pages/ForbiddenPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const MembersPage = lazy(() => import("@/features/members/pages/MembersPage"));
const TontinesPage = lazy(() => import("@/features/tontines/pages/TontinesPage"));
const TontineDetailPage = lazy(() => import("@/features/tontines/pages/TontineDetailPage"));
const TransactionsPage = lazy(() => import("@/features/transactions/pages/TransactionsPage"));
const DisputesPage = lazy(() => import("@/features/disputes/pages/DisputesPage"));
const DisputeDetailPage = lazy(() => import("@/features/disputes/pages/DisputeDetailPage"));
const NotificationsPage = lazy(() => import("@/features/notifications/pages/NotificationsPage"));
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage"));

export const router = createBrowserRouter([
  { path: "/connexion", element: <LoginPage /> },
  { path: "/403", element: <ForbiddenPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/membres", element: <MembersPage /> },
          { path: "/tontines", element: <TontinesPage /> },
          { path: "/tontines/:id", element: <TontineDetailPage /> },
          { path: "/transactions", element: <TransactionsPage /> },
          { path: "/litiges", element: <DisputesPage /> },
          { path: "/litiges/:id", element: <DisputeDetailPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/rapports", element: <ReportsPage /> },
          { path: "/parametres", element: <SettingsPage /> },
        ],
      },
    ],
  },
]);