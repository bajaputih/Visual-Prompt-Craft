import { useEffect } from "react";
import * as wouter from "wouter";
const { useLocation } = wouter;
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Folder, Calendar } from "lucide-react";
import { Prompt } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  
  const navigate = (path: string) => setLocation(path);
  
  // Fetch prompts from the API
  const { data: prompts, isLoading, error } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });

  // Navigate to first prompt if exists or create new one
  useEffect(() => {
    if (prompts && prompts.length > 0) {
      // Optional: Auto-navigate to first prompt
      // navigate(`/designer/${prompts[0].id}`);
    }
  }, [prompts, navigate]);

  // Group prompts by category
  const promptsByCategory = prompts?.reduce((acc, prompt) => {
    const category = prompt.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(prompt);
    return acc;
  }, {} as Record<string, Prompt[]>) || {};

  const handleCreateNew = () => {
    // Open the new prompt modal by clicking the button in sidebar
    const newPromptBtn = document.getElementById("new-prompt-btn");
    if (newPromptBtn) {
      newPromptBtn.click();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-full max-w-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was an error loading your prompts. Please try again later.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-12 mt-4 text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-heading">Welcome to Visual Prompt Designer</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create, edit and manage AI prompts visually. Drag and drop components to build
          your prompt flow and customize each node's properties.
        </p>
      </div>

      {Object.keys(promptsByCategory).length === 0 ? (
        <div className="max-w-lg mx-auto mt-16 glass-panel rounded-lg p-1">
          <Card className="border-0 bg-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>You don't have any prompts yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-6 mb-6">
                <p className="text-center text-muted-foreground mb-4">
                  Create your first visual prompt to start building AI workflows.
                </p>
                <div className="flex justify-center">
                  <Button onClick={handleCreateNew} size="lg" className="font-medium">
                    <FileText className="mr-2 h-5 w-5" />
                    Create New Prompt
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Design Visually</h3>
                  <p className="text-xs text-muted-foreground">Build flows with intuitive drag-and-drop</p>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Test Instantly</h3>
                  <p className="text-xs text-muted-foreground">Get immediate results from your AI prompts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="animate-fade-in">
          {Object.entries(promptsByCategory).map(([category, categoryPrompts]) => (
            <div key={category} className="mb-10">
              <div className="flex items-center mb-4 border-b border-border pb-2">
                <Folder className="mr-2 h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{category}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPrompts.map((prompt) => (
                  <Card 
                    key={prompt.id} 
                    className="cursor-pointer hover:shadow-lg transition-all border-border hover:border-primary/20 group"
                    onClick={() => navigate(`/designer/${prompt.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{prompt.name}</CardTitle>
                      {prompt.description && (
                        <CardDescription>{prompt.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>
                          Last updated: {new Date(prompt.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Open Prompt
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                <Card 
                  className="border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={handleCreateNew}
                >
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-center font-medium text-lg">Create New Prompt</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
