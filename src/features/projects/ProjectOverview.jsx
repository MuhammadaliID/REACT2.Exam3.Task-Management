"use client";

import { useEffect, useState } from "react";
import { projectApi, projectPath } from "./project-api";

export default function ProjectOverview({ slug, projectId }) {
  const [data, setData] = useState({ project: null, cycles: [], modules: [], issues: [], states: [] });
  const [error, setError] = useState("");
  useEffect(() => {
    async function load() {
      try {
        const base = projectPath(slug, projectId);
        const results = await Promise.allSettled([projectApi(base), projectApi(`${base}/cycles`), projectApi(`${base}/modules`), projectApi(`${base}/issues`), projectApi(`${base}/states`)]);
        const value = (result) => result.status === "fulfilled" ? result.value : [];
        if (results[0].status === "rejected") throw results[0].reason;
        const issueResponse = value(results[3]);
        setData({ project: results[0].value, cycles: value(results[1]), modules: value(results[2]), issues: Array.isArray(issueResponse) ? issueResponse : issueResponse?.data || issueResponse?.items || [], states: value(results[4]) });
      } catch (err) { setError(err.message || "Не удалось загрузить проект."); }
    }
    load();
  }, [slug, projectId]);

  const { project, cycles, modules, issues, states } = data;
  const done = issues.filter((issue) => ["completed", "done", "cancelled"].includes(String(states.find((state) => state.id === issue.state_id)?.group || issue.state?.group || issue.status || "").toLowerCase())).length;
  const percent = issues.length ? Math.round(done / issues.length * 100) : 0;
  const latest = [...issues].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)).slice(0, 5);

  if (error) return <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>;
  return <div className="space-y-5">
    <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"><div className="border-b border-zinc-100 px-5 py-4"><h2 className="font-semibold text-zinc-900">Project progress</h2><p className="mt-1 text-xs text-zinc-500">{done} of {issues.length} tasks completed</p></div><div className="p-6"><div className="flex items-end gap-3"><strong className="text-5xl tracking-tight text-zinc-900">{percent}%</strong><span className="mb-2 text-xs font-medium text-emerald-600">{percent >= 60 ? "On track" : "In progress"}</span></div><div className="mt-5 h-2 rounded-full bg-zinc-100"><div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${percent}%` }} /></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[[issues.length, "Total tasks"], [cycles.length, "Cycles"], [modules.length, "Modules"], [done, "Completed"]].map(([number, label]) => <div key={label} className="rounded-xl bg-zinc-50 p-3"><strong className="text-lg text-zinc-900">{number}</strong><p className="mt-1 text-xs text-zinc-500">{label}</p></div>)}</div></div></section>
      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm"><div className="border-b border-zinc-100 px-5 py-4"><h2 className="font-semibold text-zinc-900">Details</h2><p className="mt-1 text-xs text-zinc-500">Project information</p></div><dl className="space-y-5 p-5 text-sm"><div className="flex justify-between gap-4"><dt className="text-zinc-500">Identifier</dt><dd className="font-medium text-zinc-900">{project?.identifier || "—"}</dd></div><div className="flex justify-between gap-4"><dt className="text-zinc-500">Lead</dt><dd className="font-medium text-zinc-900">{project?.lead?.display_name || "Not assigned"}</dd></div><div className="flex justify-between gap-4"><dt className="text-zinc-500">Cycle</dt><dd className="font-medium text-zinc-900">{cycles.find((cycle) => cycle.status === "active")?.name || "No active cycle"}</dd></div><div className="flex justify-between gap-4"><dt className="text-zinc-500">Module</dt><dd className="max-w-[60%] truncate font-medium text-zinc-900">{modules[0]?.name || "No modules yet"}</dd></div></dl></section>
    </div>
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"><div className="border-b border-zinc-100 px-5 py-4"><h2 className="font-semibold text-zinc-900">Recent tasks</h2><p className="mt-1 text-xs text-zinc-500">Latest activity in {project?.name || "this project"}</p></div>{latest.length ? <div className="divide-y divide-zinc-100">{latest.map((issue) => <div key={issue.id} className="flex items-center justify-between gap-4 px-5 py-4"><div className="flex min-w-0 items-center gap-3"><span className="h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500"/><div className="min-w-0"><p className="truncate text-sm font-medium text-zinc-900">{issue.title || issue.name}</p><p className="mt-1 text-xs text-zinc-400">{issue.identifier || `${project?.identifier || ""}-${issue.sequence_id || ""}`}</p></div></div><span className="text-xs text-zinc-500">{states.find((state) => state.id === issue.state_id)?.name || issue.state?.name || issue.status || "Open"}</span></div>)}</div> : <p className="px-5 py-8 text-sm text-zinc-500">Задач пока нет. Создайте первую задачу во вкладке Issues.</p>}</section>
  </div>;
}
