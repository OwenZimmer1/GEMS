// src/App.tsx
import React, { useState, useCallback } from 'react';
import { Node, Edge, useReactFlow } from '@xyflow/react';
import { Sidebar } from './components/Sidebar';
import { ControlsPanel } from './components/ControlsPanel';
import { GraphEditor } from './components/GraphEditor';
import { computeDominatingSet, Graph } from './algorithms/dominatingSet';

type NodeData = { label: string };

export default function App() {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const reactFlowInstance = useReactFlow();

  // Compute dominating set and highlight
  const handleCompute = useCallback(() => {
    const graph: Graph = {
      nodes: nodes.map((n) => ({ id: n.id })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    };
    const ds = computeDominatingSet(graph);

    setNodes((nds) =>
      nds.map((n) =>
        ds.has(n.id)
          ? { ...n, style: { ...n.style, backgroundColor: 'lightgreen' } }
          : { ...n, style: {} }
      )
    );
  }, [nodes, edges]);

  // Reset any dominating‐set highlighting
  const handleReset = useCallback(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {},          // clear all inline styles
      }))
    );
  }, []);

  // Add node (existing drag/drop + addNode button logic omitted for brevity)
  const addNode = useCallback((type: string) => {
    const { x: panX, y: panY, zoom } = reactFlowInstance.getViewport();
    const position = { x: -panX + 100, y: -panY + 100 };
    const id = `${Date.now()}`;
    const newNode: Node<NodeData> = {
      id,
      type,
      position,
      data: { label: `Node ${nodes.length + 1}` },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [reactFlowInstance, nodes.length]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar onAddNode={addNode} />

      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 10,
        }}
      >
        <ControlsPanel
          onCompute={handleCompute}
          onReset={handleReset}   // pass reset handler
        />

        {/* manual edge‐adding UI here if you have it */}

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
