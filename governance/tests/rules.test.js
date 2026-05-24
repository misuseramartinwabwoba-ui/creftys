const { runGovernanceRules } = require("../rules/rules-engine");

describe("Governance Rules", () => {
  it("passes a clean graph", () => {
    const graph = {
      adjacency: new Map([
        ["@creftys/property-core", new Set(["@creftys/shared-types"])],
        ["@creftys/shared-types", new Set()],
      ]),
    };
    const result = runGovernanceRules(graph);
    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("detects self-reference", () => {
    const graph = {
      adjacency: new Map([
        ["@creftys/analytics", new Set(["@creftys/analytics"])],
      ]),
    };
    const result = runGovernanceRules(graph);
    expect(result.passed).toBe(false);
    expect(result.violations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "SELF_REFERENCE",
          package: "@creftys/analytics",
        }),
      ])
    );
  });

  it("handles empty graph", () => {
    const graph = { adjacency: new Map() };
    const result = runGovernanceRules(graph);
    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);
  });
});
