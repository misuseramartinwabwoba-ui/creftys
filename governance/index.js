module.exports = {
  audit: require("./audit/workspace-audit"),
  rules: require("./rules/rules-engine"),
  violations: require("./violations/violation-engine"),
  scoring: require("./scoring/governance-score-engine"),
  docs: require("./docs/governance-reporter"),
  graph: require("./graph/graph-engine"),
};
