export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  detail: (id: string) => [...memberKeys.all, "detail", id] as const,
};