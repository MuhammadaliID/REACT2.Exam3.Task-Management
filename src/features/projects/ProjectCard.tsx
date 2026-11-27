import type { DemoProject } from "@/features/projects/demo";

export function ProjectCard({ project, href }: { project: DemoProject; href: string }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <a
          href={href}
          className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold text-white"
          style={{ backgroundColor: project.color }}
        >
          {project.name.charAt(0)}
        </a>
        <button
          type="button"
          aria-label={`Actions for ${project.name}`}
          className="-mr-1 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="1.6" />
            <circle cx="12" cy="12" r="1.6" />
            <circle cx="19" cy="12" r="1.6" />
          </svg>
        </button>
      </div>

      <h2 className="mt-5 text-lg font-semibold tracking-tight">
        <a href={href} className="transition-colors hover:text-zinc-600">
          {project.name}
        </a>
      </h2>
      <p className="mt-1.5 text-sm leading-6 text-zinc-500">{project.description}</p>

      <div className="mt-auto pt-8">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">{project.taskCount} tasks</span>
          <span className="text-sm font-semibold text-zinc-900">{project.completion}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full"
            style={{ width: `${project.completion}%`, backgroundColor: project.color }}
          />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members.map((member) => (
              <span
                key={member.initials}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-white"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </span>
            ))}
          </div>
          <span className="text-xs text-zinc-400">Target {project.target}</span>
        </div>
      </div>
    </article>
  );
}
