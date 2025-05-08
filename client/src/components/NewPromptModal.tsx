import { useState } from "react";
import * as wouter from "wouter";
const { useLocation } = wouter;
import { useMutation } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { type InsertPrompt } from "@shared/schema";

interface NewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewPromptModal({ isOpen, onClose }: NewPromptModalProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const navigate = (path: string) => setLocation(path);
  
  const [promptData, setPromptData] = useState<Partial<InsertPrompt>>({
    name: "",
    description: "",
    category: "",
    elements: { nodes: [], edges: [] }
  });

  const createPromptMutation = useMutation({
    mutationFn: async (data: InsertPrompt) => {
      const response = await apiRequest("POST", "/api/prompts", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      toast({
        title: "Success",
        description: "New prompt created successfully!",
      });
      onClose();
      navigate(`/designer/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promptData.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Prompt name is required",
        variant: "destructive",
      });
      return;
    }

    createPromptMutation.mutate({
      name: promptData.name,
      description: promptData.description || "",
      category: promptData.category || "Uncategorized",
      elements: { nodes: [], edges: [] } // Start with empty flow
    } as InsertPrompt);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPromptData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPromptData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Prompt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Prompt Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter a name for your prompt"
                value={promptData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={promptData.category || ""} 
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Creative Writing">Creative Writing</SelectItem>
                  <SelectItem value="Data Analysis">Data Analysis</SelectItem>
                  <SelectItem value="Customer Support">Customer Support</SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Briefly describe what this prompt does"
                rows={3}
                value={promptData.description || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Template</Label>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Start from scratch
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createPromptMutation.isPending}
            >
              {createPromptMutation.isPending ? "Creating..." : "Create Prompt"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
