function calculateGovernanceScore(payload) {
  const packageCount = payload.audit.packages.length;
  const violations = payload.violations.failed.length;
  const score = Math.max(0, 100 - violations * 5);

  return {
    score,
    packages: packageCount,
    violations,
    grade: score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D",
  };
}

module.exports = { calculateGovernanceScore };
