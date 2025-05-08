import { useCallback } from "react";
import { NodeType } from "@shared/schema";

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string, nodeName: string, description: string) => void;
}

export default function NodePalette({ onDragStart }: NodePaletteProps) {
  const handleDragStart = useCallback(
    (event: React.DragEvent, nodeType: string, nodeName: string, description: string) => {
      onDragStart(event, nodeType, nodeName, description);
      
      // Add dragging class to the dragged element
      if (event.currentTarget instanceof HTMLElement) {
        event.currentTarget.classList.add('dragging');
        
        // Remove class after drag operation ends
        const handleDragEnd = () => {
          event.currentTarget.classList.remove('dragging');
          event.currentTarget.removeEventListener('dragend', handleDragEnd);
        };
        
        event.currentTarget.addEventListener('dragend', handleDragEnd);
      }
    },
    [onDragStart]
  );

  return (
    <div className="w-60 bg-card border-r border-border overflow-y-auto p-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        المكونات
      </h3>

      <div className="space-y-3">
        <div
          className="node-palette-item node-input bg-primary/5 border border-primary/20"
          draggable
          onDragStart={(e) => 
            handleDragStart(e, NodeType.INPUT, "إدخال المستخدم", "طلب المستخدم الأولي")
          }
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
            <div className="text-sm font-medium">إدخال المستخدم</div>
          </div>
          <div className="text-xs text-muted-foreground pr-4">طلب المستخدم الأولي</div>
        </div>
        
        <div
          className="node-palette-item node-process bg-success/5 border border-success/20"
          draggable
          onDragStart={(e) => 
            handleDragStart(e, NodeType.PROCESS, "معالجة", "تحويل أو تعديل النص")
          }
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2.5 w-2.5 rounded-full bg-success"></div>
            <div className="text-sm font-medium">معالجة</div>
          </div>
          <div className="text-xs text-muted-foreground pr-4">تحويل أو تعديل النص</div>
        </div>
        
        <div
          className="node-palette-item node-filter bg-warning/5 border border-warning/20"
          draggable
          onDragStart={(e) => 
            handleDragStart(e, NodeType.FILTER, "فلترة", "إزالة المحتوى غير المرغوب فيه")
          }
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2.5 w-2.5 rounded-full bg-warning"></div>
            <div className="text-sm font-medium">فلترة</div>
          </div>
          <div className="text-xs text-muted-foreground pr-4">إزالة المحتوى غير المرغوب</div>
        </div>
        
        <div
          className="node-palette-item node-condition bg-info/5 border border-info/20"
          draggable
          onDragStart={(e) => 
            handleDragStart(e, NodeType.CONDITION, "شرط", "التفرع بناءً على المحتوى")
          }
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2.5 w-2.5 rounded-full bg-info"></div>
            <div className="text-sm font-medium">شرط</div>
          </div>
          <div className="text-xs text-muted-foreground pr-4">التفرع بناءً على المحتوى</div>
        </div>
        
        <div
          className="node-palette-item node-output bg-accent/5 border border-accent/20"
          draggable
          onDragStart={(e) => 
            handleDragStart(e, NodeType.OUTPUT, "إخراج", "الاستجابة النهائية")
          }
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2.5 w-2.5 rounded-full bg-accent"></div>
            <div className="text-sm font-medium">إخراج</div>
          </div>
          <div className="text-xs text-muted-foreground pr-4">الاستجابة النهائية</div>
        </div>
      </div>
      
      <div className="pt-4 mt-4 border-t border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          القوالب
        </h3>
        <div className="space-y-3">
          <div className="node-palette-item bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-sm font-medium">تلخيص النص</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 mr-6">تدفق تلخيص النص</div>
          </div>
          
          <div className="node-palette-item bg-gradient-to-r from-info/5 to-success/5 border border-info/20">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm font-medium">سلسلة سؤال وجواب</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 mr-6">الإجابة على الأسئلة</div>
          </div>
          
          <div className="node-palette-item bg-gradient-to-r from-warning/5 to-destructive/5 border border-warning/20">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <div className="text-sm font-medium">توليد محتوى إبداعي</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 mr-6">إنشاء محتوى فريد</div>
          </div>
        </div>
      </div>
    </div>
  );
}
