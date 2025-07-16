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

export type BadgeVariant =
  | "default"
  | "user"
  | "destructive"
  | "outline"
  | "secondary"
  | "admin"
  | "developer"
  | "manager"
  | null
  | undefined;

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

export type HomePageState = {
  pagination: { pageIndex: number; pageSize: number };
  search: string;
  queryText: string;
  priority?: Priority;
  status?: Status;
  type?: Type;
  date?: Date;
  sortField: string;
  sortOrder: "asc" | "desc";
  author?: User;
  open: boolean;
};

export type HomePageAction =
  | { type: "SET_PAGINATION"; payload: { pageIndex: number; pageSize: number } }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_QUERY_TEXT"; payload: string }
  | { type: "SET_PRIORITY"; payload?: Priority }
  | { type: "SET_STATUS"; payload?: Status }
  | { type: "SET_TYPE"; payload?: Type }
  | { type: "SET_DATE"; payload?: Date }
  | { type: "SET_SORT"; payload: { field: string; order: "asc" | "desc" } }
  | { type: "SET_AUTHOR"; payload?: User }
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "CLEAR_FILTERS" };

export type AuthorPageState = {
  pagination: { pageIndex: number; pageSize: number };
  search: string;
  queryText: string;
  priority?: Priority;
  status?: Status;
  type?: Type;
  date?: Date;
};

export type AuthorPageAction =
  | {
      type: "SET_PAGINATION";
      payload: { pageIndex: number; pageSize: number };
    }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_QUERY_TEXT"; payload: string }
  | { type: "SET_PRIORITY"; payload?: Priority }
  | { type: "SET_STATUS"; payload?: Status }
  | { type: "SET_TYPE"; payload?: Type }
  | { type: "SET_DATE"; payload?: Date }
  | { type: "CLEAR_FILTERS" };
