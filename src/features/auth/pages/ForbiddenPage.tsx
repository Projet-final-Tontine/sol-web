import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background">
      <h1 className="text-2xl font-semibold tracking-tight">Accès refusé</h1>
      <p className="text-sm text-muted-foreground">
        Ton rôle ne permet pas d'accéder à cette page.
      </p>
      <Button variant="outline" className="mt-3" render={<Link to="/" />}>
        Retour au tableau de bord
      </Button>
    </div>
  );
}