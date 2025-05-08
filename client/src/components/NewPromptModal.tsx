import { useState, useRef } from "react";
import * as wouter from "wouter";
const { useLocation } = wouter;
import { useMutation } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { type InsertPrompt, FlowElements } from "@shared/schema";
import { Upload, FileUp } from "lucide-react";

interface NewPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewPromptModal({ isOpen, onClose }: NewPromptModalProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = (path: string) => setLocation(path);
  
  const [activeTab, setActiveTab] = useState<string>("create");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const [promptData, setPromptData] = useState<Partial<InsertPrompt>>({
    name: "",
    description: "",
    category: "",
    elements: { nodes: [], edges: [] }
  });

  const createPromptMutation = useMutation({
    mutationFn: async (data: InsertPrompt) => {
      const response = await apiRequest("POST", "/api/prompts", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      toast({
        title: "Success",
        description: "New prompt created successfully!",
      });
      onClose();
      navigate(`/designer/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create prompt: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promptData.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Prompt name is required",
        variant: "destructive",
      });
      return;
    }

    createPromptMutation.mutate({
      name: promptData.name,
      description: promptData.description || "",
      category: promptData.category || "Uncategorized",
      elements: { nodes: [], edges: [] } // Start with empty flow
    } as InsertPrompt);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPromptData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPromptData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setImportFile(files[0]);
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const processImportedFile = async () => {
    if (!importFile) {
      toast({
        title: "Error",
        description: "No file selected for import",
        variant: "destructive",
      });
      return;
    }
    
    setIsImporting(true);
    
    try {
      const fileContents = await importFile.text();
      const importedData = JSON.parse(fileContents);
      
      // Basic validation
      if (!importedData.name || !importedData.elements) {
        throw new Error("الملف المستورد غير صالح أو ينقصه بيانات أساسية");
      }
      
      // Create the imported prompt
      createPromptMutation.mutate({
        name: importedData.name,
        description: importedData.description || "",
        category: importedData.category || "Uncategorized",
        elements: importedData.elements
      } as InsertPrompt);
      
    } catch (error) {
      toast({
        title: "خطأ في الاستيراد",
        description: `فشل استيراد الملف: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إنشاء Prompt جديد</DialogTitle>
          <DialogDescription>
            قم بإنشاء prompt جديد أو استيراده من ملف سابق
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="create">إنشاء جديد</TabsTrigger>
            <TabsTrigger value="import">استيراد</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الـPrompt</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="أدخل اسماً للـprompt"
                    value={promptData.name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">الفئة</Label>
                  <Select 
                    value={promptData.category || ""} 
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر فئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Creative Writing">كتابة إبداعية</SelectItem>
                      <SelectItem value="Data Analysis">تحليل بيانات</SelectItem>
                      <SelectItem value="Customer Support">دعم العملاء</SelectItem>
                      <SelectItem value="Programming">برمجة</SelectItem>
                      <SelectItem value="Other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف (اختياري)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="صِف باختصار ماذا يفعل هذا الـprompt"
                    rows={3}
                    value={promptData.description || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={createPromptMutation.isPending}
                >
                  {createPromptMutation.isPending ? "جارِ الإنشاء..." : "إنشاء Prompt"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-md p-6 text-center space-y-4">
              <FileUp className="h-10 w-10 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">استيراد ملف Prompt</h3>
              <p className="text-sm text-muted-foreground">
                اسحب وأفلت ملف JSON أو انقر لاختيار الملف
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleImportClick}
                className="mt-2"
              >
                <Upload className="mr-2 h-4 w-4" />
                اختر ملفاً
              </Button>
              
              {importFile && (
                <div className="mt-4 text-sm text-left">
                  <p className="font-medium">الملف المختار:</p>
                  <p className="text-muted-foreground">{importFile.name}</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                إلغاء
              </Button>
              <Button
                type="button"
                disabled={!importFile || isImporting || createPromptMutation.isPending}
                onClick={processImportedFile}
              >
                {isImporting || createPromptMutation.isPending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جارِ الاستيراد...
                  </span>
                ) : "استيراد Prompt"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
