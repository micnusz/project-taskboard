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
import Link from "next/link";

export const getColumns = ({
  sortField,
  sortOrder,
  setSort,
}: {
  sortField?: string;
  sortOrder?: "asc" | "desc";
  setSort: (field: string) => void;
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
      <Button variant="ghost" onClick={() => setSort("title")}>
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
      <Button variant="ghost" onClick={() => setSort("description")}>
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
      <Button variant="ghost" onClick={() => setSort("status")}>
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
      <Button variant="ghost" onClick={() => setSort("type")}>
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
      <Button variant="ghost" onClick={() => setSort("priority")}>
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
      <Button variant="ghost" onClick={() => setSort("createdAt")}>
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
      const roleVariantMap: Record<
        string,
        "user" | "admin" | "developer" | "manager" | "default"
      > = {
        user: "user",
        admin: "admin",
        developer: "developer",
        manager: "manager",
      };

      const role = author?.role?.toLowerCase();
      const variant = roleVariantMap[role ?? ""] ?? "default";

      return (
        <div>
          <Tooltip>
            <TooltipTrigger>
              <Link href={`/author/${author.id}`}>
                <Badge variant={variant}>
                  <CircleUser className="w-4 h-4" /> {author?.name || "Unknown"}
                </Badge>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-y-2">
                <div>
                  <Label className="label">Email:</Label>
                  <p>{author?.email}</p>
                </div>
                <div>
                  <Label className="label">Role:</Label>
                  <span>
                    {author?.role ? formatRole(author.role) : "No role"}
                  </span>
                </div>
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
