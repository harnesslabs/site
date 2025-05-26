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
      "A library for computational mathematics with precise, principled implementations of algebraic structures, topological spaces, and formal abstraction.",
  },
  {
    name: "Arbiter",
    link: "https://github.com/harnesslabs/arbiter",
    slug: "arbiter",
    description:
      "A Rust-based multi-agent framework for the design, simulation, and auditing of autonomous, event-driven systems.",
  },
  {
    name: "Pha",
    link: "https://github.com/harnesslabs/pha",
    slug: "pha",
    description:
      "An exploration into reinforcement learning and evolutionary algorithms for dynamical systems and control theory.",
  },
  {
    name: "ARC-AGI",
    link: "https://github.com/harnesslabs/arc-agi",
    slug: "arc-agi",
    description:
      "Biologically inspired and mathematically grounded learning algorithms for adaption and reasoning in complex environments.",
  },
];
