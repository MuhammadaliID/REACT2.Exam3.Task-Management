import ProjectsWorkspace from "@/features/projects/ProjectsWorkspace";

export const metadata = { title: "Projects" };

export default async function WorkspaceProjectsPage({ params }) {
  const { slug } = await params;
  return <ProjectsWorkspace slug={slug} />;
}
