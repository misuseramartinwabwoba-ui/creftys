const fs = require("fs");
const path = require("path");

module.exports = function repoHealth(workspace) {
  let score = 100;

  console.log("\n🩺 REPO HEALTH REPORT\n");

  workspace.packages.forEach(pkg => {
    const packageJson = path.join(pkg.path, "package.json");

    if (!fs.existsSync(packageJson)) {
      console.log(`❌ Missing package.json → ${pkg.name}`);
      score -= 10;
    }

    const srcDir = path.join(pkg.path, "src");

    if (!fs.existsSync(srcDir)) {
      console.log(`⚠ Missing src directory → ${pkg.name}`);
      score -= 5;
    }
  });

  console.log(`\n🏥 Repo Health Score: ${score}/100`);

  if (score >= 90) {
    console.log("✅ Healthy repository");
  } else if (score >= 70) {
    console.log("⚠ Moderate repo degradation");
  } else {
    console.log("❌ Repository stabilization required");
  }
};
