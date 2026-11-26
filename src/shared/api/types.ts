export type ID = string;

export type Role = "owner" | "admin" | "member" | "viewer";

export type User = {
  id: ID;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type Workspace = {
  id: ID;
  name: string;
  slug: string;
};

export type Project = {
  id: ID;
  name: string;
  workspaceId: ID;
  slug: string;
};

export type Issue = {
  id: ID;
  title: string;
  description?: string;
  projectId: ID;
  assigneeId?: ID;
};

export type ApiList<T> = {
  items: T[];
  total: number;
};
