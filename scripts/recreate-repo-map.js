#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const IGNORE = new Set([
  "node_modules",
  "dist",
  ".git",
  ".turbo",
  ".next",
  "coverage",
]);

/**
 * Build a safe recursive file tree
 */
function walk(dir, depth = 0) {
  if (depth > 6) return null; // safety stop (prevents hanging)

  let children;

  try {
    children = fs.readdirSync(dir);
  } catch (e) {
    return null;
  }

  const result = [];

  for (const name of children) {
    if (IGNORE.has(name)) continue;

    const full = path.join(dir, name);

    let stat;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      const subtree = walk(full, depth + 1);

      result.push({
        type: "dir",
        name,
        children: subtree || [],
      });
    } else {
      result.push({
        type: "file",
        name,
      });
    }
  }

  return result;
}

/**
 * Collect workspace root structure
 */
function buildMonorepoMap() {
  const packagesDir = path.join(ROOT, "packages");
  const appsDir = path.join(ROOT, "apps");

  const output = {
    root: "creftys",
    generatedAt: new Date().toISOString(),
    packages: [],
    apps: [],
  };

  if (fs.existsSync(packagesDir)) {
    const pkgs = fs.readdirSync(packagesDir);

    for (const pkg of pkgs) {
      const full = path.join(packagesDir, pkg);
      if (!fs.statSync(full).isDirectory()) continue;

      output.packages.push({
        name: pkg,
        tree: walk(full),
      });
    }
  }

  if (fs.existsSync(appsDir)) {
    const apps = fs.readdirSync(appsDir);

    for (const app of apps) {
      const full = path.join(appsDir, app);
      if (!fs.statSync(full).isDirectory()) continue;

      output.apps.push({
        name: app,
        tree: walk(full),
      });
    }
  }

  return output;
}

/**
 * Pretty print tree
 */
function printTree(nodes, indent = "") {
  if (!nodes) return;

  for (const node of nodes) {
    if (node.type === "file") {
      console.log(`${indent}📄 ${node.name}`);
    } else {
      console.log(`${indent}📁 ${node.name}`);
      printTree(node.children, indent + "  ");
    }
  }
}

/**
 * MAIN
 */
function main() {
  console.log("\n🧭 REBUILDING MONOREPO MAP...\n");

  const map = buildMonorepoMap();

  console.log("========================================");
  console.log("📦 PACKAGES");
  console.log("========================================\n");

  for (const pkg of map.packages) {
    console.log(`📦 ${pkg.name}`);
    printTree(pkg.tree, "  ");
    console.log("");
  }

  console.log("========================================");
  console.log("🚀 APPS");
  console.log("========================================\n");

  for (const app of map.apps) {
    console.log(`🚀 ${app.name}`);
    printTree(app.tree, "  ");
    console.log("");
  }

  console.log("========================================");
  console.log("✅ DONE");
  console.log("========================================\n");

  const outFile = path.join(ROOT, "repo-map.json");
  fs.writeFileSync(outFile, JSON.stringify(map, null, 2));

  console.log(`📁 Saved: repo-map.json`);
}

main();