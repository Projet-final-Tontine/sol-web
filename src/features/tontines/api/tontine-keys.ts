export const tontineKeys = {
  all: ["tontines"] as const,
  lists: () => [...tontineKeys.all, "list"] as const,
  detail: (id: string) => [...tontineKeys.all, "detail", id] as const,
};