"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { projectApi, workspaceProjectsPath } from "./project-api";

const colors = ["#6558f5", "#0f9f86", "#ec8b3a", "#3d82c4", "#c05c83"];

export default function ProjectsWorkspace({ slug }) {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", identifier: "", description: "", lead_id: "" });

  const path = useMemo(() => workspaceProjectsPath(slug), [slug]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      projectApi(path),
      projectApi(`/workspaces/${encodeURIComponent(slug)}/members`),
    ]).then(([projectData, memberData]) => {
      if (cancelled) return;
      setProjects(Array.isArray(projectData) ? projectData : projectData?.items || []);
      setMembers(Array.isArray(memberData) ? memberData : memberData?.items || []);
      setError("");
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Не удалось загрузить проекты.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [path, slug]);

  function updateName(name) {
    setForm((current) => ({
      ...current,
      name,
      identifier: current.identifierTouched ? current.identifier : name.replace(/[^a-z\d]/gi, "").slice(0, 5).toUpperCase(),
    }));
  }

  async function createProject(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const project = await projectApi(path, {
        method: "POST",
        body: {
          name: form.name.trim(),
          identifier: form.identifier.trim().toUpperCase(),
          description: form.description.trim(),
          ...(form.lead_id ? { lead_id: form.lead_id } : {}),
        },
      });
      setProjects((current) => [project, ...current]);
      setOpen(false);
      setForm({ name: "", identifier: "", description: "", lead_id: "" });
    } catch (err) {
      setError(err.message || "Не удалось создать проект.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Projects</h1>
          <p className="mt-2 text-sm text-zinc-500">Все инициативы и команды вашего рабочего пространства.</p>
        </div>
        <button onClick={() => { setError(""); setOpen(true); }} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
          <span className="mr-2">＋</span>New project
        </button>
      </div>

      {error && !open ? <div role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {loading ? <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-52 animate-pulse rounded-2xl border border-zinc-200 bg-white" />)}</div> : projects.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Link key={project.id} href={`/w/${slug}/p/${project.id}`} className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-semibold text-white" style={{ background: colors[index % colors.length] }}>{project.name?.[0]?.toUpperCase() || "P"}</span>
                <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-zinc-600">{project.identifier}</span>
              </div>
              <h2 className="mt-5 text-lg font-semibold text-zinc-900 group-hover:text-indigo-700">{project.name}</h2>
              <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-500">{project.description || "No description yet."}</p>
              <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs text-zinc-400"><span>Open project</span><span className="text-indigo-600 transition group-hover:translate-x-1">→</span></div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">✦</div>
          <h2 className="mt-4 text-lg font-semibold text-zinc-900">Пока нет проектов</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">Создайте проект, чтобы собрать задачи, циклы и модули в одном месте.</p>
          <button onClick={() => setOpen(true)} className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Create your first project</button>
        </div>
      )}

      {open ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="create-project-title" className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
            <div><h2 id="create-project-title" className="text-lg font-semibold text-zinc-900">Create project</h2><p className="mt-1 text-sm text-zinc-500">Create a focused space for a new initiative.</p></div>
            <button aria-label="Close" onClick={() => setOpen(false)} className="rounded-lg p-1 text-xl leading-none text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">×</button>
          </div>
          <form onSubmit={createProject} className="space-y-4 px-6 py-5">
            <label className="block text-xs font-semibold text-zinc-600">Project name<input autoFocus required maxLength={100} value={form.name} onChange={(event) => updateName(event.target.value)} placeholder="e.g. Mobile experience" className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-3 text-sm font-normal text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-zinc-600">Identifier<input required maxLength={10} pattern="[A-Za-z0-9]+" value={form.identifier} onChange={(event) => setForm((current) => ({ ...current, identifier: event.target.value.toUpperCase(), identifierTouched: true }))} placeholder="MOB" className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-3 text-sm font-normal uppercase text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /><span className="mt-1 block font-normal text-zinc-400">Letters and numbers, up to 10 characters</span></label>
              <label className="block text-xs font-semibold text-zinc-600">Lead<select value={form.lead_id} onChange={(event) => setForm((current) => ({ ...current, lead_id: event.target.value }))} className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm font-normal text-zinc-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"><option value="">Select a workspace member</option>{members.map((member) => <option key={member.user?.id || member.user_id || member.id} value={member.user?.id || member.user_id || member.id}>{member.user?.display_name || member.display_name || member.user?.email || member.email || "Workspace member"}</option>)}</select></label>
            </div>
            <label className="block text-xs font-semibold text-zinc-600">Description<textarea maxLength={500} rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="What is this project aiming to achieve?" className="mt-2 w-full resize-none rounded-lg border border-zinc-200 px-3 py-3 text-sm font-normal text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>
            {error ? <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
            <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4"><button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Cancel</button><button disabled={saving} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">{saving ? "Creating…" : "Create project"}</button></div>
          </form>
        </section>
      </div> : null}
    </main>
  );
}

