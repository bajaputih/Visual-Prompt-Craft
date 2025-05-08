import { useCallback } from "react";
import { NodeType } from "@shared/schema";

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string, nodeName: string, description: string) => void;
}

export default function NodePalette({ onDragStart }: NodePaletteProps) {
  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeType: string, nodeName: string, description: string) => {
      onDragStart(event, nodeType, nodeName, description);
    },
    [onDragStart]
  );

  return (
    <div className="w-48 bg-white border-r border-gray-200 overflow-y-auto p-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Components
      </h3>
      <div className="space-y-3">
        <div
          className="node-input p-2 rounded shadow-sm cursor-grab bg-blue-50 border-l-4 border-l-primary"
          draggable
          onDragStart={(e) => 
            handleDragStart(e, NodeType.INPUT, "User Input", "Initial user prompt")
          }
        >
          <div className="text-xs font-medium">User Input</div>
          <div className="text-xs text-gray-500">Initial user prompt</div>
        </div>
        
        <div
          className="node-process p-2 rounded shadow-sm cursor-grab bg-green-50 border-l-4 border-l-green-500"
          draggable
          onDragStart={(e) => 
            handleDragStart(e, NodeType.PROCESS, "Process", "Transform or modify text")
          }
        >
          <div className="text-xs font-medium">Process</div>
          <div className="text-xs text-gray-500">Transform or modify text</div>
        </div>
        
        <div
          className="node-process p-2 rounded shadow-sm cursor-grab bg-green-50 border-l-4 border-l-green-500"
          draggable
          onDragStart={(e) => 
            handleDragStart(e, NodeType.FILTER, "Filter", "Remove unwanted content")
          }
        >
          <div className="text-xs font-medium">Filter</div>
          <div className="text-xs text-gray-500">Remove unwanted content</div>
        </div>
        
        <div
          className="node-process p-2 rounded shadow-sm cursor-grab bg-green-50 border-l-4 border-l-green-500"
          draggable
          onDragStart={(e) => 
            handleDragStart(e, NodeType.CONDITION, "Condition", "Branch based on content")
          }
        >
          <div className="text-xs font-medium">Condition</div>
          <div className="text-xs text-gray-500">Branch based on content</div>
        </div>
        
        <div
          className="node-output p-2 rounded shadow-sm cursor-grab bg-purple-50 border-l-4 border-l-purple-500"
          draggable
          onDragStart={(e) => 
            handleDragStart(e, NodeType.OUTPUT, "Output", "Final response")
          }
        >
          <div className="text-xs font-medium">Output</div>
          <div className="text-xs text-gray-500">Final response</div>
        </div>
      </div>
      
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-2">
        Templates
      </h3>
      <div className="space-y-3">
        <div className="bg-white p-2 rounded border border-gray-200 shadow-sm cursor-grab hover:bg-gray-50">
          <div className="text-xs font-medium">Summarization</div>
          <div className="text-xs text-gray-500">Text summary flow</div>
        </div>
        <div className="bg-white p-2 rounded border border-gray-200 shadow-sm cursor-grab hover:bg-gray-50">
          <div className="text-xs font-medium">Q&A Chain</div>
          <div className="text-xs text-gray-500">Question answering</div>
        </div>
      </div>
    </div>
  );
}
