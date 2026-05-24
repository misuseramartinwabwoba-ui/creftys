#!/usr/bin/env node

/**
 * CREFTYS REPO MAP ENGINE (STABLE VERSION)
 * ----------------------------------------
 * Deterministic, fast, and architecture-aware monorepo scanner.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const PACKAGES_DIR = path.join(ROOT, "packages");
const APPS_DIR = path.join(ROOT, "apps");

/**
 * -----------------------------
 * SAFE RECURSIVE SCAN (LIMITED)
 * -----------------------------
 */

function scanDir(dir, depth = 0, maxDepth = 4) {
  if (depth > maxDepth) return [];

  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir);

  return entries.map((entry) => {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      return {
        type: "dir",
        name: entry,
        children: scanDir(fullPath, depth + 1, maxDepth),
      };
    }

    return {
      type: "file",
      name: entry,
    };
  });
}

/**
 * -----------------------------
 * PACKAGE SCANNER
 * -----------------------------
 */

function getPackages(baseDir) {
  if (!fs.existsSync(baseDir)) return [];

  return fs.readdirSync(baseDir)
    .map((name) => {
      const fullPath = path.join(baseDir, name);
      const pkgJson = path.join(fullPath, "package.json");

      if (!fs.existsSync(pkgJson)) return null;

      try {
        const pkg = JSON.parse(fs.readFileSync(pkgJson, "utf8"));

        return {
          name: pkg.name || name,
          path: fullPath,
          dependencies: Object.keys(pkg.dependencies || {}),
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

/**
 * -----------------------------
 * MAIN REPORT
 * -----------------------------
 */

function printHeader(title) {
  console.log("\n" + "=".repeat(80));
  console.log(title);
  console.log("=".repeat(80) + "\n");
}

function main() {
  printHeader("🧠 CREFTYS REPO INTELLIGENCE MAP");

  const packages = getPackages(PACKAGES_DIR);
  const apps = getPackages(APPS_DIR);

  console.log("📦 PACKAGES\n");

  for (const pkg of packages) {
    console.log(`• ${pkg.name}`);
    console.log(`  path: ${pkg.path}`);
    console.log(`  deps: ${pkg.dependencies.length}`);

    const structure = scanDir(pkg.path);

    for (const item of structure) {
      console.log(`  └─ ${item.name}`);
    }

    console.log("");
  }

  console.log("\n🚀 APPS\n");

  for (const app of apps) {
    console.log(`• ${app.name}`);
    console.log(`  path: ${app.path}`);
  }

  printHeader("✅ REPO MAP COMPLETE (STABLE ENGINE)");
}

main();