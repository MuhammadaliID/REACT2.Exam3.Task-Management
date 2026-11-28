import ProjectCollections from "@/features/projects/ProjectCollections";

export const metadata = { title: "Modules" };

export default async function ModulesPage({ params }) {
  const { slug, projectId } = await params;
  return <ProjectCollections slug={slug} projectId={projectId} type="modules" />;
}
