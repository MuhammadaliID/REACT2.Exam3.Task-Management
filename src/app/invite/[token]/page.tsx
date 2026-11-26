import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Invite",
};

export default function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Workspace invite</h1>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <InviteToken params={params} />
      </Suspense>
    </main>
  );
}

async function InviteToken({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  return (
    <p className="text-sm text-zinc-600 dark:text-zinc-400">
      Invitation token: <span className="font-medium">{token}</span>
    </p>
  );
}
