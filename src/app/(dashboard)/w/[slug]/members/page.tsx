import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Workspace members",
};

export default function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <WorkspaceMembersContent params={params} />
      </Suspense>
    </div>
  );
}

async function WorkspaceMembersContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <h2 className="text-xl font-semibold tracking-tight">Members</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        People with access to <span className="font-medium">{slug}</span>.
      </p>
    </>
  );
}
