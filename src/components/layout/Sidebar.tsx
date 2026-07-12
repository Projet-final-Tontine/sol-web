import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, HandCoins, ArrowLeftRight,
  Scale, Bell, FileBarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Tableau de bord", to: "/", icon: LayoutDashboard },
  { label: "Membres", to: "/membres", icon: Users },
  { label: "Tontines", to: "/tontines", icon: HandCoins },
  { label: "Transactions", to: "/transactions", icon: ArrowLeftRight },
  { label: "Litiges", to: "/litiges", icon: Scale },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Rapports", to: "/rapports", icon: FileBarChart },
];

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={cn("flex-col bg-sidebar text-sidebar-foreground", className)}>
      {/* Logo — même hauteur (h-16) que la topbar : les deux lignes s'alignent */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold">
          S
        </div>
        <span className="text-[15px] font-semibold tracking-tight">Sol en Ligne</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-300/80 hover:bg-white/5 hover:text-white"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4 text-xs text-slate-400">
        Console d'administration
      </div>
    </aside>
  );
}