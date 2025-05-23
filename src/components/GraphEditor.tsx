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

type GraphEditorProps<NodeDataType extends Record<string, unknown>> = {
  nodes: Node<NodeDataType>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeDataType>[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

export function GraphEditor<NodeDataType extends Record<string, unknown>>({
  nodes,
  setNodes,
  edges,
  setEdges,
}: GraphEditorProps<NodeDataType>) {
  const reactFlowInstance = useReactFlow();

  const onNodesChange: OnNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds) as Node<NodeDataType>[]);

  const onEdgesChange: OnEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  const onConnect: OnConnect = (params) =>
    setEdges((eds) => [
      ...eds,
      { ...params, id: `${params.source}-${params.target}` },
    ]);

  // Handle drag over - must preventDefault to allow drop
  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  // Handle drop - create new node at drop position
  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');

    if (!type) {
      return;
    }

    // Calculate position inside ReactFlow viewport coordinates
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    // Create a new node — adjust data shape as needed
    const newNode: Node<NodeDataType> = {
      id: `${+new Date()}`, // unique id based on timestamp
      type,
      position,
      data: { label: `New node` } as NodeDataType,
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
