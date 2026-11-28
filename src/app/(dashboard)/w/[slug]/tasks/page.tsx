"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  GetProjects,
  GetIssues,
  CreateIssue,
  GetStates,
  GetLabels,
  GetMembers,
} from "./api"

type ProjectItem = {
  id: string
  name: string
  identifier?: string
}

type StateItem = {
  id: string
  name: string
}

type LabelItem = {
  id: string
  name: string
}

type MemberItem = {
  id?: string
  user_id?: string
  display_name?: string
  name?: string
  email?: string
}

type IssueItem = {
  id: string
  title: string
  project_id: string
  state_id?: string
  state?: string
  sequence_id?: number
  priority?: string
  due_date?: string | null
  assignees?: MemberItem[]
  _project?: ProjectItem
}
const priorityColors: Record<string, string> = {
  urgent: "text-red-600",
  high: "text-orange-600",
  medium: "text-yellow-600",
  low: "text-zinc-400",
  none: "text-zinc-300",
}

function PriorityLabel({ priority }: { priority: string }) {
  const p = (priority || "none").toLowerCase()
  const label = p.charAt(0).toUpperCase() + p.slice(1)
  return <span className={priorityColors[p] || "text-zinc-400"}>{label}</span>
}
function StatusIcon({ status }: { status: string }) {
  const s = (status || "").toLowerCase()

  if (s.includes("done") || s.includes("complete")) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )
  }
  if (s.includes("progress")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
        <path d="M10 2a8 8 0 0 1 0 16" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }
  if (s.includes("review")) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
        <path d="M10 2a8 8 0 0 1 0 16" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="none" stroke="#d1d5db" strokeWidth="2.5" />
    </svg>
  )
}

function formatDue(dateStr: string | null | undefined) {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
}

const avatarColors = ["#b16b53", "#3d82c4", "#6558f5", "#0f9f86", "#c05c83", "#ec8b3a"]

function OwnerAvatar({ assignees }: { assignees?: MemberItem[] }) {
  if (!assignees || !assignees.length) return <span className="text-xs text-zinc-300">—</span>
  const a = assignees[0]
  const name = a?.display_name || a?.name || a?.email || "?"
  const initial = name.charAt(0).toUpperCase()
  const color = avatarColors[name.charCodeAt(0) % avatarColors.length]
  return (
    <span
      className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
      title={name}
    >
      {initial}
    </span>
  )
}

const filterOptions = [
  { value: "", label: "All" },
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
]

