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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Visual Prompt Designer</h1>
        <p className="text-gray-600 max-w-2xl">
          Create, edit and manage AI prompts visually. Drag and drop components to build
          your prompt flow and customize each node's properties.
        </p>
      </div>

      {Object.keys(promptsByCategory).length === 0 ? (
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>You don't have any prompts yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Create your first visual prompt to start building AI workflows.
            </p>
            <Button onClick={handleCreateNew}>
              <FileText className="mr-2 h-4 w-4" />
              Create New Prompt
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {Object.entries(promptsByCategory).map(([category, categoryPrompts]) => (
            <div key={category} className="mb-8">
              <div className="flex items-center mb-4">
                <Folder className="mr-2 h-5 w-5 text-gray-500" />
                <h2 className="text-xl font-semibold">{category}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPrompts.map((prompt) => (
                  <Card 
                    key={prompt.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/designer/${prompt.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{prompt.name}</CardTitle>
                      {prompt.description && (
                        <CardDescription>{prompt.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>
                          Last updated: {new Date(prompt.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="mt-2">
                        Open Prompt
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                <Card 
                  className="border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-50"
                  onClick={handleCreateNew}
                >
                  <CardContent className="flex flex-col items-center justify-center py-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-center font-medium">Create New Prompt</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
