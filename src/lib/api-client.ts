import axios from "axios";
import { env } from "@/config/env";
import { tokenStore } from "@/lib/token-store";
import type { ApiError } from "@/types/api";

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
});

/* Intercepteur de requête : attache le JWT à chaque appel sortant. */
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Intercepteur de réponse : gère le 401 et normalise TOUTES les erreurs. */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      window.dispatchEvent(new Event("session-expired")); // capté par l'AuthProvider en Phase 2
    }
    return Promise.reject(normalizeApiError(error));
  }
);

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    // Le serveur a répondu avec un code d'erreur
    if (error.response) {
      const data = error.response.data as
        | { message?: string; errors?: Record<string, string> }
        | undefined;
      return {
        status: error.response.status,
        message: data?.message ?? "Une erreur est survenue. Réessaie dans un instant.",
        fieldErrors: data?.errors,
      };
    }
    // Pas de réponse du tout
    if (error.code === "ECONNABORTED") {
      return { status: 0, message: "Le serveur met trop de temps à répondre." };
    }
    return { status: 0, message: "Impossible de joindre le serveur. Vérifie ta connexion." };
  }
  return { status: 0, message: "Erreur inattendue." };
}