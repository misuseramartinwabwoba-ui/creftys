import fs from "fs";
import path from "path";
import { validatePackage } from "./package-validator";

export function auditWorkspace() {
  const packagesDir = path.join(process.cwd(), "packages");

  const packages = fs.readdirSync(packagesDir);

  const results = packages.map((pkg) =>
    validatePackage(path.join(packagesDir, pkg))
  );

  const failures = results.filter((r) => !r.valid);

  return {
    total: results.length,
    passed: results.length - failures.length,
    failed: failures,
  };
}