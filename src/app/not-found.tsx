import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-semibold tracking-tight">404</h1>
      <p className="text-zinc-600 dark:text-zinc-400">This page could not be found.</p>
      <Link
        className="text-sm font-medium underline underline-offset-4"
        href="/"
      >
        Go back home
      </Link>
    </main>
  );
}
