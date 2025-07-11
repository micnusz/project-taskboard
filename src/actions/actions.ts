"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma";
import { Priority, Prisma, Status, Type, User } from "../../prisma/prisma";
import { z } from "zod";
import { TaskActionState } from "@/lib/types";
import { getErrorMessage } from "@/modules/get-error-message";

//For task/[slug]
export const getTask = async (slug: string) => {
  const tasks = await prisma.task.findUnique({
    where: {
      slug: slug,
    },
    include: {
      author: true,
    },
  });
  return tasks;
};
//Getting authors for filters
export const getAuthors = async (): Promise<User[]> => {
  try {
    const authors = await prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
    });
    return authors;
  } catch (e) {
    console.error("Error fetching authors:", e);
    return [];
  }
};

//Zod create task schema
const createTaskSchema = z.object({
  title: z
    .string()
    .max(100)
    .refine(
      async (val) => {
        const exists = await prisma.task.findUnique({
          where: { slug: val.toLowerCase().replace(/\s+/g, "-") },
        });
        return !exists;
      },
      {
        message: "duplicate_title",
      }
    ),
  description: z.string().max(1000),
  status: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"])
  ),
  priority: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["LOW", "MEDIUM", "HIGH"])
  ),
  type: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(["BUG", "FEATURE", "ENHANCEMENT", "DOCUMENTATION", "OTHER"])
  ),
});
//Create Task
export const createTask = async (
  prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> => {
  const formValues = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
    type: formData.get("type") as string,
  };

  const parseResult = await createTaskSchema.safeParseAsync(formValues);

  if (!parseResult.success) {
    const fieldErrors = parseResult.error.flatten().fieldErrors;

    return {
      message: getErrorMessage(fieldErrors),
      success: false,
      errors: fieldErrors,
    };
  }

  const { title, description, status, priority, type } = parseResult.data;

  try {
    await prisma.task.create({
      data: {
        title,
        slug: title.replace(/\s+/g, "-").toLowerCase(),
        description,
        status,
        priority,
        type,
        author: {
          connect: { email: "test@prisma.io" },
        },
      },
    });

    return {
      message: "Post created successfully!",
      success: true,
    };
  } catch {
    return {
      message: "Something went wrong.",
      success: false,
    };
  }
};

//Zod update task schema
const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  type: z.enum(["BUG", "FEATURE", "ENHANCEMENT", "DOCUMENTATION", "OTHER"]),
});
//Update Post
export const updatePost = async (
  prevState: TaskActionState,
  formData: FormData
) => {
  const formValues = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
    type: formData.get("type") as string,
  };

  const parseResult = await updateTaskSchema.safeParseAsync(formValues);

  if (!parseResult.success) {
    return {
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { id, title, description, status, priority, type } = parseResult.data;

  const slug = title.replace(/\s+/g, "-").toLowerCase();

  const existingTask = await prisma.task.findUnique({
    where: { slug },
  });

  if (existingTask && existingTask.id !== id) {
    return {
      message: "A task with this title already exists.",
      success: false,
    };
  }

  try {
    await prisma.task.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        status,
        priority,
        type,
      },
    });
    return { message: "Post updated successfully!", success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          message: "A post with this slug already exists.",
          success: false,
        };
      }
      if (e.code === "P2025") {
        return {
          message: "Post not found. Update failed.",
          success: false,
        };
      }
    }
    return { message: "Something went wrong.", success: false };
  }
};

//Zod update many schema
const updateManyTaskSchema = z.object({
  ids: z.array(z.string()).min(1),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  type: z
    .enum(["BUG", "FEATURE", "ENHANCEMENT", "DOCUMENTATION", "OTHER"])
    .optional(),
});
//Update many
export const updateManyPosts = async (
  prevState: TaskActionState,
  formData: FormData
) => {
  const ids = formData.getAll("ids") as string[];

  const rawStatus = formData.get("status");
  const rawPriority = formData.get("priority");
  const rawType = formData.get("type");

  const status = rawStatus === "" ? undefined : (rawStatus as string);
  const priority = rawPriority === "" ? undefined : (rawPriority as string);
  const type = rawType === "" ? undefined : (rawType as string);

  const parseResult = await updateManyTaskSchema.safeParseAsync({
    ids,
    status,
    priority,
    type,
  });

  if (!parseResult.success) {
    return {
      message: "Validation failed",
      errors: parseResult.error.flatten().fieldErrors,
      success: false,
    };
  }

  const {
    ids: validIds,
    status: newStatus,
    priority: newPriority,
    type: newType,
  } = parseResult.data;

  try {
    await prisma.task.updateMany({
      where: {
        id: { in: validIds },
      },
      data: {
        ...(newStatus && { status: newStatus }),
        ...(newPriority && { priority: newPriority }),
        ...(newType && { type: newType }),
      },
    });
    return { message: "Tasks updated successfully!", success: true };
  } catch (e) {
    console.error(e);
    return {
      message: "Something went wrong while updating tasks.",
      success: false,
    };
  }
};

export const deletePost = async (id: string) => {
  try {
    await prisma.task.delete({
      where: { id },
    });
    revalidatePath("/");
    return { message: "Task deleted successfully!" };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return { message: "Task not found. It may have already been deleted." };
      }
    }

    return { message: "Something went wrong..." };
  }
};

//Main
export const searchTask = async (
  searchInput: string,
  limit: number,
  offset: number,
  priority?: Priority | undefined,
  status?: Status,
  type?: Type,
  date?: Date,
  sortField: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
  authorId?: string
) => {
  let startOfDay: Date | undefined;
  let endOfDay: Date | undefined;

  if (date) {
    startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
  }

  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        [sortField]: sortOrder,
      },
      where: {
        OR: [
          {
            description: {
              contains: searchInput,
              mode: "insensitive",
            },
          },
          {
            title: {
              contains: searchInput,
              mode: "insensitive",
            },
          },
        ],
        priority: priority,
        status: status,
        type: type,
        ...(authorId && { authorId }),
        ...(date && {
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        }),
      },
      include: {
        author: true,
      },
      skip: offset,
      take: limit,
    });

    return tasks;
  } catch (e) {
    console.error("Error searching tasks:", e);
    return [];
  }
};
