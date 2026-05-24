// ai/graph-optimizer/task1-graph-optimizer.js
//
// CREFTYS Graph & Governance Optimiser
// Enterprise-grade: caching, Tarjan SCC, anomaly detection, topological sort.

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

// ------------------------------------------------------------------
// 1. OPTIMIZED GRAPH ENGINE (CORE)
// ------------------------------------------------------------------

class DependencyGraph {
  constructor(root, packagesGlob = 'packages/*') {
    this.root = root;
    this.packagesGlob = packagesGlob;
    this.nodeMap = new Map();
    this.graph = {
      nodes: new Set(),
      adjacency: new Map(),
    };
    this.packageDeps = new Map();
    this.cacheFile = path.join(root, 'node_modules', '.cache', 'depgraph-cache.json');
  }

  async buildAsync() {
    const cached = await this._loadCache();
    if (cached) {
      this.graph = cached.graph;
      this._rebuildNodeMap();
      this.packageDeps = this._extractDepsFromGraph();
      return this.graph;
    }
    const packagePaths = await this._expandGlobAsync();
    const pkgs = await this._readAllPackages(packagePaths);
    this._buildGraphFromPackages(pkgs);
    await this._saveCache();
    return this.graph;
  }

  buildSync() {
    const cached = this._loadCacheSync();
    if (cached) {
      this.graph = cached.graph;
      this._rebuildNodeMap();
      this.packageDeps = this._extractDepsFromGraph();
      return this.graph;
    }
    const packagePaths = this._expandGlobSync();
    const pkgs = packagePaths.map(pkgPath => {
      const full = path.join(this.root, pkgPath, 'package.json');
      try {
        const content = fs.readFileSync(full, 'utf-8');
        return { pkgPath, content, pkg: JSON.parse(content) };
      } catch { return null; }
    }).filter(Boolean);
    this._buildGraphFromPackages(pkgs);
    this._saveCacheSync();
    return this.graph;
  }

  update(packageName) {
    const node = this.nodeMap.get(packageName);
    if (!node) return;
    const pkgJsonPath = path.join(this.root, node.path, 'package.json');
    let pkg;
    try { pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8')); }
    catch { return; }
    const oldDeps = this.packageDeps.get(packageName) || new Set();
    for (const dep of oldDeps) {
      this.graph.adjacency.get(packageName)?.delete(dep);
    }
    const newDeps = new Set();
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
    for (const depName of Object.keys(allDeps)) {
      if (depName.startsWith('@creftys/') && this.nodeMap.has(depName)) {
        newDeps.add(depName);
        if (!this.graph.adjacency.has(packageName)) {
          this.graph.adjacency.set(packageName, new Set());
        }
        this.graph.adjacency.get(packageName).add(depName);
      }
    }
    this.packageDeps.set(packageName, newDeps);
    this._saveCache().catch(() => {});
  }

  detectCycles() {
    const index = new Map();
    const lowlink = new Map();
    const onStack = new Set();
    const stack = [];
    let currentIndex = 0;
    const cycles = [];
    const strongConnect = (v) => {
      index.set(v, currentIndex);
      lowlink.set(v, currentIndex);
      currentIndex++;
      stack.push(v);
      onStack.add(v);
      const neighbors = this.graph.adjacency.get(v) || new Set();
      for (const w of neighbors) {
        if (!index.has(w)) {
          strongConnect(w);
          lowlink.set(v, Math.min(lowlink.get(v), lowlink.get(w)));
        } else if (onStack.has(w)) {
          lowlink.set(v, Math.min(lowlink.get(v), index.get(w)));
        }
      }
      if (lowlink.get(v) === index.get(v)) {
        const scc = [];
        let w;
        do {
          w = stack.pop();
          onStack.delete(w);
          scc.push(w);
        } while (w !== v);
        if (scc.length > 1 || (scc.length === 1 && this.graph.adjacency.get(v)?.has(v))) {
          cycles.push(scc);
        }
      }
    };
    for (const v of this.graph.nodes) {
      if (!index.has(v)) strongConnect(v);
    }
    return cycles;
  }

  getAdjacencyList() { return this.graph; }

  async _loadCache() {
    try {
      const raw = await fsp.readFile(this.cacheFile, 'utf-8');
      const entry = JSON.parse(raw);
      const currentHashes = await this._computeAllHashes();
      if (this._hashesEqual(entry.hashes, currentHashes)) return entry;
    } catch {}
    return null;
  }

  _loadCacheSync() {
    try {
      const raw = fs.readFileSync(this.cacheFile, 'utf-8');
      const entry = JSON.parse(raw);
      const currentHashes = this._computeAllHashesSync();
      if (this._hashesEqual(entry.hashes, currentHashes)) return entry;
    } catch {}
    return null;
  }

  async _saveCache() {
    const hashes = await this._computeAllHashes();
    const cacheData = { graph: this.graph, hashes, timestamp: Date.now() };
    await fsp.mkdir(path.dirname(this.cacheFile), { recursive: true });
    await fsp.writeFile(this.cacheFile, JSON.stringify(cacheData, null, 2));
  }

  _saveCacheSync() {
    const hashes = this._computeAllHashesSync();
    const cacheData = { graph: this.graph, hashes, timestamp: Date.now() };
    fs.mkdirSync(path.dirname(this.cacheFile), { recursive: true });
    fs.writeFileSync(this.cacheFile, JSON.stringify(cacheData, null, 2));
  }

  async _computeAllHashes() {
    const hashes = {};
    const limiter = new ConcurrencyLimiter(20);
    const promises = Array.from(this.nodeMap.entries()).map(async ([name, node]) => {
      const pkgPath = path.join(this.root, node.path, 'package.json');
      await limiter.acquire();
      try {
        const content = await fsp.readFile(pkgPath, 'utf-8');
        hashes[name] = crypto.createHash('sha256').update(content).digest('hex');
      } catch { hashes[name] = ''; }
      finally { limiter.release(); }
    });
    await Promise.all(promises);
    return hashes;
  }

  _computeAllHashesSync() {
    const hashes = {};
    for (const [name, node] of this.nodeMap) {
      try {
        const content = fs.readFileSync(path.join(this.root, node.path, 'package.json'), 'utf-8');
        hashes[name] = crypto.createHash('sha256').update(content).digest('hex');
      } catch { hashes[name] = ''; }
    }
    return hashes;
  }

  _hashesEqual(a, b) {
    const keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) if (a[k] !== b[k]) return false;
    return true;
  }

