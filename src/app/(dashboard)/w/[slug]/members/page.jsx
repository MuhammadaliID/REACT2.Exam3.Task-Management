import TeamMembers from "@/features/workspaces/TeamMembers";

export const metadata = { title: "Team members" };

export default async function WorkspaceMembersPage({ params }) {
  const { slug } = await params;
  return <TeamMembers slug={slug} />;
}
