export interface Project {
  name: string;
  link: string;
  slug: string;
  description: string;
}

export const projects: Project[] = [
  {
    name: "Cova",
    link: "https://github.com/harnesslabs/cova",
    slug: "cova",
    description:
      "Mathematical abstractions and computations with rigorous implementations of algebraic structures, topological spaces, and computational mathematics.",
  },
  {
    name: "Arbiter",
    link: "https://github.com/harnesslabs/arc-agi",
    slug: "arbiter",
    description:
      "A blazing-fast Ethereum sandbox that lets developers orchestrate event-driven simulations.",
  },
  {
    name: "ARC-AGI",
    link: "https://github.com/harnesslabs/arc-agi",
    slug: "arc-agi",
    description:
      "Fundamental algorithm design for artificial intelligence, focused on the ability to adapt and reason in complex environments.",
  },
  {
    name: "Pha",
    link: "https://github.com/harnesslabs/pha",
    slug: "pha",
    description:
      "Leveraging reinforcement learning and evolutionary algorithms for dynamical systems and control theory.",
  },
];
