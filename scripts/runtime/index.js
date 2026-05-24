const loadWorkspace = require("./core/load-workspace");
const repoHealth = require("./health/repo-health");

console.log("\n🧠 CREFTYS DEVELOPMENT RUNTIME\n");

const workspace = loadWorkspace();

console.log(`📦 Packages: ${workspace.packages.length}`);
console.log(`🖥 Apps: ${workspace.apps.length}`);

repoHealth(workspace);

console.log("\n✅ DEVELOPMENT RUNTIME READY\n");
