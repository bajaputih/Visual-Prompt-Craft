import { useState, useEffect } from "react";
import { Node } from "reactflow";
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
import { NodeType } from "@shared/schema";

interface NodePropertiesProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, data: any) => void;
}

export default function NodeProperties({ selectedNode, onNodeUpdate }: NodePropertiesProps) {
  const [parameters, setParameters] = useState<Array<{ key: string; value: string }>>([]);
  
  useEffect(() => {
    if (selectedNode?.data?.parameters) {
      const params = Object.entries(selectedNode.data.parameters).map(
        ([key, value]) => ({ key, value: value as string })
      );
      setParameters(params);
    } else {
      setParameters([]);
    }
  }, [selectedNode]);

  // Node selection UI is now handled in the parent component (Designer)
  
  // If no node is selected, don't render anything
  if (!selectedNode) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onNodeUpdate(selectedNode.id, {
      ...selectedNode.data,
      [name]: value,
    });
  };

  const handleNodeTypeChange = (value: string) => {
    onNodeUpdate(selectedNode.id, {
      ...selectedNode.data,
    });
    // We'd need to change the node type at a higher level since it affects the node itself
  };

  const handleParameterChange = (index: number, field: 'key' | 'value', value: string) => {
    const newParameters = [...parameters];
    newParameters[index][field] = value;
    
    // Update the node data with new parameters
    const paramObject = newParameters.reduce((acc, { key, value }) => {
      if (key.trim()) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    onNodeUpdate(selectedNode.id, {
      ...selectedNode.data,
      parameters: paramObject,
    });
  };

  const addParameter = () => {
    setParameters([...parameters, { key: "", value: "" }]);
  };

  const removeParameter = (index: number) => {
    const newParameters = [...parameters];
    newParameters.splice(index, 1);
    setParameters(newParameters);
    
    // Update the node data with new parameters
    const paramObject = newParameters.reduce((acc, { key, value }) => {
      if (key.trim()) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    onNodeUpdate(selectedNode.id, {
      ...selectedNode.data,
      parameters: paramObject,
    });
  };

  return (
    <div className="space-y-5">
      {/* Node basics section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="label" className="text-xs font-medium text-muted-foreground">Node Name</Label>
          <Input
            id="label"
            name="label"
            value={selectedNode.data.label || ""}
            onChange={handleInputChange}
            className="mt-1.5"
          />
        </div>
        
        <div className="bg-muted/20 rounded-md p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className={`h-2 w-2 rounded-full 
              ${selectedNode.type === NodeType.INPUT ? 'bg-primary' : 
                selectedNode.type === NodeType.PROCESS ? 'bg-success' :
                selectedNode.type === NodeType.FILTER ? 'bg-warning' :
                selectedNode.type === NodeType.CONDITION ? 'bg-info' : 'bg-accent'
              }`}
            />
            <Label htmlFor="nodeType" className="text-xs font-medium">Type: {selectedNode.type}</Label>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-xs font-medium text-muted-foreground">Description</Label>
            <Input
              id="description"
              name="description"
              value={selectedNode.data.description || ""}
              onChange={handleInputChange}
              className="mt-1.5"
            />
          </div>
        </div>
      </div>
      
      {/* Parameters section */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-xs font-medium text-muted-foreground">Parameters</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addParameter}
            className="h-7 px-2 text-xs"
          >
            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {parameters.length === 0 ? (
            <div className="text-center text-muted-foreground text-xs py-3 bg-muted/20 rounded-md">
              No parameters defined
            </div>
          ) : (
            parameters.map((param, index) => (
              <div key={index} className="flex items-center space-x-2 group">
                <Input
                  placeholder="Key"
                  className="flex-1"
                  value={param.key}
                  onChange={(e) => handleParameterChange(index, 'key', e.target.value)}
                />
                <Input
                  placeholder="Value"
                  className="flex-1"
                  value={param.value}
                  onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeParameter(index)}
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Template section for certain node types */}
      {(selectedNode.type === NodeType.PROCESS || selectedNode.type === NodeType.FILTER || selectedNode.type === NodeType.CONDITION) && (
        <div className="border-t border-border pt-4">
          <Label htmlFor="template" className="text-xs font-medium text-muted-foreground block mb-2">Prompt Template</Label>
          <Textarea
            id="template"
            name="template"
            value={selectedNode.data.template || ""}
            onChange={handleInputChange}
            rows={6}
            className="font-mono text-xs resize-none"
            placeholder="Enter your prompt template here. Use {{parameter}} syntax to reference parameters."
          />
          <p className="text-xs text-muted-foreground mt-2">
            Use <code className="text-xs bg-muted px-1 py-0.5 rounded">{'{{parameter}}'}</code> to reference parameters in your template.
          </p>
        </div>
      )}
    </div>
  );
}
