export function analyzeArchitecture(graph: any, audit: any) {
  return {
    recommendation:
      audit.failed.length > 0
        ? "Fix governance violations before scaling"
        : "System is stable for expansion",

    riskLevel:
      audit.failed.length > 3 ? "HIGH" : "LOW",
  };
}