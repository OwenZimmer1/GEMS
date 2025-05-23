export type Graph = {
    nodes: { id: string }[];
    edges: { source: string; target: string }[];
  };
  
  export function computeDominatingSet(graph: Graph): Set<string> {
    // Build adjacency list (treat edges as undirected)
    const adj = new Map<string, Set<string>>();
    graph.nodes.forEach((node) => adj.set(node.id, new Set()));
    graph.edges.forEach(({ source, target }) => {
      if (adj.has(source)) adj.get(source)!.add(target);
      if (adj.has(target)) adj.get(target)!.add(source);
    });
  
    const dominatingSet = new Set<string>();
    const dominated = new Set<string>(); // nodes already covered
  
    // Greedy selection: while some nodes are not dominated
    while (dominated.size < graph.nodes.length) {
      let bestNode: string | null = null;
      let bestScore = -1;
      for (const node of graph.nodes) {
        const id = node.id;
        if (dominated.has(id)) continue;
        // Count itself + uncovered neighbors
        let score = dominated.has(id) ? 0 : 1;
        adj.get(id)!.forEach((nbr) => {
          if (!dominated.has(nbr)) score++;
        });
        if (score > bestScore) {
          bestScore = score;
          bestNode = id;
        }
      }
      if (!bestNode) break; // safety
      // Add to dominating set and mark its neighbors dominated
      dominatingSet.add(bestNode);
      dominated.add(bestNode);
      adj.get(bestNode)!.forEach((nbr) => dominated.add(nbr));
    }
  
    return dominatingSet;
  }
  