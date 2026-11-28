"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import { GetProfileRequest, UpdateProfileRequest } from "../(auth)/login/api"

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  avatarUrl: z.string(),
})

type ProfileForm = z.infer<typeof profileSchema>

const ProfilePage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token")
      if (!token) return null
      return GetProfileRequest()
    },
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [isLoading, user, router])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      displayName: user?.display_name || "",
      avatarUrl: user?.avatar_url || "",
    },
  })

  const mutation = useMutation({
    mutationFn: (payload: { display_name: string; avatar_url?: string }) =>
      UpdateProfileRequest(payload),
    onSuccess: (data) => {
      if (!data || data.error) {
        setError(data?.error || "Update failed")
        return
      }
      queryClient.setQueryData(["profile"], data)
      setSuccess("Profile updated")
    },
  })

  const onSubmit = (values: ProfileForm) => {
    setError("")
    setSuccess("")
    const payload: { display_name: string; avatar_url?: string } = {
      display_name: values.displayName,
    }
    if (values.avatarUrl.trim()) {
      payload.avatar_url = values.avatarUrl.trim()
    }
    mutation.mutate(payload)
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB] text-sm text-zinc-500">
        Loading...
      </div>
    )
  }

  const displayName = watch("displayName")
  const avatarUrl = watch("avatarUrl")
  const initial = (displayName || user.email || "U").charAt(0).toUpperCase()

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
              <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
          </div>

          <Link
            href="/w/northstar/tasks"
            className="text-xs font-medium text-[#5E5CE6] hover:underline"
          >
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              value={user.email || ""}
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
              {...register("displayName")}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100/70 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#5E5CE6] focus:bg-white focus:ring-2 focus:ring-[#5E5CE6]/15 transition"
            />
            {errors.displayName && (
              <p className="mt-1 text-xs text-red-600">{errors.displayName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Avatar URL
            </label>
            <input
              type="text"
              placeholder="https://..."
              {...register("avatarUrl")}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-100/70 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#5E5CE6] focus:bg-white focus:ring-2 focus:ring-[#5E5CE6]/15 transition"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-[#5E5CE6] hover:bg-[#5250D4] text-white py-2.5 px-4 text-sm font-medium transition disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
