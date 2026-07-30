import { useQuery } from "@tanstack/react-query";
import { reportApi } from "./report-api";
import { reportKeys } from "./report-keys";
import type { Periode } from "../types";

export function useRapport(periode: Periode) {
  return useQuery({
    queryKey: reportKeys.rapport(periode),
    queryFn: () => reportApi.getRapport(periode),
    staleTime: 5 * 60_000,
  });
}