
const scanWorkspace = require("./core/workspace-scanner");
const buildGraph = require("./core/dependency-graph");
const architectureScore = require("./analyzers/architecture-score");

console.log("\n🧠 CREFTYS ENGINE CORE\n");

const workspace = scanWorkspace();
const graph = buildGraph(workspace);

console.log("\n📦 Packages:", workspace.packages.length);
console.log("🖥 Apps:", workspace.apps.length);

architectureScore(graph);

console.log("\n✅ ENGINE READY\n");


