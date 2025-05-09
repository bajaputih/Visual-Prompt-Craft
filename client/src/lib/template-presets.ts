import { FlowElements, NodeType } from "@shared/schema";

// SQL Query Generator Template
export const sqlQueryGenerator: FlowElements = {
  nodes: [
    {
      id: "1",
      type: NodeType.INPUT,
      position: { x: 100, y: 175 },
      data: { 
        label: "Database Schema", 
        description: "Tables and their relationships" 
      }
    },
    {
      id: "2",
      type: NodeType.INPUT,
      position: { x: 100, y: 325 },
      data: { 
        label: "Query Requirement", 
        description: "What data needs to be retrieved" 
      }
    },
    {
      id: "3",
      type: NodeType.PROCESS,
      position: { x: 350, y: 175 },
      data: { 
        label: "Table Analysis", 
        description: "Identify required tables",
        parameters: {},
        template: "Analyze the database schema and determine which tables and columns are needed to fulfill the query requirement.\n\nDatabase Schema:\n{{Database Schema}}\n\nQuery Requirement:\n{{Query Requirement}}"
      }
    },
    {
      id: "4",
      type: NodeType.PROCESS,
      position: { x: 350, y: 325 },
      data: { 
        label: "Query Construction", 
        description: "Build SQL query",
        parameters: {
          dialect: "PostgreSQL",
          include_explanation: "yes"
        },
        template: "Based on the table analysis, construct a {{dialect}} SQL query that retrieves the required data. {{include_explanation === 'yes' ? 'Include a detailed explanation of the query.\\'s logic and any optimizations made.' : ''}}\n\nTable Analysis:\n{{Table Analysis}}"
      }
    },
    {
      id: "5",
      type: NodeType.OUTPUT,
      position: { x: 600, y: 250 },
      data: { 
        label: "Final SQL Query", 
        description: "Optimized SQL query with explanation" 
      }
    }
  ],
  edges: [
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5" }
  ]
};

// Data Visualization Template
export const dataVisualization: FlowElements = {
  nodes: [
    {
      id: "1",
      type: NodeType.INPUT,
      position: { x: 100, y: 175 },
      data: { 
        label: "Data Description", 
        description: "Dataset structure and variables" 
      }
    },
    {
      id: "2",
      type: NodeType.INPUT,
      position: { x: 100, y: 325 },
      data: { 
        label: "Visualization Goal", 
        description: "What insights to highlight" 
      }
    },
    {
      id: "3",
      type: NodeType.PROCESS,
      position: { x: 350, y: 175 },
      data: { 
        label: "Chart Selection", 
        description: "Determine appropriate chart types",
        parameters: {
          chart_library: "D3.js"
        },
        template: "Based on the data description and visualization goals, recommend the most appropriate chart types to visualize the data effectively using {{chart_library}}.\n\nData Description:\n{{Data Description}}\n\nVisualization Goal:\n{{Visualization Goal}}"
      }
    },
    {
      id: "4",
      type: NodeType.PROCESS,
      position: { x: 350, y: 325 },
      data: { 
        label: "Chart Configuration", 
        description: "Configure chart parameters",
        parameters: {
          color_scheme: "viridis",
          responsive: "true"
        },
        template: "For each recommended chart type, provide detailed configuration including axes, legends, labels, {{color_scheme}} color scheme, and {{responsive === 'true' ? 'responsive design considerations' : 'fixed dimensions'}}.\n\nChart Types:\n{{Chart Selection}}"
      }
    },
    {
      id: "5",
      type: NodeType.OUTPUT,
      position: { x: 600, y: 250 },
      data: { 
        label: "Visualization Guide", 
        description: "Complete visualization instructions" 
      }
    }
  ],
  edges: [
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5" }
  ]
};

// Statistical Analysis Template
export const statisticalAnalysis: FlowElements = {
  nodes: [
    {
      id: "1",
      type: NodeType.INPUT,
      position: { x: 100, y: 175 },
      data: { 
        label: "Data Description", 
        description: "Dataset structure and variables" 
      }
    },
    {
      id: "2",
      type: NodeType.INPUT,
      position: { x: 100, y: 325 },
      data: { 
        label: "Analysis Objective", 
        description: "Research question to answer" 
      }
    },
    {
      id: "3",
      type: NodeType.PROCESS,
      position: { x: 350, y: 175 },
      data: { 
        label: "Statistical Method Selection", 
        description: "Choose appropriate methods",
        parameters: {
          significance_level: "0.05"
        },
        template: "Based on the data description and analysis objective, recommend appropriate statistical methods with a significance level of {{significance_level}}.\n\nData Description:\n{{Data Description}}\n\nAnalysis Objective:\n{{Analysis Objective}}"
      }
    },
    {
      id: "4",
      type: NodeType.PROCESS,
      position: { x: 350, y: 325 },
      data: { 
        label: "Analysis Procedure", 
        description: "Step-by-step analysis plan",
        parameters: {
          software: "R",
          include_code: "yes"
        },
        template: "Provide a detailed analysis procedure using {{software}}. {{include_code === 'yes' ? 'Include sample code for each step.' : ''}} Cover data preparation, statistical tests, and interpretation guidelines.\n\nRecommended Methods:\n{{Statistical Method Selection}}"
      }
    },
    {
      id: "5",
      type: NodeType.OUTPUT,
      position: { x: 600, y: 250 },
      data: { 
        label: "Statistical Analysis Plan", 
        description: "Complete analysis protocol" 
      }
    }
  ],
  edges: [
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5" }
  ]
};

