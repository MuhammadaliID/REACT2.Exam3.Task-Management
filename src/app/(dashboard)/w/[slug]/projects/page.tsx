import type { Metadata } from "next";
import { Suspense } from "react";
import { demoProjects } from "@/features/projects/demo";
import { ProjectCard } from "@/features/projects/ProjectCard";
import { PlusIcon } from "@/shared/ui/icons";

export const metadata: Metadata = {
  title: "Projects",
};

export default function WorkspaceProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
      <WorkspaceProjectsContent params={params} />
    </Suspense>
  );
}

async function WorkspaceProjectsContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            All active initiatives in your workspace
          </p>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500"
        >
          <PlusIcon className="h-4 w-4" />
          New project
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {demoProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            href={`/w/${slug}/p/${project.id}`}
          />
        ))}
      </div>
    </>
  );
}
