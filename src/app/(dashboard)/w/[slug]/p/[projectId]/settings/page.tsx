import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Project settings",
};

export default function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ slug: string; projectId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <ProjectSettingsContent params={params} />
      </Suspense>
    </div>
  );
}

async function ProjectSettingsContent({
  params,
}: {
  params: Promise<{ slug: string; projectId: string }>;
}) {
  const { slug, projectId } = await params;

  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight">Settings</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Configuration for <span className="font-medium">{projectId}</span>.
      </p>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className="text-sm font-medium underline underline-offset-4"
            href={`/w/${slug}/p/${projectId}/settings/states`}
          >
            States
          </Link>
        </li>
        <li>
          <Link
            className="text-sm font-medium underline underline-offset-4"
            href={`/w/${slug}/p/${projectId}/settings/labels`}
          >
            Labels
          </Link>
        </li>
      </ul>
    </>
  );
}
