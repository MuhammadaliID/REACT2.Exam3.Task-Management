import type { Metadata } from "next";
import { NotificationsPanel } from "@/features/workspaces/NotificationsPanel";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function WorkspaceNotificationsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <NotificationsPanel slug={slug} />;
}
