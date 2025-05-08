import { useState, useEffect } from 'react';
import { getBezierPath, EdgeProps, EdgeText } from 'reactflow';

// Function to get edge color based on source and target node types
const getEdgeColor = (data: any): string => {
  if (!data || !data.sourceType || !data.targetType) {
    return 'hsl(var(--primary))';
  }
  
  // Source node is input
  if (data.sourceType === 'input') {
    return 'hsl(var(--primary))';
  }
  
  // Process to output
  if (data.sourceType === 'process' && data.targetType === 'output') {
    return 'hsl(var(--success))';
  }
  
  // Condition edges
  if (data.sourceType === 'condition') {
    return 'hsl(var(--info))';
  }
  
  // Filter edges
  if (data.sourceType === 'filter') {
    return 'hsl(var(--warning))';
  }
  
  // Default color
  return 'hsl(var(--primary))';
};

// Base function for all edge types
const BaseEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  ...props
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
  const color = getEdgeColor(data);
  
  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: color,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {data?.label && (
        <EdgeText
          x={labelX}
          y={labelY}
          label={data.label || ''}
          labelStyle={{ fill: 'var(--foreground)', fontWeight: 500 }}
          labelBgStyle={{ fill: 'hsl(var(--card))', fillOpacity: 0.75 }}
          labelBgPadding={[2, 4]}
          labelBgBorderRadius={4}
        />
      )}
    </>
  );
};

// Standard edge
export function DefaultEdge(props: EdgeProps) {
  return <BaseEdge {...props} />;
}

// Dashed edge (for conditional flows)
export function DashedEdge(props: EdgeProps) {
  return (
    <BaseEdge 
      {...props} 
      style={{ ...props.style, strokeDasharray: '5,5' }} 
    />
  );
}

// Success edge (for completed flows)
export function SuccessEdge(props: EdgeProps) {
  return (
    <BaseEdge 
      {...props} 
      style={{ ...props.style, stroke: 'hsl(var(--success))' }} 
    />
  );
}

// Warning edge (for filter connections)
export function WarningEdge(props: EdgeProps) {
  return (
    <BaseEdge 
      {...props} 
      style={{ ...props.style, stroke: 'hsl(var(--warning))' }} 
    />
  );
}

// Define edge types object to be used with ReactFlow
export const edgeTypes = {
  default: DefaultEdge,
  dashed: DashedEdge,
  success: SuccessEdge,
  warning: WarningEdge
};
