const { generateGovernanceReport } = require("../docs/governance-reporter");

describe("Governance Reporter", () => {
  it("generates a properly structured report", () => {
    const payload = {
      governanceScore: { score: 95, grade: "A", violations: 1 },
      audit: { packages: ["pkg1"], failed: [] },
      ruleResults: { passed: true, violations: [] },
      violations: { passed: true, failed: [] },
    };
    const report = generateGovernanceReport(payload);
    expect(report).toHaveProperty("generatedAt");
    expect(report.summary).toEqual({
      score: 95,
      grade: "A",
      violations: 1,
    });
    expect(report.audit).toEqual(payload.audit);
    expect(report.ruleResults).toEqual(payload.ruleResults);
    expect(report.violations).toEqual(payload.violations);
  });
});
