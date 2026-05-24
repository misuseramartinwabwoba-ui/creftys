export function evaluateRules(pkg: any) {
  const violations = [];

  // Rule 1: No empty packages
  if (!pkg.hasIndexFile) {
    violations.push("MISSING_INDEX_FILE");
  }

  // Rule 2: No illegal dependency imports
  if (pkg.importsInfraDirectly) {
    violations.push("INFRASTRUCTURE_BYPASS");
  }

  // Rule 3: No circular dependencies
  if (pkg.hasCircularDeps) {
    violations.push("CIRCULAR_DEPENDENCY");
  }

  return violations;
}