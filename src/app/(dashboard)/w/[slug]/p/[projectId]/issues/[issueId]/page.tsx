import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Issue",
};

export default function IssuePage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <IssueDetails params={params} />
      </Suspense>
    </div>
  );
}

async function IssueDetails({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const { issueId } = await params;

  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight">{issueId}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Issue details.</p>
    </>
  );
}
