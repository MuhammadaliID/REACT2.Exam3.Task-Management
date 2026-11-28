import ProjectOverview from "@/features/projects/ProjectOverview";

export const metadata = { title: "Project overview" };

export default async function ProjectPage({ params }) {
  const { slug, projectId } = await params;
  return <ProjectOverview slug={slug} projectId={projectId} />;
}