// UI Design System Template
export const uiDesignSystem: FlowElements = {
  nodes: [
    {
      id: "1",
      type: NodeType.INPUT,
      position: { x: 100, y: 175 },
      data: { 
        label: "Brand Identity", 
        description: "Logo, colors, typography, etc." 
      }
    },
    {
      id: "2",
      type: NodeType.INPUT,
      position: { x: 100, y: 325 },
      data: { 
        label: "Application Requirements", 
        description: "User needs and platform details" 
      }
    },
    {
      id: "3",
      type: NodeType.PROCESS,
      position: { x: 350, y: 175 },
      data: { 
        label: "Design Tokens", 
        description: "Core design variables",
        parameters: {
          token_format: "CSS variables"
        },
        template: "Based on the brand identity, define design tokens using {{token_format}} for colors, typography, spacing, shadows, and other fundamental design elements.\n\nBrand Identity:\n{{Brand Identity}}"
      }
    },
    {
      id: "4",
      type: NodeType.PROCESS,
      position: { x: 350, y: 325 },
      data: { 
        label: "Component Library", 
        description: "Reusable UI components",
        parameters: {
          framework: "React",
          accessibility: "WCAG 2.1 AA"
        },
        template: "Design a comprehensive component library for {{framework}} that adheres to {{accessibility}} accessibility standards. Include specifications for each component based on the design tokens.\n\nDesign Tokens:\n{{Design Tokens}}\n\nApplication Requirements:\n{{Application Requirements}}"
      }
    },
    {
      id: "5",
      type: NodeType.OUTPUT,
      position: { x: 600, y: 250 },
      data: { 
        label: "Design System Documentation", 
        description: "Complete design system specifications" 
      }
    }
  ],
  edges: [
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-4", source: "2", target: "4" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5" }
  ]
};

// UX Flow Designer Template
export const uxFlowDesigner: FlowElements = {
  nodes: [
    {
      id: "1",
      type: NodeType.INPUT,
      position: { x: 100, y: 175 },
      data: { 
        label: "User Personas", 
        description: "Target user descriptions" 
      }
    },
    {
      id: "2",
      type: NodeType.INPUT,
      position: { x: 100, y: 325 },
      data: { 
        label: "Task Requirements", 
        description: "What users need to accomplish" 
      }
    },
    {
      id: "3",
      type: NodeType.PROCESS,
      position: { x: 350, y: 175 },
      data: { 
        label: "User Journey Mapping", 
        description: "Flow of user interactions",
        parameters: {
          detail_level: "high"
        },
        template: "Create a {{detail_level === 'high' ? 'detailed' : 'simplified'}} user journey map for the primary personas completing the required tasks. Include touchpoints, user emotions, and potential pain points.\n\nUser Personas:\n{{User Personas}}\n\nTask Requirements:\n{{Task Requirements}}"
      }
    },
    {
      id: "4",
      type: NodeType.PROCESS,
      position: { x: 350, y: 325 },
      data: { 
        label: "Interaction Design", 
        description: "Screen flows and interactions",
        parameters: {
          interaction_pattern: "progressive disclosure",
          include_microcopy: "yes"
        },
        template: "Design the user interaction flow using {{interaction_pattern}} patterns. {{include_microcopy === 'yes' ? 'Include microcopy for key interactions.' : ''}} Detail the screen-to-screen navigation, form interactions, and feedback mechanisms.\n\nUser Journey Map:\n{{User Journey Mapping}}"
      }
    },
    {
      id: "5",
      type: NodeType.OUTPUT,
      position: { x: 600, y: 250 },
      data: { 
        label: "UX Flow Documentation", 
        description: "Complete user experience blueprint" 
      }
    }
  ],
  edges: [
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5" }
  ]
};

