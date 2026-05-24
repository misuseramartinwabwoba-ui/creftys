const { runWorkspaceAudit } = require("../audit/workspace-audit");
const { buildDependencyGraph } = require("../graph/graph-engine");
const { runGovernanceRules } = require("../rules/rules-engine");
const { runViolationEngine } = require("../violations/violation-engine");
const { calculateGovernanceScore } = require("../scoring/governance-score-engine");
const { generateGovernanceReport } = require("../docs/governance-reporter");

describe("Governance Integration", () => {
  it("runs the full pipeline without throwing", () => {
    const graphData = buildDependencyGraph();
    expect(graphData).toHaveProperty("nodes");
    expect(graphData).toHaveProperty("adjacency");

    const audit = runWorkspaceAudit();
    expect(audit.packages.length).toBeGreaterThan(0);

    const ruleResults = runGovernanceRules({ adjacency: graphData.adjacency });
    expect(ruleResults).toHaveProperty("passed");
    expect(ruleResults).toHaveProperty("violations");

    const violations = runViolationEngine({
      audit,
      ruleResults,
      anomalies: [],
    });
    expect(violations).toHaveProperty("passed");
    expect(violations).toHaveProperty("failed");

    const score = calculateGovernanceScore({
      audit,
      violations,
      ruleResults,
    });
    expect(score.score).toBeGreaterThanOrEqual(0);
    expect(score.score).toBeLessThanOrEqual(100);

    const report = generateGovernanceReport({
      governanceScore: score,
      audit,
      ruleResults,
      violations,
    });
    expect(report.generatedAt).toBeDefined();
  });
});
