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
import PromptRunner from "@/components/PromptRunner";
import ImportConversation from "@/components/ImportConversation";
import TemplateGallery from "@/components/TemplateGallery";
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

  // Initialize prompt designer hook with enhanced functionality
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
    canUndo,
    canRedo,
    // New zoom and grid controls
    zoomIn,
    zoomOut,
    zoomLevel,
    toggleGrid,
    isGridVisible,
    importFlow,
    // Dialog states
    isPromptRunnerOpen,
    closePromptRunner,
    isImportDialogOpen,
    openImportDialog,
    closeImportDialog,
    isTemplateGalleryOpen,
    openTemplateGallery,
    closeTemplateGallery
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
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onImport={importFlow}
        onToggleGrid={toggleGrid}
        isGridVisible={isGridVisible}
        zoomLevel={zoomLevel}
        openImportDialog={openImportDialog}
        openTemplateGallery={openTemplateGallery}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Node Palette */}
        <NodePalette onDragStart={onDragStart} />
        
        {/* Flow Canvas */}
        <div 
          className="flex-1 relative bg-muted/30 designer-grid h-full w-full" 
          ref={reactFlowWrapper}
          style={{ height: 'calc(100vh - 160px)', minHeight: '500px', width: '100%' }}
        >
          <div className="absolute inset-0">
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
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              fitView
              defaultEdgeOptions={{ 
                animated: true,
                style: { stroke: 'hsl(var(--primary))', strokeWidth: 2 } 
              }}
              proOptions={{ hideAttribution: true }}
              className="h-full w-full"
            >
              {isGridVisible && <Background gap={20} color="rgba(0, 0, 0, 0.03)" />}
              <Controls 
                position="bottom-right"
                style={{ 
                  background: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
              />
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <div className="bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium border border-border shadow-sm">
                  {nodes.length} Nodes | {edges.length} Connections
                </div>
              </div>
            </ReactFlow>
          </div>
        </div>
        
        {/* Properties Panel */}
        <div className="w-80 bg-card border-l border-border overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Node Properties</h3>
            {selectedNode && (
              <div className="px-2 py-1 bg-muted/60 rounded-md text-xs text-muted-foreground">
                {selectedNode.type}
              </div>
            )}
          </div>
          {selectedNode ? (
            <NodeProperties 
              selectedNode={selectedNode} 
              onNodeUpdate={updateNodeData} 
            />
          ) : (
            <div className="text-center p-6 border border-dashed border-border rounded-lg bg-muted/30">
              <div className="mb-2 text-muted-foreground">
                <svg className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <p className="text-sm">Select a node to view and edit its properties</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Prompt Runner Dialog */}
      <PromptRunner
        isOpen={isPromptRunnerOpen}
        onClose={closePromptRunner}
        elements={getElements()}
      />
      
      {/* Import Conversation Dialog */}
      <ImportConversation
        isOpen={isImportDialogOpen}
        onClose={closeImportDialog}
        onImport={importFlow}
      />
      
      {/* Template Gallery Dialog */}
      <TemplateGallery
        isOpen={isTemplateGalleryOpen}
        onClose={closeTemplateGallery}
        onSelectTemplate={importFlow}
      />
    </div>
  );
}
