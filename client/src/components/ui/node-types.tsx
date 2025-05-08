import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

// Base style for all nodes
const baseNodeStyle = "p-3 rounded-md shadow-md border border-gray-200 w-[180px]";

export const InputNode = memo(({ data }: NodeProps) => (
  <div className={`${baseNodeStyle} node-input bg-blue-50 border-l-3 border-l-primary`}>
    <div className="text-sm font-medium mb-1">{data.label}</div>
    <div className="text-xs text-gray-500">{data.description}</div>
    <Handle
      type="source"
      position={Position.Right}
      className="h-2 w-2 bg-primary"
    />
  </div>
));

export const ProcessNode = memo(({ data }: NodeProps) => (
  <div className={`${baseNodeStyle} node-process bg-green-50 border-l-3 border-l-green-500`}>
    <div className="text-sm font-medium mb-1">{data.label}</div>
    <div className="text-xs text-gray-500">{data.description}</div>
    
    <Handle
      type="target"
      position={Position.Left}
      className="h-2 w-2 bg-primary"
    />
    <Handle
      type="source"
      position={Position.Right}
      className="h-2 w-2 bg-primary"
    />
  </div>
));

export const FilterNode = memo(({ data }: NodeProps) => (
  <div className={`${baseNodeStyle} node-process bg-green-50 border-l-3 border-l-green-500`}>
    <div className="text-sm font-medium mb-1">{data.label}</div>
    <div className="text-xs text-gray-500">{data.description}</div>
    
    <Handle
      type="target"
      position={Position.Left}
      className="h-2 w-2 bg-primary"
    />
    <Handle
      type="source"
      position={Position.Right}
      className="h-2 w-2 bg-primary"
    />
  </div>
));

export const ConditionNode = memo(({ data }: NodeProps) => (
  <div className={`${baseNodeStyle} node-process bg-green-50 border-l-3 border-l-green-500`}>
    <div className="text-sm font-medium mb-1">{data.label}</div>
    <div className="text-xs text-gray-500">{data.description}</div>
    
    <Handle
      type="target"
      position={Position.Left}
      className="h-2 w-2 bg-primary"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="true"
      className="h-2 w-2 bg-primary"
      style={{ top: '30%' }}
    />
    <Handle
      type="source"
      position={Position.Right}
      id="false"
      className="h-2 w-2 bg-primary"
      style={{ top: '70%' }}
    />
  </div>
));

export const OutputNode = memo(({ data }: NodeProps) => (
  <div className={`${baseNodeStyle} node-output bg-purple-50 border-l-3 border-l-purple-500`}>
    <div className="text-sm font-medium mb-1">{data.label}</div>
    <div className="text-xs text-gray-500">{data.description}</div>
    
    <Handle
      type="target"
      position={Position.Left}
      className="h-2 w-2 bg-primary"
    />
  </div>
));

// Define node types object to be used with ReactFlow
export const nodeTypes = {
  input: InputNode,
  process: ProcessNode,
  filter: FilterNode,
  condition: ConditionNode,
  output: OutputNode,
};
