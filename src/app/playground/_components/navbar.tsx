"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { projects } from "@/data";
import { usePathname } from "next/navigation";

export function NavBar() {
  const pathname = usePathname();

  return (
    <div className="flex justify-center items-starts flex-grow flex-row lg:flex-col gap-2">
      {projects.map((project) => (
        <Link
          key={project.slug}
          className={cn(
            "text-md text-muted-foreground uppercase tracking-wider text-nowrap",
            pathname === `/playground/${project.slug}` && "text-foreground lg:text-xl font-bold"
          )}
          href={`/playground/${project.slug}`}
        >
          {project.name}
        </Link>
      ))}
    </div>
  );
}
