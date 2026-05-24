#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

function kebab(name) {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .replace(/_+/g, "-")
    .toLowerCase();
}

function safeWrite(file, content) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content);
  }
}

function createPackage(dir, opts = {}) {
  const normalizedDir = kebab(dir);
  const pkgDir = path.join(ROOT, "packages", normalizedDir);

  fs.mkdirSync(pkgDir, { recursive: true });

  const packageName =
    opts.name || `@creftys/${path.basename(normalizedDir)}`;

  const pkgJson = {
    name: packageName,
    version: "1.0.0",
    private: true,
    type: "module",
    main: "dist/index.js",
    module: "dist/index.js",
    types: "dist/index.d.ts",

    scripts: {
      build: "tsup",
      dev: "tsup --watch",
      clean: "rimraf dist",
      test: "jest"
    },

    dependencies: {
      "@creftys/shared-types": "workspace:*"
    },

    devDependencies: {
      rimraf: "^5.0.5",
      tsup: "^8.0.1",
      typescript: "^5.4.0",
      jest: "^29.7.0",
      "@types/jest": "^29.5.12",
      "ts-jest": "^29.1.2"
    }
  };

  safeWrite(
    path.join(pkgDir, "package.json"),
    JSON.stringify(pkgJson, null, 2)
  );

  const srcDir = path.join(pkgDir, "src");
  fs.mkdirSync(srcDir, { recursive: true });

  safeWrite(
    path.join(srcDir, "index.ts"),
    `export const ${camel(path.basename(normalizedDir))} = {};\n`
  );

  safeWrite(
    path.join(pkgDir, "tsconfig.json"),
    JSON.stringify(
      {
        extends: "../../tsconfig.base.json",
        compilerOptions: {
          outDir: "dist"
        },
        include: ["src"]
      },
      null,
      2
    )
  );

  safeWrite(
    path.join(pkgDir, "tsup.config.ts"),
    `
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true
});
`.trim()
  );

  safeWrite(
    path.join(pkgDir, "README.md"),
    `# ${packageName}\n`
  );

  safeWrite(
    path.join(pkgDir, ".gitignore"),
    `dist\nnode_modules\n`
  );

  console.log(`✅ Package generated: ${packageName}`);
}

function camel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function usage() {
  console.log(`
Usage:
  node scripts/generate-package.js <package-name>

Example:
  node scripts/generate-package.js valuation-engine
`);
}

if (require.main === module) {
  const arg = process.argv[2];

  if (!arg) {
    usage();
    process.exit(1);
  }

  createPackage(arg);
}

module.exports = {
  createPackage,
  kebab
};
