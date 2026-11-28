"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { projectApi, projectPath } from "./project-api";

export default function ProjectCollections({ slug, projectId, type }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const isCycles = type === "cycles";
  const title = isCycles ? "Cycles" : "Modules";
  useEffect(() => {
    projectApi(`${projectPath(slug, projectId)}/${type}`).then((result) => setItems(Array.isArray(result) ? result : result?.items || [])).catch((err) => setError(err.message || `Не удалось загрузить ${title.toLowerCase()}.`));
  }, [slug, projectId, type, title]);

  return <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4"><div><h2 className="font-semibold text-zinc-900">{title}</h2><p className="mt-1 text-xs text-zinc-500">{isCycles ? "Plan and track work in iterations." : "Group related work into milestones."}</p></div><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{items.length} total</span></div>
    {error ? <p role="alert" className="p-5 text-sm text-rose-600">{error}</p> : items.length ? <div className="divide-y divide-zinc-100">{items.map((item) => <Link key={item.id} href={`/w/${slug}/p/${projectId}/${type}/${item.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-zinc-50"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">{isCycles ? "◷" : "▦"}</span><div className="min-w-0"><p className="truncate text-sm font-semibold text-zinc-900">{item.name}</p><p className="mt-1 truncate text-xs text-zinc-500">{item.description || (isCycles ? "No cycle description" : "No module description")}</p></div></div><span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600">{item.status?.replaceAll("_", " ") || "planned"}</span></Link>)}</div> : <div className="px-5 py-12 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-lg text-zinc-500">{isCycles ? "◷" : "▦"}</div><p className="mt-3 text-sm font-medium text-zinc-800">No {title.toLowerCase()} yet</p><p className="mt-1 text-xs text-zinc-500">{isCycles ? "Cycles will appear here when created for this project." : "Modules will appear here when created for this project."}</p></div>}
  </section>;
}
