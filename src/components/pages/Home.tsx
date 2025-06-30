"use client";

import { Task } from "../../../prisma/prisma";
import { columns } from "../table/columns";
import { DataTable } from "../table/data-table";

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
};

type HomeClientPageProps = {
  tasks: Task[];
};

const HomeClientPage = ({ tasks }: HomeClientPageProps) => {
  return (
    <main className="px-fluid ">
      <DataTable columns={columns} data={tasks} />
    </main>
  );
};

export default HomeClientPage;
