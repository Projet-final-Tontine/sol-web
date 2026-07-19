import type { Membre } from "../types";

/* ═══════════════════════════════════════════════════════════
   ⚠️  MOCK TEMPORAIRE — le backend n'est pas encore branché.
   Version réelle en bas du fichier, à activer le jour venu.
   ═══════════════════════════════════════════════════════════ */

const delai = () => new Promise((r) => setTimeout(r, 500));

let MEMBRES: Membre[] = [
  { id: "1",  nom: "Clergé",   prenom: "Marie",   telephone: "+509 3412 0011", email: "marie.clerge@mail.ht",   photoUrl: null, role: "ADMIN",      statut: "ACTIF" },
  { id: "2",  nom: "Joseph",   prenom: "Antoine", telephone: "+509 3788 4520", email: "antoine.joseph@mail.ht", photoUrl: null, role: "MANMAN_SOL", statut: "ACTIF" },
  { id: "3",  nom: "Désir",    prenom: "Sassia",  telephone: "+509 4122 9931", email: "sassia.desir@mail.ht",   photoUrl: null, role: "MEMBRE",     statut: "EN_ATTENTE" },
  { id: "4",  nom: "Morne",    prenom: "Bernard", telephone: "+509 3655 7712", email: "bernard.morne@mail.ht",  photoUrl: null, role: "MEMBRE",     statut: "ACTIF" },
  { id: "5",  nom: "Moïse",    prenom: "Karla",   telephone: "+509 4890 1123", email: "karla.moise@mail.ht",    photoUrl: null, role: "MEMBRE",     statut: "BLOQUE" },
  { id: "6",  nom: "Max",      prenom: "Serly",   telephone: "+509 3201 8890", email: "serly.max@mail.ht",      photoUrl: null, role: "MEMBRE",     statut: "ACTIF" },
  { id: "7",  nom: "Pierre",   prenom: "Jonas",   telephone: "+509 3944 2201", email: "jonas.pierre@mail.ht",   photoUrl: null, role: "MEMBRE",     statut: "INACTIF" },
  { id: "8",  nom: "Louis",    prenom: "Fabiola", telephone: "+509 3677 5540", email: "fabiola.louis@mail.ht",  photoUrl: null, role: "MANMAN_SOL", statut: "ACTIF" },
  { id: "9",  nom: "Charles",  prenom: "Widley",  telephone: "+509 4155 8823", email: "widley.charles@mail.ht", photoUrl: null, role: "MEMBRE",     statut: "EN_ATTENTE" },
  { id: "10", nom: "Étienne",  prenom: "Nadège",  telephone: "+509 3822 6710", email: "nadege.etienne@mail.ht", photoUrl: null, role: "MEMBRE",     statut: "ACTIF" },
  { id: "11", nom: "Jean",     prenom: "Ricardo", telephone: "+509 3491 0087", email: "ricardo.jean@mail.ht",   photoUrl: null, role: "MEMBRE",     statut: "ACTIF" },
  { id: "12", nom: "Baptiste", prenom: "Islande", telephone: "+509 4700 3312", email: "islande.b@mail.ht",      photoUrl: null, role: "MEMBRE",     statut: "BLOQUE" },
];

export const memberApi = {
  getAll: async (): Promise<Membre[]> => {
    await delai();
    return [...MEMBRES];
  },

  activer: async (id: string): Promise<Membre> => {
    await delai();
    MEMBRES = MEMBRES.map((m: Membre) => (m.id === id ? { ...m, statut: "ACTIF" } : m));
    return MEMBRES.find((m: Membre) => m.id === id)!;
  },

  desactiver: async (id: string): Promise<Membre> => {
    await delai();
    MEMBRES = MEMBRES.map((m: Membre) => (m.id === id ? { ...m, statut: "BLOQUE" } : m));
    return MEMBRES.find((m: Membre) => m.id === id)!;
  },
};

/* ═══════════════════════════════════════════════════════════
   ✅ VERSION RÉELLE — supprime le mock ci-dessus et décommente :

import { apiClient } from "@/lib/api-client";

export const memberApi = {
  getAll: () =>
    apiClient.get<Membre[]>("/api/admin/utilisateurs").then((r) => r.data),
  activer: (id: string) =>
    apiClient.post<Membre>(`/api/admin/utilisateurs/${id}/activer`).then((r) => r.data),
  desactiver: (id: string) =>
    apiClient.post<Membre>(`/api/admin/utilisateurs/${id}/desactiver`).then((r) => r.data),
};
   ═══════════════════════════════════════════════════════════ */