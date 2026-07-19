import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { memberApi } from "./member-api";
import { memberKeys } from "./member-keys";

export function useMembres() {
  return useQuery({
    queryKey: memberKeys.lists(),
    queryFn: memberApi.getAll,
    staleTime: 60_000,
  });
}

export function useActiverMembre() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => memberApi.activer(id),
    onSuccess: (membre) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      toast.success(`Compte de ${membre.prenom} ${membre.nom} activé.`);
    },
    onError: (error) => toast.error((error as unknown as ApiError).message),
  });
}

export function useDesactiverMembre() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => memberApi.desactiver(id),
    onSuccess: (membre) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      toast.success(`Compte de ${membre.prenom} ${membre.nom} bloqué.`);
    },
    onError: (error) => toast.error((error as unknown as ApiError).message),
  });
}