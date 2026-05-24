const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ------------------------------------------------------------------
// 0. Import governance modules
// ------------------------------------------------------------------
const { buildDependencyGraph } = require("../governance/graph/graph-engine");
const { runWorkspaceAudit } = require("../governance/audit/workspace-audit");
const { runGovernanceRules } = require("../governance/rules/rules-engine");
const { runViolationEngine } = require("../governance/violations/violation-engine");
const { calculateGovernanceScore } = require("../governance/scoring/governance-score-engine");
const { generateGovernanceReport } = require("../governance/docs/governance-reporter");

// Optimisation engine (for anomaly detection & build order)
const { detectGraphAnomalies, generateBuildOrder } = require("../ai/optimisation-engine/optimisation-engine");

// ------------------------------------------------------------------
// 1. Safe bootstrap
// ------------------------------------------------------------------
const LOG_DIR = path.resolve("./logs");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const logFile = (name, data) =>
  fs.writeFileSync(path.join(LOG_DIR, name), JSON.stringify(data, null, 2));

// ------------------------------------------------------------------
// 2. Governance pipeline (async wrapper for consistency)
(async () => {
  console.log("\n🏗 CREFTYS GOVERNANCE OS v1\n");

  try {
    // 2.1 Build dependency graph
    console.log("🔗 Building dependency graph...");
    const graphData = buildDependencyGraph();
    const adjacency = graphData.adjacency;

    // 2.2 Cycle detection (already inside graph engine, but we can double-check)
    const { detectCycles } = require("../ai/optimisation-engine/optimisation-engine");
    const cycles = detectCycles(graphData);
    if (cycles.length > 0) {
      logFile("cycles.json", cycles);
      console.error("❌ Circular dependencies detected. Build halted.");
      process.exit(1);
    }

    // 2.3 Workspace audit
    console.log("🧪 Running workspace audit...");
    const audit = runWorkspaceAudit();

    // 2.4 Governance rules (self-reference, etc.)
    console.log("📏 Running governance rules...");
    const ruleResults = runGovernanceRules({ adjacency });

    // 2.5 Anomaly detection (advisory only)
    console.log("🔎 Structural anomaly scan...");
    const anomalies = detectGraphAnomalies({ nodes: graphData.nodes, adjacency });
    if (anomalies.length > 0) {
      logFile("anomalies.json", anomalies);
      console.warn("⚠️  Anomalies detected (advisory):", anomalies.length);
    }

    // 2.6 Violation engine (combines audit + rule violations; anomalies are NOT blocking)
    console.log("🚨 Running violation engine...");
    const violations = runViolationEngine({
      audit,
      ruleResults,
      anomalies, // passed but ignored inside engine now (as per our earlier change)
    });

    if (violations.failed.length > 0) {
      logFile("violations.json", violations);
      console.error("❌ GOVERNANCE VIOLATIONS DETECTED");
      console.error(JSON.stringify(violations.failed, null, 2));
      process.exit(1);
    }

    // 2.7 Governance score & report
    const governanceScore = calculateGovernanceScore({ audit, violations, ruleResults });
    const report = generateGovernanceReport({ governanceScore, audit, ruleResults, violations });
    logFile("governance-report.json", report);

    console.log("\n📊 Governance Score:", governanceScore.score);
    console.log("🏅 Grade:", governanceScore.grade);
    console.log("🚨 Violations:", governanceScore.violations);

    // ------------------------------------------------------------------
    // 3. Dynamic build order (topological sort from real graph)
    // ------------------------------------------------------------------
    console.log("\n📦 Generating optimal build order...");
    const buildOrder = generateBuildOrder(adjacency);
    logFile("build-order.json", buildOrder);
    console.log("Build sequence:", buildOrder.join(" → "));

    // ------------------------------------------------------------------
    // 4. Execute builds in computed order
    // ------------------------------------------------------------------
    console.log("\n🚀 Starting controlled build execution...\n");
    for (const pkg of buildOrder) {
      console.log(`📦 Building ${pkg}...`);
      try {
        const start = Date.now();
        execSync(`pnpm --filter ${pkg} build`, { stdio: "inherit" });
        console.log(`✅ ${pkg} (${Date.now() - start}ms)\n`);
      } catch (err) {
        logFile("build-failure.json", {
          package: pkg,
          error: err.message,
          timestamp: new Date().toISOString(),
        });
        console.error(`❌ BUILD FAILED: ${pkg}`);
        process.exit(1);
      }
    }

    console.log("🚀 ALL PACKAGES BUILT SUCCESSFULLY\n");
  } catch (err) {
    console.error("\n❌ SYSTEM FAILURE\n");
    logFile("system-failure.json", {
      error: err.message,
      stack: err.stack,
    });
    console.error(err);
    process.exit(1);
  }
})();
