import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
};

export default function WorkspaceProjectsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <WorkspaceProjectsContent params={params} />
      </Suspense>
    </div>
  );
}

async function WorkspaceProjectsContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Projects inside <span className="font-medium">{slug}</span>.
      </p>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className="text-sm font-medium underline underline-offset-4"
            href={`/w/${slug}/p/example`}
          >
            Example project
          </Link>
        </li>
      </ul>
    </>
  );
}
