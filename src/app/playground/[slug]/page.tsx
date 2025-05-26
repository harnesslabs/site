import { projects } from "@/data";
import { ProjectHeader } from "../_components/project-header";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const project = projects.find((project) => project.slug === slug);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <ProjectHeader project={project} />
      <div className="flex flex-col gap-10 text-center mt-20">Demo Coming Soon</div>
    </div>
  );
}
