export type DemoProject = {
  id: string;
  name: string;
  identifier: string;
  description: string;
  color: string;
  taskCount: number;
  completion: number;
  target: string;
  members: Array<{ initials: string; color: string }>;
};

export const demoProjects: DemoProject[] = [
  {
    id: "atlas",
    name: "Atlas",
    identifier: "ATL",
    description: "The next generation collaborative workspace.",
    color: "#6366f1",
    taskCount: 24,
    completion: 68,
    target: "Jul 12",
    members: [
      { initials: "M", color: "#b45309" },
      { initials: "N", color: "#1e3a8a" },
    ],
  },
  {
    id: "launchpad",
    name: "Launchpad",
    identifier: "LCH",
    description: "A focused redesign of activation and onboarding.",
    color: "#ea580c",
    taskCount: 17,
    completion: 42,
    target: "Jul 28",
    members: [
      { initials: "M", color: "#b45309" },
      { initials: "N", color: "#1e3a8a" },
    ],
  },
  {
    id: "orbit-api",
    name: "Orbit API",
    identifier: "ORB",
    description: "Reliable primitives for third-party integrations.",
    color: "#059669",
    taskCount: 31,
    completion: 81,
    target: "Jun 30",
    members: [
      { initials: "N", color: "#1e3a8a" },
      { initials: "M", color: "#b45309" },
    ],
  },
];
