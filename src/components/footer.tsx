import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function Footer() {
  return (
    <footer className="block bg-background w-full border-t dark:border-t-neutral-600">
      <div className="container mx-auto h-16 flex items-center justify-center space-x-2">
        <Link href="https://harnesslabs.xyz" target="_blank" rel="noreferrer">
          <div className="text-md pr-2">
            © {new Date().getFullYear()} {siteConfig.name}
          </div>
        </Link>
        <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
          <div
            className={buttonVariants({
              size: "icon",
              variant: "ghost",
            })}
          >
            <Icons.github />
            <span className="sr-only">GitHub</span>
          </div>
        </Link>
        <Link href={siteConfig.links.x} target="_blank" rel="noreferrer">
          <div
            className={buttonVariants({
              size: "icon",
              variant: "ghost",
            })}
          >
            <Icons.x />
            <span className="sr-only">X</span>
          </div>
        </Link>
      </div>
    </footer>
  );
}
