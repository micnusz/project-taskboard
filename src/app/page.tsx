"use server";

import HomeClientPage from "@/components/pages/Home";
import prisma from "@/lib/prisma";

export default async function Home() {
  const tasks = await prisma.task.findMany();

  return <HomeClientPage tasks={tasks} />;
}
