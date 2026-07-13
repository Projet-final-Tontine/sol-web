import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth";
import { AppShell } from "@/components/layout/AppShell";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const ForbiddenPage = lazy(() => import("@/features/auth/pages/ForbiddenPage"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const MembersPage = lazy(() => import("@/features/members/pages/MembersPage"));
const TontinesPage = lazy(() => import("@/features/tontines/pages/TontinesPage"));
const TransactionsPage = lazy(() => import("@/features/transactions/pages/TransactionsPage"));
const DisputesPage = lazy(() => import("@/features/disputes/pages/DisputesPage"));
const NotificationsPage = lazy(() => import("@/features/notifications/pages/NotificationsPage"));
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));

export const router = createBrowserRouter([
  { path: "/connexion", element: <LoginPage /> },
  { path: "/403", element: <ForbiddenPage /> },
  {
    element: <ProtectedRoute />,        // 1️⃣ le garde
    children: [
      {
        element: <AppShell />,          // 2️⃣ le layout
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/membres", element: <MembersPage /> },
          { path: "/tontines", element: <TontinesPage /> },
          { path: "/transactions", element: <TransactionsPage /> },
          { path: "/litiges", element: <DisputesPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/rapports", element: <ReportsPage /> },
        ],
      },
    ],
  },
]);