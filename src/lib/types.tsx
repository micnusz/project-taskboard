import { Priority, Status, Type } from "../../prisma/prisma";

export type SearchTaskParams = {
  searchInput: string;
  limit: number;
  offset: number;
  priority?: Priority;
  status?: Status;
  type?: Type;
  date?: Date;
  sortField?: "createdAt" | "title" | "priority";
  sortOrder?: "asc" | "desc";
  authorId?: string;
};
