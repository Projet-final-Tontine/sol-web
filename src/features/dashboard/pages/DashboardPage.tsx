import type { ElementType, ReactNode } from "react";
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, HandCoins, Users, Wallet,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartCard, ChartTooltip } from "@/components/shared/ChartCard";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  formatDateHeure, formatHTG, formatHTGCompact, formatNombre,
} from "@/lib/formatters";
import { useFlux, useRecentes, useStats } from "../api/use-dashboard";

/** "2026-01" → "janv." */
const libelleMois = (iso: string) =>
  new Intl.DateTimeFormat("fr-HT", { month: "short" })
    .format(new Date(`${iso}-01`));

export default function DashboardPage() {
  const { data: stats, isLoading: chargeStats } = useStats();
  const { data: flux, isLoading: chargeFlux } = useFlux();
  const { data: recentes, isLoading: chargeRecentes } = useRecentes();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité de la plateforme."
      />

      {/* ═══════════ LES 4 KPI ═══════════ */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total collecté"
          value={stats ? formatHTG(stats.totalCollecte) : ""}
          icon={Wallet}
          tone="violet"
          delta={0.125}
          deltaLabel="ce mois"
          loading={chargeStats}
        />
        <StatCard
          label="Membres actifs"
          value={stats ? formatNombre(stats.comptesActifs) : ""}
          icon={Users}
          tone="emeraude"
          delta={0.08}
          deltaLabel="ce mois"
          loading={chargeStats}
        />
        <StatCard
          label="Sols en cours"
          value={stats ? formatNombre(stats.solsEnCours) : ""}
          icon={HandCoins}
          tone="bleu"
          loading={chargeStats}
        />
        <StatCard
          label="Cotisations en retard"
          value={stats ? formatNombre(stats.cotisationsEnRetard) : ""}
          icon={AlertTriangle}
          tone="ambre"
          delta={0.04}
          deltaLabel="ce mois"
          higherIsBetter={false}
          loading={chargeStats}
        />
      </div>

      {/* ═══════════ GRAPHIQUE + SYNTHÈSE ═══════════ */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Le graphique héros — 2/3 de la largeur */}
        <ChartCard
          title="Flux financiers"
          description="12 derniers mois"
          loading={chargeFlux}
          className="lg:col-span-2"
        >
          <AreaChart data={flux ?? []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="degradeEntrees" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="mois"
              tickFormatter={libelleMois}
              axisLine={false}
              tickLine={false}
              fontSize={12}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              tickFormatter={formatHTGCompact}
              axisLine={false}
              tickLine={false}
              fontSize={12}
              stroke="var(--muted-foreground)"
              width={50}
            />
            <Tooltip content={<ChartTooltip formatter={formatHTG} />} />
            <Legend
              verticalAlign="top"
              align="left"
              height={32}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />

            <Area
              name="Cotisations reçues"
              dataKey="entrees"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#degradeEntrees)"
            />
            <Area
              name="Décaissements"
              dataKey="sorties"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="none"
            />
          </AreaChart>
        </ChartCard>

        {/* Panneau de synthèse — 1/3 */}
        <Card className="p-5">
          <h3 className="text-base font-semibold tracking-tight">Synthèse</h3>

          {chargeStats ? (
            <div className="mt-5 space-y-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <LigneSynthese
                icon={ArrowUpRight}
                label="Collecté"
                valeur={
                  <MoneyDisplay
                    amount={stats!.totalCollecte}
                    className="text-success"
                  />
                }
              />
              <LigneSynthese
                icon={ArrowDownRight}
                label="Décaissé"
                valeur={<MoneyDisplay amount={stats!.totalDecaisse} />}
              />
              <LigneSynthese
                icon={AlertTriangle}
                label="Impayés"
                valeur={
                  <MoneyDisplay
                    amount={stats!.montantEnRetard}
                    className="text-destructive"
                  />
                }
                alerte
              />

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Comptes en attente</span>
                  <span className="font-medium tabular-nums">
                    {formatNombre(stats!.comptesEnAttente)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Comptes bloqués</span>
                  <span className="font-medium tabular-nums">
                    {formatNombre(stats!.comptesBloques)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ═══════════ ACTIVITÉ RÉCENTE ═══════════ */}
      <Card className="p-5">
        <h3 className="text-base font-semibold tracking-tight">Activité récente</h3>
        <p className="text-sm text-muted-foreground">
          Dernières cotisations enregistrées
        </p>

        <div className="mt-5 space-y-1">
          {chargeRecentes
            ? [0, 1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))
            : recentes?.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {c.membre.split(" ").map((m) => m[0]).join("").slice(0, 2)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.membre}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.sol}</p>
                  </div>

                  <StatusBadge statut={c.statut} />

                  <div className="text-right">
                    <MoneyDisplay
                      amount={c.montant}
                      className="text-sm font-medium"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formatDateHeure(c.date)}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── Sous-composant local : une ligne du panneau Synthèse ─── */
function LigneSynthese({
  icon: Icon,
  label,
  valeur,
  alerte = false,
}: {
  icon: ElementType;
  label: string;
  valeur: ReactNode;
  alerte?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
          alerte ? "bg-destructive/10" : "bg-muted"
        }`}
      >
        <Icon
          className={`h-4 w-4 ${
            alerte ? "text-destructive" : "text-muted-foreground"
          }`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{valeur}</p>
      </div>
    </div>
  );
}