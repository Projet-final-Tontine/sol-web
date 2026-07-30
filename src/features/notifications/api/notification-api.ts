import type { Notification, NouvelleNotification } from "../types";

/* ═══════════════════════════════════════════════════════════
   ⚠️  MOCK TEMPORAIRE
   Aucun endpoint admin de diffusion côté backend.
   Version réelle en bas du fichier.
   ═══════════════════════════════════════════════════════════ */

const delai = () => new Promise((r) => setTimeout(r, 500));

/* Liste mutable — l'envoi ajoute en tête pour simuler le serveur. */
let NOTIFICATIONS: Notification[] = [
  { id: "1", titre: "Rappel de cotisation", message: "Votre cotisation du mois est attendue avant le 25.",
    cible: "TOUS", cibleLabel: "Tous les membres", canal: "PUSH", statut: "ENVOYEE",
    nombreDestinataires: 128, date: "2026-07-18T09:00:00" },

  { id: "2", titre: "Nouveau tour ouvert", message: "Le tour 4 du Sol Delmas 33 démarre aujourd'hui.",
    cible: "SOL", cibleLabel: "Sol Delmas 33", canal: "IN_APP", statut: "ENVOYEE",
    nombreDestinataires: 12, date: "2026-07-17T14:30:00" },

  { id: "3", titre: "Comptes en attente", message: "Votre inscription est en cours de validation.",
    cible: "STATUT", cibleLabel: "Comptes en attente", canal: "SMS", statut: "ENVOYEE",
    nombreDestinataires: 12, date: "2026-07-16T11:15:00" },

  { id: "4", titre: "Maintenance planifiée", message: "L'application sera indisponible dimanche de 2h à 4h.",
    cible: "TOUS", cibleLabel: "Tous les membres", canal: "PUSH", statut: "ENVOYEE",
    nombreDestinataires: 128, date: "2026-07-14T16:00:00" },

  { id: "5", titre: "Paiement en retard", message: "Un rappel : votre cotisation est en retard.",
    cible: "STATUT", cibleLabel: "Membres en retard", canal: "SMS", statut: "ECHOUEE",
    nombreDestinataires: 3, date: "2026-07-12T10:00:00" },
];

/** Correspondance cible → libellé + nombre simulé de destinataires. */
const CIBLE_INFO: Record<string, { label: string; nombre: number }> = {
  TOUS: { label: "Tous les membres", nombre: 128 },
  SOL: { label: "Sol Delmas 33", nombre: 12 },
  STATUT: { label: "Comptes actifs", nombre: 96 },
};

export const notificationApi = {
  getAll: async (): Promise<Notification[]> => {
    await delai();
    return [...NOTIFICATIONS];
  },

  envoyer: async (n: NouvelleNotification): Promise<Notification> => {
    await delai();
    const info = CIBLE_INFO[n.cible];
    const nouvelle: Notification = {
      id: String(Date.now()),
      titre: n.titre,
      message: n.message,
      cible: n.cible,
      cibleLabel: info.label,
      canal: n.canal,
      statut: "ENVOYEE",
      nombreDestinataires: info.nombre,
      date: new Date().toISOString(),
    };
    NOTIFICATIONS = [nouvelle, ...NOTIFICATIONS]; // en tête
    return nouvelle;
  },
};

/* ═══════════════════════════════════════════════════════════
   ✅ VERSION RÉELLE — supprime le mock et décommente :

import { apiClient } from "@/lib/api-client";

export const notificationApi = {
  getAll: () =>
    apiClient.get<Notification[]>("/api/admin/notifications").then((r) => r.data),

  envoyer: (n: NouvelleNotification) =>
    apiClient.post<Notification>("/api/admin/notifications", n).then((r) => r.data),
};
   ═══════════════════════════════════════════════════════════ */