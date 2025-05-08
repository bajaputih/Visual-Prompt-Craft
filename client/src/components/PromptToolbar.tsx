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

  return (
    <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Untitled Prompt"
          className="border-none text-lg font-medium focus:outline-none focus:ring-0 text-gray-800 bg-transparent w-auto"
          value={promptName}
          onChange={handleNameChange}
        />
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={handleSave}
            disabled={savePromptMutation.isPending || !prompt}
          >
            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
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
          variant="outline"
          className="text-xs"
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
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={onRun}
        >
          <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Run
        </Button>
      </div>
    </div>
  );
}
