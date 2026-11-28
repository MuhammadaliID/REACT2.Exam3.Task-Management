import WorkspaceShell from "@/features/workspaces/WorkspaceShell";

export default async function WorkspaceLayout({ children, params }) {
  const { slug } = await params;
  return <WorkspaceShell slug={slug}>{children}</WorkspaceShell>;
}
