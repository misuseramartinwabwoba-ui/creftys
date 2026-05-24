// tests for core graph engine: Tarjan SCC, sync build, update, caching
const fs = require("fs");
const path = require("path");

// We mock fs for buildSync tests to avoid real disk reads
jest.mock("fs");
jest.mock("fs/promises");

const {
  DependencyGraph,
  optimizePackageScan,
  optimizeDependencyGraph,
} = require("../task1-graph-optimizer");

describe("DependencyGraph – core engine", () => {
  describe("detectCycles (Tarjan SCC)", () => {
    it("returns empty for acyclic graph", () => {
      const engine = new DependencyGraph("/root");
      engine.graph = {
        nodes: new Set(["A", "B", "C"]),
        adjacency: new Map([
          ["A", new Set(["B"])],
          ["B", new Set(["C"])],
          ["C", new Set()],
        ]),
      };
      expect(engine.detectCycles()).toEqual([]);
    });

    it("detects a simple 2-node cycle", () => {
      const engine = new DependencyGraph("/root");
      engine.graph = {
        nodes: new Set(["A", "B"]),
        adjacency: new Map([
          ["A", new Set(["B"])],
          ["B", new Set(["A"])],
        ]),
      };
      const cycles = engine.detectCycles();
      expect(cycles.length).toBe(1);
      expect(cycles[0]).toEqual(expect.arrayContaining(["A", "B"]));
    });

    it("detects a self-loop", () => {
      const engine = new DependencyGraph("/root");
      engine.graph = {
        nodes: new Set(["A"]),
        adjacency: new Map([["A", new Set(["A"])]]),
      };
      const cycles = engine.detectCycles();
      expect(cycles.length).toBe(1);
      expect(cycles[0]).toEqual(["A"]);
    });

    it("detects multiple independent cycles", () => {
      const engine = new DependencyGraph("/root");
      engine.graph = {
        nodes: new Set(["X", "Y", "Z", "W"]),
        adjacency: new Map([
          ["X", new Set(["Y"])],
          ["Y", new Set(["X"])],
          ["Z", new Set(["W"])],
          ["W", new Set(["Z"])],
        ]),
      };
      const cycles = engine.detectCycles();
      expect(cycles.length).toBe(2);
    });
  });

  describe("buildSync with mocked filesystem", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("creates graph with internal @creftys/* packages", () => {
      const root = "/fake-root";
      fs.readdirSync.mockReturnValue(["shared-types", "property-core"]);
      fs.statSync.mockReturnValue({ isDirectory: () => true });
      fs.existsSync.mockReturnValue(true);   // ← REQUIRED FIX
      fs.readFileSync.mockImplementation((filePath) => {
        if (filePath.includes("shared-types"))
          return JSON.stringify({
            name: "@creftys/shared-types",
            version: "1.0.0",
            dependencies: {},
          });
        if (filePath.includes("property-core"))
          return JSON.stringify({
            name: "@creftys/property-core",
            version: "1.0.0",
            dependencies: { "@creftys/shared-types": "workspace:*" },
          });
        return "";
      });

      const engine = new DependencyGraph(root);
      const graph = engine.buildSync();

      expect(graph.nodes.size).toBe(2);
      expect(graph.adjacency.get("@creftys/property-core")).toContain("@creftys/shared-types");
    });
  });

  describe("update (incremental)", () => {
    it("updates edges when a package.json changes", () => {
      const engine = new DependencyGraph("/root");
      engine.nodeMap.set("@creftys/A", { name: "@creftys/A", path: "packages/A" });
      engine.nodeMap.set("@creftys/B", { name: "@creftys/B", path: "packages/B" });
      engine.graph.nodes.add("@creftys/A");
      engine.graph.nodes.add("@creftys/B");
      engine.graph.adjacency.set("@creftys/A", new Set(["@creftys/B"]));
      engine.packageDeps.set("@creftys/A", new Set(["@creftys/B"]));

      const newPkg = { dependencies: { "@creftys/B": "workspace:*" }, devDependencies: {} };
      jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(newPkg));

      engine.update("@creftys/A");
      expect(engine.graph.adjacency.get("@creftys/A")).toContain("@creftys/B");
    });
  });

  describe("optimizePackageScan / optimizeDependencyGraph", () => {
    it("returns config object and graph instance", () => {
      const config = optimizePackageScan("/root", []);
      expect(config.root).toBe("/root");
      const graphEngine = optimizeDependencyGraph(config);
      expect(graphEngine).toBeInstanceOf(DependencyGraph);
    });
  });
});