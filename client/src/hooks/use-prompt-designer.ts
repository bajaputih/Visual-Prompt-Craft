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
  
  // Dialog states
  const [isPromptRunnerOpen, setIsPromptRunnerOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  
  // UI control states
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level
  const [isGridVisible, setIsGridVisible] = useState(true); // Show grid by default
  const [isDragging, setIsDragging] = useState(false);
  
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
    
    // Create a unique ID for the new edge
    const edgeId = `e${connection.source}-${connection.target}`;
    
    // Get source and target node types to determine edge style
    let sourceType = '';
    let targetType = '';
    
    // Find source and target nodes to get their types
    nodes.forEach(node => {
      if (node.id === connection.source) {
        sourceType = node.type || '';
      }
      if (node.id === connection.target) {
        targetType = node.type || '';
      }
    });
    
    // Determine edge type based on node types
    let edgeType = 'default';
    
    if (sourceType === NodeType.CONDITION) {
      edgeType = 'dashed';
    } else if (sourceType === NodeType.FILTER) {
      edgeType = 'warning';
    } else if (sourceType === NodeType.PROCESS && targetType === NodeType.OUTPUT) {
      edgeType = 'success';
    }
    
    // Add the node types and edge type to the connection data
    const edgeData = {
      sourceType,
      targetType,
      label: '',  // Can be set later if needed
    };
    
    // Create the enhanced connection object
    const enhancedConnection = {
      ...connection,
      id: edgeId,
      type: edgeType,
      data: edgeData
    };
    
    setEdges((eds) => addEdge(enhancedConnection, eds));
  }, [nodes, saveToHistory]);

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
    
    // Add visual indication
    const designerArea = document.querySelector('.designer-grid');
    if (designerArea && !designerArea.classList.contains('drag-over')) {
      designerArea.classList.add('drag-over');
    }
  }, []);
  
  // Handle drag leaving the drop area
  const onDragLeave = useCallback((event: React.DragEvent) => {
    const designerArea = document.querySelector('.designer-grid');
    if (designerArea) {
      designerArea.classList.remove('drag-over');
    }
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      
      // Remove visual indication
      const designerArea = document.querySelector('.designer-grid');
      if (designerArea) {
        designerArea.classList.remove('drag-over');
      }

      try {
        if (!reactFlowWrapper.current || !reactFlowInstance) {
          console.warn("Drag operation failed - design area not available");
          return null;
        }

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow/type') as keyof typeof NodeType;
        const nodeName = event.dataTransfer.getData('application/reactflow/name');
        const description = event.dataTransfer.getData('application/reactflow/description');
        
        // Check if the dropped element is valid
        if (!type || !Object.values(NodeType).includes(type as any)) {
          console.warn("Invalid node type:", type);
          return null;
        }

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNode: Node = {
          id: nanoid(),
          type,
          position,
          data: { 
            label: nodeName, 
            description,
            parameters: {},  // Initialize empty parameters object
          },
        };

        saveToHistory();
        setNodes((nds) => [...nds, newNode]);
        
        // Select the new node right away for better UX
        setSelectedNode(newNode);
        
        return newNode;
      } catch (error) {
        console.error("Error while creating node:", error);
        return null;
      }
    },
    [reactFlowInstance, saveToHistory]
  );

  // Initialize drag from palette
  const onDragStart = useCallback((event: React.DragEvent, nodeType: string, nodeName: string, description: string) => {
    setIsDragging(true);
    
    // Add a visual effect to the dragging element
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.add('dragging');
    }
    
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/name', nodeName);
    event.dataTransfer.setData('application/reactflow/description', description);
    event.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image (optional enhancement)
    const dragImage = document.createElement('div');
    dragImage.textContent = nodeName;
    dragImage.className = 'p-2 bg-primary text-white rounded text-sm';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up the drag image element after the drag operation
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    
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

  // Run/Execute functionality - opens the prompt runner
  const run = useCallback(() => {
    console.log('Running prompt with configuration:', { nodes, edges });
    setIsPromptRunnerOpen(true);
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
  
  // Zoom control functions
  const zoomIn = useCallback(() => {
    if (!reactFlowInstance) return;
    
    // Increment zoom by 10% each time, max zoom 2.0 (200%)
    const newZoom = Math.min(zoomLevel + 0.1, 2.0);
    reactFlowInstance.zoomTo(newZoom);
    setZoomLevel(newZoom);
  }, [reactFlowInstance, zoomLevel]);
  
  const zoomOut = useCallback(() => {
    if (!reactFlowInstance) return;
    
    // Decrement zoom by 10% each time, min zoom 0.5 (50%)
    const newZoom = Math.max(zoomLevel - 0.1, 0.5);
    reactFlowInstance.zoomTo(newZoom);
    setZoomLevel(newZoom);
  }, [reactFlowInstance, zoomLevel]);
  
  // Toggle grid visibility
  const toggleGrid = useCallback(() => {
    setIsGridVisible(prev => !prev);
  }, []);
  
  // Import flow from JSON
  const importFlow = useCallback((importedElements: FlowElements) => {
    saveToHistory();
    setElements(importedElements);
    setIsImportDialogOpen(false); // Close the import dialog after successful import
  }, [saveToHistory, setElements]);

  // Open dialogs
  const openImportDialog = useCallback(() => {
    setIsImportDialogOpen(true);
  }, []);

  const openTemplateGallery = useCallback(() => {
    setIsTemplateGalleryOpen(true);
  }, []);

  // Close dialogs
  const closePromptRunner = useCallback(() => {
    setIsPromptRunnerOpen(false);
  }, []);

  const closeImportDialog = useCallback(() => {
    setIsImportDialogOpen(false);
  }, []);
  
  const closeTemplateGallery = useCallback(() => {
    setIsTemplateGalleryOpen(false);
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
    onDragLeave,
    onDrop,
    onDragStart,
    reactFlowWrapper,
    isDragging,
    undo,
    redo,
    run,
    getElements,
    setElements,
    canUndo: historyRef.current.past.length > 0,
    canRedo: historyRef.current.future.length > 0,
    // New zoom and grid controls
    zoomIn,
    zoomOut,
    zoomLevel,
    toggleGrid,
    isGridVisible,
    importFlow,
    // Dialog states and handlers
    isPromptRunnerOpen,
    closePromptRunner,
    isImportDialogOpen,
    openImportDialog,
    closeImportDialog,
    isTemplateGalleryOpen,
    openTemplateGallery,
    closeTemplateGallery
  };
}