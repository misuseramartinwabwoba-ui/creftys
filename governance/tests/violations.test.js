const { runViolationEngine } = require("../violations/violation-engine");

describe("Violation Engine", () => {
  it("returns passed when there are no failures", () => {
    const payload = {
      audit: { failed: [] },
      ruleResults: { violations: [] },
      anomalies: [],
    };
    const result = runViolationEngine(payload);
    expect(result.passed).toBe(true);
    expect(result.failed).toHaveLength(0);
  });

  it("aggregates audit failures", () => {
    const payload = {
      audit: {
        failed: [
          { type: "MISSING_REQUIRED_FILE", package: "a", file: "README.md" },
        ],
      },
      ruleResults: { violations: [] },
      anomalies: [],
    };
    const result = runViolationEngine(payload);
    expect(result.passed).toBe(false);
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].package).toBe("a");
  });

  it("aggregates rule violations", () => {
    const payload = {
      audit: { failed: [] },
      ruleResults: {
        violations: [{ type: "SELF_REFERENCE", package: "b" }],
      },
      anomalies: [],
    };
    const result = runViolationEngine(payload);
    expect(result.passed).toBe(false);
    expect(result.failed).toContainEqual(
      expect.objectContaining({ type: "SELF_REFERENCE" })
    );
  });

  it("ignores anomalies (advisory)", () => {
    const payload = {
      audit: { failed: [] },
      ruleResults: { violations: [] },
      anomalies: [{ type: "HIGH_DEPENDENCY_FANOUT", package: "c", count: 7 }],
    };
    const result = runViolationEngine(payload);
    expect(result.passed).toBe(true);
    expect(result.failed).toHaveLength(0);
  });
});
