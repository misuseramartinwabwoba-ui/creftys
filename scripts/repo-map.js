#!/usr/bin/env node

/**
 * CREFTYS SAFE MONOREPO MAP ENGINE
 * ---------------------------------
 * Fast, bounded, architecture-only scanner
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const TARGETS = ["packages", "apps"];

const IGNORE = new Set([
  "node_modules",
  "dist",
  ".git",
  ".turbo",
  ".next",
]);

function scanDir(dir, depth = 0, maxDepth = 4) {
  if (depth > maxDepth) return [];

  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries
    .filter((e) => !IGNORE.has(e.name))
    .map((entry) => {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return {
          type: "dir",
          name: entry.name,
          children: scanDir(full, depth + 1, maxDepth),
        };
      }

      return {
        type: "file",
        name: entry.name,
      };
    });
}

function getPackages(folder) {
  const base = path.join(ROOT, folder);

  if (!fs.existsSync(base)) return [];

  return fs.readdirSync(base)
    .map((name) => {
      const pkgPath = path.join(base, name);
      const pkgJson = path.join(pkgPath, "package.json");

      if (!fs.existsSync(pkgJson)) return null;

      try {
        const json = JSON.parse(fs.readFileSync(pkgJson, "utf8"));

        return {
          name: json.name,
          path: pkgPath,
          deps: Object.keys(json.dependencies || {}),
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function main() {
  console.log("\n🏗️ SAFE MONOREPO ARCHITECTURE SNAPSHOT\n");

  // STRUCTURE (bounded)
  for (const t of TARGETS) {
    const dir = path.join(ROOT, t);

    console.log(`\n📁 ${t.toUpperCase()}`);

    const tree = scanDir(dir);

    tree.forEach(print);
  }

  // PACKAGES
  console.log("\n📦 PACKAGES\n");

  const packages = getPackages("packages");

  packages.forEach((p) => {
    console.log(`• ${p.name}`);
    console.log(`  deps: ${p.deps.length}`);
    console.log(`  path: ${p.path}\n`);
  });

  // APPS
  console.log("\n📱 APPS\n");

  const apps = getPackages("apps");

  apps.forEach((a) => {
    console.log(`• ${a.name}`);
    console.log(`  deps: ${a.deps.length}`);
    console.log(`  path: ${a.path}\n`);
  });

  console.log("\n✅ SNAPSHOT COMPLETE (SAFE MODE)\n");
}

function print(node, indent = "") {
  if (node.type === "dir") {
    console.log(`${indent}📁 ${node.name}`);
    node.children.forEach((c) => print(c, indent + "  "));
  } else {
    console.log(`${indent}📄 ${node.name}`);
  }
}

main();