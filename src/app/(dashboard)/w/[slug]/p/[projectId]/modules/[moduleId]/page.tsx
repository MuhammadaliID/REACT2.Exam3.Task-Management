import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Module",
};

export default function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <ModuleDetails params={params} />
      </Suspense>
    </div>
  );
}

async function ModuleDetails({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;

  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight">{moduleId}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Module details.</p>
    </>
  );
}
