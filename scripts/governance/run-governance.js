const { runGovernanceRules } = require("../../governance/rules/rules-engine");

async function main() {
  await runGovernanceRules();
}

main();