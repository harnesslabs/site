"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="block bg-background top-0 z-40 border-b dark:border-b-neutral-600">
      <div className="mx-auto px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <nav className="flex items-center space-x-1">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="px-2">
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
