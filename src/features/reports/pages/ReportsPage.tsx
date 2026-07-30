import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { Download, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartCard, ChartTooltip } from "@/components/shared/ChartCard";
import { MoneyDisplay } from "@/components/shared/MoneyDisplay";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { formatHTG, formatHTGCompact, formatNombre } from "@/lib/formatters";
import { useRapport } from "../api/use-reports";
import type { Periode } from "../types";

const PERIODE_LABEL: Record<Periode, string> = {
  "7J": "7 derniers jours",
  "30J": "30 derniers jours",
  TRIMESTRE: "Ce trimestre",
  ANNEE: "Cette année",
};

export default function ReportsPage() {
  const [periode, setPeriode] = useState<Periode>("30J");
  const { data, isLoading } = useRapport(periode);

  /** Exporte la répartition par sol en CSV. */
  const exporterCSV = () => {
    if (!data) return;
    const lignes = [
      ["Sol", "Montant collecté (HTG)"],
      ...data.repartition.map((r) => [r.sol, String(r.montant)]),
    ];
    const contenu = lignes.map((l) => l.join(",")).join("\n");
    const blob = new Blob([contenu], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = `rapport-${periode}.csv`;
    lien.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rapports"
        description="Analyse de l'activité sur une période."
        actions={
          <div className="flex gap-2">
            <Select
              value={periode}
              onValueChange={(v: string | null) => setPeriode((v as Periode) ?? "30J")}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7J">7 derniers jours</SelectItem>
                <SelectItem value="30J">30 derniers jours</SelectItem>
                <SelectItem value="TRIMESTRE">Ce trimestre</SelectItem>
                <SelectItem value="ANNEE">Cette année</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={exporterCSV} disabled={!data} className="gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        }
      />

      {/* ═══ 4 KPI de synthèse ═══ */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Collecté"
          value={data ? formatHTG(data.synthese.collecte) : ""}
          icon={Wallet}
          tone="violet"
          delta={data?.synthese.deltaCollecte}
          deltaLabel="vs période préc."
          loading={isLoading}
        />
        <StatCard
          label="Décaissé"
          value={data ? formatHTG(data.synthese.decaisse) : ""}
          icon={TrendingDown}
          tone="bleu"
          loading={isLoading}
        />
        <StatCard
          label="Pénalités"
          value={data ? formatHTG(data.synthese.penalites) : ""}
          icon={TrendingUp}
          tone="ambre"
          loading={isLoading}
        />
        <StatCard
          label="Nouveaux membres"
          value={data ? formatNombre(data.synthese.nouveauxMembres) : ""}
          icon={Users}
          tone="emeraude"
          delta={data?.synthese.deltaMembres}
          deltaLabel="vs période préc."
          loading={isLoading}
        />
      </div>

      {/* ═══ Graphique comparaison collecté / décaissé ═══ */}
      <ChartCard
        title="Collecté vs Décaissé"
        description={PERIODE_LABEL[periode]}
        loading={isLoading}
        height={300}
      >
        <AreaChart data={data?.comparaison ?? []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradCollecte" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="periode" axisLine={false} tickLine={false} fontSize={12} stroke="var(--muted-foreground)" />
          <YAxis tickFormatter={formatHTGCompact} axisLine={false} tickLine={false} fontSize={12} stroke="var(--muted-foreground)" width={50} />
          <Tooltip content={<ChartTooltip formatter={formatHTG} />} />
          <Area name="Collecté" dataKey="collecte" stroke="var(--chart-1)" strokeWidth={2} fill="url(#gradCollecte)" />
          <Area name="Décaissé" dataKey="decaisse" stroke="var(--chart-2)" strokeWidth={2} fill="none" />
        </AreaChart>
      </ChartCard>

      {/* ═══ Deux graphiques côte à côte ═══ */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Répartition par sol */}
        <ChartCard
          title="Répartition par cercle"
          description="Collecté par sol"
          loading={isLoading}
          height={280}
        >
          <BarChart data={data?.repartition ?? []} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" tickFormatter={formatHTGCompact} axisLine={false} tickLine={false} fontSize={11} stroke="var(--muted-foreground)" />
            <YAxis type="category" dataKey="sol" axisLine={false} tickLine={false} fontSize={11} stroke="var(--muted-foreground)" width={110} />
            <Tooltip content={<ChartTooltip formatter={formatHTG} />} />
            <Bar name="Collecté" dataKey="montant" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartCard>

        {/* Évolution des membres */}
        <ChartCard
          title="Évolution des membres"
          description={PERIODE_LABEL[periode]}
          loading={isLoading}
          height={280}
        >
          <LineChart data={data?.evolutionMembres ?? []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="periode" axisLine={false} tickLine={false} fontSize={11} stroke="var(--muted-foreground)" />
            <YAxis axisLine={false} tickLine={false} fontSize={11} stroke="var(--muted-foreground)" width={40} />
            <Tooltip content={<ChartTooltip formatter={formatNombre} />} />
            <Line name="Membres" dataKey="membres" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  );
}