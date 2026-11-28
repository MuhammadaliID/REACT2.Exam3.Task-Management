"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { GetProfileRequest } from "@/app/(auth)/login/api";
import {
  BellIcon,
  BoardIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  FolderIcon,
  LogOutIcon,
  UsersIcon,
} from "@/shared/ui/icons";

export type SidebarWorkspace = {
  name: string;
  memberCount: number;
  avatarInitial: string;
  color: string;
};

export type SidebarProject = {
  id: string;
  name: string;
  identifier: string;
  color: string;
};

export type SidebarUser = {
  name: string;
  email: string;
  initials: string;
  color: string;
};

type Props = {
  slug: string;
  workspace: SidebarWorkspace;
  projects: SidebarProject[];
  user: SidebarUser;
  unreadCount: number;
};

type NavItem = {
  label: string;
  href: string;
  icon: (props: { className?: string }) => React.ReactElement;
  exact?: boolean;
};

export function Sidebar({ slug, workspace, projects, user, unreadCount }: Props) {
  const pathname = usePathname() ?? "";
  const base = `/w/${slug}`;

  const [realUser, setRealUser] = useState<SidebarUser>(user);

  useEffect(() => {
    const loadUser = async () => {
      const data = await GetProfileRequest();
      if (data && !data.error) {
        const name = data.display_name || data.email || "User";
        setRealUser({
          name,
          email: data.email || "",
          initials: name.charAt(0).toUpperCase(),
          color: user.color,
        });
      }
    };
    loadUser();
  }, [user.color]);

  const sections: Array<{ title: string; items: NavItem[] }> = [
    {
      title: "Workspace",
      items: [
        { label: "My tasks", href: `${base}/tasks`, icon: CheckCircleIcon, exact: true },
        { label: "Board", href: `${base}/board`, icon: BoardIcon, exact: true },
        { label: "Projects", href: `${base}/projects`, icon: FolderIcon },
      ],
    },
    {
      title: "Manage",
      items: [
        { label: "Team members", href: `${base}/members`, icon: UsersIcon, exact: true },
        { label: "Notifications", href: `${base}/notifications`, icon: BellIcon, exact: true },
      ],
    },
  ];

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col overflow-y-auto bg-zinc-950 px-3 py-3">
      <Link
        href="/workspaces"
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 transition-colors hover:bg-white/[0.08]"
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: workspace.color }}
        >
          {workspace.avatarInitial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-white">
            {workspace.name}
          </span>
          <span className="block text-xs text-zinc-500">
            {workspace.memberCount} members
          </span>
        </span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-zinc-500" />
      </Link>

      {sections.map((section) => (
        <nav key={section.title} className="mt-4">
          <p className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            {section.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                      active
                        ? "bg-white/10 font-medium text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.label === "Notifications" && unreadCount > 0 ? (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[11px] font-semibold text-white">
                        {unreadCount}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ))}

      <nav className="mt-4">
        <p className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          Projects
        </p>
        <ul className="flex flex-col gap-0.5">
          {projects.map((project) => {
            const href = `${base}/p/${project.id}`;
            const active = pathname.startsWith(href);
            return (
              <li key={project.id}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                    active
                      ? "bg-white/10 font-medium text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
                  )}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="flex-1 truncate">{project.name}</span>
                  <span className="text-[11px] uppercase tracking-wide text-zinc-600">
                    {project.identifier}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-white/10 px-1 pt-3">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-md transition-opacity hover:opacity-80"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: realUser.color }}
            >
              {realUser.initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-white">
                {realUser.name}
              </span>
              <span className="block truncate text-[11px] text-zinc-500">
                {realUser.email}
              </span>
            </span>
          </Link>
          <Link
            href="/login"
            aria-label="Log out"
            className="shrink-0 rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
          >
            <LogOutIcon className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