  async _readAllPackages(packagePaths) {
    const limiter = new ConcurrencyLimiter(50);
    const results = [];
    const promises = packagePaths.map(async (pkgPath) => {
      const full = path.join(this.root, pkgPath, 'package.json');
      await limiter.acquire();
      try {
        const content = await fsp.readFile(full, 'utf-8');
        const pkg = JSON.parse(content);
        results.push({ pkgPath, content, pkg });
      } catch {} finally { limiter.release(); }
    });
    await Promise.all(promises);
    return results;
  }

  _buildGraphFromPackages(pkgs) {
    this.nodeMap.clear();
    this.graph.nodes.clear();
    this.graph.adjacency.clear();
    this.packageDeps.clear();
    const eligible = pkgs.filter(p => p.pkg.name && p.pkg.name.startsWith('@creftys/'));
    for (const p of eligible) {
      this.nodeMap.set(p.pkg.name, { name: p.pkg.name, version: p.pkg.version || '0.0.0', path: p.pkgPath });
      this.graph.nodes.add(p.pkg.name);
      this.graph.adjacency.set(p.pkg.name, new Set());
    }
    for (const p of eligible) {
      const deps = { ...p.pkg.dependencies, ...p.pkg.devDependencies, ...p.pkg.peerDependencies };
      const internalDeps = new Set();
      for (const depName of Object.keys(deps)) {
        if (depName.startsWith('@creftys/') && this.nodeMap.has(depName)) {
          internalDeps.add(depName);
          this.graph.adjacency.get(p.pkg.name).add(depName);
        }
      }
      this.packageDeps.set(p.pkg.name, internalDeps);
    }
  }

  _rebuildNodeMap() {
    this.nodeMap.clear();
    for (const name of this.graph.nodes) {
      this.nodeMap.set(name, { name, version: '0.0.0', path: path.join('packages', name.split('/').pop()) });
    }
  }

  _extractDepsFromGraph() {
    const deps = new Map();
    for (const [from, toSet] of this.graph.adjacency) {
      deps.set(from, new Set(toSet));
    }
    return deps;
  }

