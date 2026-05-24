#!/usr/bin/env node

/**
 * CREFTYS / OWNIT UG MONOREPO INTROSPECTOR
 * ----------------------------------------
 * Produces a full structural + dependency + architecture snapshot
 * for LLM reasoning, audits, and system design review.
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const PACKAGES_DIR = path.join(ROOT, "packages");
const APPS_DIR = path.join(ROOT, "apps");

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function listPackages(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .map((name) => {
      const pkgPath = path.join(dir, name);
      const pkgJsonPath = path.join(pkgPath, "package.json");

      if (!fs.existsSync(pkgJsonPath)) return null;

      const pkg = readJson(pkgJsonPath);
      if (!pkg) return null;

      return {
        name: pkg.name,
        version: pkg.version,
        path: pkgPath,
        dependencies: Object.keys(pkg.dependencies || {}),
        devDependencies: Object.keys(pkg.devDependencies || {}),
      };
    })
    .filter(Boolean);
}

function printSection(title) {
  console.log("\n" + "=".repeat(80));
  console.log(title);
  console.log("=".repeat(80));
}

function main() {
  printSection("📦 MONOREPO STRUCTURE SNAPSHOT");

  const packages = listPackages(PACKAGES_DIR);
  const apps = listPackages(APPS_DIR);

  console.log("\n--- PACKAGES ---\n");
  packages.forEach((p) => {
    console.log(`• ${p.name}`);
    console.log(`  path: ${p.path}`);
    console.log(`  deps: ${p.dependencies.length}`);
    console.log(`  devDeps: ${p.devDependencies.length}`);
    console.log("");
  });

  console.log("\n--- APPS ---\n");
  apps.forEach((a) => {
    console.log(`• ${a.name}`);
    console.log(`  path: ${a.path}`);
    console.log(`  deps: ${a.dependencies.length}`);
    console.log("");
  });

  printSection("🔗 INTERNAL DEPENDENCY GRAPH");

  const all = [...packages, ...apps];

  for (const pkg of all) {
    const internalDeps = (pkg.dependencies || []).filter((d) =>
      d.startsWith("@creftys/")
    );

    if (internalDeps.length > 0) {
      console.log(`\n${pkg.name}`);
      internalDeps.forEach((dep) => {
        console.log(`  → ${dep}`);
      });
    }
  }

  printSection("⚠️ ARCHITECTURE HEALTH CHECK");

  const violations = [];

  for (const pkg of packages) {
    const deps = pkg.dependencies.filter((d) =>
      d.startsWith("@creftys/")
    );

    for (const dep of deps) {
      // crude check: app depending on package OK, package depending on app NOT OK
      if (pkg.name.includes("core") && dep.includes("web")) {
        violations.push({
          from: pkg.name,
          to: dep,
        });
      }
    }
  }

  if (violations.length === 0) {
    console.log("✅ No obvious cross-layer violations detected");
  } else {
    console.log("❌ Violations detected:");
    violations.forEach((v) => {
      console.log(`  ${v.from} → ${v.to}`);
    });
  }

  printSection("🧠 LLM READY SUMMARY (COPY THIS)");

  console.log(
    JSON.stringify(
      {
        packages,
        apps,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );
}

main();