#!/usr/bin/env node

/**
 * CREFTYS MONOREPO ARCHITECTURE ENFORCEMENT
 * -----------------------------------------
 * Purpose:
 * Enforce strict bottom-up dependency flow across the OwnIt UG + CREFTSYS ecosystem.
 *
 * Layer Rules:
 *
 * Layer 0 → Pure shared primitives only
 * Layer 1 → Core spatial/math engines
 * Layer 2 → Domain/business engines
 * Layer 3 → Applications/API/frontends
 *
 * Allowed:
 *   lower → same/lower
 *
 * Forbidden:
 *   lower → higher
 *
 * Example:
 *   ❌ shared-types -> spatial-core
 *   ✅ property-core -> spatial-core
 *   ✅ apps -> everything
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const PACKAGE_DIRS = [
  path.join(ROOT, "packages"),
  path.join(ROOT, "apps"),
];

/**
 * =========================================================
 * ARCHITECTURE LAYERS
 * =========================================================
 */

const LAYERS = {
  // -------------------------------------------------------
  // LAYER 0 — FOUNDATION TYPES
  // -------------------------------------------------------
  "@creftys/shared-types": 0,

  // -------------------------------------------------------
  // LAYER 1 — CORE SPATIAL / MATH
  // -------------------------------------------------------
  "@creftys/spatial-core": 1,

  // -------------------------------------------------------
  // LAYER 2 — DOMAIN ENGINES
  // -------------------------------------------------------
  "@creftys/property-core": 2,
  "@creftys/lead-engine": 2,
  "@creftys/commission-engine": 2,
  "@creftys/verification-engine": 2,
  "@creftys/analytics": 2,
  "@creftys/database": 2,
  "@creftys/auth": 2,
  "@creftys/ui-system": 2,

  // -------------------------------------------------------
  // LAYER 3 — DELIVERY/APPLICATIONS
  // -------------------------------------------------------
  "@creftys/api-gateway": 3,
  "@creftys/ownitug-web": 3,
  "@creftys/ownitug-agent-hub": 3,
  "@creftys/creftys-admin": 3,
  "@creftys/field-verification-app": 3,
};

/**
 * =========================================================
 * HELPERS
 * =========================================================
 */

function normalizePath(p) {
  return p.replace(/\\/g, "/");
}

function packageExists(pkgPath) {
  return fs.existsSync(pkgPath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isInternalPackage(depName) {
  return depName.startsWith("@creftys/");
}

function getLayer(pkgName, pkgDir = "") {
  const normalized = normalizePath(pkgDir);

  // Everything inside /apps defaults to Layer 3
  if (normalized.includes("/apps/")) {
    return 3;
  }

  return LAYERS[pkgName] ?? 999;
}

function collectWorkspacePackages() {
  const packages = [];

  for (const baseDir of PACKAGE_DIRS) {
    if (!fs.existsSync(baseDir)) continue;

    const entries = fs.readdirSync(baseDir);

    for (const entry of entries) {
      const fullPath = path.join(baseDir, entry);

      if (!fs.statSync(fullPath).isDirectory()) continue;

      const packageJsonPath = path.join(fullPath, "package.json");

      if (!packageExists(packageJsonPath)) continue;

      try {
        const pkg = readJson(packageJsonPath);

        if (!pkg.name) continue;

        packages.push({
          name: pkg.name,
          path: fullPath,
          packageJsonPath,
          packageJson: pkg,
          layer: getLayer(pkg.name, fullPath),
        });
      } catch (err) {
        console.error(`❌ Failed to parse ${packageJsonPath}`);
        console.error(err);
        process.exit(1);
      }
    }
  }

  return packages;
}

/**
 * =========================================================
 * VALIDATION
 * =========================================================
 */

function validateArchitecture(packages) {
  let hasErrors = false;

  console.log("\n🏗️  CREFTYS Architecture Dependency Check\n");

  for (const pkg of packages) {
    const deps = {
      ...(pkg.packageJson.dependencies || {}),
      ...(pkg.packageJson.devDependencies || {}),
      ...(pkg.packageJson.peerDependencies || {}),
    };

    const depNames = Object.keys(deps);

    for (const depName of depNames) {
      if (!isInternalPackage(depName)) {
        continue;
      }

      const currentLayer = pkg.layer;
      const dependencyLayer = getLayer(depName);

      // Unknown internal package
      if (dependencyLayer === 999) {
        console.error(
          [
            "❌ UNKNOWN INTERNAL PACKAGE",
            `   Package: ${pkg.name}`,
            `   Unknown dependency: ${depName}`,
            `   Add it to dependency-lint.js layer registry.`,
            "",
          ].join("\n")
        );

        hasErrors = true;
        continue;
      }

      // CORE RULE:
      // Lower layers CANNOT depend on higher layers
      if (dependencyLayer > currentLayer) {
        console.error(
          [
            "❌ ARCHITECTURE VIOLATION",
            `   Package: ${pkg.name} (Layer ${currentLayer})`,
            `   Cannot depend on: ${depName} (Layer ${dependencyLayer})`,
            "",
            "   Dependency Direction:",
            `   Layer ${currentLayer} → Layer ${dependencyLayer}`,
            "",
            "   Reason:",
            "   Lower foundational layers must never import upward.",
            "",
            "   Example:",
            "   ❌ shared-types -> spatial-core",
            "   ✅ property-core -> spatial-core",
            "",
          ].join("\n")
        );

        hasErrors = true;
      }
    }
  }

  return hasErrors;
}

/**
 * =========================================================
 * EXECUTION
 * =========================================================
 */

function main() {
  const packages = collectWorkspacePackages();

  if (packages.length === 0) {
    console.error("❌ No workspace packages discovered.");
    process.exit(1);
  }

  const hasErrors = validateArchitecture(packages);

  if (hasErrors) {
    console.error(
      "\n🚨 Dependency lint failed. Fix architectural boundaries before proceeding.\n"
    );

    process.exit(1);
  }

  console.log("✅ Architectural boundaries intact.\n");
}

main();