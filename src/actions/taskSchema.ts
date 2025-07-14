import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(1000),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  type: z.enum(["BUG", "FEATURE", "ENHANCEMENT", "DOCUMENTATION", "OTHER"]),
});

export const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  type: z
    .enum(["BUG", "FEATURE", "ENHANCEMENT", "DOCUMENTATION", "OTHER"])
    .optional(),
});

export const updateManyTaskSchema = z.object({
  ids: z.array(z.string()).min(1),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  type: z
    .enum(["BUG", "FEATURE", "ENHANCEMENT", "DOCUMENTATION", "OTHER"])
    .optional(),
});
