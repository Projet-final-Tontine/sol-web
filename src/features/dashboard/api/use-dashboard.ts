import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./dashboard-api";
import { dashboardKeys } from "./dashboard-keys";

/** KPIs — rafraîchis souvent, ce sont les chiffres du jour. */
export function useStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardApi.getStats,
    staleTime: 30_000, // 30 s
  });
}

/** Graphique de flux — données mensuelles, elles bougent peu. */
export function useFlux() {
  return useQuery({
    queryKey: dashboardKeys.flux(),
    queryFn: dashboardApi.getFlux,
    staleTime: 5 * 60_000, // 5 min
  });
}

/** Activité récente — la plus volatile. */
export function useRecentes() {
  return useQuery({
    queryKey: dashboardKeys.recentes(),
    queryFn: dashboardApi.getRecentes,
    staleTime: 30_000,
  });
}