export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
  workspaces: {
    all: ["workspaces"] as const,
    list: () => [...queryKeys.workspaces.all, "list"] as const,
    detail: (slug: string) => [...queryKeys.workspaces.all, "detail", slug] as const,
    members: (slug: string) => [...queryKeys.workspaces.all, "members", slug] as const,
  },
  projects: {
    all: ["projects"] as const,
    list: (workspaceSlug: string) =>
      [...queryKeys.projects.all, "list", workspaceSlug] as const,
    detail: (projectId: string) =>
      [...queryKeys.projects.all, "detail", projectId] as const,
  },
  issues: {
    all: ["issues"] as const,
    list: (projectId: string) => [...queryKeys.issues.all, "list", projectId] as const,
    detail: (issueId: string) => [...queryKeys.issues.all, "detail", issueId] as const,
  },
  cycles: {
    all: ["cycles"] as const,
    list: (projectId: string) => [...queryKeys.cycles.all, "list", projectId] as const,
    detail: (cycleId: string) => [...queryKeys.cycles.all, "detail", cycleId] as const,
  },
  modules: {
    all: ["modules"] as const,
    list: (projectId: string) => [...queryKeys.modules.all, "list", projectId] as const,
    detail: (moduleId: string) => [...queryKeys.modules.all, "detail", moduleId] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: () => [...queryKeys.notifications.all, "list"] as const,
  },
} as const;
