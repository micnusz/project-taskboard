"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma";
import { Priority, Prisma, Status, Type } from "../../prisma/prisma";

export const getTasks = async () => {
  const tasks = await prisma.task.findMany({
    orderBy: {
      title: "desc",
    },
  });
  return tasks;
};

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

export const createPost = async (state: any, formData: FormData) => {
  const statusFromForm = formData.get("status") as string;
  const priorityFromForm = formData.get("priority") as string;
  const typeFromForm = formData.get("type") as string;

  try {
    await prisma.task.create({
      data: {
        title: formData.get("title") as string,
        slug: (formData.get("title") as string)
          .replace(/\s+/g, "-")
          .toLowerCase(),
        description: formData.get("description") as string,
        status: statusFromForm as Status,
        priority: priorityFromForm as Priority,
        type: typeFromForm as Type,
        author: {
          connect: { email: "alice@prisma.io" },
        },
      },
    });
    return { message: "Post created successfully!", success: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          message: "A post with this slug already exists.",
          success: false,
        };
      }
    }

    return { message: "Something went wrong.", success: false };
  }
};

//Update Post
export const updatePost = async (state: any, formData: FormData) => {
  const id = formData.get("id") as string;
  const statusFromForm = formData.get("status") as string;
  const priorityFromForm = formData.get("priority") as string;
  const typeFromForm = formData.get("type") as string;

  try {
    await prisma.task.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        slug: (formData.get("title") as string)
          .replace(/\s+/g, "-")
          .toLowerCase(),
        description: formData.get("description") as string,
        status: statusFromForm as Status,
        priority: priorityFromForm as Priority,
        type: typeFromForm as Type,
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

export const searchTask = async (
  searchInput: string,
  limit: number,
  offset: number,
  priority?: Priority,
  status?: Status,
  type?: Type
) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        description: {
          contains: searchInput,
          mode: "insensitive",
        },
        priority: priority,
        status: status,
        type: type,
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
