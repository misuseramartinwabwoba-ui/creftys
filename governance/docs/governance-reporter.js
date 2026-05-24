function generateGovernanceReport(payload) {
  return {
    generatedAt: new Date().toISOString(),
    summary: {
      score: payload.governanceScore.score,
      grade: payload.governanceScore.grade,
      violations: payload.governanceScore.violations,
    },
    audit: payload.audit,
    ruleResults: payload.ruleResults,
    violations: payload.violations,
  };
}

module.exports = { generateGovernanceReport };
