"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/shared/layout/Sidebar";
import { projectApi, workspaceProjectsPath } from "@/features/projects/project-api";

const colors = ["#6558f5", "#0f9f86", "#ec8b3a", "#3d82c4", "#c05c83"];

export default function WorkspaceShell({ slug, children }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const projectPath = workspaceProjectsPath(slug);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      projectApi(`/workspaces/${encodeURIComponent(slug)}`),
      projectApi(projectPath),
      projectApi(`/workspaces/${encodeURIComponent(slug)}/members`),
      projectApi("/auth/me"),
    ]).then(([workspace, projects, members, user]) => {
      if (!cancelled) setData({ workspace, projects, members, user });
    }).catch((err) => {
      if (!cancelled) setError(err.message || `Workspace "${slug}" could not be loaded.`);
    });
    return () => { cancelled = true; };
  }, [slug, projectPath]);

  if (error) return <div className="grid min-h-screen flex-1 place-items-center bg-zinc-50 p-6"><div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600">!</span><h1 className="mt-4 text-lg font-semibold text-zinc-900">Workspace not found</h1><p className="mt-2 text-sm leading-6 text-zinc-500">{error}. Open your workspaces and select an existing one or create a new one.</p><Link href="/workspaces" className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Open workspaces</Link></div></div>;
  if (!data) return <div className="grid min-h-screen flex-1 place-items-center bg-zinc-50"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-600" /></div>;

  const workspace = data.workspace;
  const projects = Array.isArray(data.projects) ? data.projects : data.projects?.items || [];
  const members = Array.isArray(data.members) ? data.members : data.members?.items || [];
  const user = data.user || {};
  const displayName = user.display_name || user.email || "Account";
  const initials = displayName.split(/[\s@._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("") || "U";

  return <><Sidebar slug={slug} workspace={{ name: workspace.name, memberCount: members.length, avatarInitial: workspace.name?.[0]?.toUpperCase() || "W", color: "#6558f5" }} projects={projects.map((project, index) => ({ ...project, color: colors[index % colors.length] }))} user={{ name: displayName, email: user.email || "", initials, color: "#b16b53" }} unreadCount={0} /><div className="flex min-w-0 flex-1 flex-col bg-[#f7f7f9]"><main className="flex-1 px-6 py-7 lg:px-8">{children}</main></div></>;
}
