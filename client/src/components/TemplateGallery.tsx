import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FlowElements } from '@shared/schema';
import { promptTemplates } from '@/lib/initial-elements';

// Group templates by category
const getTemplatesByCategory = () => {
  const categories: Record<string, any[]> = {};
  
  Object.entries(promptTemplates).forEach(([key, template]) => {
    const category = template.category || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({
      id: key,
      ...template
    });
  });
  
  return categories;
};

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (elements: FlowElements) => void;
}

export default function TemplateGallery({ isOpen, onClose, onSelectTemplate }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const templatesByCategory = getTemplatesByCategory();
  const categories = Object.keys(templatesByCategory);
  
  // Filter templates based on search query
  const filterTemplates = (templates: any[]) => {
    if (!searchQuery.trim()) return templates;
    const query = searchQuery.toLowerCase();
    
    return templates.filter(template => 
      template.name.toLowerCase().includes(query) || 
      template.description.toLowerCase().includes(query)
    );
  };
  
  const handleSelectTemplate = (templateId: string) => {
    const template = promptTemplates[templateId as keyof typeof promptTemplates];
    if (template && template.elements) {
      // Make sure all optional fields like parameters are properly initialized and converted to strings
      const processedElements: FlowElements = {
        nodes: template.elements.nodes.map(node => {
          // Convert all parameter values to strings to satisfy the Record<string, string> requirement
          const processedParameters: Record<string, string> = {};
          if (node.data.parameters) {
            Object.entries(node.data.parameters).forEach(([key, value]) => {
              processedParameters[key] = String(value); // Convert all values to strings
            });
          }
          
          return {
            ...node,
            data: {
              ...node.data,
              parameters: processedParameters
            }
          };
        }),
        edges: template.elements.edges
      };
      
      onSelectTemplate(processedElements);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Template Gallery</DialogTitle>
          <DialogDescription>
            Choose from our pre-built templates to quickly design effective prompts
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8 w-full bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex flex-wrap h-auto p-1 overflow-x-auto">
            <TabsTrigger value="all" className="rounded">
              All
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="rounded">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
                {Object.entries(templatesByCategory).map(([category, templates]) => (
                  <React.Fragment key={category}>
                    {filterTemplates(templates).length > 0 && (
                      <>
                        <h3 className="text-lg font-semibold col-span-full mt-2 mb-1">{category}</h3>
                        {filterTemplates(templates).map(template => (
                          <Card key={template.id} className="overflow-hidden border border-border/60 hover:border-border hover:shadow-md transition-all">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{template.name}</CardTitle>
                                <Badge variant="outline">{category}</Badge>
                              </div>
                              <CardDescription className="text-xs line-clamp-2">
                                {template.description}
                              </CardDescription>
                            </CardHeader>
                            <CardFooter className="pt-2 pb-3">
                              <Button 
                                size="sm" 
                                onClick={() => handleSelectTemplate(template.id)}
                                className="w-full"
                              >
                                Use Template
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <ScrollArea className="h-[500px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2">
                  {filterTemplates(templatesByCategory[category]).map(template => (
                    <Card key={template.id} className="overflow-hidden border border-border/60 hover:border-border hover:shadow-md transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2 pb-3">
                        <Button 
                          size="sm" 
                          onClick={() => handleSelectTemplate(template.id)}
                          className="w-full"
                        >
                          Use Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}