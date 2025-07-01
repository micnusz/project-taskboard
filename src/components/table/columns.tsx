import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { Task } from "../../../prisma/prisma";
import formatStatus from "@/modules/format-status";
import { Badge } from "../ui/badge";
import formatPriority from "@/modules/format-priority";
import { formatDate } from "@/modules/format-date";
import { deletePost } from "@/actions/actions";
import { useState } from "react";
import AlertDelete from "../ui/alert-task-delete";
import formatRole from "@/modules/format-role";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div>
          <Badge variant="outline">{formatStatus(status)}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div>
        <Badge variant="outline">{row.getValue("type")}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            value="asc"
          >
            Asc
          </SelectItem>
          <SelectItem
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "desc")
            }
            value="desc"
          >
            Desc
          </SelectItem>
        </SelectContent>
      </Select>
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <div>
          <Badge variant="outline">{formatPriority(priority)}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "author",
    header: "Created By",
    cell: ({ row }) => {
      const author = row.original.author; // zakładam, że row.original ma cały obiekt Task wraz z author
      return (
        <div>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline">{author?.name || "Unknown"}</Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-y-2">
                <p>{author?.email}</p>
                <p className="justify-center flex">
                  {formatRole(author?.role)}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original;
      const id = task.id;

      const [alert, setAlert] = useState<{
        message: string;
        type: "success" | "error";
      } | null>(null);

      const handleDelete = async () => {
        const res = await deletePost(id);
        if (res.message === "Task deleted successfully!") {
          setAlert({ message: res.message, type: "success" });
        } else {
          setAlert({ message: res.message, type: "error" });
        }
      };

      return (
        <div>
          {alert && <AlertDelete message={alert.message} type={alert.type} />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
