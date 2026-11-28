import ProjectHeader from "@/features/projects/ProjectHeader";

export default async function ProjectLayout({ children, params }) {
  const { slug, projectId } = await params;
  return <div className="flex flex-col gap-6"><ProjectHeader slug={slug} projectId={projectId} /><div>{children}</div></div>;
}
