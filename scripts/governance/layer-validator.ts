import fs from "fs";

export function validateLayer(packageJsonPath: string) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const layer = pkg.creftysLayer;

  const deps = Object.keys(pkg.dependencies || {});

  const violations = [];

  for (const dep of deps) {
    const depPkg = JSON.parse(
      fs.readFileSync(
        `packages/${dep.split("/")[1]}/package.json`,
        "utf8"
      )
    );

    if (depPkg.creftysLayer < layer) {
      violations.push({
        type: "LAYER_VIOLATION",
        from: pkg.name,
        to: depPkg.name,
      });
    }
  }

  return violations;
}