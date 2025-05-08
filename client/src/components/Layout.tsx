import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { User, Menu, Sparkles, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "./ThemeToggle";
import NewPromptModal from "./NewPromptModal";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewPromptModalOpen, setIsNewPromptModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-background h-screen flex flex-col">
      {/* Header */}
      <TooltipProvider>
        <header className="bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold gradient-heading">Visual Prompt Designer</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Github className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View on GitHub</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help</p>
                </TooltipContent>
              </Tooltip>
              
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" />
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
      </TooltipProvider>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - always rendered but conditionally visible on mobile */}
        <div 
          className={`${
            sidebarOpen ? 'fixed inset-0 z-40 block' : 'hidden'
          } md:relative md:block`}
        >
          {/* Backdrop for mobile */}
          {sidebarOpen && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 md:hidden" 
              onClick={toggleSidebar}
            />
          )}
          <Sidebar 
            onNewPromptClick={() => setIsNewPromptModalOpen(true)}
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } md:block`}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {children}
        </main>
      </div>

      {/* New Prompt Modal */}
      <NewPromptModal 
        isOpen={isNewPromptModalOpen}
        onClose={() => setIsNewPromptModalOpen(false)}
      />
    </div>
  );
}
