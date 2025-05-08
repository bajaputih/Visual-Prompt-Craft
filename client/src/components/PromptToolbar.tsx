import { useState } from "react";
import * as wouter from "wouter";
const { useLocation } = wouter;
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Prompt, FlowElements } from "@shared/schema";

interface PromptToolbarProps {
  prompt: Prompt | null;
  elements: FlowElements;
  onUndo: () => void;
  onRedo: () => void;
  onRun: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function PromptToolbar({
  prompt,
  elements,
  onUndo,
  onRedo,
  onRun,
  canUndo,
  canRedo
}: PromptToolbarProps) {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const { toast } = useToast();
  const [promptName, setPromptName] = useState(prompt?.name || "Untitled Prompt");
  
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
                <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
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
            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex bg-muted/40 rounded-md p-0.5 mr-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-8 px-2 rounded-sm"
            onClick={onUndo}
            disabled={!canUndo}
          >
            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a4 4 0 0 1 0 8H9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l5-5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l5 5" />
            </svg>
            Undo
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs h-8 px-2 rounded-sm"
            onClick={onRedo}
            disabled={!canRedo}
          >
            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10h-10a4 4 0 0 0 0 8h4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10l-5-5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10l-5 5" />
            </svg>
            Redo
          </Button>
        </div>
        
        <Button
          size="sm"
          className="text-xs bg-primary/90 hover:bg-primary h-8 px-4"
          onClick={onRun}
        >
          <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Run Prompt
        </Button>
      </div>
    </div>
  );
}
