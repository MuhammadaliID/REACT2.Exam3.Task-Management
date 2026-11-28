import type { ReactNode } from "react";
import { demoProjects } from "@/features/projects/demo";
import { demoUnreadCount, demoUser, demoWorkspace } from "@/features/workspaces/demo";
import { Sidebar } from "@/shared/layout/Sidebar";

export const instant = false;

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <Sidebar
        slug={slug}
        workspace={demoWorkspace}
        projects={demoProjects}
        user={demoUser}
        unreadCount={demoUnreadCount}
      />
      <div className="flex min-w-0 flex-1 flex-col bg-zinc-50">
        <main className="flex-1 px-8 py-7">{children}</main>
      </div>
    </>
  );
}
