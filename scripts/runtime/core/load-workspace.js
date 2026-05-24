const fs = require("fs");
const path = require("path");

function scan(basePath) {
  if (!fs.existsSync(basePath)) {
    return [];
  }

  return fs.readdirSync(basePath)
    .filter(name => {
      const full = path.join(basePath, name);
      return fs.statSync(full).isDirectory();
    })
    .map(name => ({
      name,
      path: path.join(basePath, name),
    }));
}

module.exports = function loadWorkspace() {
  return {
    packages: scan("packages"),
    apps: scan("apps"),
  };
};
