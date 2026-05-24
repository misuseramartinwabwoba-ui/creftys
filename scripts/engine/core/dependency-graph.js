const fs = require("fs");
const path = require("path");

module.exports = function buildGraph(workspace) {
  const graph = {};

  workspace.packages.forEach(pkg => {
    const pkgJsonPath = path.join(pkg.path, "package.json");

    if (!fs.existsSync(pkgJsonPath)) {
      graph[pkg.name] = [];
      return;
    }

    const pkgJson = JSON.parse(
      fs.readFileSync(pkgJsonPath, "utf-8")
    );

    const deps = Object.keys(pkgJson.dependencies || {})
      .filter(dep => dep.startsWith("@creftys/"));

    graph[pkg.name] = deps;
  });

  return graph;
};
