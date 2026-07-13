import type { ConnexionRequest, ConnexionResponse, Utilisateur } from "../types";
import type { ApiError } from "@/types/api";

/* ⚠️ TEMPORAIRE — en attendant l'URL du backend. Mot de passe : "demo" */
const FAUX_ADMIN: Utilisateur = {
  id: "1",
  nom: "Laguerre",
  prenom: "Mitovens",
  telephone: "+50900000000",
  email: "admin@solenligne.ht",
  photoUrl: null,
  role: "ADMIN",
  statut: "ACTIF",
};

export const authApi = {
  connexion: async (i: ConnexionRequest): Promise<ConnexionResponse> => {
    await new Promise((r) => setTimeout(r, 600));
    if (i.motDePasse !== "demo") {
      throw { status: 400, message: "Identifiants incorrects." } satisfies ApiError;
    }
    return { token: "jeton-demo", utilisateur: FAUX_ADMIN };
  },
};