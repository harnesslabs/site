import Hero from "./_components/hero";
import Projects from "./_components/projects";
import Foundation from "./_components/foundation";
import Community from "./_components/community";

export default function Home() {
  return (
    <div className="flex flex-grow flex-col space-y-40 mb-32">
      <Hero />
      <Projects />
      <Foundation />
      <Community />
    </div>
  );
}
