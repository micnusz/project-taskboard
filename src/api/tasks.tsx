import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const search = (req.query.search as string) || "";

  try {
    const tasks = await prisma.task.findMany({
      where: {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
