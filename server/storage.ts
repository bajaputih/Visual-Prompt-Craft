import { 
  users, type User, type InsertUser,
  prompts, type Prompt, type InsertPrompt,
  type FlowElements
} from "@shared/schema";

// CRUD interface for storage
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Prompt methods
  getPrompts(): Promise<Prompt[]>;
  getPrompt(id: number): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: number, prompt: Partial<InsertPrompt>): Promise<Prompt | undefined>;
  deletePrompt(id: number): Promise<boolean>;
  getPromptsByCategory(category: string): Promise<Prompt[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private promptsMap: Map<number, Prompt>;
  private userIdCounter: number;
  private promptIdCounter: number;

  constructor() {
    this.users = new Map();
    this.promptsMap = new Map();
    this.userIdCounter = 1;
    this.promptIdCounter = 1;
    
    // Add some initial prompts
    this.createPrompt({
      name: "Text Summarization Flow",
      description: "Summarizes text content efficiently",
      category: "Creative Writing",
      elements: {
        nodes: [
          {
            id: "1",
            type: "input",
            position: { x: 100, y: 100 },
            data: { 
              label: "User Input", 
              description: "Provide a text to summarize" 
            }
          },
          {
            id: "2",
            type: "process",
            position: { x: 400, y: 100 },
            data: { 
              label: "Text Analysis", 
              description: "Extract key information"
            }
          },
          {
            id: "3",
            type: "process",
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
            type: "output",
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
      }
    });
    
    this.createPrompt({
      name: "Customer Support Assistant",
      description: "Helps with customer inquiries",
      category: "Customer Support",
      elements: {
        nodes: [],
        edges: []
      }
    });
    
    this.createPrompt({
      name: "Image Description Generator",
      description: "Generates detailed image descriptions",
      category: "Creative Writing",
      elements: {
        nodes: [],
        edges: []
      }
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Prompt methods
  async getPrompts(): Promise<Prompt[]> {
    return Array.from(this.promptsMap.values());
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    return this.promptsMap.get(id);
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const id = this.promptIdCounter++;
    const now = new Date().toISOString();
    const prompt: Prompt = { 
      ...insertPrompt, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.promptsMap.set(id, prompt);
    return prompt;
  }

  async updatePrompt(id: number, promptUpdate: Partial<InsertPrompt>): Promise<Prompt | undefined> {
    const existingPrompt = this.promptsMap.get(id);
    if (!existingPrompt) return undefined;

    const updatedPrompt: Prompt = {
      ...existingPrompt,
      ...promptUpdate,
      updatedAt: new Date().toISOString()
    };
    
    this.promptsMap.set(id, updatedPrompt);
    return updatedPrompt;
  }

  async deletePrompt(id: number): Promise<boolean> {
    return this.promptsMap.delete(id);
  }

  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    return Array.from(this.promptsMap.values()).filter(
      (prompt) => prompt.category === category
    );
  }
}

export const storage = new MemStorage();
