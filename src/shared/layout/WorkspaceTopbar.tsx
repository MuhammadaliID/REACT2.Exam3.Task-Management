"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon, PlusIcon } from "@/shared/ui/icons";

const pageNames: Record<string, string> = {
  board: "Board",
  members: "Team members",
  notifications: "Notifications",
  projects: "Projects",
  settings: "Settings",
  tasks: "My tasks",
};

export function WorkspaceTopbar({
  slug,
  workspaceName,
  unreadCount,
}: {
  slug: string;
  workspaceName: string;
  unreadCount: number;
}) {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean);
  const currentSegment = segments[segments.length - 1] ?? "";
  const currentPage = pageNames[currentSegment] ?? "Workspace";

  return (
    <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-6 lg:px-10">
      <div className="flex min-w-0 items-center gap-3 text-sm">
        <span className="truncate text-zinc-400">{workspaceName}</span>
        <span aria-hidden="true" className="text-zinc-300">/</span>
        <span className="truncate font-medium text-zinc-700">{currentPage}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <label className="hidden h-10 w-[280px] items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-zinc-400 md:flex">
          <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" strokeLinecap="round" />
          </svg>
          <input
            aria-label="Search workspace"
            placeholder="Search workspace..."
            className="min-w-0 flex-1 bg-transparent text-xs text-zinc-700 outline-none placeholder:text-zinc-400"
          />
          <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] text-zinc-400">⌘K</kbd>
        </label>

        <Link
          href={`/w/${slug}/notifications`}
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50"
        >
          <BellIcon className="h-[18px] w-[18px]" />
          {unreadCount > 0 ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500 ring-2 ring-white" /> : null}
        </Link>

        <Link
          href={`/w/${slug}/tasks`}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-3.5 text-xs font-semibold text-white transition hover:bg-zinc-800 sm:px-4"
        >
          <PlusIcon className="h-4 w-4" />
          <span className="hidden sm:inline">New task</span>
        </Link>
      </div>
    </header>
  );
}
