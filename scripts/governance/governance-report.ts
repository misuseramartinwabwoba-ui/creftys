export function generateReport(audit: any) {
  return {
    timestamp: new Date().toISOString(),
    totalPackages: audit.total,
    passed: audit.passed,
    failed: audit.failed.length,
    healthScore:
      (audit.passed / audit.total) * 100,

    status:
      audit.failed.length === 0
        ? "HEALTHY"
        : "DEGRADED",

    failures: audit.failed,
  };
}