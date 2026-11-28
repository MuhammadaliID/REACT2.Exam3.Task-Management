import axios from "axios"
import { getAuthHeaders } from "@/app/(auth)/login/api"

const api = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3000/api/v1"

export async function GetProjects(slug) {
  try {
    const { data } = await axios.get(`${api}/workspaces/${slug}/projects`, {
      headers: getAuthHeaders(),
    })
    return Array.isArray(data) ? data : data?.items || data?.data || []
  } catch (error) {
    console.error("GetProjects error:", error)
    return []
  }
}

export async function GetIssues(slug, projectId, params = {}) {
  try {
    const query = new URLSearchParams()
    if (params.search) query.set("search", params.search)
    if (params.state) query.set("state", params.state)
    if (params.priority) query.set("priority", params.priority)
    if (params.assignee) query.set("assignee", params.assignee)
    if (params.sort_by) query.set("sort_by", params.sort_by)
    if (params.order) query.set("order", params.order)
    if (params.limit) query.set("limit", String(params.limit))

    const qs = query.toString()
    const url = `${api}/workspaces/${slug}/projects/${projectId}/issues/${qs ? "?" + qs : ""}`

    const { data } = await axios.get(url, {
      headers: getAuthHeaders(),
    })
    return data?.data || (Array.isArray(data) ? data : [])
  } catch (error) {
    console.error("GetIssues error:", error)
    return []
  }
}

export async function CreateIssue(slug, projectId, body) {
  try {
    const { data } = await axios.post(
      `${api}/workspaces/${slug}/projects/${projectId}/issues/`,
      body,
      { headers: getAuthHeaders() }
    )
    return data
  } catch (error) {
    console.error("CreateIssue error:", error)
    const message = error?.response?.data?.error?.message
    return { error: message || "Failed to create issue" }
  }
}

export async function UpdateIssue(slug, projectId, issueId, body) {
  try {
    const { data } = await axios.patch(
      `${api}/workspaces/${slug}/projects/${projectId}/issues/${issueId}`,
      body,
      { headers: getAuthHeaders() }
    )
    return data
  } catch (error) {
    console.error("UpdateIssue error:", error)
    const message = error?.response?.data?.error?.message
    return { error: message || "Failed to update issue" }
  }
}

export async function DeleteIssue(slug, projectId, issueId) {
  try {
    await axios.delete(
      `${api}/workspaces/${slug}/projects/${projectId}/issues/${issueId}`,
      { headers: getAuthHeaders() }
    )
    return true
  } catch (error) {
    console.error("DeleteIssue error:", error)
    return false
  }
}

export async function GetStates(slug, projectId) {
  try {
    const { data } = await axios.get(
      `${api}/workspaces/${slug}/projects/${projectId}/states`,
      { headers: getAuthHeaders() }
    )
    return Array.isArray(data) ? data : data?.items || data?.data || []
  } catch (error) {
    console.error("GetStates error:", error)
    return []
  }
}

export async function GetLabels(slug, projectId) {
  try {
    const { data } = await axios.get(
      `${api}/workspaces/${slug}/projects/${projectId}/labels`,
      { headers: getAuthHeaders() }
    )
    return Array.isArray(data) ? data : data?.items || data?.data || []
  } catch (error) {
    console.error("GetLabels error:", error)
    return []
  }
}

export async function GetMembers(slug) {
  try {
    const { data } = await axios.get(
      `${api}/workspaces/${slug}/members`,
      { headers: getAuthHeaders() }
    )
    return Array.isArray(data) ? data : data?.items || data?.data || []
  } catch (error) {
    console.error("GetMembers error:", error)
    return []
  }
}
