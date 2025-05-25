"use client";
import Link from "next/link";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { projects } from "@/data";
import { useState } from "react";

function AnimatedTitle({ title, isHovered }: { title: string; isHovered: boolean }) {
  const colors = ["text-red-500", "text-blue-500", "text-green-500"];

  const getColoredChars = () => {
    const chars = title.split("");
    const totalChars = chars.length;
    const coloredCharsCount = Math.floor(totalChars * (0.3 + Math.random() * 0.25)); // 25-50%

    // Create array of indices to color
    const indicesToColor = new Set();
    while (indicesToColor.size < coloredCharsCount) {
      indicesToColor.add(Math.floor(Math.random() * totalChars));
    }

    return chars.map((char, index) => {
      if (indicesToColor.has(index)) {
        const colorClass = colors[Math.floor(Math.random() * colors.length)];
        return (
          <span key={`${index}-colored`} className={`${colorClass} transition-colors duration-200`}>
            {char}
          </span>
        );
      }
      return (
        <span key={`${index}-normal`} className="text-foreground transition-colors duration-200">
          {char}
        </span>
      );
    });
  };

  return <div className="text-xl font-semibold mb-3">{isHovered ? getColoredChars() : title}</div>;
}

export default function Projects() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">Research & Development</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Advancing the frontiers of computational mathematics and artificial intelligence through
          exploration rooted in theory and driven by practice. See our work below!
        </p>
        <div className="mt-4">
          <Link href="/about" className="group relative inline-block">
            {/* Subtle outer glow */}
            <div className="absolute inset-0 rounded-full opacity-30 blur-md scale-105">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500/50 via-red-500/50 via-green-500/50 to-green-500/50 animate-gradient-rotate bg-[length:200%_200%]"></div>
            </div>
            {/* Main animated border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 animate-gradient-rotate bg-[length:200%_200%] p-[1.5px]">
              <div className="h-full w-full rounded-full bg-background"></div>
            </div>
            {/* Content */}
            <div className="relative px-6 py-2 rounded-full flex items-center gap-3 font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/5">
              <span className="text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                Explore in our playground
              </span>
              <span className="transform transition-all duration-300 group-hover:translate-x-1 text-foreground/70 group-hover:text-foreground">
                →
              </span>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              onMouseEnter={() => setHoveredCard(project.name)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="min-h-40 cursor-pointer border-border/50 hover:border-border bg-card/50">
                <CardContent className="p-6 h-full flex flex-col">
                  <AnimatedTitle title={project.name} isHovered={hoveredCard === project.name} />
                  <CardDescription className="text-muted-foreground leading-relaxed flex-1">
                    {project.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Right side: Centered text content */}
        <div className="flex items-center justify-center lg:col-span-1">
          <div className="text-center space-y-4 p-6">ABSTRACT IMAGE OF SORTS</div>
        </div>
      </div>
    </section>
  );
}
