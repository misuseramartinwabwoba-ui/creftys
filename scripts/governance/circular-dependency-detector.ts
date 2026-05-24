export function detectCycle(graph: Record<string, string[]>) {
  const visited = new Set();
  const stack = new Set();

  function dfs(node: string): boolean {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (const neighbor of graph[node] || []) {
      if (dfs(neighbor)) return true;
    }

    stack.delete(node);
    return false;
  }

  for (const node of Object.keys(graph)) {
    if (dfs(node)) {
      return true;
    }
  }

  return false;
}