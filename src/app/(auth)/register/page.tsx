import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Set up your account to start working.
        </p>
      </div>
      <form className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Name
          <input
            className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
            type="text"
            name="name"
            autoComplete="name"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input
            className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
            type="email"
            name="email"
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Password
          <input
            className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
            type="password"
            name="password"
            autoComplete="new-password"
          />
        </label>
        <button
          className="mt-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-700"
          type="submit"
        >
          Create account
        </button>
      </form>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Already registered?{" "}
        <Link className="font-medium underline underline-offset-4" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
