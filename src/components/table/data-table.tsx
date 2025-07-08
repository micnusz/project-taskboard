"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { DataTableSkeleton } from "./data-table-skeleton";
import Link from "next/link";
import UpdatePost from "../FormUpdate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/actions/actions";
import { Task } from "../../../prisma/prisma";

interface DataTableProps<TData extends Task, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
}
export function DataTable<TData extends Task, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    columns,
    data,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
  });

  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    const res = await deletePost(id);
    if (res.message === "Task deleted successfully!") {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["task", id] });
    } else {
      console.error(res.message);
    }
  };

  return (
    <Table className="border-1">
      <TableHeader className="sticky top-0 z-10 bg-card shadow-md">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {!header.isPlaceholder &&
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="p-0">
              <DataTableSkeleton
                columnCount={7}
                cellWidths={[
                  "1rem",
                  "3rem",
                  "7rem",
                  "4rem",
                  "4rem",
                  "4rem",
                  "6rem",
                  "3rem",
                ]}
                shrinkZero
                className="p-0 md:p-0 md:mt-0 m-0"
              />
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const slug = row.original.slug;
            const task = row.original;
            return (
              <ContextMenu key={row.id}>
                <ContextMenuTrigger asChild>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuLabel>Actions</ContextMenuLabel>
                  <ContextMenuSeparator />
                  <ContextMenuItem>
                    <Link href={`/task/${slug}`} className="w-full">
                      View task
                    </Link>
                  </ContextMenuItem>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        Edit Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="min-h-[20rem] max-h-screen">
                      <DialogHeader>
                        <DialogTitle>Edit Task:</DialogTitle>
                        <UpdatePost task={task} />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <ContextMenuItem
                    onClick={() => handleDelete(task.id)}
                    className="w-full justify-start text-red-400"
                  >
                    Delete Task
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
