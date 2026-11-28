"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { GetProfileRequest, UpdateProfileRequest } from "../(auth)/login/api"

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  avatarUrl: z.string(),
})

const ProfilePage = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.replace("/login")
        return
      }

      const user = await GetProfileRequest()
      if (!user) {
        router.replace("/login")
        return
      }

      setEmail(user.email || "")
      setDisplayName(user.display_name || "")
      setAvatarUrl(user.avatar_url || "")
      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const result = profileSchema.safeParse({ displayName, avatarUrl })
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid input")
      return
    }

    setSaving(true)

    try {
      const payload: { display_name: string; avatar_url?: string } = {
        display_name: displayName,
      }

      if (avatarUrl.trim()) {
        payload.avatar_url = avatarUrl.trim()
      }

      const data = await UpdateProfileRequest(payload)

      if (!data || data.error) {
        setError(data?.error || "Update failed")
        return
      }

      setDisplayName(data.display_name || displayName)
      setAvatarUrl(data.avatar_url || "")
      setSuccess("Profile updated")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB] text-sm text-zinc-500">
        Loading...
      </div>
    )
  }

  const initial = (displayName || email || "U").charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#FAFAFB] py-12 px-6">
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName || "Avatar"}
                className="h-11 w-11 rounded-full object-cover border border-zinc-200"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5E5CE6] text-white font-semibold text-base">
                {initial}
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-zinc-900">Profile</h1>
              <p className="text-xs text-zinc-500">{email}</p>
            </div>
          </div>

          <Link
            href="/workspaces"
            className="text-xs font-medium text-[#5E5CE6] hover:underline"
          >
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
              {success}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100 px-3.5 py-2.5 text-sm text-zinc-500 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Display name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100/70 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#5E5CE6] focus:bg-white focus:ring-2 focus:ring-[#5E5CE6]/15 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Avatar URL
            </label>
            <input
              type="text"
              placeholder="https://..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100/70 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#5E5CE6] focus:bg-white focus:ring-2 focus:ring-[#5E5CE6]/15 transition"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-[#5E5CE6] hover:bg-[#5250D4] text-white py-2.5 px-4 text-sm font-medium transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
