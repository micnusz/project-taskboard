"use server";

import { revalidatePath } from "next/cache";
import prisma from "../lib/prisma";
import { Prisma } from "../../prisma/prisma";

export const createPost = async (state: any, formData: FormData) => {
  try {
    await prisma.task.create({
      data: {
        title: formData.get("title") as string,
        slug: (formData.get("title") as string)
          .replace(/\s+/g, "-")
          .toLowerCase(),
        description: formData.get("content") as string,
        author: {
          connect: { email: "alice@prisma.io" },
        },
      },
    });

    revalidatePath("/");

    return { message: "Post created successfully!" };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return { message: "A post with this slug already exists." };
      }
    }

    return { message: "Something went wrong." };
  }
};

export const updatePost = async (formData: FormData, id: string) => {
  await prisma.task.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      slug: (formData.get("slug") as string).replace(/\s+/g, "-").toLowerCase(),
      description: formData.get("content") as string,
    },
  });
};

export const deletePost = async (id: string) => {
  await prisma.task.delete({
    where: { id },
  });
};
