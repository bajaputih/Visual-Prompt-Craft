import { useQuery } from "@tanstack/react-query";
import * as wouter from "wouter";
const { Link, useLocation } = wouter;
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings, FilePlus, FileText, FolderOpen } from "lucide-react";
import { type Prompt } from "@shared/schema";

interface SidebarProps {
  onNewPromptClick: () => void;
  className?: string;
}

export default function Sidebar({ onNewPromptClick, className = "" }: SidebarProps) {
  const [location] = useLocation();
  
  // Fetch prompts from the API
  const { data: prompts, isLoading } = useQuery<Prompt[]>({
    queryKey: ['/api/prompts'],
  });

  // Extract unique categories from prompts
  const categories = useMemo(() => {
    if (!prompts) return [];
    
    const uniqueCategories: string[] = [];
    const seen = new Set<string>();
    
    prompts.forEach(prompt => {
      if (prompt.category && !seen.has(prompt.category)) {
        seen.add(prompt.category);
        uniqueCategories.push(prompt.category);
      }
    });
    
    return uniqueCategories;
  }, [prompts]);

  return (
    <aside className={`w-64 bg-card border-r border-border shadow-sm flex flex-col h-full ${className}`}>
      <div className="p-4 border-b border-border">
        <Button
          onClick={onNewPromptClick}
          className="w-full"
          id="new-prompt-btn"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Recent Prompts
            </h2>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : prompts && prompts.length > 0 ? (
              <ul className="space-y-1 animate-fade-in">
                {prompts.map((prompt) => (
                  <li key={prompt.id}>
                    <Link 
                      href={`/designer/${prompt.id}`}
                      className={`
                        text-foreground hover:bg-muted hover:text-foreground 
                        rounded-md px-2 py-2 flex items-center text-sm transition-colors
                        ${location === `/designer/${prompt.id}` ? 'bg-muted font-medium' : ''}
                      `}
                    >
                      <FileText className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{prompt.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground py-2">No prompts found</p>
            )}
          </div>
          
          {categories.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Categories
              </h2>
              <ul className="space-y-1">
                {categories.map((category: string, index: number) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-foreground hover:bg-muted hover:text-foreground
                      rounded-md px-2 py-2 flex items-center text-sm transition-colors"
                    >
                      <FolderOpen className="mr-3 h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{category}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
