const { calculateGovernanceScore } = require("../scoring/governance-score-engine");

describe("Governance Score Engine", () => {
  it("gives score 100 with 0 violations", () => {
    const payload = {
      audit: { packages: ["a", "b", "c"] },
      violations: { failed: [] },
      ruleResults: { violations: [] },
    };
    const score = calculateGovernanceScore(payload);
    expect(score.score).toBe(100);
    expect(score.grade).toBe("A");
    expect(score.packages).toBe(3);
    expect(score.violations).toBe(0);
  });

  it("reduces score by 5 per violation", () => {
    const payload = {
      audit: { packages: ["a", "b"] },
      violations: {
        failed: [
          { type: "MISSING_REQUIRED_FILE" },
          { type: "SELF_REFERENCE" },
        ],
      },
      ruleResults: { violations: [] },
    };
    const score = calculateGovernanceScore(payload);
    expect(score.score).toBe(90);
    expect(score.grade).toBe("A");
  });

  it("returns grade B at 75-89", () => {
    const payload = {
      audit: { packages: ["x"] },
      violations: { failed: new Array(5).fill({}) },
      ruleResults: { violations: [] },
    };
    const score = calculateGovernanceScore(payload);
    expect(score.score).toBe(75);
    expect(score.grade).toBe("B");
  });

  it("returns grade C at 60-74", () => {
    const payload = {
      audit: { packages: ["x"] },
      violations: { failed: new Array(8).fill({}) },
      ruleResults: { violations: [] },
    };
    const score = calculateGovernanceScore(payload);
    expect(score.score).toBe(60);
    expect(score.grade).toBe("C");
  });

  it("returns grade D below 60", () => {
    const payload = {
      audit: { packages: ["x"] },
      violations: { failed: new Array(9).fill({}) },
      ruleResults: { violations: [] },
    };
    const score = calculateGovernanceScore(payload);
    expect(score.score).toBe(55);
    expect(score.grade).toBe("D");
  });
});
