import { Request, Response } from 'express';
import OpenAI from 'openai';
import { FlowElements, NodeType, FlowNode, FlowEdge } from '@shared/schema';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = 'gpt-4o';

// Initialize OpenAI client (only if API key is available)
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.warn('Failed to initialize OpenAI client:', error);
}

/**
 * Generates a final prompt from the flow elements
 */
function generatePromptFromFlow(elements: FlowElements): string {
  // Start with input nodes
  const inputNodes = elements.nodes.filter(node => node.type === 'INPUT' || node.type === 'input');
  const processNodes = elements.nodes.filter(node => node.type === 'PROCESS' || node.type === 'process');
  const outputNodes = elements.nodes.filter(node => node.type === 'OUTPUT' || node.type === 'output');
  
  // Create a map of node connections
  const connections: Record<string, string[]> = {};
  elements.edges.forEach(edge => {
    if (!connections[edge.source]) {
      connections[edge.source] = [];
    }
    connections[edge.source].push(edge.target);
  });

  // Start building the prompt from input nodes
  let finalPrompt = '';
  
  // Add system instructions
  finalPrompt += "# System Instructions\n\n";
  
  // Process the flow of nodes starting from inputs
  const processedNodes = new Set<string>();
  
  // Process input nodes first
  inputNodes.forEach(node => {
    finalPrompt += `## ${node.data.label}\n${node.data.description || ''}\n\n`;
    processedNodes.add(node.id);
  });
  
  // Process all other nodes in order of connections
  processNodes.forEach(node => {
    if (!processedNodes.has(node.id)) {
      const template = node.data.template || `Process: ${node.data.label}\n${node.data.description || ''}`;
      finalPrompt += `## ${node.data.label}\n${template}\n\n`;
      processedNodes.add(node.id);
    }
  });
  
  // Finally add output nodes
  outputNodes.forEach(node => {
    if (!processedNodes.has(node.id)) {
      finalPrompt += `## ${node.data.label}\n${node.data.description || 'Provide the final output here.'}\n\n`;
      processedNodes.add(node.id);
    }
  });
  
  return finalPrompt;
}

/**
 * Executes a prompt designed in the visual editor with OpenAI
 */
