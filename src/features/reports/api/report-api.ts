import type {
  PointComparaison, PointMembres, Rapport, RepartitionSol,
  SynthesePeriode, Periode,
} from "../types";

/* ═══════════════════════════════════════════════════════════
   ⚠️  MOCK TEMPORAIRE
   Aucun endpoint de rapports côté backend.
   Version réelle en bas du fichier.
   ═══════════════════════════════════════════════════════════ */

const delai = () => new Promise((r) => setTimeout(r, 500));

/** Étiquettes de l'axe X selon la période choisie. */
const LABELS: Record<Periode, string[]> = {
  "7J": ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  "30J": ["Sem. 1", "Sem. 2", "Sem. 3", "Sem. 4"],
  TRIMESTRE: ["Mois 1", "Mois 2", "Mois 3"],
  ANNEE: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
};

const SOLS = [
  "Sol Delmas 33", "Sol Pétion-Ville", "Sol Carrefour",
  "Sol Croix-des-Bouquets", "Sol Tabarre",
];

/** Génère un rapport cohérent pour la période demandée. */
function genererRapport(periode: Periode): Rapport {
  const labels = LABELS[periode];

  const comparaison: PointComparaison[] = labels.map((periodeLabel, i) => ({
    periode: periodeLabel,
    collecte: 20_000 + ((i * 7) % 5) * 4_000 + i * 1_500,
    decaisse: 15_000 + ((i * 5) % 4) * 3_500 + i * 1_000,
  }));

  const repartition: RepartitionSol[] = SOLS.map((sol, i) => ({
    sol,
    montant: 40_000 + ((i * 11) % 6) * 8_000,
  }));

  const evolutionMembres: PointMembres[] = labels.map((periodeLabel, i) => ({
    periode: periodeLabel,
    membres: 80 + i * 4 + ((i * 3) % 5),
  }));

  const collecte = comparaison.reduce((s, p) => s + p.collecte, 0);
  const decaisse = comparaison.reduce((s, p) => s + p.decaisse, 0);

  const synthese: SynthesePeriode = {
    collecte,
    decaisse,
    penalites: Math.round(collecte * 0.02),
    nouveauxMembres: labels.length * 3,
    deltaCollecte: 0.128,
    deltaMembres: 0.056,
  };

  return { synthese, comparaison, repartition, evolutionMembres };
}

export const reportApi = {
  getRapport: async (periode: Periode): Promise<Rapport> => {
    await delai();
    return genererRapport(periode);
  },
};

/* ═══════════════════════════════════════════════════════════
   ✅ VERSION RÉELLE — supprime le mock et décommente :

import { apiClient } from "@/lib/api-client";

export const reportApi = {
  getRapport: (periode: Periode) =>
    apiClient.get<Rapport>("/api/admin/rapports", { params: { periode } })
      .then((r) => r.data),
};
   ═══════════════════════════════════════════════════════════ */