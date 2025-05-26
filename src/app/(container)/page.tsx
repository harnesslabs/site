import Hero from "./_components/hero";
import Projects from "./_components/projects";
import Foundation from "./_components/foundation";

export default function Home() {
  return (
    <div className="flex flex-grow flex-col space-y-32 my-32">
      <Hero />
      <Projects />
      <Foundation />
    </div>
  );
}
