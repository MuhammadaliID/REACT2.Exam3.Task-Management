import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Issues",
};

export default function IssuesPage({
  params,
}: {
  params: Promise<{ slug: string; projectId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <IssuesContent params={params} />
      </Suspense>
    </div>
  );
}

async function IssuesContent({
  params,
}: {
  params: Promise<{ slug: string; projectId: string }>;
}) {
  const { slug, projectId } = await params;

  return (
    <>
      <h3 className="text-lg font-semibold tracking-tight">Issues</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        All issues for this project.
      </p>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className="text-sm font-medium underline underline-offset-4"
            href={`/w/${slug}/p/${projectId}/issues/example`}
          >
            Example issue
          </Link>
        </li>
      </ul>
    </>
  );
}
