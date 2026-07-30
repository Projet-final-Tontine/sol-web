import type { MembreSol, Sol, SolDetail, Tour } from "../types";

/* ═══════════════════════════════════════════════════════════
   ⚠️  MOCK TEMPORAIRE
   GET /api/admin/sols n'existe pas encore côté backend.
   Version réelle en bas du fichier.
   ═══════════════════════════════════════════════════════════ */

const delai = () => new Promise((r) => setTimeout(r, 500));

const SOLS: Sol[] = [
  { id: "s1", nom: "Sol Delmas 33", description: "Cercle mensuel du quartier Delmas 33.",
    codeInvitation: "DLM33-A7", nombreMaxMembres: 12, montantCotisation: 2500,
    frequence: "MENSUEL", statut: "EN_COURS", mamanSolId: "2",
    mamanSolNom: "Antoine Joseph", nombreMembres: 12, dateDebut: "2025-09-01" },

  { id: "s2", nom: "Sol Pétion-Ville", description: "Cercle des commerçantes de Pétion-Ville.",
    codeInvitation: "PTV-K21", nombreMaxMembres: 8, montantCotisation: 5000,
    frequence: "MENSUEL", statut: "EN_COURS", mamanSolId: "8",
    mamanSolNom: "Fabiola Louis", nombreMembres: 8, dateDebut: "2025-11-15" },

  { id: "s3", nom: "Sol Carrefour", description: "Cotisation hebdomadaire, ouvert aux nouveaux.",
    codeInvitation: "CRF-M09", nombreMaxMembres: 10, montantCotisation: 3000,
    frequence: "HEBDOMADAIRE", statut: "OUVERT", mamanSolId: "2",
    mamanSolNom: "Antoine Joseph", nombreMembres: 6, dateDebut: "2026-08-01" },

  { id: "s4", nom: "Sol Tabarre", description: "Cycle clôturé en juin 2026.",
    codeInvitation: "TBR-X44", nombreMaxMembres: 6, montantCotisation: 4000,
    frequence: "MENSUEL", statut: "TERMINE", mamanSolId: "8",
    mamanSolNom: "Fabiola Louis", nombreMembres: 6, dateDebut: "2025-01-10" },

  { id: "s5", nom: "Sol Croix-des-Bouquets", description: "Grand cercle hebdomadaire.",
    codeInvitation: "CDB-T18", nombreMaxMembres: 15, montantCotisation: 1500,
    frequence: "HEBDOMADAIRE", statut: "EN_COURS", mamanSolId: "2",
    mamanSolNom: "Antoine Joseph", nombreMembres: 14, dateDebut: "2026-02-01" },

  { id: "s6", nom: "Sol Cap-Haïtien", description: "Nouveau cercle, inscriptions ouvertes.",
    codeInvitation: "CAP-B02", nombreMaxMembres: 10, montantCotisation: 2000,
    frequence: "MENSUEL", statut: "OUVERT", mamanSolId: "8",
    mamanSolNom: "Fabiola Louis", nombreMembres: 3, dateDebut: "2026-09-01" },
];

const NOMS = [
  "Marie Clergé", "Antoine Joseph", "Sassia Désir", "Bernard Morne",
  "Karla Moïse", "Serly Max", "Jonas Pierre", "Fabiola Louis",
  "Widley Charles", "Nadège Étienne", "Ricardo Jean", "Islande Baptiste",
  "Gerald Saint-Fleur", "Myrlande Cadet", "Ludwig Antoine",
];

/** Fabrique les participants d'un sol, dans l'ordre de rotation. */
function genererMembres(nb: number): MembreSol[] {
  return Array.from({ length: nb }, (_, i) => ({
    utilisateurId: String(i + 1),
    nom: NOMS[i % NOMS.length],
    photoUrl: null,
    ordre: i + 1,
    statutMembre: i === 4 ? "DEFAILLANT" : i === 9 ? "PARTI" : "ACTIF",
  }));
}

/** Fabrique le calendrier des tours à partir de la date de début. */
function genererTours(sol: Sol, joues: number): Tour[] {
  const debut = new Date(sol.dateDebut);
  const pasJours = sol.frequence === "HEBDOMADAIRE" ? 7 : 30;

  return Array.from({ length: sol.nombreMembres }, (_, i) => {
    const date = new Date(debut);
    date.setDate(date.getDate() + i * pasJours);

    return {
      id: `${sol.id}-t${i + 1}`,
      numero: i + 1,
      beneficiaireId: String(i + 1),
      beneficiaireNom: NOMS[i % NOMS.length],
      datePrevue: date.toISOString().slice(0, 10),
      statut: i < joues ? "TERMINE" : i === joues ? "EN_COURS" : "EN_ATTENTE",
      montantPot: sol.montantCotisation * sol.nombreMembres,
    };
  });
}

export const tontineApi = {
  getAll: async (): Promise<Sol[]> => {
    await delai();
    return [...SOLS];
  },

  getDetail: async (id: string): Promise<SolDetail> => {
    await delai();
    const sol = SOLS.find((s) => s.id === id);
    if (!sol) throw { status: 404, message: "Sol introuvable." };

    /* Progression simulée selon le statut. */
    const joues =
      sol.statut === "TERMINE" ? sol.nombreMembres
      : sol.statut === "OUVERT" ? 0
      : Math.floor(sol.nombreMembres / 2);

    const score = sol.statut === "TERMINE" ? 100 : 74;

    return {
      sol,
      nombreMembres: sol.nombreMembres,
      toursJoues: joues,
      totalTours: sol.nombreMembres,
      tours: genererTours(sol, joues),
      tourCourant: joues < sol.nombreMembres ? genererTours(sol, joues)[joues] : null,
      membres: genererMembres(sol.nombreMembres),
      sante: {
        score,
        niveau: score >= 80 ? "EXCELLENT" : score >= 50 ? "MOYEN" : "RISQUE",
      },
    };
  },
};

/* ═══════════════════════════════════════════════════════════
   ✅ VERSION RÉELLE — supprime le mock et décommente :

import { apiClient } from "@/lib/api-client";

export const tontineApi = {
  getAll: () =>
    apiClient.get<Sol[]>("/api/admin/sols").then((r) => r.data),

  getDetail: (id: string) =>
    apiClient.get<SolDetail>(`/api/sols/${id}/detail`).then((r) => r.data),
};
   ═══════════════════════════════════════════════════════════ */