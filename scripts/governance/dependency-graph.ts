import fs from "fs";

export function buildGraph(packages: string[]) {
  const graph: Record<string, string[]> = {};

  for (const pkgPath of packages) {
    const pkg = JSON.parse(
      fs.readFileSync(`${pkgPath}/package.json`, "utf8")
    );

    graph[pkg.name] = Object.keys(pkg.dependencies || {});
  }

  return graph;
}