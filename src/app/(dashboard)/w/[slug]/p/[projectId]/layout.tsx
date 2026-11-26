import { Suspense } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

const navItems = [
  { href: "", label: "Overview" },
  { href: "/issues", label: "Issues" },
  { href: "/board", label: "Board" },
  { href: "/cycles", label: "Cycles" },
  { href: "/modules", label: "Modules" },
  { href: "/settings", label: "Settings" },
];

export default function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string; projectId: string }>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<div className="h-24 border-b border-zinc-200 dark:border-zinc-800" />}>
        <ProjectHeader params={params} />
      </Suspense>
      <div>{children}</div>
    </div>
  );
}

async function ProjectHeader({
  params,
}: {
  params: Promise<{ slug: string; projectId: string }>;
}) {
  const { slug, projectId } = await params;

  return (
    <header className="flex flex-col gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800">
      <p className="text-xs uppercase tracking-wide text-zinc-500">Project</p>
      <h2 className="text-xl font-semibold tracking-tight">{projectId}</h2>
      <nav className="flex flex-wrap gap-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            href={`/w/${slug}/p/${projectId}${item.href}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
