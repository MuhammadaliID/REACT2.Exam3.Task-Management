import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Modules",
};

export default function ModulesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <ModulesContent params={params} />
      </Suspense>
    </div>
  );
}

async function ModulesContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight">Modules</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Modules for <span className="font-medium">{projectId}</span>.
      </p>
    </>
  );
}
