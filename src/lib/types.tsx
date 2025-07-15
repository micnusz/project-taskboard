import { Priority, Status, Task, Type, User } from "../../prisma/prisma";

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

export type TaskWithAuthor = Task & {
  author: User;
};

export type AuthorWithTasks = User & {
  tasks: Task[];
};

export type TaskActionState = {
  message: string;
  success: boolean;
  errors?: {
    title?: string[];
    description?: string[];
    status?: string[];
    priority?: string[];
    type?: string[];
  };
  timestamp?: number;
};
