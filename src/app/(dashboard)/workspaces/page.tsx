import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Workspaces",
};

export default function WorkspacesPage() {
  return (
    <div className="flex flex-col gap-4 bg-zinc-50 px-8 py-7">
      <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Select a workspace to continue.
      </p>
      <ul className="flex flex-col gap-2">
        <li>
          <Link className="text-sm font-medium underline underline-offset-4" href="/w/example">
            Example workspace
          </Link>
        </li>
      </ul>
    </div>
  );
}
