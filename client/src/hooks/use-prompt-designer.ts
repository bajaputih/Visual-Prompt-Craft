import { useState, useCallback, useRef } from 'react';
import { 
  ReactFlowInstance, 
  Edge, 
  Node, 
  Connection, 
  useReactFlow, 
  addEdge, 
  NodeChange, 
  EdgeChange, 
  applyNodeChanges, 
  applyEdgeChanges 
} from 'reactflow';
import { FlowElements, NodeType, FlowNode, FlowEdge } from '@shared/schema';
import { nanoid } from 'nanoid';

interface UsePromptDesignerProps {
  initialElements?: FlowElements;
}

export function usePromptDesigner({ initialElements }: UsePromptDesignerProps = {}) {
  // State for nodes and edges
  const [nodes, setNodes] = useState<Node[]>(initialElements?.nodes || []);
  const [edges, setEdges] = useState<Edge[]>(initialElements?.edges || []);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // History for undo/redo
  const historyRef = useRef<{
    past: { nodes: Node[]; edges: Edge[] }[];
    future: { nodes: Node[]; edges: Edge[] }[];
  }>({
    past: [],
    future: []
  });
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  // Save current state to history
  const saveToHistory = useCallback(() => {
    historyRef.current.past.push({
      nodes: [...nodes],
      edges: [...edges]
    });
    historyRef.current.future = [];
  }, [nodes, edges]);

  // Handle node changes
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    saveToHistory();
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [saveToHistory]);

  // Handle edge changes
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    saveToHistory();
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [saveToHistory]);

  // Handle connection between nodes
  const onConnect = useCallback((connection: Connection) => {
    saveToHistory();
    setEdges((eds) => addEdge({ ...connection, id: `e${connection.source}-${connection.target}` }, eds));
  }, [saveToHistory]);

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle click on background (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update node data
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    saveToHistory();
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
    // Also update the selected node if it's the one being modified
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          data: {
            ...prev.data,
            ...newData,
          },
        };
      });
    }
  }, [selectedNode, saveToHistory]);

  // Handle drag and drop from palette
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow/type') as keyof typeof NodeType;
      const nodeName = event.dataTransfer.getData('application/reactflow/name');
      const description = event.dataTransfer.getData('application/reactflow/description');
      
      // Check if the dropped element is valid
      if (!type || !Object.values(NodeType).includes(type as any)) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: nanoid(),
        type,
        position,
        data: { label: nodeName, description },
      };

      saveToHistory();
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, saveToHistory]
  );

  // Initialize drag from palette
  const onDragStart = useCallback((event: React.DragEvent, nodeType: string, nodeName: string, description: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/name', nodeName);
    event.dataTransfer.setData('application/reactflow/description', description);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // Undo/Redo functionality
  const undo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (past.length === 0) return;

    const previous = past.pop()!;
    future.unshift({ nodes, edges });

    setNodes(previous.nodes);
    setEdges(previous.edges);
  }, [nodes, edges]);

  const redo = useCallback(() => {
    const { past, future } = historyRef.current;
    if (future.length === 0) return;

    const next = future.shift()!;
    past.push({ nodes, edges });

    setNodes(next.nodes);
    setEdges(next.edges);
  }, [nodes, edges]);

  // Run/Execute functionality
  const run = useCallback(() => {
    console.log('Running prompt with configuration:', { nodes, edges });
    // Here you would implement the actual execution logic
    alert('Prompt execution is a placeholder in this version.');
  }, [nodes, edges]);

  // Get current elements as FlowElements for saving
  const getElements = useCallback((): FlowElements => {
    return {
      nodes: nodes as FlowNode[],
      edges: edges as FlowEdge[]
    };
  }, [nodes, edges]);

  // Set elements from external source
  const setElements = useCallback((elements: FlowElements) => {
    if (elements.nodes) setNodes(elements.nodes);
    if (elements.edges) setEdges(elements.edges);
  }, []);

  return {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    updateNodeData,
    onDragOver,
    onDrop,
    onDragStart,
    reactFlowWrapper,
    undo,
    redo,
    run,
    getElements,
    setElements,
    canUndo: historyRef.current.past.length > 0,
    canRedo: historyRef.current.future.length > 0
  };
}
