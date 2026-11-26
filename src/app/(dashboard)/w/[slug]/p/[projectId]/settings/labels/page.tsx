import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Labels",
};

export default function ProjectLabelsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <ProjectLabelsContent params={params} />
      </Suspense>
    </div>
  );
}

async function ProjectLabelsContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight">Labels</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Labels for <span className="font-medium">{projectId}</span>.
      </p>
    </>
  );
}
