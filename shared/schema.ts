import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Prompts table
export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  elements: jsonb("elements").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;

// Node types enumeration
export const NodeType = {
  INPUT: "input",
  PROCESS: "process",
  FILTER: "filter",
  CONDITION: "condition",
  OUTPUT: "output",
} as const;

// Define Flow Element types for frontend
export type FlowNode = {
  id: string;
  type: keyof typeof NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    parameters?: Record<string, string>;
    template?: string;
  };
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
};

export type FlowElements = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};