export async function executePrompt(req: Request, res: Response) {
  try {
    const { elements, userInputs = {}, model = DEFAULT_MODEL } = req.body;
    
    if (!elements || !elements.nodes || !elements.edges) {
      return res.status(400).json({ error: 'Missing or invalid flow elements' });
    }
    
    // Generate the prompt from flow elements
    let prompt = generatePromptFromFlow(elements);
    
    // Replace variables in the prompt with user inputs
    Object.entries(userInputs).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
    });
    
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || !openai) {
      return res.status(401).json({ 
        error: 'OpenAI API key not configured', 
        prompt: prompt,
        missingKey: true
      });
    }
    
    try {
      // Execute the prompt with OpenAI
      const completion = await openai!.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that follows instructions precisely.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });
      
      // Return the result
      res.json({
        result: completion.choices[0].message.content,
        prompt: prompt,
        model: model,
        usage: completion.usage
      });
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      return res.status(500).json({
        error: apiError instanceof Error ? apiError.message : 'Error calling OpenAI API',
        prompt: prompt
      });
    }
    
  } catch (error) {
    console.error('Error executing prompt:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error executing prompt',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

/**
 * Imports conversation history from ChatGPT/Claude and converts it to a flow
 */
export async function importConversation(req: Request, res: Response) {
  try {
    const { conversation, source = 'chatgpt' } = req.body;
    
    if (!conversation) {
      return res.status(400).json({ error: 'Missing conversation data' });
    }
    
    // Parse the conversation based on its source (ChatGPT, Claude, etc.)
    let parsedMessages;
    
    if (source === 'chatgpt') {
      parsedMessages = parseOpenAIConversation(conversation);
    } else if (source === 'claude') {
      parsedMessages = parseClaudeConversation(conversation);
    } else {
      return res.status(400).json({ error: 'Unsupported conversation source' });
    }
    
    // Convert the parsed messages to flow elements
    const flowElements = convertMessagesToFlow(parsedMessages);
    
    res.json({
      elements: flowElements,
      messageCount: parsedMessages.length
    });
    
  } catch (error) {
    console.error('Error importing conversation:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error importing conversation'
    });
  }
}

interface Message {
  role: string;
  content: string;
}

/**
 * Parse a conversation from OpenAI/ChatGPT
 */
function parseOpenAIConversation(conversation: any): Message[] {
  // Handle different formats from ChatGPT export
  if (Array.isArray(conversation)) {
    // Already in messages format
    return conversation;
  } else if (typeof conversation === 'string') {
    // Text format - try to parse
    const messages: Message[] = [];
    const lines = conversation.split('\n');
    let currentRole = '';
    let currentContent = '';
    
    lines.forEach(line => {
      if (line.startsWith('User: ')) {
        // Save previous message if exists
        if (currentRole) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = 'user';
        currentContent = line.replace('User: ', '');
      } else if (line.startsWith('Assistant: ')) {
        // Save previous message if exists
        if (currentRole) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = 'assistant';
        currentContent = line.replace('Assistant: ', '');
      } else {
        // Continue previous message
        currentContent += '\n' + line;
      }
    });
    
    // Add the last message
    if (currentRole) {
      messages.push({ role: currentRole, content: currentContent.trim() });
    }
    
    return messages;
  }
  
  throw new Error('Unsupported ChatGPT conversation format');
}

/**
 * Parse a conversation from Anthropic/Claude
 */
function parseClaudeConversation(conversation: any): Message[] {
  // Handle different formats from Claude export
  if (Array.isArray(conversation)) {
    // Already in messages format
    return conversation.map(msg => ({
      role: msg.role === 'human' ? 'user' : 'assistant',
      content: msg.content
    }));
  } else if (typeof conversation === 'string') {
    // Text format - try to parse
    const messages: Message[] = [];
    const lines = conversation.split('\n');
    let currentRole = '';
    let currentContent = '';
    
    lines.forEach(line => {
      if (line.startsWith('Human: ')) {
        // Save previous message if exists
        if (currentRole) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = 'user';
        currentContent = line.replace('Human: ', '');
      } else if (line.startsWith('Claude: ')) {
        // Save previous message if exists
        if (currentRole) {
          messages.push({ role: currentRole, content: currentContent.trim() });
        }
        currentRole = 'assistant';
        currentContent = line.replace('Claude: ', '');
      } else {
        // Continue previous message
        currentContent += '\n' + line;
      }
    });
    
    // Add the last message
    if (currentRole) {
      messages.push({ role: currentRole, content: currentContent.trim() });
    }
    
    return messages;
  }
  
  throw new Error('Unsupported Claude conversation format');
}

/**
 * Convert messages to flow elements
 */
function convertMessagesToFlow(messages: Message[]): FlowElements {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];
  
  // Start with an initial input node
  nodes.push({
    id: '1',
    type: 'INPUT',
    position: { x: 100, y: 100 },
    data: {
      label: 'User Context',
      description: 'Initial user query or context'
    }
  });
  
  let nodeCount = 1;
  let yPosition = 100;
  
  // Process each message
  messages.forEach((message, index) => {
    nodeCount++;
    yPosition += 150;
    
    if (message.role === 'user') {
      // Create an input node for user messages
      nodes.push({
        id: String(nodeCount),
        type: 'INPUT',
        position: { x: 100, y: yPosition },
        data: {
          label: `User Input ${Math.floor(index / 2) + 1}`,
          description: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : '')
        }
      });
    } else {
      // Create a process node for assistant messages
      nodes.push({
        id: String(nodeCount),
        type: 'PROCESS',
        position: { x: 400, y: yPosition - 75 },
        data: {
          label: `Processing Step ${Math.floor(index / 2) + 1}`,
          description: 'Process the user input',
          template: message.content.substring(0, 150) + (message.content.length > 150 ? '...' : '')
        }
      });
      
      // Connect user input to this process node
      if (index > 0) {
        edges.push({
          id: `e${nodeCount-1}-${nodeCount}`,
          source: String(nodeCount - 1),
          target: String(nodeCount)
        });
      }
    }
  });
  
  // Add final output node
  nodeCount++;
  nodes.push({
    id: String(nodeCount),
    type: 'OUTPUT',
    position: { x: 700, y: yPosition / 2 },
    data: {
      label: 'Final Output',
      description: 'The generated response'
    }
  });
  
  // Connect last process node to output
  edges.push({
    id: `e${nodeCount-1}-${nodeCount}`,
    source: String(nodeCount - 1),
    target: String(nodeCount)
  });
  
  return { nodes, edges };
}