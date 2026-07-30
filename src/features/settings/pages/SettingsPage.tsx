import {
  Building2, Globe, Lock, Mail, Phone, Shield, User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAuth } from "@/features/auth";

export default function SettingsPage() {
  const { utilisateur } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paramètres"
        description="Votre compte et la configuration de l'application."
      />

      <Tabs defaultValue="profil">
        <TabsList>
          <TabsTrigger value="profil">Profil administrateur</TabsTrigger>
          <TabsTrigger value="application">Application</TabsTrigger>
        </TabsList>

        {/* ═══════════ ONGLET 1 : PROFIL ═══════════ */}
        <TabsContent value="profil" className="mt-4 space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                  {utilisateur
                    ? `${utilisateur.prenom[0] ?? ""}${utilisateur.nom[0] ?? ""}`
                    : "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {utilisateur?.prenom} {utilisateur?.nom}
                </h3>
                <StatusBadge statut="ACTIF" />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-5 sm:grid-cols-2">
              <ChampInfo icon={User} label="Nom complet"
                valeur={`${utilisateur?.prenom ?? ""} ${utilisateur?.nom ?? ""}`} />
              <ChampInfo icon={Shield} label="Rôle" valeur="Administrateur" />
              <ChampInfo icon={Mail} label="Adresse e-mail"
                valeur={utilisateur?.email ?? "—"} />
              <ChampInfo icon={Phone} label="Téléphone"
                valeur={utilisateur?.telephone ?? "—"} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Mot de passe</h4>
                  <p className="text-sm text-muted-foreground">
                    Modifiez votre mot de passe régulièrement pour sécuriser votre compte.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Modifier
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ═══════════ ONGLET 2 : APPLICATION ═══════════ */}
        <TabsContent value="application" className="mt-4 space-y-4">
          <Card className="p-6">
            <h4 className="text-sm font-semibold">Informations de l'application</h4>
            <Separator className="my-5" />

            <div className="grid gap-5 sm:grid-cols-2">
              <ChampInfo icon={Building2} label="Nom" valeur="Sol en Ligne — Console d'administration" />
              <ChampInfo icon={Globe} label="Version" valeur="1.0.0" />
              <ChampInfo icon={Shield} label="Environnement" valeur="Développement" />
              <ChampInfo icon={Building2} label="Organisation" valeur="Sol en Ligne" />
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm font-semibold">À propos</h4>
            <Separator className="my-5" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sol en Ligne digitalise la tontine traditionnelle haïtienne. Cette console
              permet aux administrateurs de superviser les membres, les cercles de
              cotisation, les paiements et la communication avec les utilisateurs de
              l'application mobile.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── Sous-composant : une ligne d'information ─── */
function ChampInfo({
  icon: Icon,
  label,
  valeur,
}: {
  icon: React.ElementType;
  label: string;
  valeur: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{valeur}</p>
      </div>
    </div>
  );
}