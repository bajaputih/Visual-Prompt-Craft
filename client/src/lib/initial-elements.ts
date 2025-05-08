import { FlowElements, NodeType } from "@shared/schema";
import {
  sqlQueryGenerator,
  dataVisualization,
  statisticalAnalysis,
  uiDesignSystem,
  uxFlowDesigner,
  seoArticleGenerator,
  socialMediaContent,
  emailSequence
} from "./template-presets";

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
  architectureDesign: {
    name: "Software Architecture Designer",
    description: "Designs software architecture for new projects",
    category: "Development",
    elements: {
      nodes: [
        {
          id: "1",
          type: "INPUT" as keyof typeof NodeType,
          position: { x: 100, y: 100 },
          data: { 
            label: "Project Requirements", 
            description: "Functional and non-functional requirements" 
          }
        },
        {
          id: "2",
          type: "INPUT" as keyof typeof NodeType,
          position: { x: 100, y: 250 },
          data: { 
            label: "Technology Constraints", 
            description: "Tech stack limitations or preferences" 
          }
        },
        {
          id: "3",
          type: "PROCESS" as keyof typeof NodeType,
          position: { x: 350, y: 100 },
          data: { 
            label: "System Design", 
            description: "High-level architecture design",
            parameters: {
              architecture_type: "microservices",
              scalability: "high"
            },
            template: "Design a {{architecture_type}} architecture for a system with {{scalability}} scalability based on the following requirements and constraints. Include component diagrams, data flow, and technology choices.\n\nRequirements:\n{{Project Requirements}}\n\nTechnology Constraints:\n{{Technology Constraints}}"
          }
        },
        {
          id: "4",
          type: "PROCESS" as keyof typeof NodeType,
          position: { x: 350, y: 250 },
          data: { 
            label: "Component Specification", 
            description: "Detailed component design",
            parameters: {
              detail_level: "high"
            },
            template: "Based on the system design, provide {{detail_level === 'high' ? 'detailed' : 'basic'}} specifications for each component. Include interfaces, dependencies, data models, and implementation guidelines.\n\nSystem Design:\n{{System Design}}"
          }
        },
        {
          id: "5",
          type: "PROCESS" as keyof typeof NodeType,
          position: { x: 600, y: 100 },
          data: { 
            label: "Implementation Plan", 
            description: "Development roadmap",
            parameters: {
              timeline: "3 months"
            },
            template: "Create an implementation plan and roadmap for developing this architecture over a {{timeline}} period. Include phases, key milestones, and resource allocation suggestions.\n\nArchitecture:\n{{System Design}}\n\nComponent Details:\n{{Component Specification}}"
          }
        },
        {
          id: "6",
          type: "OUTPUT" as keyof typeof NodeType,
          position: { x: 600, y: 250 },
          data: { 
            label: "Architecture Document", 
            description: "Complete architecture specification" 
          }
        }
      ],
      edges: [
        { id: "e1-3", source: "1", target: "3" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e3-4", source: "3", target: "4" },
        { id: "e3-5", source: "3", target: "5" },
        { id: "e4-5", source: "4", target: "5" },
        { id: "e5-6", source: "5", target: "6" }
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
  },
  
  // Data Analysis Templates
  sqlQueryGen: {
    name: "SQL Query Generator",
    description: "Generates optimized SQL queries from business questions",
    category: "Data Analysis",
    elements: sqlQueryGenerator
  },
  
  dataViz: {
    name: "Data Visualization Recommender",
    description: "Recommends appropriate data visualizations",
    category: "Data Analysis",
    elements: dataVisualization
  },
  
  statsAnalysis: {
    name: "Statistical Analysis Helper",
    description: "Helps select and implement statistical methods",
    category: "Data Analysis",
    elements: statisticalAnalysis
  },
  
  // Design Templates
  designSystem: {
    name: "UI Design System Creator",
    description: "Creates comprehensive design systems",
    category: "Design",
    elements: uiDesignSystem
  },
  
  uxFlow: {
    name: "UX Flow Designer",
    description: "Designs user experience flows and screens",
    category: "Design",
    elements: uxFlowDesigner
  },
  
  // Content Writing Templates
  seoArticle: {
    name: "SEO Article Generator",
    description: "Creates SEO-optimized articles",
    category: "Content Creation",
    elements: seoArticleGenerator
  },
  
  socialMedia: {
    name: "Social Media Content Calendar",
    description: "Creates multi-platform social media content",
    category: "Content Creation",
    elements: socialMediaContent
  },
  
  emailCampaign: {
    name: "Email Sequence Creator",
    description: "Creates email marketing sequences",
    category: "Content Creation", 
    elements: emailSequence
  }
};
