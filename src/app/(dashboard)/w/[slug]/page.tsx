import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Workspace",
};

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <WorkspaceOverview params={params} />
      </Suspense>
    </div>
  );
}

async function WorkspaceOverview({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <h2 className="text-xl font-semibold tracking-tight">{slug}</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Workspace overview for <span className="font-medium">{slug}</span>.
      </p>
    </>
  );
}
