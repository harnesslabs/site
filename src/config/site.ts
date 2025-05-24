export type SiteConfig = typeof siteConfig;

interface NavItem {
  href: string;
  label: string;
}

export const siteConfig = {
  name: "Harness Labs",
  description: "coming soon...",
  main: "https://harnesslabs.xyz",
  nav: [
    { href: "/about", label: "About" },
    { href: "https://github.com/harnesslabs", label: "GitHub" },
  ] as NavItem[],
  links: {
    company: "https://harnesslabs.xyz",
    github: "https://github.com/harnesslabs",
    x: "https://x.com/harnesslabs",
  },
};
