import { createTaskSchema } from "@/actions/taskSchema";
import { z } from "zod";

export function getErrorMessage(
  errors: z.inferFlattenedErrors<typeof createTaskSchema>["fieldErrors"]
): string {
  if (errors.title?.includes("duplicate_title")) {
    return "A task with this title already exists.";
  }

  return "Validation failed. Please check all fields.";
}
