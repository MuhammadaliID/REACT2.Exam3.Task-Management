import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Project",
};

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <ProjectOverview params={params} />
      </Suspense>
    </div>
  );
}

async function ProjectOverview({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight">{projectId}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Project overview.</p>
    </>
  );
}
