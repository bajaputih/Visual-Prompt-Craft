import { memo, useCallback } from "react";
import { Handle, Position, NodeProps, useReactFlow, Node } from "reactflow";
import { Pencil, Settings } from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import NodeContextMenu from "@/components/NodeContextMenu";
import NodeHoverPreview from "@/components/NodeHoverPreview";

// Base style for all nodes
const baseNodeStyle = "p-3 rounded-md shadow-md border border-gray-200 w-[180px]";

// Helper to create a wrapper with node context menu and hover preview
function withNodeFeatures(NodeComponent: React.ComponentType<NodeProps>) {
  return (props: NodeProps) => {
    const { getNodes, setNodes, addNodes, deleteElements } = useReactFlow();
    
    // Context menu handlers
    const handleEdit = useCallback((nodeId: string) => {
      // This would ideally be handled through a prop callback in real usage
      console.log("Edit node:", nodeId);
    }, []);
    
    const handleDelete = useCallback((nodeId: string) => {
      deleteElements({ nodes: [{ id: nodeId }] });
    }, [deleteElements]);
    
    const handleDuplicate = useCallback((nodeId: string) => {
      const nodeToDuplicate = getNodes().find(n => n.id === nodeId);
      if (!nodeToDuplicate) return;
      
      const newNode: Node = {
        ...nodeToDuplicate,
        id: `${nodeToDuplicate.type}_${nanoid(6)}`,
        position: {
          x: nodeToDuplicate.position.x + 20,
          y: nodeToDuplicate.position.y + 20
        },
        selected: false,
      };
      
      addNodes(newNode);
    }, [getNodes, addNodes]);
    
    const handleLock = useCallback((nodeId: string, locked: boolean) => {
      setNodes(nodes => 
        nodes.map(node => {
          if (node.id === nodeId) {
            return { 
              ...node,
              // Update the node data to include locked status
              data: {
                ...node.data,
                locked: locked
              },
              // ReactFlow internally uses draggable but it's not in the type definition
              ...{ draggable: !locked }
            };
          }
          return node;
        })
      );
    }, [setNodes]);
    
    const handleMoveUp = useCallback((nodeId: string) => {
      const nodes = getNodes();
      const nodeIndex = nodes.findIndex(n => n.id === nodeId);
      if (nodeIndex <= 0) return;
      
      const nodeToMove = nodes[nodeIndex];
      setNodes(nodes => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            return { 
              ...node, 
              position: { 
                x: node.position.x, 
                y: node.position.y - 100 
              } 
            };
          }
          return node;
        });
      });
    }, [getNodes, setNodes]);
    
    const handleMoveDown = useCallback((nodeId: string) => {
      setNodes(nodes => {
        return nodes.map(node => {
          if (node.id === nodeId) {
            return { 
              ...node, 
              position: { 
                x: node.position.x, 
                y: node.position.y + 100 
              } 
            };
          }
          return node;
        });
      });
    }, [setNodes]);
    
    // TypeScript workaround - draggable might be set by ReactFlow but not in the type definition
    const isLocked = props.data.locked === true;
    
    return (
      <NodeHoverPreview node={props.data.node || props}>
        <NodeContextMenu
          nodeId={props.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onLock={handleLock}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          isLocked={isLocked}
        >
          <div className="relative">
            <NodeComponent {...props} />
            {isLocked && (
              <Badge variant="outline" className="absolute -top-2 -right-2 p-1 h-5 text-xs bg-background">
                <Settings className="h-3 w-3 mr-1" />
                Locked
              </Badge>
            )}
          </div>
        </NodeContextMenu>
      </NodeHoverPreview>
    );
  };
};

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

// Enhanced node components with context menu and hover preview
const EnhancedInputNode = withNodeFeatures(InputNode);
const EnhancedProcessNode = withNodeFeatures(ProcessNode);
const EnhancedFilterNode = withNodeFeatures(FilterNode);
const EnhancedConditionNode = withNodeFeatures(ConditionNode);
const EnhancedOutputNode = withNodeFeatures(OutputNode);

// Define node types object to be used with ReactFlow
export const nodeTypes = {
  input: EnhancedInputNode,
  process: EnhancedProcessNode,
  filter: EnhancedFilterNode,
  condition: EnhancedConditionNode,
  output: EnhancedOutputNode,
};
