import fs from "fs";
import path from "path";

export function buildArchitectureGraph() {
  const packagesDir = path.join(process.cwd(), "packages");

  const packages = fs.readdirSync(packagesDir);

  const nodes = [];
  const edges = [];

  for (const pkgName of packages) {
    const pkgPath = path.join(packagesDir, pkgName);
    const pkgJson = JSON.parse(
      fs.readFileSync(`${pkgPath}/package.json`, "utf8")
    );

    nodes.push({
      id: pkgJson.name,
      layer: pkgJson.creftysLayer || "unknown",
    });

    const deps = Object.keys(pkgJson.dependencies || {});

    for (const dep of deps) {
      edges.push({
        from: pkgJson.name,
        to: dep,
      });
    }
  }

  return { nodes, edges };
}