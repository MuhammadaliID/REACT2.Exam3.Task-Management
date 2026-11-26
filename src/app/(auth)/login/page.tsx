import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Sign in to continue to your workspaces.
        </p>
      </div>
      <form className="flex flex-col gap-4">
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
            autoComplete="current-password"
          />
        </label>
        <button
          className="mt-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-700"
          type="submit"
        >
          Sign in
        </button>
      </form>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        No account yet?{" "}
        <Link className="font-medium underline underline-offset-4" href="/register">
          Create one
        </Link>
      </p>
    </div>
  );
}
