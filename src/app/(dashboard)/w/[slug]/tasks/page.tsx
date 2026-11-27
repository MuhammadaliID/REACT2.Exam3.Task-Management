import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My tasks",
};

export default function MyTasksPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">My tasks</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Tasks assigned to you.</p>
    </div>
  );
}
