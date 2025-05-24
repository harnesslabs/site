export type SiteConfig = typeof siteConfig;

interface NavItem {
  href: string;
  label: string;
}

export const siteConfig = {
  name: "",
  description: "coming soon...",
  main: "https://harnesslabs.xyz",
  company: "harnesslabs",
  nav: [{ href: "/team", label: "Team" }] as NavItem[],
  links: {
    github: "https://github.com/harnesslabs",
    company: "https://harnesslabs.xyz",
    x: "https://x.com/harnesslabsdev",
  },
};