  async _expandGlobAsync() {
    const [baseDir] = this.packagesGlob.split('/');
    const fullBase = path.join(this.root, baseDir);
    try {
      const entries = await fsp.readdir(fullBase);
      const dirs = [];
      for (const e of entries) {
        const full = path.join(fullBase, e);
        if ((await fsp.stat(full)).isDirectory() && fs.existsSync(path.join(full, 'package.json'))) {
          dirs.push(path.join(baseDir, e));
        }
      }
      return dirs;
    } catch { return []; }
  }

  _expandGlobSync() {
    const [baseDir] = this.packagesGlob.split('/');
    const fullBase = path.join(this.root, baseDir);
    try {
      return fs.readdirSync(fullBase)
        .filter(e => {
          const full = path.join(fullBase, e);
          return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'package.json'));
        })
        .map(e => path.join(baseDir, e));
    } catch { return []; }
  }
}

class ConcurrencyLimiter {
  constructor(max) { this.max = max; this.active = 0; this.queue = []; }
  acquire() {
    if (this.active < this.max) { this.active++; return Promise.resolve(); }
    return new Promise(resolve => this.queue.push(resolve));
  }
  release() {
    this.active--;
    const next = this.queue.shift();
    if (next) { this.active++; next(); }
  }
}

// ------------------------------------------------------------------
// 2. PUBLIC INTERFACE
// ------------------------------------------------------------------

function optimizePackageScan(root, order = []) {
  return { root, packagesGlob: 'packages/*', order, concurrency: 50, cacheEnabled: true };
}

function optimizeDependencyGraph(scanConfig) {
  return new DependencyGraph(scanConfig.root, scanConfig.packagesGlob);
}

function detectGraphAnomalies(graph) {
  const anomalies = [];
  const adjacency = graph.adjacency;
  const nodes = graph.nodes;
  const incomingCount = new Map();
  for (const [, edges] of adjacency) {
    for (const dep of edges) {
      incomingCount.set(dep, (incomingCount.get(dep) || 0) + 1);
    }
  }
  for (const node of nodes) {
    const outgoing = adjacency.get(node) || new Set();
    const outgoingCount = outgoing.size;
    const incoming = incomingCount.get(node) || 0;
    if (outgoingCount === 0 && incoming === 0) {
      anomalies.push({ type: 'ISOLATED_PACKAGE', package: node, detail: 'No internal deps, not depended upon' });
    }
    if (outgoingCount > 5) {
      anomalies.push({ type: 'HIGH_DEPENDENCY_FANOUT', package: node, count: outgoingCount, detail: 'Too many internal deps' });
    }
    if (incoming === 0 && outgoingCount > 0) {
      anomalies.push({ type: 'NO_DEPENDENTS', package: node, detail: 'Unused by any other package' });
    }
    if (outgoing.has(node)) {
      anomalies.push({ type: 'SELF_LOOP', package: node, detail: 'Depends on itself' });
    }
  }
  return anomalies;
}

function generateBuildOrder(adjacency) {
  const inDegree = new Map();
  for (const [node, deps] of adjacency) {
    if (!inDegree.has(node)) inDegree.set(node, 0);
    for (const dep of deps) {
      inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
    }
  }
  for (const node of adjacency.keys()) {
    if (!inDegree.has(node)) inDegree.set(node, 0);
  }
  const queue = [];
  for (const [node, degree] of inDegree) {
    if (degree === 0) queue.push(node);
  }
  const sorted = [];
  while (queue.length > 0) {
    const current = queue.shift();
    sorted.push(current);
    const neighbors = adjacency.get(current) || new Set();
    for (const neighbor of neighbors) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) queue.push(neighbor);
    }
  }
  if (sorted.length !== adjacency.size) {
    throw new Error('Cycle detected during topological sort – should have been caught earlier');
  }
  return sorted;
}

module.exports = {
  DependencyGraph,
  optimizePackageScan,
  optimizeDependencyGraph,
  detectGraphAnomalies,
  generateBuildOrder,
  buildDependencyGraph: (root, packagesGlob) => {
    const engine = new DependencyGraph(root, packagesGlob);
    return engine.buildSync();
  },
  detectCycles: (graphData) => {
    const tempGraph = new DependencyGraph('');
    tempGraph.graph = graphData;
    tempGraph.nodeMap = new Map(Array.from(graphData.nodes, n => [n, { name: n, version: '', path: '' }]));
    return tempGraph.detectCycles();
  }
};