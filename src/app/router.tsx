import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";

const DashboardPage = lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const MembersPage = lazy(() => import("@/features/members/pages/MembersPage"));
const TontinesPage = lazy(() => import("@/features/tontines/pages/TontinesPage"));
const TransactionsPage = lazy(() => import("@/features/transactions/pages/TransactionsPage"));
const DisputesPage = lazy(() => import("@/features/disputes/pages/DisputesPage"));
const NotificationsPage = lazy(() => import("@/features/notifications/pages/NotificationsPage"));
const ReportsPage = lazy(() => import("@/features/reports/pages/ReportsPage"));

export const router = createBrowserRouter([
  {
    element: <AppShell />, // layout parent : sidebar + topbar + <Outlet />
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
  // La route /login et le ProtectedRoute arrivent en Phase 2
]);