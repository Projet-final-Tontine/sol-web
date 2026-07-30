import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";
import { notificationApi } from "./notification-api";
import { notificationKeys } from "./notification-keys";

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: notificationApi.getAll,
    staleTime: 30_000,
  });
}

export function useEnvoyerNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.envoyer,
    onSuccess: (notif) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      toast.success(`Notification envoyée à ${notif.nombreDestinataires} membre(s).`);
    },
    onError: (error) => toast.error((error as unknown as ApiError).message),
  });
}