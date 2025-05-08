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

  if (!selectedNode) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <p className="mt-2 text-sm">Select a node to edit its properties</p>
      </div>
    );
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
    <div className="space-y-4">
      <div>
        <Label htmlFor="label" className="text-xs">Node Name</Label>
        <Input
          id="label"
          name="label"
          value={selectedNode.data.label || ""}
          onChange={handleInputChange}
          className="text-sm"
        />
      </div>
      
      <div>
        <Label htmlFor="nodeType" className="text-xs">Node Type</Label>
        <Select 
          value={selectedNode.type} 
          onValueChange={handleNodeTypeChange}
          disabled // Disabling for now as changing node type needs more complex handling
        >
          <SelectTrigger className="text-sm">
            <SelectValue placeholder="Select node type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NodeType.INPUT}>Input</SelectItem>
            <SelectItem value={NodeType.PROCESS}>Process</SelectItem>
            <SelectItem value={NodeType.FILTER}>Filter</SelectItem>
            <SelectItem value={NodeType.CONDITION}>Condition</SelectItem>
            <SelectItem value={NodeType.OUTPUT}>Output</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description" className="text-xs">Description</Label>
        <Input
          id="description"
          name="description"
          value={selectedNode.data.description || ""}
          onChange={handleInputChange}
          className="text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs mb-1 block">Parameters</Label>
        <div className="space-y-2">
          {parameters.map((param, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                placeholder="Key"
                className="flex-1 text-sm"
                value={param.key}
                onChange={(e) => handleParameterChange(index, 'key', e.target.value)}
              />
              <Input
                placeholder="Value"
                className="flex-1 text-sm"
                value={param.value}
                onChange={(e) => handleParameterChange(index, 'value', e.target.value)}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeParameter(index)}
                className="h-8 w-8 p-0"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addParameter}
            className="text-xs"
          >
            <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Parameter
          </Button>
        </div>
      </div>
      
      {(selectedNode.type === "process" || selectedNode.type === "filter" || selectedNode.type === "condition") && (
        <div>
          <Label htmlFor="template" className="text-xs">Prompt Template</Label>
          <Textarea
            id="template"
            name="template"
            value={selectedNode.data.template || ""}
            onChange={handleInputChange}
            className="text-sm"
            rows={4}
            placeholder="Enter your prompt template here. Use {{parameter}} syntax to reference parameters."
          />
        </div>
      )}
    </div>
  );
}
