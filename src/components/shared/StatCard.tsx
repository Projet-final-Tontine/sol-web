import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Tons disponibles pour la pastille d'icône. */
type Tone = "violet" | "emeraude" | "bleu" | "ambre";

/** Pastille teintée + icône soutenue. */
const TONES: Record<Tone, { pastille: string; icone: string }> = {
  violet:   { pastille: "bg-violet-100",  icone: "text-violet-600" },
  emeraude: { pastille: "bg-emerald-100", icone: "text-emerald-600" },
  bleu:     { pastille: "bg-sky-100",     icone: "text-sky-600" },
  ambre:    { pastille: "bg-amber-100",   icone: "text-amber-600" },
};

interface StatCardProps {
  /** Libellé du KPI : "Total collecté" */
  label: string;
  /** Valeur déjà formatée : "458 200,00 HTG" ou "128" */
  value: string;
  /** Icône lucide affichée en pastille. */
  icon: LucideIcon;
  /** Couleur de la pastille. Défaut : violet. */
  tone?: Tone;
  /** Variation vs période précédente, en ratio : 0.125 → +12,5 % */
  delta?: number;
  /** Contexte du delta : "ce mois" */
  deltaLabel?: string;
  /** Une hausse est-elle une bonne nouvelle ? (faux pour "Paiements en retard") */
  higherIsBetter?: boolean;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "violet",
  delta,
  deltaLabel,
  higherIsBetter = true,
  loading = false,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn("p-5", className)}>
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="mt-3 h-8 w-32" />
        <Skeleton className="mt-2 h-3 w-20" />
      </Card>
    );
  }

  const aDelta = delta !== undefined;
  const enHausse = aDelta && delta >= 0;
  /* Une hausse des retards est une MAUVAISE nouvelle → rouge, pas vert. */
  const estBon = enHausse === higherIsBetter;

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
            TONES[tone].pastille
          )}
        >
          <Icon className={cn("h-[18px] w-[18px]", TONES[tone].icone)} />
        </div>
      </div>

      <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>

      {aDelta && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "flex items-center gap-0.5 font-medium tabular-nums",
              estBon ? "text-success" : "text-destructive"
            )}
          >
            {enHausse ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {Math.abs(delta * 100).toFixed(1).replace(".", ",")} %
          </span>
          {deltaLabel && (
            <span className="text-muted-foreground">{deltaLabel}</span>
          )}
        </div>
      )}
    </Card>
  );
}