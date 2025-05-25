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
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-left md:text-center lg:text-left">
          Research & Development
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl text-left md:text-center lg:text-left">
          Advancing the frontiers of mathematics and artificial intelligence through rigorous
          research and innovative implementations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <Card className="h-full cursor-pointer border-border/50 hover:border-border bg-card/50">
              <CardContent className="p-6">
                <AnimatedTitle title={project.name} isHovered={hoveredCard === project.name} />
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {project.desctiption}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
