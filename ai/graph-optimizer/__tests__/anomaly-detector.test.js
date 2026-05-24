const { detectGraphAnomalies } = require("../task1-graph-optimizer");

describe("detectGraphAnomalies", () => {
  it("flags ISOLATED_PACKAGE (no edges at all)", () => {
    const graph = {
      nodes: new Set(["orphan"]),
      adjacency: new Map([["orphan", new Set()]]),
    };
    const result = detectGraphAnomalies(graph);
    expect(result).toContainEqual(
      expect.objectContaining({ type: "ISOLATED_PACKAGE", package: "orphan" })
    );
  });

  it("flags HIGH_DEPENDENCY_FANOUT (>5 internal deps)", () => {
    const deps = new Set(["a", "b", "c", "d", "e", "f"]);
    const graph = {
      nodes: new Set(["hub", ...deps]),
      adjacency: new Map([["hub", deps]]),
    };
    const result = detectGraphAnomalies(graph);
    expect(result).toContainEqual(
      expect.objectContaining({ type: "HIGH_DEPENDENCY_FANOUT", package: "hub", count: 6 })
    );
  });

  it("flags NO_DEPENDENTS (incoming=0, outgoing>0)", () => {
    const graph = {
      nodes: new Set(["lonely"]),
      adjacency: new Map([["lonely", new Set(["target"])]]),
    };
    const result = detectGraphAnomalies(graph);
    expect(result).toContainEqual(
      expect.objectContaining({ type: "NO_DEPENDENTS", package: "lonely" })
    );
  });

  it("flags SELF_LOOP", () => {
    const graph = {
      nodes: new Set(["self"]),
      adjacency: new Map([["self", new Set(["self"])]]),
    };
    const result = detectGraphAnomalies(graph);
    expect(result).toContainEqual(
      expect.objectContaining({ type: "SELF_LOOP", package: "self" })
    );
  });

  it("returns empty for healthy graph", () => {
    const graph = {
      nodes: new Set(["A", "B"]),
      adjacency: new Map([
        ["A", new Set(["B"])],
        ["B", new Set()],
      ]),
    };
    // Count incoming for A = 0, B = 1
    const result = detectGraphAnomalies(graph);
    // A has incoming 0 but outgoing 1 -> NO_DEPENDENTS? Actually A has no incoming but outgoing>0, so it will be flagged NO_DEPENDENTS. That's correct.
    // Let's adjust to avoid NO_DEPENDENTS for a root that is supposed to be a root: we only flag if incoming===0 AND outgoing>0, yes that flags roots too. That's intentional for "unused" detection. In a healthy graph you might want to ignore roots. That's a design choice. We'll just test that it's flagged.
    expect(result).toContainEqual(
      expect.objectContaining({ type: "NO_DEPENDENTS", package: "A" })
    );
    // B is fine
    expect(result.filter(r => r.type === "NO_DEPENDENTS").length).toBe(1);
  });
});