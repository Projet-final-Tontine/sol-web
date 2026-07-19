import type { CotisationRecente, DashboardStats, PointFlux } from "../types";

/* ═══════════════════════════════════════════════════════════
   ⚠️  MOCK TEMPORAIRE
   Les endpoints réels n'existent pas encore côté backend.
   Voir plus bas la version à activer le jour du branchement.
   ═══════════════════════════════════════════════════════════ */

const delai = () => new Promise((r) => setTimeout(r, 500));

const STATS: DashboardStats = {
  totalUtilisateurs: 128,
  comptesActifs: 96,
  comptesBloques: 4,
  comptesEnAttente: 12,
  totalSols: 18,
  solsEnCours: 7,
  totalCollecte: 458_200,
  totalDecaisse: 312_000,
  cotisationsEnRetard: 3,
  montantEnRetard: 12_500,
};

const FLUX: PointFlux[] = [
  { mois: "2025-08", entrees: 28_000, sorties: 21_000 },
  { mois: "2025-09", entrees: 31_500, sorties: 24_000 },
  { mois: "2025-10", entrees: 29_800, sorties: 27_500 },
  { mois: "2025-11", entrees: 35_200, sorties: 26_000 },
  { mois: "2025-12", entrees: 41_000, sorties: 33_500 },
  { mois: "2026-01", entrees: 38_400, sorties: 30_000 },
  { mois: "2026-02", entrees: 36_900, sorties: 31_200 },
  { mois: "2026-03", entrees: 42_100, sorties: 28_800 },
  { mois: "2026-04", entrees: 39_500, sorties: 34_000 },
  { mois: "2026-05", entrees: 44_800, sorties: 29_500 },
  { mois: "2026-06", entrees: 47_200, sorties: 36_500 },
  { mois: "2026-07", entrees: 43_800, sorties: 32_000 },
];

const RECENTES: CotisationRecente[] = [
  { id: "1", membre: "Marie Clergé",  sol: "Sol Delmas 33",  montant: 2_500, statut: "PAYEE",     date: "2026-07-12T09:24:00" },
  { id: "2", membre: "Antoine Joseph", sol: "Sol Pétion-Ville", montant: 5_000, statut: "PAYEE",     date: "2026-07-11T16:45:00" },
  { id: "3", membre: "Sassia Désir",  sol: "Sol Delmas 33",  montant: 2_500, statut: "EN_RETARD", date: "2026-07-11T08:31:00" },
  { id: "4", membre: "Bernard Morne", sol: "Sol Carrefour",  montant: 3_000, statut: "PAYEE",     date: "2026-07-10T14:12:00" },
  { id: "5", membre: "Karla Moïse",   sol: "Sol Pétion-Ville", montant: 5_000, statut: "IMPAYEE",   date: "2026-07-10T11:02:00" },
  { id: "6", membre: "Serly Max",     sol: "Sol Delmas 33",  montant: 2_500, statut: "PAYEE",     date: "2026-07-09T10:15:00" },
];

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    await delai();
    return STATS;
  },

  getFlux: async (): Promise<PointFlux[]> => {
    await delai();
    return FLUX;
  },

  getRecentes: async (): Promise<CotisationRecente[]> => {
    await delai();
    return RECENTES;
  },
};

/* ═══════════════════════════════════════════════════════════
   ✅ VERSION RÉELLE — à activer quand le backend est prêt.
   Supprime tout ce qui précède et décommente ceci :

import { apiClient } from "@/lib/api-client";

export const dashboardApi = {
  getStats: () =>
    apiClient.get<DashboardStats>("/api/admin/stats").then((r) => r.data),

  getFlux: (mois = 12) =>
    apiClient.get<PointFlux[]>("/api/admin/stats/flux", { params: { mois } })
      .then((r) => r.data),

  getRecentes: (limite = 10) =>
    apiClient.get<CotisationRecente[]>("/api/admin/cotisations/recentes",
      { params: { limite } }).then((r) => r.data),
};
   ═══════════════════════════════════════════════════════════ */