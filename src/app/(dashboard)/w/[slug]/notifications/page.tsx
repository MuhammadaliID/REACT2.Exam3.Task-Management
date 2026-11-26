import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function WorkspaceNotificationsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <WorkspaceNotificationsContent params={params} />
      </Suspense>
    </div>
  );
}

async function WorkspaceNotificationsContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <h2 className="text-xl font-semibold tracking-tight">Notifications</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Notification settings for <span className="font-medium">{slug}</span>.
      </p>
    </>
  );
}
