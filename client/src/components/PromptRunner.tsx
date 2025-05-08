import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, PlayCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { customApiRequest } from '@/lib/customApiRequest';
import { FlowElements } from '@shared/schema';
import { askSecrets } from './utils/askSecrets';

interface PromptRunnerProps {
  isOpen: boolean;
  onClose: () => void;
  elements: FlowElements;
}

export default function PromptRunner({ isOpen, onClose, elements }: PromptRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState('');
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  const inputVariables = findInputVariables(elements);
  
  // Handle user input changes
  const handleInputChange = (key: string, value: string) => {
    setUserInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Reset the component state
  const handleClose = () => {
    setResult('');
    setIsRunning(false);
    onClose();
  };
  
  // Run the prompt with OpenAI
  const runPrompt = async () => {
    try {
      setIsRunning(true);
      setResult('');
      
      const response = await customApiRequest('/api/execute-prompt', {
        method: 'POST',
        body: {
          elements,
          userInputs,
          model: 'gpt-4o' // Use the latest model
        },
      });
      
      if (response.error && response.missingKey) {
        // Prompt user to set up their API key
        toast({
          title: "API Key Missing",
          description: "You need to set up your OpenAI API key to use this feature.",
          variant: "destructive"
        });
        
        // Ask for the API key
        askSecrets(['OPENAI_API_KEY']);
        setIsRunning(false);
        return;
      }
      
      if (!response.result) {
        throw new Error('No result returned from the API');
      }
      
      setResult(response.result);
    } catch (error) {
      console.error('Error running prompt:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to run prompt",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Run Prompt
          </DialogTitle>
        </DialogHeader>
        
        {inputVariables.length > 0 && (
          <div className="space-y-4 my-4">
            <h3 className="text-lg font-medium">Input Variables</h3>
            <p className="text-sm text-muted-foreground">
              Fill in the values for the variables used in your prompt.
            </p>
            
            <div className="grid gap-4">
              {inputVariables.map((variable) => (
                <div key={variable} className="grid gap-2">
                  <Label htmlFor={variable}>{variable}</Label>
                  <Input
                    id={variable}
                    value={userInputs[variable] || ''}
                    onChange={(e) => handleInputChange(variable, e.target.value)}
                    placeholder={`Enter value for ${variable}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <h3 className="text-lg font-medium">Result</h3>
            {isRunning ? (
              <div className="min-h-[200px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : result ? (
              <Card>
                <CardContent className="p-4">
                  <Textarea
                    value={result}
                    readOnly
                    className="min-h-[200px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Run the prompt to see the result here.</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isRunning}>
            Cancel
          </Button>
          <Button onClick={runPrompt} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              'Run Prompt'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to find input variables in the prompt (format: {{variable}})
function findInputVariables(elements: FlowElements): string[] {
  const variables = new Set<string>();
  
  // Look for variables in node descriptions and templates
  elements.nodes.forEach(node => {
    const description = node.data.description || '';
    const template = node.data.template || '';
    
    // Find all matches for {{variableName}}
    const regex = /{{([^}]+)}}/g;
    let match;
    
    while ((match = regex.exec(description)) !== null) {
      variables.add(match[1]);
    }
    
    while ((match = regex.exec(template)) !== null) {
      variables.add(match[1]);
    }
  });
  
  return Array.from(variables);
}