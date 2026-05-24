import { useEffect, useState } from "react";

export default function App() {
  const [graph, setGraph] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:4000/graph")
      .then((r) => r.json())
      .then(setGraph);

    fetch("http://localhost:4000/health")
      .then((r) => r.json())
      .then(setHealth);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🧠 CREFTYS CONTROL CENTER</h1>

      <div>
        <h2>System Health</h2>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </div>

      <div>
        <h2>Architecture Graph</h2>
        <pre>{JSON.stringify(graph, null, 2)}</pre>
      </div>
    </div>
  );
}