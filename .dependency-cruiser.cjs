module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: "no-cross-app-imports",
      severity: "error",
      from: {
        path: "^apps/[^/]+",
      },
      to: {
        path: "^apps/[^/]+",
      },
    },
    {
      name: "no-upward-layer-imports",
      severity: "error",
      from: {
        path: "^packages/shared-types",
      },
      to: {
        path: "^packages/(property-core|legal-core|valuation-engine)",
      },
    },
  ],
  options: {
    tsPreCompilationDeps: true,
    combinedDependencies: true,
    doNotFollow: {
      path: "node_modules",
    },
    exclude: {
      path: "dist",
    },
  },
};