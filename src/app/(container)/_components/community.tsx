import Link from "next/link";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function Community() {
  return (
    <section className="mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative z-10 text-left">
          <div>
            <h2 className="text-4xl md:text-5xl">Join our Community</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl ml-auto">
              We are looking for passionate individuals to join our community. Whether you want to
              collaborate on projects, share ideas, or simply connect with like-minded people, there
              are many ways to get involved. Let&apos;s build a better future together!
            </p>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <Link
              href={siteConfig.links.discord}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-block"
            >
              {/* Subtle outer glow */}
              <div className="absolute inset-0 rounded-xl opacity-30 blur-md scale-105">
                <div className="h-full w-full rounded-xl bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-gray-500/50 animate-gradient-rotate bg-[length:200%_200%]"></div>
              </div>
              {/* Main animated border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-rotate bg-[length:200%_200%] p-[1.5px]">
                <div className="h-full w-full rounded-[calc(0.75rem-1.5px)] bg-primary-foreground" />
              </div>
              {/* Content */}
              <div className="relative px-6 py-2 rounded-xl flex items-center gap-3 font-medium transition-all duration-300">
                <Icons.discord className="w-5 h-5 duration-300" />
                Discord
              </div>
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center"
            >
              <div className="border border-border/50 hover:border-foreground/20 rounded-xl px-6 py-2 flex items-center gap-3 font-medium bg-card/50">
                <Icons.github className="w-5 h-5" />
                GitHub
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
