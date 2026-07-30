/** Statuts d'un Sol (backend : OUVERT, EN_COURS, TERMINE). */
export type StatutSol = "OUVERT" | "EN_COURS" | "TERMINE";

/** Rythme des cotisations. */
export type Frequence = "HEBDOMADAIRE" | "MENSUEL";

/** Miroir de SolResponse + les 3 champs demandés au backend. */
export interface Sol {
  id: string;
  nom: string;
  description: string;
  codeInvitation: string;
  nombreMaxMembres: number;
  montantCotisation: number;
  frequence: Frequence;
  statut: StatutSol;
  mamanSolId: string;

  /* ⚠️ À AJOUTER côté backend */
  mamanSolNom: string;
  nombreMembres: number;
  dateDebut: string; // ISO
}

/** Un tour du cycle (TourInfo côté backend). */
export interface Tour {
  id: string;
  numero: number;
  beneficiaireId: string;
  beneficiaireNom: string;
  datePrevue: string;
  statut: "EN_ATTENTE" | "EN_COURS" | "TERMINE";
  montantPot: number;
}

/** Un participant du cercle (MembreInfo côté backend). */
export interface MembreSol {
  utilisateurId: string;
  nom: string;
  photoUrl: string | null;
  ordre: number;
  statutMembre: "ACTIF" | "DEFAILLANT" | "PARTI";
}

/** Santé financière du Sol (score 0-100). */
export interface SanteSol {
  score: number;
  niveau: "EXCELLENT" | "MOYEN" | "RISQUE";
}

/** Vue complète — miroir de SolDetailResponse. */
export interface SolDetail {
  sol: Sol;
  nombreMembres: number;
  toursJoues: number;
  totalTours: number;
  tourCourant: Tour | null;
  tours: Tour[];
  membres: MembreSol[];
  sante: SanteSol;
}