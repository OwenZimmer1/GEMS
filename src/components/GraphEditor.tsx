// GraphEditor.tsx
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from '@xyflow/react';

// define exactly what each node's data looks like
type NodeData = { label: string };

type GraphEditorProps = {
  nodes: Node<NodeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

export function GraphEditor({
  nodes,
  setNodes,
  edges,
  setEdges,
}: GraphEditorProps) {
  const reactFlowInstance = useReactFlow();

  const onNodesChange: OnNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds) as Node<NodeData>[]);

  const onEdgesChange: OnEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  const onConnect: OnConnect = (params) =>
    setEdges((eds) => [
      ...eds,
      { ...params, id: `${params.source}-${params.target}` },
    ]);

  // allow drops
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // handle drop → add new node
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type) return;

    // screen coords
    const dropX = e.clientX - bounds.left;
    const dropY = e.clientY - bounds.top;

    // pan & zoom
    const { x: panX, y: panY, zoom } = reactFlowInstance.getViewport();

    // convert to canvas coords
    const position = {
      x: dropX / zoom - panX,
      y: dropY / zoom - panY,
    };

    const newNode: Node<NodeData> = {
      id: `${Date.now()}`,
      type,
      position,
      data: { label: `Node ${nodes.length + 1}` },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div
      style={{ width: '100%', height: '90vh' }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
