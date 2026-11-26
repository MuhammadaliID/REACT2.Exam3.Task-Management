import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Cycle",
};

export default function CyclePage({
  params,
}: {
  params: Promise<{ cycleId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <CycleDetails params={params} />
      </Suspense>
    </div>
  );
}

async function CycleDetails({
  params,
}: {
  params: Promise<{ cycleId: string }>;
}) {
  const { cycleId } = await params;

  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight">{cycleId}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Cycle details.</p>
    </>
  );
}
