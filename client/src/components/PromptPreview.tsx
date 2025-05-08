import { useState } from 'react';
import { FlowElements, FlowNode } from '@shared/schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface PromptPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  elements: FlowElements;
}

export default function PromptPreview({ isOpen, onClose, elements }: PromptPreviewProps) {
  const [previewResult, setPreviewResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;
  
  // Find input and output nodes
  const inputNodes = elements.nodes.filter(node => node.type === "INPUT");
  const processNodes = elements.nodes.filter(node => node.type === "PROCESS");
  const outputNodes = elements.nodes.filter(node => node.type === "OUTPUT");
  
  // Extract templates from process nodes
  const templates = processNodes
    .filter(node => node.data.template)
    .map(node => ({
      id: node.id,
      label: node.data.label,
      template: node.data.template,
      parameters: node.data.parameters || {}
    }));
  
  // Generate preview based on the flow
  const generatePreview = () => {
    setIsLoading(true);
    
    // Simulate AI response with a delay
    setTimeout(() => {
      // Create a sample output based on the structure
      const result = templates.length > 0
        ? `# Preview of "${templates[0].label}" output\n\n` +
          `This is a simulated preview of how your prompt structure might execute.\n\n` +
          `## Input Processing\nYour flow contains ${inputNodes.length} input node(s), ` +
          `${processNodes.length} processing node(s), and ${outputNodes.length} output node(s).\n\n` +
          `## Sample Template Used\n\`\`\`\n${templates[0].template || "No template found"}\n\`\`\`\n\n` +
          `## Parameters\n${Object.entries(templates[0].parameters || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n') || "No parameters found"}\n\n` +
          `## Expected Output\nThe expected output would follow the instructions in your template, ` +
          `processing the input and generating a result according to the specified parameters.\n\n` +
          `In a real execution, this would be replaced with actual AI-generated content based on your entire prompt flow.`
        : "No templates found in your prompt flow. Add process nodes with templates to see a preview.";
      
      setPreviewResult(result);
      setIsLoading(false);
    }, 1500);
  };
  
  // Calculate the template chain text
  const templateChainText = templates.map((t, i) => 
    `${i+1}. ${t.label}:\n${t.template?.substring(0, 100)}${t.template && t.template.length > 100 ? '...' : ''}`
  ).join('\n\n');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-3/4 max-w-4xl">
        <CardHeader className="relative">
          <CardTitle>Prompt Preview</CardTitle>
          <CardDescription>
            Preview how your prompt flow will execute
          </CardDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="flow" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="flow">Flow Structure</TabsTrigger>
              <TabsTrigger value="templates">Template Chain</TabsTrigger>
              <TabsTrigger value="preview">Output Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="flow" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Input Nodes ({inputNodes.length})</h3>
                  <div className="grid gap-2">
                    {inputNodes.map(node => (
                      <div key={node.id} className="p-2 border rounded bg-muted/30">
                        <div className="font-medium">{node.data.label}</div>
                        <div className="text-xs text-muted-foreground">{node.data.description}</div>
                      </div>
                    ))}
                    {inputNodes.length === 0 && <div className="text-sm text-muted-foreground">No input nodes found</div>}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Process Nodes ({processNodes.length})</h3>
                  <div className="grid gap-2">
                    {processNodes.map(node => (
                      <div key={node.id} className="p-2 border rounded bg-muted/30">
                        <div className="font-medium">{node.data.label}</div>
                        <div className="text-xs text-muted-foreground">{node.data.description}</div>
                      </div>
                    ))}
                    {processNodes.length === 0 && <div className="text-sm text-muted-foreground">No process nodes found</div>}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Output Nodes ({outputNodes.length})</h3>
                  <div className="grid gap-2">
                    {outputNodes.map(node => (
                      <div key={node.id} className="p-2 border rounded bg-muted/30">
                        <div className="font-medium">{node.data.label}</div>
                        <div className="text-xs text-muted-foreground">{node.data.description}</div>
                      </div>
                    ))}
                    {outputNodes.length === 0 && <div className="text-sm text-muted-foreground">No output nodes found</div>}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="space-y-4">
              <ScrollArea className="h-[300px] w-full border rounded-md p-4">
                <pre className="whitespace-pre-wrap text-sm">
                  {templateChainText || "No templates found in your prompt flow"}
                </pre>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              <div className="flex flex-col gap-4">
                {!previewResult ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      Click the button below to generate a preview of your prompt flow
                    </p>
                    <Button onClick={generatePreview} disabled={isLoading}>
                      {isLoading ? "Generating Preview..." : "Generate Preview"}
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[300px] w-full border rounded-md p-4">
                    <div className="whitespace-pre-wrap prose">
                      {previewResult}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={generatePreview} disabled={isLoading}>
            {isLoading ? "Generating..." : "Refresh Preview"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}