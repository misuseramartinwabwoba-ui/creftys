#!/usr/bin/env node

const { execSync } = require("child_process");

console.log("\n🚨 CREFTYS CI ARCHITECTURE CHECK\n");

try {
  execSync("node scripts/dependency-lint.js", { stdio: "inherit" });

  execSync("node scripts/repo-introspect.js", { stdio: "inherit" });

  console.log("\n✅ CI ARCHITECTURE CHECK PASSED\n");
  process.exit(0);
} catch (err) {
  console.error("\n❌ CI ARCHITECTURE FAILED\n");
  process.exit(1);
}