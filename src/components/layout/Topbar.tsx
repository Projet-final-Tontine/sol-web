import { Bell, Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card px-4 lg:px-6">
      {/* Menu mobile : la MÊME Sidebar, servie dans un Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
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
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-xs text-primary-foreground">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}