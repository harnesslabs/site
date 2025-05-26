"use client";
import Link from "next/link";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { projects } from "@/data";
import WaterfallSeparator from "./waterfall-separator";

function AnimatedTitle({ title }: { title: string }) {
  return <div className="text-xl font-semibold mb-3">{title}</div>;
}

export default function Projects() {
  return (
    <section className="mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative z-10">
          <div>
            <h2 className="text-4xl md:text-5xl">Research & Development</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Advancing the frontier of computational mathematics and artificial intelligence
              through exploration rooted in theory and driven by practice. See our work below!
            </p>
            <div className="mt-4 mb-6">
              <Link href="/playground" className="group relative inline-block">
                {/* Subtle outer glow */}
                <div className="absolute inset-0 rounded-xl opacity-30 blur-md scale-105">
                  <div className="h-full w-full rounded-xl bg-gradient-to-r from-blue-500/50 via-red-500/50 to-green-500/50 animate-gradient-rotate bg-[length:200%_200%]"></div>
                </div>
                {/* Main animated border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 animate-gradient-rotate bg-[length:200%_200%] p-[1.5px]">
                  <div className="h-full w-full rounded-[calc(0.75rem-1.5px)] bg-background" />
                </div>
                {/* Content */}
                <div className="relative px-6 py-2 rounded-xl flex items-center gap-3 font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/5">
                  <span className="/90 group-hover: transition-colors duration-300">
                    Explore in our playground
                  </span>
                  <span className="transform transition-all duration-300 group-hover:translate-x-1 /70 group-hover:">
                    →
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link
                key={project.name}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="min-h-40 cursor-pointer border-border/50 hover:border-foreground/20 bg-card/50 relative z-10">
                  <CardContent className="p-6 h-full flex flex-col">
                    <AnimatedTitle title={project.name} />
                    <CardDescription className="text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Waterfall separator overlay*/}
      <div className="hidden lg:block absolute inset-y-0 pointer-events-none z-0 right-0 pr-6">
        <WaterfallSeparator />
      </div>
    </section>
  );
}
