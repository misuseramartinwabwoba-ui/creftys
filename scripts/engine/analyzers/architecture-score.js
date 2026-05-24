module.exports = function architectureScore(graph) {
  const packages = Object.keys(graph);

  let score = 100;

  packages.forEach(pkg => {
    const deps = graph[pkg];

    if (deps.length > 8) {
      score -= 5;
    }
  });

  console.log("\n🏗 Architecture Score:", score + "/100");

  if (score >= 90) {
    console.log("✅ Excellent architecture");
  } else if (score >= 70) {
    console.log("⚠️ Moderate complexity");
  } else {
    console.log("❌ Refactor recommended");
  }
};
