const fs = require("fs");
const path = require("path");

const REQUIRED_FILES = [
  "README.md",
  "package.json",
  "tsconfig.json",
];

function runWorkspaceAudit() {
  const packagesDir = path.join(process.cwd(), "packages");

  if (!fs.existsSync(packagesDir)) {
    return {
      packages: [],
      failed: [{ type: "MISSING_PACKAGES_DIRECTORY" }],
    };
  }

  const packages = fs
    .readdirSync(packagesDir)
    .map((pkg) => path.join(packagesDir, pkg))
    .filter((pkgPath) => fs.statSync(pkgPath).isDirectory());

  const failed = [];

  for (const pkgPath of packages) {
    for (const file of REQUIRED_FILES) {
      const target = path.join(pkgPath, file);
      if (!fs.existsSync(target)) {
        failed.push({
          type: "MISSING_REQUIRED_FILE",
          package: path.basename(pkgPath),
          file,
        });
      }
    }
  }

  return { packages, failed };
}

module.exports = { runWorkspaceAudit };
