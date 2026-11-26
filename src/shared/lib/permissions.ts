import type { Role } from "../api/types";

const roleWeight: Record<Role, number> = {
  viewer: 0,
  member: 1,
  admin: 2,
  owner: 3,
};

export function hasRoleAtLeast(role: Role, required: Role): boolean {
  return roleWeight[role] >= roleWeight[required];
}

export function canEdit(role: Role): boolean {
  return hasRoleAtLeast(role, "member");
}

export function canManageMembers(role: Role): boolean {
  return hasRoleAtLeast(role, "admin");
}

export function canManageWorkspace(role: Role): boolean {
  return hasRoleAtLeast(role, "owner");
}
