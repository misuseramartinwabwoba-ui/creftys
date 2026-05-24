function runViolationEngine(payload) {
  const failed = [];

  if (payload.audit.failed.length > 0) {
    failed.push(...payload.audit.failed);
  }

  if (payload.ruleResults.violations.length > 0) {
    failed.push(...payload.ruleResults.violations);
  }

  // Anomalies are advisory – they do NOT block the build
  // if (payload.anomalies.length > 0) {
  //   failed.push(...payload.anomalies);
  // }

  return {
    passed: failed.length === 0,
    failed,
  };
}

module.exports = { runViolationEngine };
