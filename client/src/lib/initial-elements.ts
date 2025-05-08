import { FlowElements, NodeType } from "@shared/schema";

// Default elements for a new prompt
export const initialElements: FlowElements = {
  nodes: [
    {
      id: "1",
      type: NodeType.INPUT,
      position: { x: 100, y: 100 },
      data: { 
        label: "User Input", 
        description: "Provide a text to summarize" 
      }
    },
    {
      id: "2",
      type: NodeType.PROCESS,
      position: { x: 400, y: 100 },
      data: { 
        label: "Text Analysis", 
        description: "Extract key information"
      }
    },
    {
      id: "3",
      type: NodeType.PROCESS,
      position: { x: 400, y: 250 },
      data: { 
        label: "Summarization", 
        description: "Create concise summary",
        parameters: {
          max_length: "100",
          min_length: "30"
        },
        template: "Summarize the following text in {{max_length}} words or less, but not less than {{min_length}} words:\n\n{{input}}"
      }
    },
    {
      id: "4",
      type: NodeType.OUTPUT,
      position: { x: 100, y: 250 },
      data: { 
        label: "Final Output", 
        description: "Return summarized text" 
      }
    }
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" }
  ]
};

// Templates for new prompts
export const promptTemplates = {
  summarization: {
    name: "Text Summarization",
    description: "Summarizes text content efficiently",
    category: "Content Creation",
    elements: initialElements
  },
  qaChain: {
    name: "Q&A Chain",
    description: "Answer questions based on provided context",
    category: "Customer Support",
    elements: {
      nodes: [
        {
          id: "1",
          type: NodeType.INPUT,
          position: { x: 100, y: 100 },
          data: { 
            label: "Context", 
            description: "Knowledge base information" 
          }
        },
        {
          id: "2",
          type: NodeType.INPUT,
          position: { x: 100, y: 250 },
          data: { 
            label: "Question", 
            description: "User question" 
          }
        },
        {
          id: "3",
          type: NodeType.PROCESS,
          position: { x: 350, y: 175 },
          data: { 
            label: "Answer Generation", 
            description: "Generate answer from context",
            parameters: {
              max_length: "200"
            },
            template: "Based on the following context, answer the question. If the answer cannot be found in the context, say 'I don't have enough information'.\n\nContext: {{Context}}\n\nQuestion: {{Question}}"
          }
        },
        {
          id: "4",
          type: NodeType.OUTPUT,
          position: { x: 600, y: 175 },
          data: { 
            label: "Answer", 
            description: "Response to the question" 
          }
        }
      ],
      edges: [
        { id: "e1-3", source: "1", target: "3" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e3-4", source: "3", target: "4" }
      ]
    }
  }
};
