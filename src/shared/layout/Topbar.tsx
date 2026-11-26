import Link from "next/link";

export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
      <p className="text-sm text-zinc-500">Dashboard</p>
      <Link
        className="text-sm font-medium underline underline-offset-4"
        href="/profile"
      >
        Profile
      </Link>
    </header>
  );
}
