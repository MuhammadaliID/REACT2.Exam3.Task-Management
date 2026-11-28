import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board",
};



export default function BoardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">Board</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Workspace board overview.</p>
    </div>
  );
}
