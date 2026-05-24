const { generateBuildOrder } = require("../task1-graph-optimizer");

describe("generateBuildOrder (Kahn's algorithm)", () => {
  it("returns correct order for simple chain A→B→C", () => {
    const adj = new Map([
      ["A", new Set(["B"])],
      ["B", new Set(["C"])],
      ["C", new Set()],
    ]);
    const order = generateBuildOrder(adj);
    expect(order).toEqual(["A", "B", "C"]);
  });

  it("returns any valid topological order for DAG with multiple roots", () => {
    const adj = new Map([
      ["A", new Set(["C"])],
      ["B", new Set(["C"])],
      ["C", new Set()],
    ]);
    const order = generateBuildOrder(adj);
    // A and B must come before C
    expect(order.indexOf("A")).toBeLessThan(order.indexOf("C"));
    expect(order.indexOf("B")).toBeLessThan(order.indexOf("C"));
  });

  it("handles disconnected nodes", () => {
    const adj = new Map([
      ["X", new Set()],
      ["Y", new Set()],
      ["Z", new Set()],
    ]);
    const order = generateBuildOrder(adj);
    expect(order).toHaveLength(3);
    expect(order.sort()).toEqual(["X", "Y", "Z"]);
  });

  it("throws an error when a cycle is present", () => {
    const adj = new Map([
      ["A", new Set(["B"])],
      ["B", new Set(["A"])],
    ]);
    expect(() => generateBuildOrder(adj)).toThrow("Cycle detected");
  });

  it("sorts a complex diamond graph", () => {
    // A→B, A→C, B→D, C→D
    const adj = new Map([
      ["A", new Set(["B", "C"])],
      ["B", new Set(["D"])],
      ["C", new Set(["D"])],
      ["D", new Set()],
    ]);
    const order = generateBuildOrder(adj);
    expect(order).toEqual(["A", "B", "C", "D"]);
  });
});