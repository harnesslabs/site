import { Project } from "@/data";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h1 className="lg:block hidden text-sm text-muted-foreground uppercase tracking-wider mb-2">
        {project.name}
      </h1>
      <p className="text-md max-w-2xl text-center">{project.description}</p>
      <div className="w-full h-px bg-border mt-10 max-w-3xl" />
    </div>
  );
}
