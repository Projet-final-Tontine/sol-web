import { useQuery } from "@tanstack/react-query";
import { tontineApi } from "./tontine-api";
import { tontineKeys } from "./tontine-keys";

/** Liste de tous les sols. */
export function useSols() {
  return useQuery({
    queryKey: tontineKeys.lists(),
    queryFn: tontineApi.getAll,
    staleTime: 60_000,
  });
}

/** Détail d'un sol. `id` peut être undefined le temps que l'URL soit lue. */
export function useSolDetail(id: string | undefined) {
  return useQuery({
    queryKey: tontineKeys.detail(id ?? ""),
    queryFn: () => tontineApi.getDetail(id!),
    enabled: Boolean(id),   // ← ne lance rien tant que l'id est absent
    staleTime: 30_000,
  });
}