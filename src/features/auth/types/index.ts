/** Rôles réels du backend. Seul ADMIN accède à la console. */
export type Role = "MEMBRE" | "MANMAN_SOL" | "ADMIN";

/** Statuts de compte côté backend. */
export type StatutCompte = "EN_ATTENTE" | "ACTIF" | "BLOQUE" | "INACTIF";

/** Miroir exact de UtilisateurResponse (Spring). */
export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  photoUrl: string | null;
  role: Role;
  statut: StatutCompte;
}

/** Corps de POST /api/auth/connexion.
 *  Le backend cherche par téléphone PUIS par email : ce champ accepte les deux. */
export interface ConnexionRequest {
  telephone: string;
  motDePasse: string;
}

/** Réponse de POST /api/auth/connexion. */
export interface ConnexionResponse {
  token: string;
  utilisateur: Utilisateur;
}
