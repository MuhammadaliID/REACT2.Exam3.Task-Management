import Link from "next/link";

const links = [
  { href: "/workspaces", label: "Workspaces" },
  { href: "/profile", label: "Profile" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-zinc-200 p-4 dark:border-zinc-800 md:block">
      <Link className="text-base font-semibold tracking-tight" href="/">
        Task Management
      </Link>
      <nav className="mt-6 flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            className="rounded-md px-2 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
