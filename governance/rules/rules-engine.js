const LAYER_RULES = {
  infra: ["infra"],
  domain: ["infra", "domain"],
  app: ["infra", "domain", "app"],
  ai: ["infra", "domain", "ai"],
};

function runGovernanceRules(graph) {
  const violations = [];

  for (const [pkg, deps] of graph.adjacency.entries()) {
    for (const dep of deps) {
      if (pkg === dep) {
        violations.push({
          type: "SELF_REFERENCE",
          package: pkg,
        });
      }
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

module.exports = { runGovernanceRules, LAYER_RULES };
