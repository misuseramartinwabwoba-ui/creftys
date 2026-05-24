#!/usr/bin/env node

const { execSync } = require("child_process");

console.log("\n🧠 CREFTYS REPO CORE INTELLIGENCE ENGINE\n");

// 1. Get repo map
const map = execSync("node scripts/recreate-repo-map.js", {
  encoding: "utf8",
});

// 2. Get dependency graph
const introspect = execSync("node scripts/repo-introspect.js", {
  encoding: "utf8",
});

// 3. Run architecture check
const ci = execSync("node scripts/ci/architecture-check.js", {
  encoding: "utf8",
});

console.log("\n========================================");
console.log("📦 RAW SYSTEM OUTPUTS COLLECTED");
console.log("========================================");

console.log("\n--- REPO MAP ---\n");
console.log(map);

console.log("\n--- DEPENDENCY INTROSPECTION ---\n");
console.log(introspect);

console.log("\n--- CI ARCHITECTURE CHECK ---\n");
console.log(ci);

console.log("\n========================================");
console.log("🧠 SYSTEM STATUS SUMMARY");
console.log("========================================");

// simple heuristic
const hasViolation = ci.includes("❌");

if (hasViolation) {
  console.log("❌ ARCHITECTURE STATUS: BROKEN");
  console.log("🔧 ACTION REQUIRED: Fix layer violations before proceeding");
} else {
  console.log("✅ ARCHITECTURE STATUS: STABLE");
}

console.log("\n========================================\n");