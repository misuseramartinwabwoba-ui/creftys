export const LAYERS = {
  infra: 1,
  intelligence: 2,
  domain: 3,
  financial: 4,
  experience: 5,
};

export const RULES = [
  // lower number can NEVER import higher number
  {
    from: "infra",
    to: ["intelligence", "domain", "financial", "experience"],
  },
  {
    from: "intelligence",
    to: ["financial", "experience"],
  },
  {
    from: "domain",
    to: ["experience"],
  },
];