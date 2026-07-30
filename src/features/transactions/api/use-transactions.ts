import { useQuery } from "@tanstack/react-query";
import { transactionApi } from "./transaction-api";
import { transactionKeys } from "./transaction-keys";

export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.lists(),
    queryFn: transactionApi.getAll,
    staleTime: 30_000,
  });
}