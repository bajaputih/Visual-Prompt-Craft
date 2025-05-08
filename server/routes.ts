import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPromptSchema,
  type InsertPrompt
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all prompts
  app.get("/api/prompts", async (req: Request, res: Response) => {
    try {
      const prompts = await storage.getPrompts();
      res.json(prompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  // Get a single prompt by ID
  app.get("/api/prompts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const prompt = await storage.getPrompt(id);
      if (!prompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }

      res.json(prompt);
    } catch (error) {
      console.error(`Error fetching prompt ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to fetch prompt" });
    }
  });

  // Create a new prompt
  app.post("/api/prompts", async (req: Request, res: Response) => {
    try {
      const validationResult = insertPromptSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }

      const promptData = validationResult.data;
      const newPrompt = await storage.createPrompt(promptData);
      res.status(201).json(newPrompt);
    } catch (error) {
      console.error("Error creating prompt:", error);
      res.status(500).json({ message: "Failed to create prompt" });
    }
  });

  // Update an existing prompt
  app.put("/api/prompts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      // Partial validation of the update data
      const validationResult = insertPromptSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationError.details 
        });
      }

      const promptData = validationResult.data;
      const updatedPrompt = await storage.updatePrompt(id, promptData);
      
      if (!updatedPrompt) {
        return res.status(404).json({ message: "Prompt not found" });
      }

      res.json(updatedPrompt);
    } catch (error) {
      console.error(`Error updating prompt ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update prompt" });
    }
  });

  // Delete a prompt
  app.delete("/api/prompts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const success = await storage.deletePrompt(id);
      if (!success) {
        return res.status(404).json({ message: "Prompt not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting prompt ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete prompt" });
    }
  });

  // Get prompts by category
  app.get("/api/prompts/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const prompts = await storage.getPromptsByCategory(category);
      res.json(prompts);
    } catch (error) {
      console.error(`Error fetching prompts for category ${req.params.category}:`, error);
      res.status(500).json({ message: "Failed to fetch prompts by category" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
