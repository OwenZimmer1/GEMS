import { Node, Edge } from '@xyflow/react';

// Save nodes and edges to localStorage
export function saveGraph(nodes: Node[], edges: Edge[]) {
  localStorage.setItem('myGraph', JSON.stringify({ nodes, edges }));
}

// Load nodes and edges from localStorage and pass them to state setters
export function loadGraph(
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) {
  const saved = localStorage.getItem('myGraph');
  if (saved) {
    const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
    setNodes(savedNodes);
    setEdges(savedEdges);
  }
}
