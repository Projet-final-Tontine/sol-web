import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Familles de statuts du domaine. */
export type Statut =
  // Comptes (backend : EN_ATTENTE, ACTIF, BLOQUE, INACTIF)
  | "ACTIF" | "EN_ATTENTE" | "BLOQUE" | "INACTIF"
  // Tontines / Sols
  | "EN_COURS" | "TERMINE" | "ANNULE"
  // Cotisations & paiements
  | "PAYEE" | "IMPAYEE" | "EN_RETARD" | "REMBOURSEE"
  // Litiges
  | "OUVERT" | "RESOLU" | "REJETE";

type Ton = "success" | "warning" | "danger" | "neutral" | "info";

/** Table unique : statut → libellé lisible + ton sémantique. */
const CONFIG: Record<Statut, { libelle: string; ton: Ton }> = {
  ACTIF:       { libelle: "Actif",       ton: "success" },
  EN_ATTENTE:  { libelle: "En attente",  ton: "warning" },
  BLOQUE:      { libelle: "Bloqué",      ton: "danger"  },
  INACTIF:     { libelle: "Inactif",     ton: "neutral" },

  EN_COURS:    { libelle: "En cours",    ton: "info"    },
  TERMINE:     { libelle: "Terminé",     ton: "neutral" },
  ANNULE:      { libelle: "Annulé",      ton: "danger"  },

  PAYEE:       { libelle: "Payée",       ton: "success" },
  IMPAYEE:     { libelle: "Impayée",     ton: "danger"  },
  EN_RETARD:   { libelle: "En retard",   ton: "warning" },
  REMBOURSEE:  { libelle: "Remboursée",  ton: "neutral" },

  OUVERT:      { libelle: "Ouvert",      ton: "warning" },
  RESOLU:      { libelle: "Résolu",      ton: "success" },
  REJETE:      { libelle: "Rejeté",      ton: "danger"  },
};

/** Fond teinté + texte soutenu — jamais de couleur pleine saturée. */
const TONS: Record<Ton, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50  text-amber-700  border-amber-200",
  danger:  "bg-red-50    text-red-700    border-red-200",
  neutral: "bg-slate-50  text-slate-600  border-slate-200",
  info:    "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export function StatusBadge({
  statut,
  className,
}: {
  statut: Statut;
  className?: string;
}) {
  const config = CONFIG[statut];

  /* Statut inconnu (backend qui évolue) : on affiche la valeur brute
     plutôt que de planter ou d'afficher du vide. */
  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {statut}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn("font-medium", TONS[config.ton], className)}
    >
      {config.libelle}
    </Badge>
  );
}