/** État d'avancement d'un litige. */
export type StatutLitige = "OUVERT" | "EN_COURS" | "RESOLU" | "REJETE";

/** Nature de la réclamation. */
export type TypeLitige = "PAIEMENT" | "MEMBRE" | "SOL" | "AUTRE";

/** Une note interne ajoutée au dossier. */
export interface NoteLitige {
  id: string;
  auteur: string;
  contenu: string;
  date: string;   // ISO
}

/** Un litige (réclamation). */
export interface Litige {
  id: string;
  reference: string;
  sujet: string;
  type: TypeLitige;
  membreNom: string;
  solNom: string | null;
  statut: StatutLitige;
  dateOuverture: string;
  notes: NoteLitige[];
}