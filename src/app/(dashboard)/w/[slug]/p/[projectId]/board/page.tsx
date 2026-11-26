import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Board",
};

export default function BoardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <BoardContent params={params} />
      </Suspense>
    </div>
  );
}

async function BoardContent({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight">Board</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Kanban board for <span className="font-medium">{projectId}</span>.
      </p>
    </>
  );
}
