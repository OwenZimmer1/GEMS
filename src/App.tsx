import React, { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { GraphEditor } from './components/GraphEditor';
import { ControlsPanel } from './components/ControlsPanel';
import { Sidebar } from './components/Sidebar';
import { computeDominatingSet, Graph } from './algorithms/dominatingSet';

type NodeData = {
  label: string;
};

export default function App() {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');

  const handleCompute = () => {
    const graph: Graph = {
      nodes: nodes.map((n) => ({ id: n.id })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    };
    const ds = computeDominatingSet(graph);
    setNodes(
      nodes.map((n) =>
        ds.has(n.id) ? { ...n, style: { backgroundColor: 'lightgreen' } } : n,
      ),
    );
  };

  const addEdge = () => {
    if (sourceNode && targetNode && sourceNode !== targetNode) {
      setEdges([
        ...edges,
        { id: `${sourceNode}-${targetNode}`, source: sourceNode, target: targetNode },
      ]);
      setSourceNode('');
      setTargetNode('');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, padding: 10, display: 'flex', flexDirection: 'column' }}>
        <ControlsPanel onCompute={handleCompute} />

        <div style={{ marginBottom: 10 }}>
          <select value={sourceNode} onChange={(e) => setSourceNode(e.target.value)}>
            <option value="">Select source</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.data.label}
              </option>
            ))}
          </select>

          <select
            value={targetNode}
            onChange={(e) => setTargetNode(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option value="">Select target</option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.data.label}
              </option>
            ))}
          </select>

          <button
            onClick={addEdge}
            disabled={!sourceNode || !targetNode || sourceNode === targetNode}
            style={{ marginLeft: 10 }}
          >
            Add Edge
          </button>
        </div>

        <GraphEditor
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          setEdges={setEdges}
        />
      </div>
    </div>
  );
}
