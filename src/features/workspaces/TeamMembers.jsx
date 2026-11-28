"use client";

import { useEffect, useState } from "react";
import { projectApi } from "@/features/projects/project-api";

const roles = ["admin", "member", "guest"];

export default function TeamMembers({ slug }) {
  const [members, setMembers] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [sending, setSending] = useState(false);
  const [menu, setMenu] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const base = `/workspaces/${encodeURIComponent(slug)}`;

  useEffect(() => {
    let cancelled = false;
    projectApi(`${base}/members`).then((result) => {
      if (!cancelled) setMembers(Array.isArray(result) ? result : result?.items || []);
    }).catch((err) => {
      if (!cancelled) setError(err.message || "Не удалось загрузить участников workspace.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [base]);

  async function inviteMember(event) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const invite = await projectApi(`${base}/members/invite`, { method: "POST", body: { email: email.trim(), role } });
      const link = `${window.location.origin}/invite/${invite.token}`;
      setPending((current) => [{ id: invite.id, email: invite.email, role: invite.role, token: invite.token }, ...current]);
      setInviteLink(link);
      setEmail("");
    } catch (err) {
      setError(err.message || "Не удалось отправить приглашение.");
    } finally {
      setSending(false);
    }
  }

  async function updateRole(member, nextRole) {
    setError("");
    try {
      const updated = await projectApi(`${base}/members/${member.user_id}`, { method: "PATCH", body: { role: nextRole } });
      setMembers((current) => current.map((item) => item.user_id === member.user_id ? updated : item));
      setMenu("");
    } catch (err) { setError(err.message || "Не удалось обновить роль."); }
  }

  async function removeMember(member) {
    if (!window.confirm(`Remove ${member.user?.display_name || member.user?.email} from this workspace?`)) return;
    setError("");
    try {
      await projectApi(`${base}/members/${member.user_id}`, { method: "DELETE" });
      setMembers((current) => current.filter((item) => item.user_id !== member.user_id));
      setMenu("");
    } catch (err) { setError(err.message || "Не удалось удалить участника."); }
  }

  async function copyInvite() {
    await navigator.clipboard.writeText(inviteLink);
    setInviteLink("");
    setModal(false);
  }

  return <main className="mx-auto w-full max-w-6xl">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Team members</h1><p className="mt-2 text-sm text-zinc-500">People with access to your workspace</p></div><button onClick={() => { setError(""); setInviteLink(""); setModal(true); }} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"><span className="mr-2">＋</span>Invite member</button></div>
    {error && !modal ? <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
    <section className="mt-8 overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="grid grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_120px_40px] gap-4 border-b border-zinc-200 bg-zinc-50/70 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 max-sm:grid-cols-[1fr_40px]"><span>Member</span><span className="max-sm:hidden">Email</span><span className="max-sm:hidden">Role</span><span /></div>
      {loading ? <div className="space-y-3 p-5"><div className="h-10 animate-pulse rounded-lg bg-zinc-100"/><div className="h-10 animate-pulse rounded-lg bg-zinc-100"/></div> : members.length || pending.length ? <>
        {members.map((member, index) => {
          const user = member.user || {};
          const name = user.display_name || user.email?.split("@")[0] || "Workspace member";
          return <div key={member.user_id} className="relative grid grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_120px_40px] items-center gap-4 border-b border-zinc-100 px-5 py-4 text-sm max-sm:grid-cols-[1fr_40px]">
            <div className="flex min-w-0 items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-500 text-[11px] font-semibold text-white">{name.trim().slice(0, 1).toUpperCase()}</span><span className="truncate font-semibold text-zinc-900">{name}</span></div>
            <span className="truncate text-xs text-zinc-500 max-sm:hidden">{user.email}</span><span className="text-xs font-medium capitalize text-zinc-800 max-sm:hidden">{member.role}</span>
            <div className="relative justify-self-center"><button aria-label={`Actions for ${name}`} onClick={() => setMenu(menu === member.user_id ? "" : member.user_id)} className="rounded-md px-2 py-1 text-lg leading-none text-zinc-500 hover:bg-zinc-100">···</button>{menu === member.user_id ? <div className={`absolute right-0 z-10 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg ${index > members.length - 2 ? "bottom-9" : "top-9"}`}><p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Change role</p>{roles.map((item) => <button key={item} disabled={member.role === "owner" || item === member.role} onClick={() => updateRole(member, item)} className="block w-full rounded-lg px-2 py-1.5 text-left text-xs capitalize text-zinc-700 hover:bg-zinc-50 disabled:opacity-40">{item}</button>)}<button disabled={member.role === "owner"} onClick={() => removeMember(member)} className="mt-1 block w-full rounded-lg border-t border-zinc-100 px-2 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-40">Remove from workspace</button></div> : null}</div>
          </div>;
        })}
        {pending.map((invite) => <div key={invite.id} className="grid grid-cols-[minmax(220px,1.2fr)_minmax(180px,1fr)_120px_40px] items-center gap-4 border-b border-zinc-100 px-5 py-4 text-sm opacity-80 max-sm:grid-cols-[1fr_40px]"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">✉</span><span className="font-medium text-zinc-700">Invitation pending</span></div><span className="truncate text-xs text-zinc-500 max-sm:hidden">{invite.email}</span><span className="text-xs capitalize text-zinc-500 max-sm:hidden">{invite.role}</span><button title="Copy invite link" onClick={() => setInviteLink(`${window.location.origin}/invite/${invite.token}`)} className="text-xs text-indigo-600 hover:underline">Link</button></div>)}
      </> : <div className="px-5 py-12 text-center"><p className="text-sm font-medium text-zinc-800">No team members found</p><p className="mt-1 text-xs text-zinc-500">Invite someone to start collaborating.</p></div>}
      <button onClick={() => { setError(""); setInviteLink(""); setModal(true); }} className="flex w-full items-center gap-2 px-5 py-4 text-left text-xs font-medium text-indigo-600 hover:bg-zinc-50"><span className="text-base">＋</span>Invite another member</button>
    </section>

    {modal ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(false); }}><section role="dialog" aria-modal="true" aria-labelledby="invite-title" className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5"><div><h2 id="invite-title" className="text-lg font-semibold text-zinc-900">Invite a teammate</h2><p className="mt-1 text-xs text-zinc-400">They’ll receive access to the {slug} workspace.</p></div><button aria-label="Close" onClick={() => setModal(false)} className="rounded-lg p-1 text-xl leading-none text-zinc-400 hover:bg-zinc-100">×</button></div>
      {inviteLink ? <div className="space-y-4 px-6 py-6"><div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-sm font-semibold text-emerald-800">Invitation created</p><p className="mt-1 text-xs text-emerald-700">In development, the invite link is also printed in the backend terminal.</p></div><label className="block text-xs font-semibold text-zinc-600">Invite link<input readOnly value={inviteLink} className="mt-2 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-xs text-zinc-600"/></label><div className="flex justify-end gap-3"><button onClick={() => setModal(false)} className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm text-zinc-700">Close</button><button onClick={copyInvite} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Copy invite link</button></div></div> : <form onSubmit={inviteMember} className="space-y-4 px-6 py-5">
        <label className="block text-xs font-semibold text-zinc-600">Email address<input autoFocus required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="teammate@company.com" className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-3 text-sm font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"/></label>
        <label className="block text-xs font-semibold text-zinc-600">Workspace role<select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-3 text-sm font-normal capitalize outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">{roles.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        {error ? <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4"><button type="button" onClick={() => setModal(false)} className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Cancel</button><button disabled={sending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60">{sending ? "Sending…" : "Send invitation"}</button></div>
      </form>}
    </section></div> : null}
  </main>;
}
