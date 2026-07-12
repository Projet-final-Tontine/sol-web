import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar fixe, visible à partir de lg (1024px) */}
      <Sidebar className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:flex" />

      <div className="lg:pl-60">
        <Topbar />
        <main className="mx-auto max-w-[1400px] p-4 lg:p-6">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}