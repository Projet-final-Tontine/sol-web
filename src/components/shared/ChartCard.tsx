import type { ReactNode } from "react";
import { ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  /** Titre : "Évolution des cotisations" */
  title: string;
  /** Période ou précision : "12 derniers mois" */
  description?: string;
  /** Sélecteur de période, filtre… aligné à droite du titre. */
  actions?: ReactNode;
  /** Hauteur du graphique en pixels. */
  height?: number;
  loading?: boolean;
  /** Un unique élément Recharts : <AreaChart>, <BarChart>… */
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  actions,
  height = 300,
  loading = false,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      {/* En-tête */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      {/* Graphique */}
      <div className="mt-5" style={{ height }}>
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

/* ─── Tooltip personnalisé ─────────────────────────────── */

interface TooltipItem {
  name: string;
  value: number;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string;
  /** Comment formater les valeurs : formatHTG, formatNombre… */
  formatter?: (v: number) => string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter = (v) => String(v),
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-md">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ml-auto font-medium tabular-nums">
              {formatter(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}