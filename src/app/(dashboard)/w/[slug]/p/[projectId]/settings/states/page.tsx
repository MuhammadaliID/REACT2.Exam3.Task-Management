import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "States",
};

export default function ProjectStatesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <ProjectStatesContent params={params} />
      </Suspense>
    </div>
  );
}

async function ProjectStatesContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight">States</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Workflow states for <span className="font-medium">{projectId}</span>.
      </p>
    </>
  );
}
