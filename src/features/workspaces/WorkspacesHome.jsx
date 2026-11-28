"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { projectApi } from "@/features/projects/project-api";

export default function WorkspacesHome() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    projectApi("/workspaces").then((result) => {
      if (!cancelled) setWorkspaces(Array.isArray(result) ? result : result?.items || []);
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Не удалось загрузить рабочие пространства.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  function updateName(value) {
    setName(value);
    setSlug(value.normalize("NFKD").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50));
  }

  async function createWorkspace(event) {
    event.preventDefault();
    setError("");
    setCreating(true);
    try {
      const workspace = await projectApi("/workspaces", { method: "POST", body: { name: name.trim(), slug } });
      router.replace(`/w/${workspace.slug}/projects`);
    } catch (err) {
      setError(err.message || "Не удалось создать workspace.");
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <div className="grid min-h-screen place-items-center bg-zinc-50"><div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-600" /></div>;

  return <main className="grid min-h-screen place-items-center bg-[#f7f7f9] px-4 py-10">
    <section className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-9">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-semibold text-white">N</div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Get started</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{workspaces.length ? "Choose a workspace" : "Create your workspace"}</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{workspaces.length ? "Open a workspace to see its projects and team." : "A workspace brings your projects and teammates together."}</p>

      {workspaces.length ? <div className="mt-6 space-y-2">{workspaces.map((workspace) => <button key={workspace.id} onClick={() => router.push(`/w/${workspace.slug}/projects`)} className="flex w-full items-center justify-between rounded-xl border border-zinc-200 px-4 py-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50/50"><span><span className="block font-semibold text-zinc-900">{workspace.name}</span><span className="mt-1 block text-xs text-zinc-500">/{workspace.slug}</span></span><span className="text-lg text-indigo-600">→</span></button>)}</div> : <form onSubmit={createWorkspace} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-zinc-700">Workspace name<input required maxLength={100} autoFocus value={name} onChange={(event) => updateName(event.target.value)} placeholder="e.g. Northstar" className="mt-2 w-full rounded-lg border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
        <label className="block text-sm font-medium text-zinc-700">Workspace address<input required minLength={2} maxLength={50} pattern="[a-z0-9-]+" value={slug} onChange={(event) => setSlug(event.target.value.toLowerCase())} placeholder="northstar" className="mt-2 w-full rounded-lg border border-zinc-200 px-3.5 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /><span className="mt-1 block text-xs font-normal text-zinc-400">Lowercase letters, numbers and hyphens</span></label>
        {error ? <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        <button disabled={creating} className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60">{creating ? "Creating…" : "Create workspace"}</button>
      </form>}
      {error && workspaces.length ? <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
    </section>
  </main>;
}
