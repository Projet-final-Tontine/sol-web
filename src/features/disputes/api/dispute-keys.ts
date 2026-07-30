export const disputeKeys = {
  all: ["disputes"] as const,
  lists: () => [...disputeKeys.all, "list"] as const,
  detail: (id: string) => [...disputeKeys.all, "detail", id] as const,
};