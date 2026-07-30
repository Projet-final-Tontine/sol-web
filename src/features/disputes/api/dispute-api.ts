import type { Litige, NoteLitige, StatutLitige } from "../types";

/* ═══════════════════════════════════════════════════════════
   ⚠️  MOCK TEMPORAIRE — 100% fictif.
   Le module Litiges n'existe pas encore côté backend
   (aucune entité, aucune table). Fonctionnalité prévue.
   ═══════════════════════════════════════════════════════════ */

const delai = () => new Promise((r) => setTimeout(r, 500));

let LITIGES: Litige[] = [
  {
    id: "l1", reference: "LIT-2026-0001", sujet: "Cotisation débitée deux fois",
    type: "PAIEMENT", membreNom: "Marie Clergé", solNom: "Sol Delmas 33",
    statut: "OUVERT", dateOuverture: "2026-07-18T10:30:00",
    notes: [
      { id: "n1", auteur: "Système", contenu: "Litige ouvert par le membre.", date: "2026-07-18T10:30:00" },
    ],
  },
  {
    id: "l2", reference: "LIT-2026-0002", sujet: "Membre non retiré après départ",
    type: "MEMBRE", membreNom: "Antoine Joseph", solNom: "Sol Pétion-Ville",
    statut: "EN_COURS", dateOuverture: "2026-07-16T14:00:00",
    notes: [
      { id: "n2", auteur: "Système", contenu: "Litige ouvert par le membre.", date: "2026-07-16T14:00:00" },
      { id: "n3", auteur: "Admin", contenu: "Vérification en cours auprès de la manman sol.", date: "2026-07-17T09:15:00" },
    ],
  },
  {
    id: "l3", reference: "LIT-2026-0003", sujet: "Contestation de l'ordre des tours",
    type: "SOL", membreNom: "Sassia Désir", solNom: "Sol Carrefour",
    statut: "RESOLU", dateOuverture: "2026-07-10T08:45:00",
    notes: [
      { id: "n4", auteur: "Système", contenu: "Litige ouvert par le membre.", date: "2026-07-10T08:45:00" },
      { id: "n5", auteur: "Admin", contenu: "Ordre de rotation confirmé selon l'inscription. Expliqué au membre.", date: "2026-07-11T11:00:00" },
    ],
  },
  {
    id: "l4", reference: "LIT-2026-0004", sujet: "Demande de remboursement non justifiée",
    type: "AUTRE", membreNom: "Karla Moïse", solNom: null,
    statut: "REJETE", dateOuverture: "2026-07-08T16:20:00",
    notes: [
      { id: "n6", auteur: "Système", contenu: "Litige ouvert par le membre.", date: "2026-07-08T16:20:00" },
      { id: "n7", auteur: "Admin", contenu: "Aucune anomalie constatée. Demande rejetée.", date: "2026-07-09T10:30:00" },
    ],
  },
  {
    id: "l5", reference: "LIT-2026-0005", sujet: "Paiement MonCash non crédité",
    type: "PAIEMENT", membreNom: "Serly Max", solNom: "Sol Delmas 33",
    statut: "OUVERT", dateOuverture: "2026-07-19T07:10:00",
    notes: [
      { id: "n8", auteur: "Système", contenu: "Litige ouvert par le membre.", date: "2026-07-19T07:10:00" },
    ],
  },
];

export const disputeApi = {
  getAll: async (): Promise<Litige[]> => {
    await delai();
    return [...LITIGES];
  },

  getById: async (id: string): Promise<Litige> => {
    await delai();
    const litige = LITIGES.find((l) => l.id === id);
    if (!litige) throw { status: 404, message: "Litige introuvable." };
    return { ...litige };
  },

  changerStatut: async (id: string, statut: StatutLitige, note: string): Promise<Litige> => {
    await delai();
    LITIGES = LITIGES.map((l) => {
      if (l.id !== id) return l;
      const nouvelleNote: NoteLitige = {
        id: `n${Date.now()}`,
        auteur: "Admin",
        contenu: note,
        date: new Date().toISOString(),
      };
      return { ...l, statut, notes: [...l.notes, nouvelleNote] };
    });
    return { ...LITIGES.find((l) => l.id === id)! };
  },

  ajouterNote: async (id: string, contenu: string): Promise<Litige> => {
    await delai();
    LITIGES = LITIGES.map((l) => {
      if (l.id !== id) return l;
      const nouvelleNote: NoteLitige = {
        id: `n${Date.now()}`,
        auteur: "Admin",
        contenu,
        date: new Date().toISOString(),
      };
      return { ...l, notes: [...l.notes, nouvelleNote] };
    });
    return { ...LITIGES.find((l) => l.id === id)! };
  },
};

/* ═══════════════════════════════════════════════════════════
   ✅ VERSION RÉELLE — quand le backend existera :

import { apiClient } from "@/lib/api-client";

export const disputeApi = {
  getAll: () =>
    apiClient.get<Litige[]>("/api/admin/litiges").then((r) => r.data),
  getById: (id: string) =>
    apiClient.get<Litige>(`/api/admin/litiges/${id}`).then((r) => r.data),
  changerStatut: (id: string, statut: StatutLitige, note: string) =>
    apiClient.post<Litige>(`/api/admin/litiges/${id}/statut`, { statut, note }).then((r) => r.data),
  ajouterNote: (id: string, contenu: string) =>
    apiClient.post<Litige>(`/api/admin/litiges/${id}/notes`, { contenu }).then((r) => r.data),
};
   ═══════════════════════════════════════════════════════════ */