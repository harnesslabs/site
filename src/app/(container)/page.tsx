import Hero from "@/app/_components/hero";
import Projects from "@/app/_components/projects";
import Teaser from "@/app/_components/teaser";

export default function Home() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center space-y-32 my-32">
      <Hero />
      <Projects />
      <Teaser />
    </div>
  );
}
