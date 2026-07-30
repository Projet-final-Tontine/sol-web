import type { Transaction } from "../types";

/* ═══════════════════════════════════════════════════════════
   ⚠️  MOCK TEMPORAIRE
   Aucun endpoint admin ne liste les paiements côté backend.
   Version réelle en bas du fichier.
   ═══════════════════════════════════════════════════════════ */

const delai = () => new Promise((r) => setTimeout(r, 500));

const MEMBRES = [
  "Marie Clergé", "Antoine Joseph", "Sassia Désir", "Bernard Morne",
  "Karla Moïse", "Serly Max", "Jonas Pierre", "Fabiola Louis",
];
const SOLS = ["Sol Delmas 33", "Sol Pétion-Ville", "Sol Carrefour", "Sol Croix-des-Bouquets"];
const METHODES = ["MONCASH", "NATCASH", "ESPECES", "VIREMENT"] as const;
const TYPES = ["COTISATION", "DECAISSEMENT", "REMBOURSEMENT"] as const;


/** Génère 48 transactions réalistes, triées de la plus récente à la plus ancienne. */
function genererTransactions(): Transaction[] {
  const liste: Transaction[] = [];

  for (let i = 0; i < 48; i++) {
    const type = TYPES[i % TYPES.length];
    const montant =
      type === "DECAISSEMENT" ? 30_000 + (i % 4) * 5_000 : 2_500 + (i % 3) * 500;

    const date = new Date("2026-07-19");
    date.setDate(date.getDate() - i); // une par jour, en remontant

    liste.push({
      id: `trx-${i + 1}`,
      reference: `TRX-2026-${String(i + 1).padStart(4, "0")}`,
      type,
      membreNom: MEMBRES[i % MEMBRES.length],
      solNom: SOLS[i % SOLS.length],
      montant,
      methode: METHODES[i % METHODES.length],
      /* Les plus récentes en attente, le reste validé, quelques rejets. */
      statut: i < 6 ? "EN_ATTENTE" : i % 11 === 0 ? "REJETE" : "VALIDE",
      date: date.toISOString(),
    });
  }

  return liste;
}

const TRANSACTIONS = genererTransactions();

export const transactionApi = {
  getAll: async (): Promise<Transaction[]> => {
    await delai();
    return [...TRANSACTIONS];
  },
};

/* ═══════════════════════════════════════════════════════════
   ✅ VERSION RÉELLE — supprime le mock et décommente :

import { apiClient } from "@/lib/api-client";
import type { Paginated } from "@/types/api";

export const transactionApi = {
  getAll: () =>
    apiClient.get<Transaction[]>("/api/admin/transactions").then((r) => r.data),
};
   ═══════════════════════════════════════════════════════════ */