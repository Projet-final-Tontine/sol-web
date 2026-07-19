import type { Role, StatutCompte } from "@/features/auth";

/** Miroir de UtilisateurResponse (backend). Réutilise les types d'auth. */
export interface Membre {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  photoUrl: string | null;
  role: Role;
  statut: StatutCompte;
}

/** Filtres appliqués côté client (le backend ne filtre pas encore). */
export interface FiltresMembres {
  recherche: string;
  statut: StatutCompte | "TOUS";
  role: Role | "TOUS";
}