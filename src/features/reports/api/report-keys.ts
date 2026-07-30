import type { Periode } from "../types";

export const reportKeys = {
  all: ["reports"] as const,
  rapport: (periode: Periode) => [...reportKeys.all, periode] as const,
};