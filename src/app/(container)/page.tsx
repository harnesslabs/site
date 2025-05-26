import Hero from "@/app/(container)/_components/hero";
import Projects from "@/app/(container)/_components/projects";
import Teaser from "@/app/(container)/_components/teaser";

export default function Home() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center space-y-32 my-32">
      <Hero />
      <Projects />
      <Teaser />
    </div>
  );
}
