import { ChevronDown, CircleUser } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import formatStatus from "@/modules/format-status";
import { Badge } from "../ui/badge";
import formatPriority from "@/modules/format-priority";
import { formatDate } from "@/modules/format-date";
import ActionsCell from "@/actions/ActionsCell";
import formatRole from "@/modules/format-role";
import { Label } from "../ui/label";
import formatType from "@/modules/format-type";
import { TaskWithAuthor } from "@/lib/types";

export const getColumns = ({
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
}: {
  sortField: string;
  sortOrder: "asc" | "desc";
  setSortField: (field: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
}): ColumnDef<TaskWithAuthor>[] => [
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
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          const isAsc = sortField === "title" && sortOrder === "asc";
          setSortField("title");
          setSortOrder(isAsc ? "desc" : "asc");
        }}
      >
        Title
        <ChevronDown
          className={
            sortField === "title"
              ? sortOrder === "desc"
                ? "rotate-180"
                : ""
              : "opacity-30"
          }
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          const isAsc = sortField === "description" && sortOrder === "asc";
          setSortField("description");
          setSortOrder(isAsc ? "desc" : "asc");
        }}
      >
        Description
        <ChevronDown
          className={
            sortField === "description"
              ? sortOrder === "desc"
                ? "rotate-180"
                : ""
              : "opacity-30"
          }
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div
        style={{
          maxWidth: "450px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {row.getValue("description")}
      </div>
    ),
    size: 200,
  },

  {
    accessorKey: "status",
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          const isAsc = sortField === "status" && sortOrder === "asc";
          setSortField("status");
          setSortOrder(isAsc ? "desc" : "asc");
        }}
      >
        Status
        <ChevronDown
          className={
            sortField === "status"
              ? sortOrder === "desc"
                ? "rotate-180"
                : ""
              : "opacity-30"
          }
        />
      </Button>
    ),
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
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          const isAsc = sortField === "type" && sortOrder === "asc";
          setSortField("type");
          setSortOrder(isAsc ? "desc" : "asc");
        }}
      >
        Type
        <ChevronDown
          className={
            sortField === "type"
              ? sortOrder === "desc"
                ? "rotate-180"
                : ""
              : "opacity-30"
          }
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <Badge variant="outline">{formatType(row.getValue("type"))}</Badge>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          const isAsc = sortField === "priority" && sortOrder === "asc";
          setSortField("priority");
          setSortOrder(isAsc ? "desc" : "asc");
        }}
      >
        Priority
        <ChevronDown
          className={
            sortField === "priority"
              ? sortOrder === "desc"
                ? "rotate-180"
                : ""
              : "opacity-30"
          }
        />
      </Button>
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
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          const isAsc = sortField === "createdAt" && sortOrder === "asc";
          setSortField("createdAt");
          setSortOrder(isAsc ? "desc" : "asc");
        }}
      >
        Created At
        <ChevronDown
          className={
            sortField === "createdAt"
              ? sortOrder === "desc"
                ? "rotate-180"
                : ""
              : "opacity-30"
          }
        />
      </Button>
    ),
    cell: ({ row }) => {
      const date: Date = row.getValue("createdAt");
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "author",
    header: "Created By",
    cell: ({ row }) => {
      const author = row.original.author;
      return (
        <div>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={author?.role?.toLowerCase()}>
                <CircleUser className="w-4 h-4" /> {author?.name || "Unknown"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-y-2">
                <Label>Email:</Label>
                <p>{author?.email}</p>
                <Label>Role:</Label>
                <p>{author?.role ? formatRole(author.role) : "No role"}</p>
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
      return <ActionsCell task={task} />;
    },
  },
];
