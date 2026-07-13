import {
  createContext, useCallback, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tokenStore } from "@/lib/token-store";
import type { ApiError } from "@/types/api";
import { authApi } from "../api/auth-api";
import type { ConnexionRequest, Utilisateur } from "../types";

const USER_KEY = "sol_admin_user";

interface AuthContextValue {
  utilisateur: Utilisateur | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  connexion: (identifiants: ConnexionRequest) => Promise<void>;
  deconnexion: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  /* Le backend n'expose pas GET /api/auth/me : on restaure la session
     depuis le localStorage. Le token reste la seule autorité — si le
     serveur le rejette, l'intercepteur Axios émet "session-expired". */
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(() => {
    const brut = localStorage.getItem(USER_KEY);
    if (!brut || !tokenStore.get()) return null;
    try {
      return JSON.parse(brut) as Utilisateur;
    } catch {
      return null;
    }
  });

  const [isLoading] = useState(false); // restauration synchrone : aucun appel réseau

  /* Session expirée en cours d'usage (401 capté par l'intercepteur Axios). */
  useEffect(() => {
    const onExpired = () => {
      tokenStore.clear();
      localStorage.removeItem(USER_KEY);
      setUtilisateur(null);
      queryClient.clear();
      toast.error("Session expirée. Reconnecte-toi.");
    };
    window.addEventListener("session-expired", onExpired);
    return () => window.removeEventListener("session-expired", onExpired);
  }, [queryClient]);

  const connexion = useCallback(async (identifiants: ConnexionRequest) => {
    const { token, utilisateur } = await authApi.connexion(identifiants);

    /* Le backend délivre un token à TOUT compte valide (MEMBRE inclus).
       La console est réservée aux ADMIN : on refuse ici. */
    if (utilisateur.role !== "ADMIN") {
      throw {
        status: 403,
        message: "Cette console est réservée aux administrateurs.",
      } satisfies ApiError;
    }

    tokenStore.set(token);
    localStorage.setItem(USER_KEY, JSON.stringify(utilisateur));
    setUtilisateur(utilisateur);
  }, []);

  const deconnexion = useCallback(() => {
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
    setUtilisateur(null);
    queryClient.clear(); // aucune donnée financière ne survit à la déconnexion
  }, [queryClient]);

  const value = useMemo(
    () => ({
      utilisateur,
      isAuthenticated: utilisateur !== null,
      isLoading,
      connexion,
      deconnexion,
    }),
    [utilisateur, isLoading, connexion, deconnexion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}