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
  // Basic Templates
  summarization: {
    name: "Text Summarization",
    description: "Summarizes text content efficiently",
    category: "Content Creation",
    elements: initialElements
  },
  
  // Developer specific templates
  codeReview: {
    name: "Code Review Assistant",
    description: "Helps with code review and suggestions",
    category: "Development",
    elements: {
      nodes: [
        {
          id: "1",
          type: "INPUT" as keyof typeof NodeType,
          position: { x: 100, y: 100 },
          data: { 
            label: "Code Input", 
            description: "Paste code to review" 
          }
        },
        {
          id: "2",
          type: "INPUT" as keyof typeof NodeType,
          position: { x: 100, y: 250 },
          data: { 
            label: "Requirements", 
            description: "Project requirements or context" 
          }
        },
        {
          id: "3",
          type: "PROCESS" as keyof typeof NodeType,
          position: { x: 350, y: 100 },
          data: { 
            label: "Code Analysis", 
            description: "Check for bugs and issues",
            parameters: {
              lang: "javascript"
            },
            template: "Analyze the following {{lang}} code for bugs, code quality issues, and potential improvements. Identify any security vulnerabilities or performance issues.\n\nCode:\n```{{lang}}\n{{Code Input}}\n```\n\nRequirements:\n{{Requirements}}"
          }
        },
        {
          id: "4",
          type: "PROCESS" as keyof typeof NodeType,
          position: { x: 350, y: 250 },
          data: { 
            label: "Best Practices", 
            description: "Recommend best practices",
            parameters: {
              style_guide: "airbnb"
            },
            template: "Review the code according to {{style_guide}} style guide and suggest improvements with examples.\n\nCode Analysis:\n{{Code Analysis}}"
          }
        },
        {
          id: "5",
          type: "OUTPUT" as keyof typeof NodeType,
          position: { x: 600, y: 175 },
          data: { 
            label: "Review Results", 
            description: "Complete code review report" 
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
  },
  
  debugHelper: {
    name: "Debugging Assistant",
    description: "Helps analyze and fix code bugs",
    category: "Development",
    elements: {
      nodes: [
        {
          id: "1",
          type: "INPUT" as keyof typeof NodeType,
          position: { x: 100, y: 100 },
          data: { 
            label: "Buggy Code", 
            description: "Code that isn't working properly" 
          }
        },
        {
          id: "2",
          type: "INPUT" as keyof typeof NodeType,
          position: { x: 100, y: 250 },
          data: { 
            label: "Error Messages", 
            description: "Stack traces or error outputs" 
          }
        },
        {
          id: "3",
          type: "PROCESS" as keyof typeof NodeType,
          position: { x: 350, y: 100 },
          data: { 
            label: "Bug Analysis", 
            description: "Analyze root causes",
            parameters: {
              language: "javascript"
            },
            template: "Analyze the following {{language}} code and error messages to identify the root cause of the bug. Explain what is happening and why it's occurring.\n\nCode:\n```{{language}}\n{{Buggy Code}}\n```\n\nError Messages:\n```\n{{Error Messages}}\n```"
          }
        },
        {
          id: "4",
          type: "PROCESS" as keyof typeof NodeType,
          position: { x: 350, y: 250 },
          data: { 
            label: "Solution Generation", 
            description: "Generate fix options",
            parameters: {
              detailed: "yes"
            },
            template: "Based on the bug analysis, provide {{detailed === 'yes' ? 'detailed' : 'concise'}} solutions to fix the issue. Include sample code and explanations for each approach.\n\nBug Analysis:\n{{Bug Analysis}}"
          }
        },
        {
          id: "5",
          type: "OUTPUT" as keyof typeof NodeType,
          position: { x: 600, y: 175 },
          data: { 
            label: "Debug Solution", 
            description: "Complete debugging solution" 
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
  },
  
  apiDesign: {
    name: "API Design Helper",
    description: "Assists with designing robust RESTful APIs",
    category: "Development",
    elements: {
      nodes: [
        {
          id: "1",
          type: "INPUT" as keyof typeof NodeType,
          position: { x: 100, y: 100 },
          data: { 
            label: "Domain Model", 
            description: "Key entities and relationships" 
          }
        },
        {
          id: "2",
          type: "INPUT" as keyof typeof NodeType,
          position: { x: 100, y: 250 },
          data: { 
            label: "Requirements", 
            description: "API requirements and constraints" 
          }
        },
        {
          id: "3",
          type: "PROCESS" as keyof typeof NodeType,
          position: { x: 350, y: 100 },
          data: { 
            label: "Endpoint Design", 
            description: "Generate RESTful endpoints",
            parameters: {
              version: "v1",
              style: "RESTful"
            },
            template: "Design a {{style}} API (version {{version}}) based on the following domain model and requirements. Include detailed endpoints, HTTP methods, URL structures, request/response examples, and status codes.\n\nDomain Model:\n{{Domain Model}}\n\nRequirements:\n{{Requirements}}"
          }
        },
        {
          id: "4",
          type: "PROCESS" as keyof typeof NodeType,
          position: { x: 350, y: 250 },
          data: { 
            label: "Schema Generation", 
            description: "Create OpenAPI schema",
            parameters: {
              format: "OpenAPI 3.0"
            },
            template: "Convert the following API design into a {{format}} schema definition. Include all endpoints, data models, parameters, and responses.\n\nAPI Design:\n{{Endpoint Design}}"
          }
        },
        {
          id: "5",
          type: "OUTPUT" as keyof typeof NodeType,
          position: { x: 600, y: 175 },
          data: { 
            label: "API Documentation", 
            description: "Complete API documentation" 
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
  },
  
  // Customer Support Templates
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
  
  // Content Creation Templates
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
  
  // Analysis Templates
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
  
  // Data Analysis Templates
  dataAnalysis: {
    name: "Data Analysis",
    description: "Analyze and interpret data sets",
    category: "Data Analysis",
    elements: {
      nodes: [
        {
          id: "1",
          type: NodeType.INPUT,
          position: { x: 100, y: 100 },
          data: { 
            label: "Data Input", 
            description: "Dataset to analyze" 
          }
        },
        {
          id: "2",
          type: NodeType.INPUT,
          position: { x: 100, y: 250 },
          data: { 
            label: "Analysis Requirements", 
            description: "What insights are needed" 
          }
        },
        {
          id: "3",
          type: NodeType.PROCESS,
          position: { x: 350, y: 100 },
          data: { 
            label: "Data Cleaning", 
            description: "Clean and prepare data",
            parameters: {
              handle_missing: "impute"
            },
            template: "Clean the following dataset. Handle missing values by {{handle_missing}}. Remove outliers if necessary. Format the data for analysis.\n\nData:\n{{Data Input}}"
          }
        },
        {
          id: "4",
          type: NodeType.PROCESS,
          position: { x: 350, y: 250 },
          data: { 
            label: "Statistical Analysis", 
            description: "Run statistical tests",
            parameters: {
              test_type: "correlation"
            },
            template: "Perform {{test_type}} analysis on the cleaned data. Calculate relevant statistics and explain their significance.\n\nCleaned Data:\n{{Data Cleaning}}\n\nAnalysis Requirements:\n{{Analysis Requirements}}"
          }
        },
        {
          id: "5",
          type: NodeType.PROCESS,
          position: { x: 600, y: 175 },
          data: { 
            label: "Insight Generation", 
            description: "Extract meaningful insights",
            parameters: {
              max_insights: "5"
            },
            template: "Based on the statistical analysis, generate up to {{max_insights}} key insights. Explain each insight and its business implications.\n\nStatistical Analysis:\n{{Statistical Analysis}}"
          }
        },
        {
          id: "6",
          type: NodeType.OUTPUT,
          position: { x: 850, y: 175 },
          data: { 
            label: "Analysis Report", 
            description: "Complete analysis with insights" 
          }
        }
      ],
      edges: [
        { id: "e1-3", source: "1", target: "3" },
        { id: "e3-4", source: "3", target: "4" },
        { id: "e2-4", source: "2", target: "4" },
        { id: "e4-5", source: "4", target: "5" },
        { id: "e5-6", source: "5", target: "6" }
      ]
    }
  },
  
  // Design Templates
  uiDesigner: {
    name: "UI Component Designer",
    description: "Design consistent UI components",
    category: "Design",
    elements: {
      nodes: [
        {
          id: "1",
          type: NodeType.INPUT,
          position: { x: 100, y: 100 },
          data: { 
            label: "Brand Guidelines", 
            description: "Brand colors, typography, etc." 
          }
        },
        {
          id: "2",
          type: NodeType.INPUT,
          position: { x: 100, y: 250 },
          data: { 
            label: "Component Requirements", 
            description: "Components needed for design system" 
          }
        },
        {
          id: "3",
          type: NodeType.PROCESS,
          position: { x: 350, y: 100 },
          data: { 
            label: "Design System Definition", 
            description: "Define design tokens",
            parameters: {
              format: "tailwind"
            },
            template: "Based on the brand guidelines, define a design system using {{format}} format. Include color palette, typography scale, spacing system, and other necessary design tokens.\n\nBrand Guidelines:\n{{Brand Guidelines}}"
          }
        },
        {
          id: "4",
          type: NodeType.PROCESS,
          position: { x: 350, y: 250 },
          data: { 
            label: "Component Design", 
            description: "Create component specifications",
            parameters: {
              include_variants: "yes",
              framework: "React"
            },
            template: "Design the following UI components based on the design system. For each component, include states, variants, and responsive behavior. Format for {{framework}} implementation.\n\nDesign System:\n{{Design System Definition}}\n\nComponents to Design:\n{{Component Requirements}}"
          }
        },
        {
          id: "5",
          type: NodeType.OUTPUT,
          position: { x: 600, y: 175 },
          data: { 
            label: "Design Documentation", 
            description: "Complete component documentation" 
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
  }
};