import { auditWorkspace } from "./workspace-audit";

const result = auditWorkspace();

console.log("🧠 GOVERNANCE REPORT");
console.log("===================");

console.log(`Total packages: ${result.total}`);
console.log(`Passed: ${result.passed}`);
console.log(`Failed: ${result.failed.length}`);

if (result.failed.length > 0) {
  console.log("\n❌ VIOLATIONS:");
  console.log(JSON.stringify(result.failed, null, 2));

  process.exit(1);
}

console.log("\n✅ ALL PACKAGES GOVERNANCE-COMPLIANT");