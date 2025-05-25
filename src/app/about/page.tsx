import { Button } from "@/components/ui/button";
import AboutSeparator from "./_components/about-separator";
import { teamMembers, companyValues } from "@/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Harness Labs | About",
  description:
    "Learn about Harness Labs - an organization dedicated to building innovative software solutions grounded in mathematical principles.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-grow flex-col items-center text-foreground py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-16">
        <HeroSection />

        <div className="hidden md:block">
          <AboutSeparator />
        </div>

        <ValuesSection />
        <TeamSection />
        <ContactSection />
      </div>
    </main>
  );
}

function HeroSection() {
  return (
    <section className="text-center">
      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Harness Labs</p>
      <h1 className="text-4xl sm:text-5xl mb-12">Who are we?</h1>
      <div className="max-w-3xl mx-auto space-y-4 text-lg text-justify text-foreground">
        <p>
          We are a technology organization dedicated to building innovative software solutions
          grounded in mathematical principles. For us, mathematics is more than a tool&mdash;it is
          the foundation upon which all meaningful technology is built.{" "}
          <strong>This is our vision</strong>: to center mathematical thinking in software
          development, where elegant solutions are preferred over brute force approaches, and where
          technology serves to enhance human understanding rather than replace it.
        </p>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="py-12">
      <div className="mx-auto flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/3 mb-10 md:mb-0">
          <h2 className="text-4xl sm:text-5xl text-center md:text-left">Our values</h2>
        </div>
        <div className="md:w-2/3 space-y-10">
          {companyValues.map((value) => (
            <article key={value.id} className="flex items-start space-x-6 border-t pt-2">
              <div className="text-6xl font-bold text-foreground w-12 text-left ml-4 mr-8">
                {value.id}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="py-12">
      <div className="mx-auto flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/3 mb-10 md:mb-0">
          <h2 className="text-4xl sm:text-5xl text-center md:text-left">Our team</h2>
        </div>
        <div className="md:w-2/3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 mx-16 sm:mx-0 font-semibold">
            {teamMembers.map((member) => (
              <a
                href={member.link}
                key={member.name}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl pl-0 md:pl-4 group border-t pt-2 text-center md:text-left cursor-pointer transition-colors duration-200 hover:text-blue-600 flex items-center justify-center md:justify-start gap-2"
              >
                <span>{member.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      className="
        py-16
        text-center
        rounded-xl
        shadow-lg
      "
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl sm:text-5xl mb-4">Contact</h2>
        <p className="text-lg text-muted-foreground mb-8 text-left text-justify mx-8 md:mx-0">
          Get involved by contributing to our open source projects, participating in community
          discussions, and attending events. Have questions or want to connect?
        </p>
        <Button size="lg" asChild>
          <a href="mailto:contact@harnesslabs.xyz">Get in touch</a>
        </Button>
      </div>
    </section>
  );
}
