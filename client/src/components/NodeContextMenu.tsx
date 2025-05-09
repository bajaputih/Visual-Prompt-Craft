import { 
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator, 
} from "@/components/ui/context-menu";
import { Lock, Unlock, ChevronUp, ChevronDown, Copy, Trash, Pencil } from "lucide-react";

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
  isLocked = false
}: NodeContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem 
          onClick={() => onEdit(nodeId)} 
          disabled={isLocked}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4 text-muted-foreground" /> Edit Node
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => onDuplicate(nodeId)}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4 text-muted-foreground" /> Duplicate
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          onClick={() => onMoveUp(nodeId)}
          disabled={isLocked}
          className="flex items-center gap-2"
        >
          <ChevronUp className="h-4 w-4 text-muted-foreground" /> Move Up
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => onMoveDown(nodeId)}
          disabled={isLocked}
          className="flex items-center gap-2"
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" /> Move Down
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          onClick={() => onLock(nodeId, !isLocked)}
          className="flex items-center gap-2"
        >
          {isLocked ? (
            <>
              <Unlock className="h-4 w-4 text-muted-foreground" /> Unlock
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-muted-foreground" /> Lock
            </>
          )}
        </ContextMenuItem>
        
        <ContextMenuSeparator />
        
        <ContextMenuItem 
          onClick={() => onDelete(nodeId)}
          disabled={isLocked}
          className="flex items-center gap-2 text-destructive focus:text-destructive"
        >
          <Trash className="h-4 w-4" /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}