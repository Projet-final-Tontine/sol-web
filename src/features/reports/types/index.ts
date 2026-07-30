/** Période d'analyse sélectionnable. */
export type Periode = "7J" | "30J" | "TRIMESTRE" | "ANNEE";

/** Synthèse chiffrée d'une période. */
export interface SynthesePeriode {
  collecte: number;
  decaisse: number;
  penalites: number;
  nouveauxMembres: number;
  deltaCollecte: number;
  deltaMembres: number;
}

/** Un point du graphique collecté vs décaissé. */
export interface PointComparaison {
  periode: string;
  collecte: number;
  decaisse: number;
}

/** Répartition du collecté par sol. */
export interface RepartitionSol {
  sol: string;
  montant: number;
}

/** Évolution du nombre de membres. */
export interface PointMembres {
  periode: string;
  membres: number;
}

/** Rapport complet d'une période. */
export interface Rapport {
  synthese: SynthesePeriode;
  comparaison: PointComparaison[];
  repartition: RepartitionSol[];
  evolutionMembres: PointMembres[];
}