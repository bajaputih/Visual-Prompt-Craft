/**
 * Professional prompt templates for different user roles
 */
import { FlowElements, NodeType } from "@shared/schema";

// ===== Data Analysis Templates =====

// SQL Query Generator
export const sqlQueryGenerator: FlowElements = {
  nodes: [
    {
      id: "1",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 100 },
      data: {
        label: "Business Question",
        description: "What question do you want to answer with data?"
      }
    },
    {
      id: "2",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 250 },
      data: {
        label: "Database Schema",
        description: "Describe your tables and relationships"
      }
    },
    {
      id: "3",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 100 },
      data: {
        label: "SQL Generation",
        description: "Generate SQL query",
        parameters: {
          dialect: "PostgreSQL",
          complexity: "medium"
        },
        template: "Based on the following business question and database schema, generate a {{dialect}} SQL query with {{complexity}} complexity level. Include comments explaining the query logic.\n\nBusiness Question: {{Business Question}}\n\nDatabase Schema:\n{{Database Schema}}"
      }
    },
    {
      id: "4",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 250 },
      data: {
        label: "Query Explanation",
        description: "Explain query logic",
        parameters: {
          detail_level: "high"
        },
        template: "Explain the following SQL query in {{detail_level === 'high' ? 'detail' : 'brief'}}. Include why certain joins, filters, and aggregations were chosen.\n\nSQL Query:\n```sql\n{{SQL Generation}}\n```"
      }
    },
    {
      id: "5",
      type: "OUTPUT" as keyof typeof NodeType,
      position: { x: 600, y: 175 },
      data: {
        label: "Final Query",
        description: "SQL query with explanation"
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

// Data Visualization Recommendation
export const dataVisualization: FlowElements = {
  nodes: [
    {
      id: "1",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 100 },
      data: {
        label: "Dataset Description", 
        description: "Describe your dataset (columns, types, etc.)"
      }
    },
    {
      id: "2",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 250 },
      data: {
        label: "Analysis Goal",
        description: "What insights are you looking for?"
      }
    },
    {
      id: "3",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 175 },
      data: {
        label: "Visualization Planning",
        description: "Recommend visualization types",
        parameters: {
          audience: "technical",
          tool: "tableau"
        },
        template: "Based on the following dataset and analysis goals, recommend the most appropriate visualization types. Consider that the audience is {{audience}} and the tool being used is {{tool}}.\n\nDataset Description:\n{{Dataset Description}}\n\nAnalysis Goal:\n{{Analysis Goal}}"
      }
    },
    {
      id: "4",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 600, y: 175 },
      data: {
        label: "Implementation Guide",
        description: "Step-by-step implementation",
        parameters: {
          detail: "high"
        },
        template: "Provide a {{detail === 'high' ? 'detailed' : 'brief'}} implementation guide for creating the recommended visualizations in {{tool}}. Include specific settings, calculated fields if needed, and best practices.\n\nVisualization Recommendations:\n{{Visualization Planning}}"
      }
    },
    {
      id: "5",
      type: "OUTPUT" as keyof typeof NodeType,
      position: { x: 850, y: 175 },
      data: {
        label: "Visualization Plan",
        description: "Complete visualization blueprint"
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

// Statistical Analysis Helper
export const statisticalAnalysis: FlowElements = {
  nodes: [
    {
      id: "1",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 100 },
      data: {
        label: "Data Summary",
        description: "Describe your dataset and variables"
      }
    },
    {
      id: "2",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 250 },
      data: {
        label: "Analysis Objective",
        description: "What do you want to test or analyze?"
      }
    },
    {
      id: "3",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 100 },
      data: {
        label: "Statistical Method Selection",
        description: "Choose appropriate methods",
        parameters: {
          significance: "0.05"
        },
        template: "Based on the data and objective described, recommend the most appropriate statistical analysis methods with significance level of {{significance}}. Justify your recommendations.\n\nData Summary:\n{{Data Summary}}\n\nAnalysis Objective:\n{{Analysis Objective}}"
      }
    },
    {
      id: "4",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 250 },
      data: {
        label: "Implementation Code",
        description: "Generate code for the analysis",
        parameters: {
          language: "python",
          libraries: "scipy, statsmodels"
        },
        template: "Generate {{language}} code using {{libraries}} to implement the recommended statistical methods. Include data preparation, analysis execution, and result interpretation.\n\nRecommended Methods:\n{{Statistical Method Selection}}"
      }
    },
    {
      id: "5",
      type: "OUTPUT" as keyof typeof NodeType,
      position: { x: 600, y: 175 },
      data: {
        label: "Statistical Analysis Plan",
        description: "Complete statistical analysis with code"
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

// ===== Design Templates =====

// UI Design System Creator
export const uiDesignSystem: FlowElements = {
  nodes: [
    {
      id: "1",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 100 },
      data: {
        label: "Brand Identity",
        description: "Brand values, personality, and audience"
      }
    },
    {
      id: "2",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 250 },
      data: {
        label: "Design Requirements",
        description: "Technical requirements and constraints"
      }
    },
    {
      id: "3",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 100 },
      data: {
        label: "Design System Planning",
        description: "Plan core elements",
        parameters: {
          style: "minimalist"
        },
        template: "Create a comprehensive design system plan based on the brand identity and design requirements. Follow a {{style}} aesthetic approach. Include color palette, typography, spacing system, and component principles.\n\nBrand Identity:\n{{Brand Identity}}\n\nDesign Requirements:\n{{Design Requirements}}"
      }
    },
    {
      id: "4",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 250 },
      data: {
        label: "Component Specification",
        description: "Define key components",
        parameters: {
          component_set: "comprehensive"
        },
        template: "Based on the design system plan, create {{component_set === 'comprehensive' ? 'detailed' : 'basic'}} specifications for key UI components. Include buttons, inputs, cards, navigation, modals, and layout components. For each, describe visual properties, states, behavior, and usage guidelines.\n\nDesign System Plan:\n{{Design System Planning}}"
      }
    },
    {
      id: "5",
      type: "OUTPUT" as keyof typeof NodeType,
      position: { x: 600, y: 175 },
      data: {
        label: "Design System Documentation",
        description: "Complete design system specifications"
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

// UX Flow Designer
export const uxFlowDesigner: FlowElements = {
  nodes: [
    {
      id: "1",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 100 },
      data: {
        label: "User Persona",
        description: "Details about the target user"
      }
    },
    {
      id: "2",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 250 },
      data: {
        label: "Task Description",
        description: "What the user needs to accomplish"
      }
    },
    {
      id: "3",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 100 },
      data: {
        label: "User Flow Mapping",
        description: "Map out the user journey",
        parameters: {
          detail_level: "high"
        },
        template: "Create a {{detail_level === 'high' ? 'detailed' : 'high-level'}} user flow for accomplishing the described task. Map out each step in the journey from start to completion, including decision points and possible paths.\n\nUser Persona:\n{{User Persona}}\n\nTask Description:\n{{Task Description}}"
      }
    },
    {
      id: "4",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 250 },
      data: {
        label: "Screen Requirements",
        description: "Define screens needed",
        parameters: {
          platform: "mobile"
        },
        template: "Based on the user flow, define the screens required for a {{platform}} app. For each screen, describe its purpose, key components, user interactions, and data requirements.\n\nUser Flow:\n{{User Flow Mapping}}"
      }
    },
    {
      id: "5",
      type: "OUTPUT" as keyof typeof NodeType,
      position: { x: 600, y: 175 },
      data: {
        label: "UX Blueprint",
        description: "Complete UX flow with screen specifications"
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

// ===== Content Writing Templates =====

// SEO Article Generator
export const seoArticleGenerator: FlowElements = {
  nodes: [
    {
      id: "1",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 100 },
      data: {
        label: "Target Keyword",
        description: "Primary keyword to rank for"
      }
    },
    {
      id: "2",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 250 },
      data: {
        label: "Audience",
        description: "Target audience and their pain points"
      }
    },
    {
      id: "3",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 100 },
      data: {
        label: "SEO Content Planning",
        description: "Plan SEO-optimized structure",
        parameters: {
          word_count: "1500",
          related_keywords: "5"
        },
        template: "Create a detailed plan for a {{word_count}}-word SEO article targeting the keyword '{{Target Keyword}}'. Include a title, meta description, introduction, {{related_keywords}} H2 headings based on related keywords, and conclusion. Consider the audience's needs and search intent.\n\nTarget Keyword: {{Target Keyword}}\n\nAudience: {{Audience}}"
      }
    },
    {
      id: "4",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 250 },
      data: {
        label: "Article Generation",
        description: "Write full SEO article",
        parameters: {
          tone: "informative",
          expertise_level: "intermediate"
        },
        template: "Based on the content plan, write a full SEO-optimized article with a {{tone}} tone targeted at readers with {{expertise_level}} knowledge level. Naturally incorporate the target keyword and related keywords throughout the article. Include a compelling introduction, detailed body sections with examples, and a strong conclusion with a call to action.\n\nSEO Content Plan:\n{{SEO Content Planning}}"
      }
    },
    {
      id: "5",
      type: "OUTPUT" as keyof typeof NodeType,
      position: { x: 600, y: 175 },
      data: {
        label: "SEO Article",
        description: "Complete SEO-optimized article"
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

// Social Media Content Calendar
export const socialMediaContent: FlowElements = {
  nodes: [
    {
      id: "1",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 100 },
      data: {
        label: "Brand Info",
        description: "Brand identity, voice, and key messages"
      }
    },
    {
      id: "2",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 250 },
      data: {
        label: "Content Goals",
        description: "Objectives for the content (engagement, sales, etc.)"
      }
    },
    {
      id: "3",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 100 },
      data: {
        label: "Content Strategy",
        description: "Plan content themes and approach",
        parameters: {
          platforms: "Instagram, LinkedIn, Twitter",
          duration: "2 weeks"
        },
        template: "Create a social media content strategy for {{platforms}} over a {{duration}} period. Include content themes, posting frequency, and content mix (educational, promotional, entertaining). Align with the brand voice and content goals.\n\nBrand Info:\n{{Brand Info}}\n\nContent Goals:\n{{Content Goals}}"
      }
    },
    {
      id: "4",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 250 },
      data: {
        label: "Content Creation",
        description: "Generate actual content pieces",
        parameters: {
          posts_per_platform: "4"
        },
        template: "Based on the content strategy, create {{posts_per_platform}} posts for each platform ({{platforms}}). For each post, include the platform, content type, copy, hashtags (if applicable), and a description of visuals or attached media. Ensure each post aligns with platform best practices.\n\nContent Strategy:\n{{Content Strategy}}"
      }
    },
    {
      id: "5",
      type: "OUTPUT" as keyof typeof NodeType,
      position: { x: 600, y: 175 },
      data: {
        label: "Content Calendar",
        description: "Complete social media content plan"
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

// Email Sequence Creator
export const emailSequence: FlowElements = {
  nodes: [
    {
      id: "1",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 100 },
      data: {
        label: "Campaign Purpose",
        description: "Goal of the email sequence"
      }
    },
    {
      id: "2",
      type: "INPUT" as keyof typeof NodeType,
      position: { x: 100, y: 250 },
      data: {
        label: "Target Audience",
        description: "Who will receive these emails?"
      }
    },
    {
      id: "3",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 100 },
      data: {
        label: "Email Sequence Planning",
        description: "Plan the email flow",
        parameters: {
          emails: "5",
          sequence_type: "nurture"
        },
        template: "Design a {{sequence_type}} email sequence with {{emails}} emails. Outline the purpose, timing, and core message of each email. Create a logical flow that guides recipients toward the campaign goal.\n\nCampaign Purpose:\n{{Campaign Purpose}}\n\nTarget Audience:\n{{Target Audience}}"
      }
    },
    {
      id: "4",
      type: "PROCESS" as keyof typeof NodeType,
      position: { x: 350, y: 250 },
      data: {
        label: "Email Content Creation",
        description: "Write the actual emails",
        parameters: {
          tone: "conversational",
          include_subject_line: "yes"
        },
        template: "Based on the email sequence plan, write the full content for each email. Use a {{tone}} tone appropriate for the audience. {{include_subject_line === 'yes' ? 'Include compelling subject lines, ' : ''}}Write engaging content with clear calls-to-action.\n\nEmail Sequence Plan:\n{{Email Sequence Planning}}"
      }
    },
    {
      id: "5",
      type: "OUTPUT" as keyof typeof NodeType,
      position: { x: 600, y: 175 },
      data: {
        label: "Email Sequence",
        description: "Complete email sequence with content"
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