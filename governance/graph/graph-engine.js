// governance/graph/graph-engine.js
// Thin wrapper around the optimised graph engine

const { DependencyGraph } = require("../../ai/graph-optimizer/task1-graph-optimizer");

/**
 * Builds the full dependency graph for the workspace.
 * Uses caching automatically (first build caches, subsequent builds use cache).
 */
function buildDependencyGraph(rootPath = process.cwd()) {
  const engine = new DependencyGraph(rootPath, "packages/*");
  // Use sync for simplicity in the current pipeline; async is also available.
  return engine.buildSync();
}

/**
 * Optional: expose the class for advanced usage
 */
module.exports = { buildDependencyGraph, DependencyGraph };
