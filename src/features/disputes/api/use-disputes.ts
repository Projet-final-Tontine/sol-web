import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { disputeApi } from "./dispute-api";
import { disputeKeys } from "./dispute-keys";
import type { StatutLitige } from "../types";

export function useLitiges() {
  return useQuery({
    queryKey: disputeKeys.lists(),
    queryFn: disputeApi.getAll,
    staleTime: 30_000,
  });
}

export function useLitige(id: string | undefined) {
  return useQuery({
    queryKey: disputeKeys.detail(id ?? ""),
    queryFn: () => disputeApi.getById(id!),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}

export function useChangerStatut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statut, note }: { id: string; statut: StatutLitige; note: string }) =>
      disputeApi.changerStatut(id, statut, note),
    onSuccess: (litige) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(litige.id) });
      queryClient.invalidateQueries({ queryKey: disputeKeys.lists() });
      toast.success("Statut mis à jour.");
    },
    onError: (error) => toast.error((error as unknown as ApiError).message),
  });
}

export function useAjouterNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, contenu }: { id: string; contenu: string }) =>
      disputeApi.ajouterNote(id, contenu),
    onSuccess: (litige) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(litige.id) });
      toast.success("Note ajoutée.");
    },
    onError: (error) => toast.error((error as unknown as ApiError).message),
  });
}