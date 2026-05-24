import express from "express";
import { auditWorkspace } from "../governance/workspace-audit";
import { buildArchitectureGraph } from "./graph-builder";

const app = express();

app.get("/health", (req, res) => {
  const audit = auditWorkspace();

  res.json({
    status: audit.failed.length === 0 ? "HEALTHY" : "DEGRADED",
    total: audit.total,
    passed: audit.passed,
    failed: audit.failed.length,
  });
});

app.get("/graph", (req, res) => {
  res.json(buildArchitectureGraph());
});

app.listen(4000, () => {
  console.log("🧠 CREFTYS Control Plane running on port 4000");
});