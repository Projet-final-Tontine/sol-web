/** KPIs du tableau de bord. */
export interface DashboardStats {
  /* ✅ Déjà fournis par le backend */
  totalUtilisateurs: number;
  comptesActifs: number;
  comptesBloques: number;
  comptesEnAttente: number;
  totalSols: number;
  solsEnCours: number;

  /* ⚠️ À AJOUTER côté backend */
  totalCollecte: number;
  totalDecaisse: number;
  cotisationsEnRetard: number;
  montantEnRetard: number;
}

/** Un point du graphique de flux. */
export interface PointFlux {
  mois: string;      // "2026-01"
  entrees: number;   // cotisations reçues
  sorties: number;   // décaissements
}

/** Une ligne du tableau "activité récente". */
export interface CotisationRecente {
  id: string;
  membre: string;
  sol: string;
  montant: number;
  statut: "PAYEE" | "IMPAYEE" | "EN_RETARD";
  date: string;      // ISO : "2026-07-12T14:30:00"
}