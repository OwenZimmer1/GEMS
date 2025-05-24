// src/components/GraphEditor.tsx
import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  OnNodesDelete,
  OnEdgesDelete,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from '@xyflow/react';

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

  // Buffer for copy/paste
  const [copyBuffer, setCopyBuffer] = useState<{
    nodes: Node<NodeData>[];
    edges: Edge[];
  } | null>(null);

  // Handlers for node/edge updates
  const onNodesChange: OnNodesChange = (changes) =>
    setNodes((nds) => applyNodeChanges(changes, nds) as Node<NodeData>[]);

  const onEdgesChange: OnEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  const onConnect: OnConnect = (params) =>
    setEdges((eds) => [
      ...eds,
      { ...params, id: `${params.source}-${params.target}` },
    ]);

  // Delete selected items
  const onNodesDelete: OnNodesDelete = (deleted) => {
    const delIds = new Set(deleted.map((n) => n.id));
    setNodes((nds) => nds.filter((n) => !delIds.has(n.id)));
    setEdges((eds) =>
      eds.filter((e) => !delIds.has(e.source) && !delIds.has(e.target))
    );
  };

  const onEdgesDelete: OnEdgesDelete = (deleted) => {
    const delIds = new Set(deleted.map((e) => e.id));
    setEdges((eds) => eds.filter((e) => !delIds.has(e.id)));
  };

  // Copy selected nodes+edges into buffer
  const handleCopy = useCallback(() => {
    const allNodes = reactFlowInstance.getNodes();
    const allEdges = reactFlowInstance.getEdges();

    // Filter and cast selected nodes
    const selNodes = allNodes
      .filter((n) => n.selected)
      .map((n) => n as Node<NodeData>);

    const selNodeIds = new Set(selNodes.map((n) => n.id));

    // Filter and cast edges between selected nodes
    const selEdges = allEdges
      .filter((e) => e.selected && selNodeIds.has(e.source) && selNodeIds.has(e.target))
      .map((e) => e as Edge);

    setCopyBuffer({ nodes: selNodes, edges: selEdges });
  }, [reactFlowInstance]);

  // Paste buffer with new IDs and offset
  const handlePaste = useCallback(() => {
    if (!copyBuffer) return;
    const { nodes: bufNodes, edges: bufEdges } = copyBuffer;

    // Map old IDs→new IDs
    const idMap = new Map<string, string>();
    bufNodes.forEach((n) => idMap.set(n.id, `${n.id}-${Date.now()}`));

    const offset = { x: 20, y: 20 };

    // Create new nodes
    const newNodes = bufNodes.map((n) => ({
      ...n,
      id: idMap.get(n.id)!,
      position: {
        x: n.position.x + offset.x,
        y: n.position.y + offset.y,
      },
      selected: false,
    }));

    // Create new edges
    const newEdges = bufEdges.map((e) => ({
      ...e,
      id: `${idMap.get(e.source)}-${idMap.get(e.target)}`,
      source: idMap.get(e.source)!,
      target: idMap.get(e.target)!,
      selected: false,
    }));

    setNodes((nds) => nds.concat(newNodes));
    setEdges((eds) => eds.concat(newEdges));
    setCopyBuffer({ nodes: newNodes, edges: newEdges });
  }, [copyBuffer]);

  // Keyboard handlers for copy/paste
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        handleCopy();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault();
        handlePaste();
      }
    },
    [handleCopy, handlePaste]
  );

  // Drag & drop to add new nodes
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const type = e.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const dropX = e.clientX - bounds.left;
    const dropY = e.clientY - bounds.top;
    const { x: panX, y: panY, zoom } = reactFlowInstance.getViewport();

    const position = { x: dropX / zoom - panX, y: dropY / zoom - panY };

    const newNode: Node<NodeData> = {
      id: `${Date.now()}`,
      type,
      position,
      data: { label: `Node ${nodes.length + 1}` },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeClick = useCallback(
    (_: React.MouseEvent, clickedNode: Node<NodeData>) => {
      // build adjacency set of neighbor IDs
      const neighbors = new Set<string>();
      edges.forEach((e) => {
        if (e.source === clickedNode.id) neighbors.add(e.target);
        if (e.target === clickedNode.id) neighbors.add(e.source);
      });

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === clickedNode.id) {
            // clicked node → red
            return { ...n, style: { ...n.style, backgroundColor: 'red' } };
          } else if (neighbors.has(n.id)) {
            // neighbor → grey
            return { ...n, style: { ...n.style, backgroundColor: 'grey' } };
          } else {
            // otherwise clear
            return { ...n, style: {} };
          }
        })
      );
    },
    [edges, setNodes]
  );

  return (
    <div
      style={{ width: '100%', height: '90vh' }}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeClick={onNodeClick}
        fitView
        selectionOnDrag
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
