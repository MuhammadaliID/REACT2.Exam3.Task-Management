import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold tracking-tight">Task Management</h1>
      <p className="max-w-md text-center text-zinc-600 dark:text-zinc-400">
        Choose where you want to go.
      </p>
      <nav className="flex flex-wrap items-center justify-center gap-4">
        <Link
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-zinc-700"
          href="/login"
        >
          Sign in
        </Link>
        <Link
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          href="/workspaces"
        >
          Workspaces
        </Link>
      </nav>
    </main>
  );
}
