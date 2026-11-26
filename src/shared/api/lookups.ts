import { apiRequest } from "./client";
import type { Project, Role, User, Workspace } from "./types";

export async function fetchCurrentUser(): Promise<User> {
  return apiRequest<User>("/auth/me");
}

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const data = await apiRequest<{ items: Workspace[] }>("/workspaces");
  return data.items;
}

export async function fetchProjects(workspaceSlug: string): Promise<Project[]> {
  const data = await apiRequest<{ items: Project[] }>(
    `/workspaces/${encodeURIComponent(workspaceSlug)}/projects`,
  );
  return data.items;
}

export async function fetchMembers(workspaceSlug: string): Promise<User[]> {
  const data = await apiRequest<{ items: User[] }>(
    `/workspaces/${encodeURIComponent(workspaceSlug)}/members`,
  );
  return data.items;
}

export const roleLookup: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
};