// SEO Article Generator Template
export const seoArticleGenerator: FlowElements = {
  nodes: [
    {
      id: "1",
      type: NodeType.INPUT,
      position: { x: 100, y: 175 },
      data: { 
        label: "Target Keywords", 
        description: "Primary and secondary keywords" 
      }
    },
    {
      id: "2",
      type: NodeType.INPUT,
      position: { x: 100, y: 325 },
      data: { 
        label: "Topic Brief", 
        description: "Article topic and audience" 
      }
    },
    {
      id: "3",
      type: NodeType.PROCESS,
      position: { x: 350, y: 175 },
      data: { 
        label: "SEO Content Structure", 
        description: "Outline with keyword mapping",
        parameters: {
          word_count: "1500",
          heading_structure: "H2, H3"
        },
        template: "Create a SEO-optimized outline for a {{word_count}}-word article using {{heading_structure}} headings. Map primary and secondary keywords to specific sections.\n\nTarget Keywords:\n{{Target Keywords}}\n\nTopic Brief:\n{{Topic Brief}}"
      }
    },
    {
      id: "4",
      type: NodeType.PROCESS,
      position: { x: 350, y: 325 },
      data: { 
        label: "Article Generation", 
        description: "Write full SEO article",
        parameters: {
          tone: "informative",
          include_meta: "yes"
        },
        template: "Based on the outline, write a complete SEO-optimized article in an {{tone}} tone. {{include_meta === 'yes' ? 'Include meta title and description.' : ''}} Ensure natural keyword integration and readability.\n\nContent Structure:\n{{SEO Content Structure}}"
      }
    },
    {
      id: "5",
      type: NodeType.OUTPUT,
      position: { x: 600, y: 250 },
      data: { 
        label: "Finished SEO Article", 
        description: "Publication-ready article with meta tags" 
      }
    }
  ],
  edges: [
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5" }
  ]
};

// Social Media Content Template
export const socialMediaContent: FlowElements = {
  nodes: [
    {
      id: "1",
      type: NodeType.INPUT,
      position: { x: 100, y: 175 },
      data: { 
        label: "Brand Voice", 
        description: "Brand personality and tone" 
      }
    },
    {
      id: "2",
      type: NodeType.INPUT,
      position: { x: 100, y: 325 },
      data: { 
        label: "Content Topic", 
        description: "Subject of social media posts" 
      }
    },
    {
      id: "3",
      type: NodeType.PROCESS,
      position: { x: 350, y: 175 },
      data: { 
        label: "Platform Strategy", 
        description: "Platform-specific approaches",
        parameters: {
          platforms: "Instagram, Twitter, LinkedIn"
        },
        template: "Develop a content strategy for {{platforms}} that tailors the content topic to each platform's unique characteristics and audience expectations.\n\nBrand Voice:\n{{Brand Voice}}\n\nContent Topic:\n{{Content Topic}}"
      }
    },
    {
      id: "4",
      type: NodeType.PROCESS,
      position: { x: 350, y: 325 },
      data: { 
        label: "Content Creation", 
        description: "Generate platform-specific content",
        parameters: {
          posts_per_platform: "3",
          include_hashtags: "yes"
        },
        template: "Create {{posts_per_platform}} posts for each platform following the strategy. {{include_hashtags === 'yes' ? 'Include relevant hashtags for each platform.' : ''}} Vary post formats (questions, statements, quotes, etc.) while maintaining brand voice.\n\nPlatform Strategy:\n{{Platform Strategy}}"
      }
    },
    {
      id: "5",
      type: NodeType.OUTPUT,
      position: { x: 600, y: 250 },
      data: { 
        label: "Social Media Package", 
        description: "Ready-to-publish social media content" 
      }
    }
  ],
  edges: [
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5" }
  ]
};

// Email Sequence Template
export const emailSequence: FlowElements = {
  nodes: [
    {
      id: "1",
      type: NodeType.INPUT,
      position: { x: 100, y: 175 },
      data: { 
        label: "Customer Journey Stage", 
        description: "Where recipients are in journey" 
      }
    },
    {
      id: "2",
      type: NodeType.INPUT,
      position: { x: 100, y: 325 },
      data: { 
        label: "Campaign Goal", 
        description: "Desired recipient action" 
      }
    },
    {
      id: "3",
      type: NodeType.PROCESS,
      position: { x: 350, y: 175 },
      data: { 
        label: "Sequence Strategy", 
        description: "Email sequence flow planning",
        parameters: {
          email_count: "5",
          sequence_duration: "14 days"
        },
        template: "Design an email sequence of {{email_count}} emails over {{sequence_duration}} that guides recipients from their current journey stage toward the campaign goal.\n\nCustomer Journey Stage:\n{{Customer Journey Stage}}\n\nCampaign Goal:\n{{Campaign Goal}}"
      }
    },
    {
      id: "4",
      type: NodeType.PROCESS,
      position: { x: 350, y: 325 },
      data: { 
        label: "Email Content Creation", 
        description: "Write each email in sequence",
        parameters: {
          subject_line_style: "curiosity-based",
          include_personalization: "yes"
        },
        template: "Write the complete content for each email in the sequence using {{subject_line_style}} subject lines. {{include_personalization === 'yes' ? 'Include personalization variables and conditional content blocks.' : ''}} Ensure coherent progression through the sequence.\n\nSequence Strategy:\n{{Sequence Strategy}}"
      }
    },
    {
      id: "5",
      type: NodeType.OUTPUT,
      position: { x: 600, y: 250 },
      data: { 
        label: "Complete Email Sequence", 
        description: "Ready-to-implement email campaign" 
      }
    }
  ],
  edges: [
    { id: "e1-3", source: "1", target: "3" },
    { id: "e2-3", source: "2", target: "3" },
    { id: "e3-4", source: "3", target: "4" },
    { id: "e4-5", source: "4", target: "5" }
  ]
};