export type SiteConfig = typeof siteConfig;

interface NavItem {
  href: string;
  label: string;
}

export const siteConfig = {
  name: "Harness Labs",
  description: "coming soon...",
  main: "https://harnesslabs.dev",
  nav: [
    [
      { href: "/about", label: "About" },
      { href: "/playground", label: "Play" },
    ],
    [
      { href: "mailto:contact@harnesslabs.dev", label: "Contact" },
      { href: "https://github.com/harnesslabs", label: "GitHub" },
    ],
  ] as NavItem[][],
  links: {
    email: "mailto:contact@harnesslabs.dev",
    company: "https://harnesslabs.dev",
    github: "https://github.com/harnesslabs",
    discord: "https://discord.gg/qEwPr3GMP2",
    x: "https://x.com/harnesslabs",
  },
};
