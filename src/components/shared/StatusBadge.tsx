import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Statuts réels du backend + statuts de litige. */
export type Statut =
  // Comptes utilisateur
  | "ACTIF" | "EN_ATTENTE" | "BLOQUE" | "INACTIF"
  // Sols (tontines)
  | "OUVERT" | "EN_COURS" | "TERMINE" | "CLOTURE"
  // Cotisations / transactions
  | "VALIDE" | "REJETE" | "EN_RETARD"
  // Membres d'un sol
  | "DEFAILLANT" | "PARTI" | "REFUSE"
  // Dashboard (mock)
  | "PAYEE" | "IMPAYEE"
  // Litiges
  | "RESOLU";

type Ton = "success" | "warning" | "danger" | "neutral" | "info";

/** Table unique : statut → libellé lisible + ton sémantique. */
const CONFIG: Record<Statut, { libelle: string; ton: Ton }> = {
  /* Comptes */
  ACTIF:       { libelle: "Actif",       ton: "success" },
  EN_ATTENTE:  { libelle: "En attente",  ton: "warning" },
  BLOQUE:      { libelle: "Bloqué",      ton: "danger"  },
  INACTIF:     { libelle: "Inactif",     ton: "neutral" },

  /* Sols */
  OUVERT:      { libelle: "Ouvert",      ton: "info"    },
  EN_COURS:    { libelle: "En cours",    ton: "success" },
  TERMINE:     { libelle: "Terminé",     ton: "neutral" },
  CLOTURE:     { libelle: "Clôturé",     ton: "neutral" },

  /* Cotisations / transactions */
  VALIDE:      { libelle: "Validée",     ton: "success" },
  REJETE:      { libelle: "Rejeté",      ton: "danger"  },
  EN_RETARD:   { libelle: "En retard",   ton: "warning" },

  /* Membres d'un sol */
  DEFAILLANT:  { libelle: "Défaillant",  ton: "danger"  },
  PARTI:       { libelle: "Parti",       ton: "neutral" },
  REFUSE:      { libelle: "Refusé",      ton: "danger"  },

  /* Dashboard */
  PAYEE:       { libelle: "Payée",       ton: "success" },
  IMPAYEE:     { libelle: "Impayée",     ton: "danger"  },

  /* Litiges */
  RESOLU:      { libelle: "Résolu",      ton: "success" },
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

  /* Statut inconnu : afficher la valeur brute plutôt que planter. */
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