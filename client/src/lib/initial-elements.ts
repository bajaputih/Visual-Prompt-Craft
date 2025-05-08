import { FlowElements, NodeType } from "@shared/schema";

// Default elements for a new prompt
export const initialElements: FlowElements = {
  nodes: [
    {
      id: "1",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 100 },
      data: { 
        label: "User Input", 
        description: "Provide a text to summarize" 
      }
    },
    {
      id: "2",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 400, y: 100 },
      data: { 
        label: "Text Analysis", 
        description: "Extract key information"
      }
    },
    {
      id: "3",
      type: "PROCESS" as keyof typeof NodeType,
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
      type: "OUTPUT" as keyof typeof NodeType,
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
  },
  contentCreation: {
    name: "Content Creation",
    description: "Generate professional blog posts and articles",
    category: "Content Creation",
    elements: {
      nodes: [
        {
          id: "1",
          type: NodeType.INPUT,
          position: { x: 100, y: 100 },
          data: { 
            label: "Topic", 
            description: "Main subject of the content" 
          }
        },
        {
          id: "2",
          type: NodeType.INPUT,
          position: { x: 100, y: 250 },
          data: { 
            label: "Keywords", 
            description: "Important terms to include" 
          }
        },
        {
          id: "3",
          type: NodeType.PROCESS,
          position: { x: 350, y: 100 },
          data: { 
            label: "Outline Creation", 
            description: "Create content structure",
            parameters: {
              sections: "3-5"
            },
            template: "Create an outline for a blog post about {{Topic}} that includes {{Keywords}}. The outline should have {{sections}} main sections."
          }
        },
        {
          id: "4",
          type: NodeType.PROCESS,
          position: { x: 350, y: 250 },
          data: { 
            label: "Content Expansion", 
            description: "Expand outline into full content",
            parameters: {
              tone: "professional",
              word_count: "800"
            },
            template: "Using the following outline, create a {{word_count}}-word blog post in a {{tone}} tone.\n\nOutline: {{Outline Creation}}"
          }
        },
        {
          id: "5",
          type: NodeType.OUTPUT,
          position: { x: 600, y: 175 },
          data: { 
            label: "Final Content", 
            description: "Complete blog post" 
          }
        }
      ],
      edges: [
        { id: "e1-3", source: "1", target: "3" },
        { id: "e3-4", source: "3", target: "4" },
        { id: "e2-4", source: "2", target: "4" },
        { id: "e4-5", source: "4", target: "5" }
      ]
    }
  },
  sentimentAnalysis: {
    name: "Sentiment Analysis",
    description: "Analyze sentiment and emotions in text",
    category: "Analysis",
    elements: {
      nodes: [
        {
          id: "1",
          type: NodeType.INPUT,
          position: { x: 100, y: 175 },
          data: { 
            label: "Text Input", 
            description: "Text to analyze for sentiment" 
          }
        },
        {
          id: "2",
          type: NodeType.PROCESS,
          position: { x: 350, y: 100 },
          data: { 
            label: "Sentiment Detection", 
            description: "Determine positive/negative sentiment",
            parameters: {},
            template: "Analyze the sentiment of the following text. Rate it on a scale from -5 (very negative) to +5 (very positive). Provide the score and a brief explanation.\n\nText: {{Text Input}}"
          }
        },
        {
          id: "3",
          type: NodeType.PROCESS,
          position: { x: 350, y: 250 },
          data: { 
            label: "Emotion Detection", 
            description: "Identify specific emotions",
            parameters: {},
            template: "Identify the primary emotions present in the following text. List the top 3 emotions and explain why they appear to be present.\n\nText: {{Text Input}}"
          }
        },
        {
          id: "4",
          type: NodeType.FILTER,
          position: { x: 600, y: 175 },
          data: { 
            label: "Sentiment Router", 
            description: "Route based on sentiment score",
            parameters: {
              threshold: "0"
            },
            template: "Based on the sentiment score in {{Sentiment Detection}}, if the score is greater than {{threshold}}, route to 'positive', otherwise route to 'negative'."
          }
        },
        {
          id: "5",
          type: NodeType.OUTPUT,
          position: { x: 850, y: 100 },
          data: { 
            label: "Positive Analysis", 
            description: "Analysis for positive sentiment" 
          }
        },
        {
          id: "6",
          type: NodeType.OUTPUT,
          position: { x: 850, y: 250 },
          data: { 
            label: "Negative Analysis", 
            description: "Analysis for negative sentiment" 
          }
        }
      ],
      edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e1-3", source: "1", target: "3" },
        { id: "e2-4", source: "2", target: "4" },
        { id: "e3-4", source: "3", target: "4" },
        { id: "e4-5", source: "4", target: "5" },
        { id: "e4-6", source: "4", target: "6" }
      ]
    }
  },
  ideaGeneration: {
    name: "Idea Generation",
    description: "Generate creative ideas for various purposes",
    category: "Brainstorming",
    elements: {
      nodes: [
        {
          id: "1",
          type: NodeType.INPUT,
          position: { x: 100, y: 100 },
          data: { 
            label: "Topic Area", 
            description: "Field or domain for ideas" 
          }
        },
        {
          id: "2",
          type: NodeType.INPUT,
          position: { x: 100, y: 250 },
          data: { 
            label: "Constraints", 
            description: "Limitations or requirements" 
          }
        },
        {
          id: "3",
          type: NodeType.PROCESS,
          position: { x: 350, y: 175 },
          data: { 
            label: "Idea Brainstorming", 
            description: "Generate diverse ideas",
            parameters: {
              num_ideas: "10",
              creativity_level: "high"
            },
            template: "Generate {{num_ideas}} creative ideas related to {{Topic Area}} with {{creativity_level}} creativity level. Consider these constraints: {{Constraints}}. For each idea provide a title and a 2-3 sentence description."
          }
        },
        {
          id: "4",
          type: NodeType.PROCESS,
          position: { x: 600, y: 175 },
          data: { 
            label: "Idea Refinement", 
            description: "Improve and detail ideas",
            parameters: {
              top_ideas: "3"
            },
            template: "Select the top {{top_ideas}} most promising ideas from the following list and expand them with more details, potential implementation steps, and possible challenges to overcome:\n\nIdeas: {{Idea Brainstorming}}"
          }
        },
        {
          id: "5",
          type: NodeType.OUTPUT,
          position: { x: 850, y: 175 },
          data: { 
            label: "Final Ideas", 
            description: "Refined creative proposals" 
          }
        }
      ],
      edges: [
        { id: "e1-3", source: "1", target: "3" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e3-4", source: "3", target: "4" },
        { id: "e4-5", source: "4", target: "5" }
      ]
    }
  }
};
