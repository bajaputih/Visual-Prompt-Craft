import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NodeHoverPreviewProps {
  node: Node;
  children: React.ReactNode;
}

export default function NodeHoverPreview({ 
  node, 
  children 
}: NodeHoverPreviewProps) {
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  
  // Generate preview based on node type and data
  useEffect(() => {
    if (!node) return;
    
    let content = '';
    const { type, data } = node;
    
    switch(type) {
      case 'INPUT':
        content = `## Input: ${data.label}\n\n${data.description || 'No description'}\n\nThis node provides input to the prompt flow.`;
        break;
      case 'PROCESS':
        content = `## Process: ${data.label}\n\n${data.description || 'No description'}\n\n`;
        if (data.template) {
          content += `**Template:**\n\`\`\`\n${data.template.substring(0, 150)}${data.template.length > 150 ? '...' : ''}\n\`\`\`\n\n`;
        }
        if (data.parameters && Object.keys(data.parameters).length > 0) {
          content += '**Parameters:**\n';
          Object.entries(data.parameters).forEach(([key, value]) => {
            content += `- ${key}: ${value}\n`;
          });
        }
        break;
      case 'FILTER':
        content = `## Filter: ${data.label}\n\n${data.description || 'No description'}\n\nRoutes data based on conditions.`;
        break;
      case 'CONDITION':
        content = `## Condition: ${data.label}\n\n${data.description || 'No description'}\n\nPerforms conditional logic.`;
        break;
      case 'OUTPUT':
        content = `## Output: ${data.label}\n\n${data.description || 'No description'}\n\nFinal result of this prompt flow path.`;
        break;
      default:
        content = `## ${data.label || 'Unknown Node'}\n\n${data.description || 'No description'}`;
    }
    
    setPreviewContent(content);
  }, [node]);
  
  return (
    <HoverCard openDelay={600} closeDelay={200}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" align="start">
        <div className="bg-gradient-to-b from-primary/20 to-background p-2 rounded-t-md">
          <div className="text-sm font-medium">{node.data.label}</div>
          <div className="text-xs text-muted-foreground">Type: {node.type}</div>
        </div>
        <ScrollArea className="h-56 rounded-b-md px-4 py-2">
          <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap">
            {previewContent}
          </div>
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
}