const { runWorkspaceAudit } = require("../audit/workspace-audit");

describe("Workspace Audit", () => {
  it("returns expected structure", () => {
    const result = runWorkspaceAudit();
    expect(result).toHaveProperty("packages");
    expect(result).toHaveProperty("failed");
    expect(Array.isArray(result.packages)).toBe(true);
    expect(Array.isArray(result.failed)).toBe(true);
  });

  it("detects actual package directories", () => {
    const result = runWorkspaceAudit();
    expect(result.packages.length).toBeGreaterThan(0);
  });

  it("flags missing files with correct shape", () => {
    const result = runWorkspaceAudit();
    for (const failure of result.failed) {
      expect(failure).toHaveProperty("type", "MISSING_REQUIRED_FILE");
      expect(failure).toHaveProperty("package");
      expect(failure).toHaveProperty("file");
    }
  });
});
