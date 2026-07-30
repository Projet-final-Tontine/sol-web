import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, CalendarDays, Coins, Users, Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/formatters";
import { useSolDetail } from "../api/use-tontines";

const FREQUENCE_LABEL: Record<string, string> = {
  HEBDOMADAIRE: "Hebdomadaire",
  MENSUEL: "Mensuel",
};

export default function TontineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useSolDetail(id);

  /* ─── Chargement ─── */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  /* ─── Erreur ou introuvable ─── */
  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium">Ce cercle est introuvable.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/tontines">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const { sol, tours, membres, sante, toursJoues, totalTours } = data;
  const progression = totalTours > 0 ? (toursJoues / totalTours) * 100 : 0;
  const montantPot = sol.montantCotisation * sol.nombreMembres;

  return (
    <div className="space-y-6">
      {/* ─── Retour ─── */}
      <Button asChild variant="ghost" size="sm" className="-ml-2 gap-2">
        <Link to="/tontines">
          <ArrowLeft className="h-4 w-4" />
          Tontines
        </Link>
      </Button>

      {/* ─── En-tête ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{sol.nom}</h1>
            <StatusBadge statut={sol.statut} />
          </div>
          <p className="text-sm text-muted-foreground">{sol.description}</p>
        </div>

        <div className="shrink-0 rounded-lg border bg-card px-3 py-2">
          <p className="text-xs text-muted-foreground">Code d'invitation</p>
          <p className="font-mono text-sm font-semibold tabular-nums">
            {sol.codeInvitation}
          </p>
        </div>
      </div>

      {/* ─── 4 indicateurs ─── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Indicateur
          icon={Coins}
          label="Cotisation"
          valeur={<MoneyDisplay amount={sol.montantCotisation} />}
          detail={FREQUENCE_LABEL[sol.frequence]}
        />
        <Indicateur
          icon={Wallet}
          label="Montant de la main"
          valeur={<MoneyDisplay amount={montantPot} />}
          detail="par bénéficiaire"
        />
        <Indicateur
          icon={Users}
          label="Participants"
          valeur={`${sol.nombreMembres} / ${sol.nombreMaxMembres}`}
          detail="places occupées"
        />
        <Indicateur
          icon={CalendarDays}
          label="Démarrage"
          valeur={formatDate(sol.dateDebut)}
          detail={`Manman sol : ${sol.mamanSolNom}`}
        />
      </div>

      {/* ─── Progression + santé ─── */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight">
              Progression du cycle
            </h3>
            <p className="text-sm text-muted-foreground">
              Tour {toursJoues} sur {totalTours}
            </p>
          </div>
          <BadgeSante score={sante.score} niveau={sante.niveau} />
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progression}%` }}
          />
        </div>
      </Card>

      {/* ─── Onglets ─── */}
      <Tabs defaultValue="tours">
        <TabsList>
          <TabsTrigger value="tours">Calendrier des tours</TabsTrigger>
          <TabsTrigger value="membres">Participants</TabsTrigger>
        </TabsList>

        {/* Onglet 1 : les tours */}
        <TabsContent value="tours" className="mt-4">
          <Card className="divide-y p-0">
            {tours.map((t) => (
              <div key={t.id} className="flex items-center gap-4 px-5 py-3.5">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                    t.statut === "TERMINE"
                      ? "bg-emerald-50 text-emerald-700"
                      : t.statut === "EN_COURS"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.numero}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {t.beneficiaireNom}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(t.datePrevue)}
                  </p>
                </div>

                <StatusBadge statut={t.statut} />
                <MoneyDisplay
                  amount={t.montantPot}
                  className="w-32 text-right text-sm font-medium"
                />
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* Onglet 2 : les participants */}
        <TabsContent value="membres" className="mt-4">
          <Card className="divide-y p-0">
            {membres.map((m) => (
              <div key={m.utilisateurId} className="flex items-center gap-4 px-5 py-3.5">
                <span className="w-6 shrink-0 text-sm tabular-nums text-muted-foreground">
                  {m.ordre}
                </span>

                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {m.nom.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <p className="min-w-0 flex-1 truncate text-sm font-medium">
                  {m.nom}
                </p>

                <StatusBadge statut={m.statutMembre} />
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── Sous-composants locaux ─── */

function Indicateur({
  icon: Icon,
  label,
  valeur,
  detail,
}: {
  icon: React.ElementType;
  label: string;
  valeur: React.ReactNode;
  detail: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-2 text-lg font-semibold tabular-nums">{valeur}</p>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">{detail}</p>
    </Card>
  );
}

function BadgeSante({ score, niveau }: { score: number; niveau: string }) {
  const styles: Record<string, string> = {
    EXCELLENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
    MOYEN: "bg-amber-50 text-amber-700 border-amber-200",
    RISQUE: "bg-red-50 text-red-700 border-red-200",
  };
  const libelles: Record<string, string> = {
    EXCELLENT: "Excellente",
    MOYEN: "Moyenne",
    RISQUE: "À risque",
  };

  return (
    <div className={`rounded-lg border px-3 py-1.5 text-right ${styles[niveau]}`}>
      <p className="text-xs font-medium">Santé {libelles[niveau]}</p>
      <p className="text-sm font-semibold tabular-nums">{score} / 100</p>
    </div>
  );
}