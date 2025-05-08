import { useEffect, useState } from "react";
import * as wouter from "wouter";
const { useLocation } = wouter;
import { useQuery, useMutation } from "@tanstack/react-query";
import { type QueryKey } from "@tanstack/react-query";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider
} from "reactflow";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import NodePalette from "@/components/NodePalette";
import NodeProperties from "@/components/NodeProperties";
import PromptToolbar from "@/components/PromptToolbar";
import { nodeTypes } from "@/components/ui/node-types";
import { edgeTypes } from "@/components/ui/edge-types";
import { usePromptDesigner } from "@/hooks/use-prompt-designer";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { initialElements } from "@/lib/initial-elements";
import { type Prompt, type FlowElements } from "@shared/schema";

export default function Designer() {
  const [location, setLocation] = useLocation();
  
  const navigate = (path: string) => setLocation(path);
  const params = { id: location.split('/')[2] };
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Fetch prompt by ID if provided
  const { data: prompt, isLoading, error } = useQuery<Prompt>({
    queryKey: params.id ? [`/api/prompts/${params.id}`] as const : [null],
    enabled: !!params.id
  });

  // Initialize prompt designer hook
  const {
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
    canUndo,
    canRedo
  } = usePromptDesigner();

  // Save prompt mutation
  const savePromptMutation = useMutation({
    mutationFn: async () => {
      if (!prompt) return null;
      
      const response = await apiRequest("PUT", `/api/prompts/${prompt.id}`, {
        elements: getElements()
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/prompts/${params.id}`] });
      toast({
        title: "Success",
        description: "Prompt saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  // Load prompt data when available
  useEffect(() => {
    if (prompt && !isInitialized) {
      if (prompt.elements && typeof prompt.elements === 'object') {
        const elements = prompt.elements as unknown as FlowElements;
        if (elements.nodes?.length > 0 || elements.edges?.length > 0) {
          setElements(elements);
        } else {
          // If prompt exists but has no elements, initialize with default
          setElements(initialElements);
        }
      } else {
        // If elements is not in correct format, initialize with default
        setElements(initialElements);
      }
      setIsInitialized(true);
    } else if (!params.id && !isInitialized) {
      // If no ID provided, initialize with default elements
      setElements(initialElements);
      setIsInitialized(true);
    }
  }, [prompt, params.id, setElements, isInitialized]);

  // Handle auto-save
  useEffect(() => {
    if (isInitialized && prompt) {
      const timeoutId = setTimeout(() => {
        savePromptMutation.mutate();
      }, 5000); // Auto-save after 5 seconds of inactivity
      
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, prompt, isInitialized]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col h-full">
        <Skeleton className="h-12 w-full" />
        <div className="flex-1 flex overflow-hidden">
          <Skeleton className="w-48 h-full" />
          <Skeleton className="flex-1 h-full" />
          <Skeleton className="w-64 h-full" />
        </div>
      </div>
    );
  }

  if (error && params.id) {
    toast({
      title: "Error",
      description: "Failed to load prompt. Redirecting to home page.",
      variant: "destructive",
    });
    navigate("/");
    return null;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <PromptToolbar
        prompt={prompt || null}
        elements={getElements()}
        onUndo={undo}
        onRedo={redo}
        onRun={run}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Node Palette */}
        <NodePalette onDragStart={onDragStart} />
        
        {/* Flow Canvas */}
        <div 
          className="flex-1 relative bg-gray-50" 
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        
        {/* Properties Panel */}
        <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Node Properties</h3>
          <NodeProperties 
            selectedNode={selectedNode} 
            onNodeUpdate={updateNodeData} 
          />
        </div>
      </div>
    </div>
  );
}
