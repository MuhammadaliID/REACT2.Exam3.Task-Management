"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetProjects, GetIssues, GetStates, UpdateIssue } from "../tasks/api"

type ProjectItem = {
  id: string
  name: string
  identifier?: string
}

type StateItem = {
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

type LabelItem = {
  id?: string
  name?: string
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
  labels?: LabelItem[]
  _project?: ProjectItem
}

const priorityColors: Record<string, string> = {
  urgent: "text-red-600",
  high: "text-orange-600",
  medium: "text-yellow-600",
  low: "text-zinc-400",
  none: "text-zinc-300",
}

const avatarColors = ["#b16b53", "#3d82c4", "#6558f5", "#0f9f86", "#c05c83", "#ec8b3a"]

function StatusIcon({ status }: { status: string }) {
  const s = (status || "").toLowerCase()

  if (s.includes("done") || s.includes("complete")) {
    return (
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    )
  }
  if (s.includes("progress")) {
    return (
      <svg className="h-4 w-4" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
        <path d="M10 2a8 8 0 0 1 0 16" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }
  if (s.includes("review")) {
    return (
      <svg className="h-4 w-4" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
        <path d="M10 2a8 8 0 0 1 0 16" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="none" stroke="#d1d5db" strokeWidth="2.5" />
    </svg>
  )
}

function formatDue(dateStr: string | null | undefined) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
}

function OwnerAvatar({ assignees }: { assignees?: MemberItem[] }) {
  if (!assignees || !assignees.length) return null
  const a = assignees[0]
  const name = a?.display_name || a?.name || a?.email || "?"
  const initial = name.charAt(0).toUpperCase()
  const color = avatarColors[name.charCodeAt(0) % avatarColors.length]
  return (
    <span
      className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white"
      style={{ backgroundColor: color }}
      title={name}
    >
      {initial}
    </span>
  )
}

export default function BoardPage() {
  const params = useParams()
  const slug = (params?.slug as string) || "northstar"
  const queryClient = useQueryClient()

  const [draggedIssue, setDraggedIssue] = useState<IssueItem | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["my-tasks", slug],
    queryFn: async () => {
      const projects: ProjectItem[] = await GetProjects(slug)

      const projectMap: Record<string, ProjectItem> = {}
      projects.forEach((p) => {
        projectMap[p.id] = p
      })

      const issues: IssueItem[] = []
      const statesMap: Record<string, string> = {}
      const projectStatesMap: Record<string, StateItem[]> = {}
      const columnsSet = new Set<string>()

      for (const project of projects) {
        const projectIssues: IssueItem[] = await GetIssues(slug, project.id)
        projectIssues.forEach((issue) => {
          issues.push({ ...issue, _project: project })
        })

        const states: StateItem[] = await GetStates(slug, project.id)
        projectStatesMap[project.id] = states
        states.forEach((s) => {
          statesMap[s.id] = s.name
          columnsSet.add(s.name)
        })
      }

      const columns = Array.from(columnsSet)
      return { projects, projectMap, statesMap, projectStatesMap, columns, issues }
    },
  })

  const moveMutation = useMutation({
    mutationFn: ({
      projectId,
      issueId,
      stateId,
    }: {
      projectId: string
      issueId: string
      stateId: string
    }) => UpdateIssue(slug, projectId, issueId, { state_id: stateId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-tasks", slug] })
    },
  })

  const projectMap = data?.projectMap || {}
  const statesMap = data?.statesMap || {}
  const projectStatesMap = data?.projectStatesMap || {}
  const columns = data?.columns || ["Backlog", "Todo", "In Progress", "In Review", "Done"]
  const issues = data?.issues || []

  function getIdentifier(issue: IssueItem) {
    const project = projectMap[issue.project_id] || issue._project
    const prefix = (project?.identifier || project?.name?.slice(0, 3) || "???").toUpperCase()
    return `${prefix}-${issue.sequence_id || "?"}`
  }

  function getStatusName(issue: IssueItem) {
    return (issue.state_id && statesMap[issue.state_id]) || issue.state || "Backlog"
  }

  function handleDrop(columnName: string) {
    setDragOverColumn(null)
    if (!draggedIssue) return

    const currentStatus = getStatusName(draggedIssue)
    if (currentStatus === columnName) {
      setDraggedIssue(null)
      return
    }

    const projectStates = projectStatesMap[draggedIssue.project_id] || []
    const targetState = projectStates.find(
      (s) => s.name.toLowerCase() === columnName.toLowerCase()
    )

    if (targetState) {
      moveMutation.mutate({
        projectId: draggedIssue.project_id,
        issueId: draggedIssue.id,
        stateId: targetState.id,
      })
    }

    setDraggedIssue(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Board</h1>
        <p className="mt-1 text-sm text-zinc-500">Move work forward across every stage</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {columns.map((columnName) => {
            const columnIssues = issues.filter(
              (issue) => getStatusName(issue).toLowerCase() === columnName.toLowerCase()
            )
            const isOver = dragOverColumn === columnName

            return (
              <div
                key={columnName}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (dragOverColumn !== columnName) {
                    setDragOverColumn(columnName)
                  }
                }}
                onDragLeave={() => {
                  if (dragOverColumn === columnName) {
                    setDragOverColumn(null)
                  }
                }}
                onDrop={() => handleDrop(columnName)}
                className={`flex min-w-0 flex-col rounded-xl p-2 transition-colors ${
                  isOver ? "bg-indigo-50/70 ring-2 ring-indigo-300" : "bg-transparent"
                }`}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={columnName} />
                    <span className="text-sm font-semibold text-zinc-800">{columnName}</span>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-200/70 px-1.5 text-xs font-medium text-zinc-600">
                      {columnIssues.length}
                    </span>
                  </div>
                  <span className="text-sm text-zinc-400">...</span>
                </div>

                <div className="flex flex-col gap-3 min-h-[120px]">
                  {columnIssues.map((issue) => {
                    const p = (issue.priority || "none").toLowerCase()
                    const priorityLabel = p.charAt(0).toUpperCase() + p.slice(1)
                    const due = formatDue(issue.due_date)
                    const isDragging = draggedIssue?.id === issue.id

                    return (
                      <div
                        key={issue.id}
                        draggable
                        onDragStart={() => setDraggedIssue(issue)}
                        onDragEnd={() => {
                          setDraggedIssue(null)
                          setDragOverColumn(null)
                        }}
                        className={`cursor-grab rounded-xl border border-zinc-200 bg-white p-4 shadow-xs transition hover:border-zinc-300 active:cursor-grabbing ${
                          isDragging ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-zinc-400">
                            {getIdentifier(issue)}
                          </span>
                          {p !== "none" && (
                            <span className={`font-medium ${priorityColors[p] || "text-zinc-400"}`}>
                              {priorityLabel}
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm font-semibold text-zinc-900">
                          {issue.title}
                        </p>

                        {issue.labels && issue.labels.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {issue.labels.map((label, idx) => (
                              <span
                                key={label.id || idx}
                                className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600"
                              >
                                {label.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-zinc-400">
                            {due || ""}
                          </span>
                          <OwnerAvatar assignees={issue.assignees} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
