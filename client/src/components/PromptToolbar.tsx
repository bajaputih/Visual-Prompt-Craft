import { useState, useRef } from "react";
import * as wouter from "wouter";
const { useLocation } = wouter;
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Prompt, FlowElements } from "@shared/schema";
import PromptPreview from "@/components/PromptPreview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Save, 
  Download, 
  Upload, 
  Undo2, 
  Redo2, 
  Eye, 
  Play, 
  ZoomIn, 
  ZoomOut, 
  Grid, 
  X, 
  Trash2, 
  Info,
  PanelTop
} from "lucide-react";

interface PromptToolbarProps {
  prompt: Prompt | null;
  elements: FlowElements;
  onUndo: () => void;
  onRedo: () => void;
  onRun: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onImport?: (importedElements: FlowElements) => void;
  onToggleGrid?: () => void;
  isGridVisible?: boolean;
  zoomLevel?: number;
}

export default function PromptToolbar({
  prompt,
  elements,
  onUndo,
  onRedo,
  onRun,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onImport,
  onToggleGrid,
  isGridVisible = false,
  zoomLevel = 1
}: PromptToolbarProps) {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const { toast } = useToast();
  const [promptName, setPromptName] = useState(prompt?.name || "Untitled Prompt");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Save prompt mutation
  const savePromptMutation = useMutation({
    mutationFn: async () => {
      if (!prompt) return null;
      
      const response = await apiRequest("PUT", `/api/prompts/${prompt.id}`, {
        name: promptName,
        elements
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromptName(e.target.value);
  };

  const handleSave = () => {
    savePromptMutation.mutate();
  };

  const handleExport = () => {
    if (!prompt) return;
    
    const exportData = {
      name: promptName,
      elements,
      version: "1.0"
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `${promptName.replace(/\s+/g, '_')}_export.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    toast({
      title: "Export Successful",
      description: `"${promptName}" exported successfully`,
    });
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') return;
        
        const importData = JSON.parse(result);
        // Validate the imported data
        if (
          importData.elements && 
          Array.isArray(importData.elements.nodes) && 
          Array.isArray(importData.elements.edges)
        ) {
          // Call the import handler function
          if (onImport) {
            onImport(importData.elements);
            setPromptName(importData.name || "Imported Prompt");
            toast({
              title: "Import Successful",
              description: "Prompt imported successfully",
            });
          }
        } else {
          toast({
            title: "Import Error",
            description: "Invalid format for imported prompt file",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Import Error",
          description: `Failed to parse file: ${err instanceof Error ? err.message : 'Unknown error'}`,
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleToggleGrid = () => {
    if (onToggleGrid) {
      onToggleGrid();
    }
  };

  return (
    <div className="bg-card border-b border-border px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Untitled Prompt"
          className="border-none text-lg font-medium focus:outline-none focus:ring-0 bg-transparent w-auto"
          value={promptName}
          onChange={handleNameChange}
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 px-3"
            onClick={handleSave}
            disabled={savePromptMutation.isPending || !prompt}
          >
            {savePromptMutation.isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <Save className="mr-1 h-3 w-3" />
                Save
              </>
            )}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-8 px-3"
            onClick={handleExport}
            disabled={!prompt}
          >
            <Download className="mr-1 h-3 w-3" />
            Export
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs h-8 px-3"
            onClick={handleImportClick}
          >
            <Upload className="mr-1 h-3 w-3" />
            Import
          </Button>
          
          {/* Hidden file input for import feature */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Display current zoom level */}
        {zoomLevel && (
          <Badge variant="outline" className="text-xs mr-2">
            Zoom: {Math.round(zoomLevel * 100)}%
          </Badge>
        )}
        
        {/* Zoom controls */}
        <div className="flex bg-muted/40 rounded-md p-0.5 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-8 w-8 p-0 rounded-sm"
                  onClick={onZoomIn}
                  disabled={!onZoomIn}
                >
                  <ZoomIn className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-8 w-8 p-0 rounded-sm"
                  onClick={onZoomOut}
                  disabled={!onZoomOut}
                >
                  <ZoomOut className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-8 w-8 p-0 rounded-sm"
                  onClick={handleToggleGrid}
                  disabled={!onToggleGrid}
                  data-active={isGridVisible}
                >
                  <Grid className={`h-3 w-3 ${isGridVisible ? 'text-primary' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Grid</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Undo/Redo controls */}
        <div className="flex bg-muted/40 rounded-md p-0.5 mr-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-8 px-2 rounded-sm"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 className="mr-1 h-3 w-3" />
            Undo
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-8 px-2 rounded-sm"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo2 className="mr-1 h-3 w-3" />
            Redo
          </Button>
        </div>
        
        {/* Preview button */}
        <Button
          size="sm"
          variant="secondary"
          className="text-xs h-8 px-3 mr-2"
          onClick={() => setIsPreviewOpen(true)}
        >
          <Eye className="mr-1 h-3 w-3" />
          Preview
        </Button>
        
        {/* Run button */}
        <Button
          size="sm"
          className="text-xs bg-primary/90 hover:bg-primary h-8 px-4"
          onClick={onRun}
        >
          <Play className="mr-1 h-3 w-3" />
          Run Prompt
        </Button>
      </div>
      
      {/* Prompt Preview Modal */}
      <PromptPreview 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        elements={elements}
      />
    </div>
  );
}
