/** Nature du mouvement financier. */
export type TypeTransaction =
  | "COTISATION" | "DECAISSEMENT" | "REMBOURSEMENT" | "PENALITE";

/** Statut du paiement (backend : EN_ATTENTE, VALIDE, REJETE). */
export type StatutTransaction = "EN_ATTENTE" | "VALIDE" | "REJETE";

/** Moyen utilisé. */
export type MethodePaiement = "MONCASH" | "NATCASH" | "ESPECES" | "VIREMENT";

export interface Transaction {
  id: string;
  reference: string;        // "TRX-2026-0042"
  type: TypeTransaction;
  membreNom: string;
  solNom: string;
  montant: number;
  methode: MethodePaiement;
  statut: StatutTransaction;
  date: string;             // ISO
}

/** Filtres appliqués côté client. */
export interface FiltresTransactions {
  recherche: string;
  type: TypeTransaction | "TOUS";
  statut: StatutTransaction | "TOUS";
}