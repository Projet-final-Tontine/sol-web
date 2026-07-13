import { Bell, LogOut, Menu, Search } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function Topbar() {
  const { utilisateur, deconnexion } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card px-4 lg:px-6">
      {/* Menu mobile : la MÊME Sidebar, servie dans un Sheet */}
      <Sheet>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="lg:hidden" />}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Ouvrir le menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 border-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar className="flex h-full" />
        </SheetContent>
      </Sheet>

      {/* Recherche globale — non fonctionnelle pour l'instant */}
      <div className="relative hidden max-w-sm flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Rechercher…" className="h-9 pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                {initiales(utilisateur)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium md:inline">
              {utilisateur?.prenom} {utilisateur?.nom}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="space-y-0.5">
              <p className="text-sm font-medium">
                {utilisateur?.prenom} {utilisateur?.nom}
              </p>
              <p className="text-xs font-normal text-muted-foreground">
                Administrateur
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={deconnexion}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

/* Helper : "Mitovens Laguerre" → "ML" */
function initiales(u: { prenom: string; nom: string } | null) {
  if (!u) return "AD";
  return `${u.prenom[0] ?? ""}${u.nom[0] ?? ""}`.toUpperCase();
}