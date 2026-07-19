/** Query keys du dashboard — hiérarchiques, pour une invalidation chirurgicale. */
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  flux: () => [...dashboardKeys.all, "flux"] as const,
  recentes: () => [...dashboardKeys.all, "recentes"] as const,
};