export type Graph = {
  nodes: { id: string }[];
  edges: { source: string; target: string }[];
};

export function computeDominatingSet(graph: Graph): Set<string> {
  const allNodes = graph.nodes.map((node) => node.id);

  // Build adjacency list
  const adj = new Map<string, Set<string>>();
  graph.nodes.forEach((node) => adj.set(node.id, new Set()));
  graph.edges.forEach(({ source, target }) => {
    adj.get(source)!.add(target);
    adj.get(target)!.add(source);
  });

  // Check if a given set of nodes is a dominating set
  const isDominatingSet = (candidate: Set<string>): boolean => {
    const dominated = new Set<string>();
    Array.from(candidate).forEach((node) => {
      dominated.add(node);
      adj.get(node)!.forEach((nbr) => dominated.add(nbr));
    });
    return dominated.size === allNodes.length;
  };

  // Try all subsets of nodes, from smallest to largest
  for (let size = 1; size <= allNodes.length; size++) {
    const subsets = generateSubsets(allNodes, size);
    for (const subset of subsets) {
      const candidateSet = new Set(subset);
      if (isDominatingSet(candidateSet)) return candidateSet;
    }
  }

  return new Set(); // should never happen for connected graphs
}

function generateSubsets<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];

  const backtrack = (start: number, path: T[]) => {
    if (path.length === size) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  };

  backtrack(0, []);
  return result;
}
