import fs from "fs";
import path from "path";

export function validatePackage(pkgPath: string) {
  const requiredFiles = [
    "src/index.ts",
    "package.json",
    "tsconfig.json",
    "README.md",
    "tsup.config.ts",
  ];

  const missing: string[] = [];

  for (const file of requiredFiles) {
    const fullPath = path.join(pkgPath, file);
    if (!fs.existsSync(fullPath)) {
      missing.push(file);
    }
  }

  return {
    package: pkgPath,
    valid: missing.length === 0,
    missing,
  };
}