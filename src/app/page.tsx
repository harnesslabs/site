import Hero from "@/app/_components/hero";
import Projects from "@/app/_components/projects";

export default function Home() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center">
      <Hero />
      <Projects />
    </div>
  );
}
