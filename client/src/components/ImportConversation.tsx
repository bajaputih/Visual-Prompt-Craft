import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileInput, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { customApiRequest } from '@/lib/customApiRequest';
import { FlowElements } from '@shared/schema';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ImportConversationProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (elements: FlowElements) => void;
}

export default function ImportConversation({ isOpen, onClose, onImport }: ImportConversationProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [conversation, setConversation] = useState('');
  const [source, setSource] = useState<'chatgpt' | 'claude'>('chatgpt');
  const [activeTab, setActiveTab] = useState<string>('paste');
  const { toast } = useToast();
  
  // Reset the component state
  const handleClose = () => {
    setConversation('');
    setIsImporting(false);
    onClose();
  };
  
  // Import the conversation
  const importConversation = async () => {
    if (!conversation.trim()) {
      toast({
        title: "Error",
        description: "Please enter a conversation to import",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsImporting(true);
      
      const response = await customApiRequest('/api/import-conversation', {
        method: 'POST',
        body: {
          conversation,
          source
        },
      });
      
      if (!response.elements) {
        throw new Error('No flow elements returned from the API');
      }
      
      // Pass the imported elements to the parent component
      onImport(response.elements);
      
      toast({
        title: "Success",
        description: `Imported ${response.messageCount} messages successfully`,
        variant: "default"
      });
      
      handleClose();
    } catch (error) {
      console.error('Error importing conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import conversation",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setConversation(content);
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: "Error",
          description: "Failed to read the file",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Import Conversation
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Conversation Source</Label>
            <RadioGroup
              defaultValue={source}
              onValueChange={(value) => setSource(value as 'chatgpt' | 'claude')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="chatgpt" id="chatgpt" />
                <Label htmlFor="chatgpt">ChatGPT</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="claude" id="claude" />
                <Label htmlFor="claude">Claude</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Tabs defaultValue="paste" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste">Paste Text</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="paste" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="conversation">Conversation Text</Label>
                <Textarea
                  id="conversation"
                  placeholder={`Paste your ${source === 'chatgpt' ? 'ChatGPT' : 'Claude'} conversation here...`}
                  className="min-h-[200px]"
                  value={conversation}
                  onChange={(e) => setConversation(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Upload Conversation File</Label>
                <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-6">
                  <div className="text-center space-y-2">
                    <FileInput className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drag and drop your conversation file or click to browse
                    </p>
                    <input
                      type="file"
                      id="file"
                      accept=".txt,.json"
                      className="sr-only"
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('file')?.click()}
                    >
                      Select File
                    </Button>
                  </div>
                </div>
                {conversation && (
                  <p className="text-sm text-muted-foreground">
                    File loaded: {conversation.length} characters
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-sm text-muted-foreground">
            <p>Format Tips:</p>
            <ul className="list-disc list-inside pl-2">
              <li>For ChatGPT, include "User:" and "Assistant:" prefixes</li>
              <li>For Claude, include "Human:" and "Claude:" prefixes</li>
              <li>Each message should be on a new line or separated clearly</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isImporting}>
            Cancel
          </Button>
          <Button onClick={importConversation} disabled={isImporting || !conversation.trim()}>
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              'Import Conversation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}