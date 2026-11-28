"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { RegisterRequest } from "../login/api"

const registerSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
})

const Register = () => {
  const router = useRouter()

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = registerSchema.safeParse({ displayName, email, password })
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid input")
      return
    }

    setLoading(true)

    try {
      const result2 = await RegisterRequest({
        email,
        password,
        display_name: displayName,
      })

      if (!result2 || result2.error) {
        setError(result2?.error || "Registration failed")
        return
      }

      router.replace("/workspaces")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAFAFB]">
      <div className="w-full lg:w-1/2 bg-[#141418] px-8 py-8 lg:px-14 lg:py-10 flex flex-col justify-between relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 h-[540px] w-[540px] rounded-full border border-[#5E5CE6]/20" />
        <div className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 h-[320px] w-[320px] rounded-full border border-white/[0.06]" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5E5CE6] shadow-[0_0_20px_rgba(94,92,230,0.55)]">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7v6a5 5 0 0010 0V7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
            </svg>
          </div>
          <span className="text-white font-semibold text-base tracking-tight">Thread</span>
        </div>

        <div className="relative z-10 my-16 lg:my-auto max-w-md">
          <div className="flex items-center -space-x-2 mb-7">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9E5B40] border-2 border-[#141418] ring-1 ring-white/40 text-xs font-semibold text-white">
              M
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2C5A74] border-2 border-[#141418] ring-1 ring-white/40 text-xs font-semibold text-white">
              N
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#27272F] border-2 border-[#141418] text-xs font-medium text-zinc-300">
              2
            </div>
          </div>

          <h1 className="text-4xl lg:text-[44px] font-bold text-white leading-[1.12] tracking-tight">
            Small team.
            <br />
            Serious momentum.
          </h1>

          <p className="mt-5 text-sm lg:text-[15px] text-zinc-400 leading-relaxed">
            A focused workspace for developers who care about craft. Plan clearly, ship confidently, and keep every detail in reach.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-5 flex items-center justify-between text-xs text-zinc-500">
          <span>Built for teams that build.</span>
          <span>© 2025 Thread</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-[#FAFAFB]">
        <div className="w-full max-w-[380px]">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-[#5E5CE6] uppercase mb-2">
            GET STARTED
          </p>
          <h2 className="text-2xl lg:text-[28px] font-bold text-zinc-900 tracking-tight">
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-zinc-500">
            Set up your account to start working.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Display name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-200 bg-zinc-100/70 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#5E5CE6] focus:bg-white focus:ring-2 focus:ring-[#5E5CE6]/15 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-200 bg-zinc-100/70 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#5E5CE6] focus:bg-white focus:ring-2 focus:ring-[#5E5CE6]/15 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="At least 5 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={5}
                required
                className="w-full rounded-lg border border-zinc-200 bg-zinc-100/70 px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-[#5E5CE6] focus:bg-white focus:ring-2 focus:ring-[#5E5CE6]/15 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5E5CE6] hover:bg-[#5250D4] text-white py-2.5 px-4 text-sm font-medium transition shadow-[0_8px_22px_-4px_rgba(94,92,230,0.5)] disabled:opacity-50"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  <span>Create account</span>
                  <span className="text-base leading-none">→</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-xs text-zinc-500">
            Already registered?{" "}
            <Link href="/login" className="font-medium text-[#5E5CE6] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
