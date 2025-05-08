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
    <aside className={`w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col h-full ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={onNewPromptClick}
          className="w-full bg-primary hover:bg-blue-600 text-white"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Recent Prompts
            </h2>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : prompts && prompts.length > 0 ? (
              <ul className="space-y-1">
                {prompts.map((prompt) => (
                  <li key={prompt.id}>
                    <Link 
                      href={`/designer/${prompt.id}`}
                      className={`
                        text-gray-700 hover:bg-gray-100 hover:text-gray-900 group 
                        rounded-md px-2 py-2 flex items-center text-sm
                        ${location === `/designer/${prompt.id}` ? 'bg-gray-100 text-gray-900' : ''}
                      `}
                    >
                      <FileText className="mr-3 h-4 w-4 text-gray-500" />
                      <span className="truncate">{prompt.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-2">No prompts found</p>
            )}
          </div>
          
          {categories.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Categories
              </h2>
              <ul className="space-y-1">
                {categories.map((category: string, index: number) => (
                  <li key={index}>
                    <a href="#" className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 group rounded-md px-2 py-2 flex items-center text-sm">
                      <FolderOpen className="mr-3 h-4 w-4 text-gray-500" />
                      <span className="truncate">{category}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
