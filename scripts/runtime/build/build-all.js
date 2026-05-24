const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ORDER = require("./build-order");

const {
  optimizePackageScan,
  optimizeDependencyGraph,
  detectGraphAnomalies,
} = require("../ai/optimization/optimization-engine");

const {
  runWorkspaceAudit,
} = require("../governance/audit/workspace-audit");

const {
  runGovernanceRules,
} = require("../governance/rules/rules-engine");

const {
  runViolationEngine,
} = require("../governance/violations/violation-engine");

const {
  calculateGovernanceScore,
} = require("../governance/scoring/governance-score-engine");

const {
  generateGovernanceReport,
} = require("../governance/docs/governance-reporter");

console.log("\n🏗 CREFTYS GOVERNANCE OS v1\n");

if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs", { recursive: true });
}

(async () => {
  try {
    console.log("🧠 Initializing optimization engine...\n");

    const scanConfig = optimizePackageScan(process.cwd(), ORDER);

    const graphEngine = optimizeDependencyGraph(scanConfig);

    console.log("🔗 Building dependency graph...\n");

    await graphEngine.buildAsync();

    const cycles = graphEngine.detectCycles();

    if (cycles.length > 0) {
      console.error("❌ Circular dependencies detected\n");

      fs.writeFileSync(
        "./logs/cycles.json",
        JSON.stringify(cycles, null, 2)
      );

      console.error(cycles);

      process.exit(1);
    }

    console.log("🧪 Running workspace audit...\n");

    const audit = runWorkspaceAudit();

    console.log("📏 Running governance rules...\n");

    const ruleResults = runGovernanceRules(graphEngine.getAdjacencyList());

    console.log("🚨 Running violation engine...\n");

    const violations = runViolationEngine({
      audit,
      ruleResults,
      anomalies: detectGraphAnomalies(graphEngine.getAdjacencyList()),
    });

    if (violations.failed.length > 0) {
      console.error("❌ GOVERNANCE VIOLATIONS DETECTED\n");

      fs.writeFileSync(
        "./logs/violations.json",
        JSON.stringify(violations, null, 2)
      );

      console.error(JSON.stringify(violations.failed, null, 2));

      process.exit(1);
    }

    const governanceScore = calculateGovernanceScore({
      audit,
      violations,
      ruleResults,
    });

    const report = generateGovernanceReport({
      governanceScore,
      audit,
      ruleResults,
      violations,
    });

    fs.writeFileSync(
      "./logs/governance-report.json",
      JSON.stringify(report, null, 2)
    );

    console.log("\n📊 Governance Score:", governanceScore.score);
    console.log("📦 Packages:", governanceScore.packages);

    console.log("\n🚀 Starting controlled build execution...\n");

    for (const pkg of ORDER) {
      console.log(`📦 Building ${pkg}...`);

      const start = Date.now();

      execSync(`pnpm --filter ${pkg} build`, {
        stdio: "inherit",
      });

      const duration = Date.now() - start;

      console.log(`✅ ${pkg} built in ${duration}ms\n`);
    }

    console.log("🚀 ALL PACKAGES BUILT SUCCESSFULLY\n");
  } catch (err) {
    console.error("\n❌ SYSTEM FAILURE\n");

    fs.writeFileSync(
      "./logs/system-failure.json",
      JSON.stringify(
        {
          error: err.message,
          stack: err.stack,
        },
        null,
        2
      )
    );

    console.error(err);

    process.exit(1);
  }
})();