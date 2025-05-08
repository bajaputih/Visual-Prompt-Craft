import { useCallback, useEffect, useRef } from "react";
import { Node } from "reactflow";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Trash, Copy, Edit, Lock, Unlock, ChevronUp, ChevronDown, Settings } from "lucide-react";

interface NodeContextMenuProps {
  nodeId: string;
  children: React.ReactNode;
  onEdit: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  onLock: (nodeId: string, locked: boolean) => void;
  onMoveUp: (nodeId: string) => void;
  onMoveDown: (nodeId: string) => void;
  isLocked?: boolean;
}

export default function NodeContextMenu({
  nodeId,
  children,
  onEdit,
  onDelete,
  onDuplicate,
  onLock,
  onMoveUp,
  onMoveDown,
  isLocked = false,
}: NodeContextMenuProps) {
  const handleEdit = useCallback(() => {
    onEdit(nodeId);
  }, [nodeId, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(nodeId);
  }, [nodeId, onDelete]);

  const handleDuplicate = useCallback(() => {
    onDuplicate(nodeId);
  }, [nodeId, onDuplicate]);

  const handleLockToggle = useCallback(() => {
    onLock(nodeId, !isLocked);
  }, [nodeId, isLocked, onLock]);

  const handleMoveUp = useCallback(() => {
    onMoveUp(nodeId);
  }, [nodeId, onMoveUp]);

  const handleMoveDown = useCallback(() => {
    onMoveDown(nodeId);
  }, [nodeId, onMoveDown]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem onClick={handleEdit} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit Properties</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleLockToggle} className="cursor-pointer">
          {isLocked ? (
            <>
              <Unlock className="mr-2 h-4 w-4" />
              <span>Unlock Node</span>
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              <span>Lock Node</span>
            </>
          )}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDuplicate} className="cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleMoveUp} className="cursor-pointer">
          <ChevronUp className="mr-2 h-4 w-4" />
          <span>Move Up</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleMoveDown} className="cursor-pointer">
          <ChevronDown className="mr-2 h-4 w-4" />
          <span>Move Down</span>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={handleDelete}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}