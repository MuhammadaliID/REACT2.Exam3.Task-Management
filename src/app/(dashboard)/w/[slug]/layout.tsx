import { Suspense } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

const navItems = [
  { href: "", label: "Overview" },
  { href: "/projects", label: "Projects" },
  { href: "/members", label: "Members" },
  { href: "/notifications", label: "Notifications" },
  { href: "/settings", label: "Settings" },
];

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<div className="h-24 border-b border-zinc-200 dark:border-zinc-800" />}>
        <WorkspaceHeader params={params} />
      </Suspense>
      <div>{children}</div>
    </div>
  );
}

async function WorkspaceHeader({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <header className="flex flex-col gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
      <p className="text-xs uppercase tracking-wide text-zinc-500">Workspace</p>
      <h1 className="text-2xl font-semibold tracking-tight">{slug}</h1>
      <nav className="flex flex-wrap gap-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            href={`/w/${slug}${item.href}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
