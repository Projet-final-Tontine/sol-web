import { QueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types/api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,            // une donnée est "fraîche" 30 s par défaut
      refetchOnWindowFocus: true,   // re-synchronise quand l'admin revient sur l'onglet
      retry: (failureCount, error) => {
        const status = (error as ApiError).status;
        // Erreur client (400, 401, 403, 404…) : réessayer ne changera rien.
        if (status >= 400 && status < 500) return false;
        // Erreur serveur ou réseau : deux tentatives supplémentaires max.
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false, // JAMAIS de retry automatique sur une écriture — règle fintech
    },
  },
});