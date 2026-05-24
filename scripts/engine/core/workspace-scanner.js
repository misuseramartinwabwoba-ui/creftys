const fs = require("fs");
const path = require("path");

function scanDir(basePath) {
  if (!fs.existsSync(basePath)) return [];

  return fs.readdirSync(basePath)
    .filter(name =>
      fs.statSync(path.join(basePath, name)).isDirectory()
    )
    .map(name => ({
      name,
      path: path.join(basePath, name)
    }));
}

module.exports = function scanWorkspace() {
  return {
    packages: scanDir("packages"),
    apps: scanDir("apps")
  };
};
