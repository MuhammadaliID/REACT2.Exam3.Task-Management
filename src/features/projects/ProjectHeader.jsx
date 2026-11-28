"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { projectApi, projectPath } from "./project-api";

export default function ProjectHeader({ slug, projectId }) {
  const [project, setProject] = useState(null);
  const pathname = usePathname();
  useEffect(() => { projectApi(projectPath(slug, projectId)).then(setProject).catch(() => {}); }, [slug, projectId]);
  const base = `/w/${slug}/p/${projectId}`;
  const tabs = [{ label: "Overview", href: base }, { label: "Issues", href: `${base}/issues` }, { label: "Board", href: `${base}/board` }, { label: "Cycles", href: `${base}/cycles` }, { label: "Modules", href: `${base}/modules` }, { label: "Settings", href: `${base}/settings` }];

  return <header className="border-b border-zinc-200 pb-0">
    <div className="mb-5 flex items-start gap-3"><span className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-semibold text-white">{project?.name?.[0]?.toUpperCase() || "P"}</span><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">{project?.identifier || "Project"}</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">{project?.name || "Loading project…"}</h1>{project?.description ? <p className="mt-1 text-sm text-zinc-500">{project.description}</p> : null}</div></div>
    <nav aria-label="Project navigation" className="flex gap-6 overflow-x-auto">{tabs.map((tab) => { const active = pathname === tab.href || (tab.href !== base && pathname.startsWith(`${tab.href}/`)); return <Link key={tab.label} href={tab.href} className={`relative whitespace-nowrap py-3 text-sm transition ${active ? "font-semibold text-indigo-700 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-indigo-600" : "font-medium text-zinc-500 hover:text-zinc-900"}`}>{tab.label}</Link>; })}</nav>
  </header>;
}