function CreateTaskModal({
  open,
  onClose,
  slug,
  projects,
  members,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  slug: string
  projects: ProjectItem[]
  members: MemberItem[]
  onCreated: () => void
}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [projectId, setProjectId] = useState("")
  const [stateId, setStateId] = useState("")
  const [priority, setPriority] = useState("none")
  const [assigneeId, setAssigneeId] = useState("")
  const [labelId, setLabelId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [projectStates, setProjectStates] = useState<StateItem[]>([])
  const [projectLabels, setProjectLabels] = useState<LabelItem[]>([])

  const activeProjectId = projectId || projects[0]?.id || ""

  useEffect(() => {
    if (!activeProjectId || !slug) return
    GetStates(slug, activeProjectId).then(setProjectStates)
    GetLabels(slug, activeProjectId).then(setProjectLabels)
  }, [slug, activeProjectId])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !activeProjectId) return
    setLoading(true)
    setError("")

    const body: Record<string, string> = { title: title.trim() }
    if (description.trim()) body.description = description.trim()
    if (stateId) body.state_id = stateId
    if (priority !== "none") body.priority = priority
    if (assigneeId) body.assignee_id = assigneeId
    if (labelId) body.label_id = labelId

    const result = await CreateIssue(slug, activeProjectId, body)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setTitle("")
      setDescription("")
      setStateId("")
      setPriority("none")
      setAssigneeId("")
      setLabelId("")
      setError("")
      onCreated()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Create task</h2>
            <p className="text-sm text-zinc-500">Capture the work and give it a clear owner.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Task title</label>
            <input
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add helpful context..."
              className="mt-1 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700">Project</label>
              <select
                value={activeProjectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-indigo-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Status</label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-indigo-500"
              >
                <option value="">Default</option>
                {projectStates.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-indigo-500"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-indigo-500"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user_id || m.id} value={m.user_id || m.id}>
                    {m.display_name || m.name || m.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-1/2 pr-2">
            <label className="block text-sm font-medium text-zinc-700">Label</label>
            <select
              value={labelId}
              onChange={(e) => setLabelId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-indigo-500"
            >
              <option value="">None</option>
              {projectLabels.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MyTasksPage() {
  const params = useParams()
  const slug = (params?.slug as string) || "northstar"

  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [issues, setIssues] = useState<IssueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [members, setMembers] = useState<MemberItem[]>([])

  const [projectMap, setProjectMap] = useState<Record<string, ProjectItem>>({})
  const [statesMap, setStatesMap] = useState<Record<string, string>>({})

  const loadData = useCallback(async () => {
    const projectsList: ProjectItem[] = await GetProjects(slug)
    setProjects(projectsList)

    const pMap: Record<string, ProjectItem> = {}
    projectsList.forEach((p) => {
      pMap[p.id] = p
    })
    setProjectMap(pMap)

    const membersList: MemberItem[] = await GetMembers(slug)
    setMembers(membersList)

    const allIssues: IssueItem[] = []
    const allStates: Record<string, string> = {}

    for (const project of projectsList) {
      const queryParams: Record<string, string> = {}
      if (search) queryParams.search = search
      if (filter) queryParams.state = filter

      const projectIssues: IssueItem[] = await GetIssues(slug, project.id, queryParams)
      projectIssues.forEach((issue) => {
        allIssues.push({ ...issue, _project: project })
      })

      const states: StateItem[] = await GetStates(slug, project.id)
      states.forEach((s) => {
        allStates[s.id] = s.name
      })
    }

    setStatesMap(allStates)
    setIssues(allIssues)
    setLoading(false)
  }, [slug, search, filter])

  useEffect(() => {
    let active = true
    Promise.resolve().then(() => {
      if (active) loadData()
    })
    return () => {
      active = false
    }
  }, [loadData])

  const [searchInput, setSearchInput] = useState("")
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      setSearch(searchInput)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  function getIdentifier(issue: IssueItem) {
    const project = projectMap[issue.project_id] || issue._project
    const prefix = (project?.identifier || project?.name?.slice(0, 3) || "???").toUpperCase()
    return `${prefix}-${issue.sequence_id || "?"}`
  }

  function getStatusName(issue: IssueItem) {
    return (issue.state_id && statesMap[issue.state_id]) || issue.state || "—"
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">My tasks</h1>
          <p className="mt-1 text-sm text-zinc-500">Everything assigned to you across projects</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          <span className="text-lg leading-none">+</span> New task
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 5.65 5.65a7.5 7.5 0 0 0 10.99 10.99z" />
          </svg>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or identifier..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => {
            setLoading(true)
            setFilter(e.target.value)
          }}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-indigo-500"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              <th className="px-5 py-3">Task</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3 text-right">Owner</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-zinc-400">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-600" />
                </td>
              </tr>
            ) : issues.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-zinc-400">
                  No tasks found
                </td>
              </tr>
            ) : (
              issues.map((issue) => {
                const statusName = getStatusName(issue)
                const identifier = getIdentifier(issue)
                const project = projectMap[issue.project_id] || issue._project
                return (
                  <tr key={issue.id} className="border-b border-zinc-50 transition-colors hover:bg-zinc-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <StatusIcon status={statusName} />
                        <div>
                          <p className="font-medium text-zinc-900">{issue.title}</p>
                          <p className="text-xs text-zinc-400">
                            {identifier} · {project?.name || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-600">{statusName}</td>
                    <td className="px-4 py-4 font-medium">
                      <PriorityLabel priority={issue.priority || "none"} />
                    </td>
                    <td className="px-4 py-4 text-zinc-500">{formatDue(issue.due_date)}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end">
                        <OwnerAvatar assignees={issue.assignees} />
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <CreateTaskModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        slug={slug}
        projects={projects}
        members={members}
        onCreated={() => {
          setLoading(true)
          loadData()
        }}
      />
    </div>
  )
}
