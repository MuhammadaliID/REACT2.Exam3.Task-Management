import ProjectCollections from "@/features/projects/ProjectCollections";

export const metadata = { title: "Cycles" };

export default async function CyclesPage({ params }) {
  const { slug, projectId } = await params;
  return <ProjectCollections slug={slug} projectId={projectId} type="cycles" />;
}
