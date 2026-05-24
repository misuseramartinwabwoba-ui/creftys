export function calculatePackageRisk(pkg: any) {
  let score = 100;

  // Missing index file
  if (!pkg.hasIndexFile) score -= 30;

  // Circular dependency risk
  if (pkg.hasCircularDeps) score -= 25;

  // Layer violation
  if (pkg.layerViolations > 0) score -= 30;

  // Too many dependencies
  if ((pkg.dependencyCount || 0) > 10) score -= 10;

  return {
    package: pkg.name,
    score: Math.max(score, 0),
    status:
      score > 80
        ? "HEALTHY"
        : score > 50
        ? "WARNING"
        : "CRITICAL",
  };
}