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
import React, { useEffect } from "react";
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
    getRowId: (row) => row.id,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
  });

  const queryClient = useQueryClient();

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedTask = selectedRows[0]?.original;

  const handleDelete = async (id: string) => {
    const res = await deletePost(id);
    if (res.message === "Task deleted successfully!") {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      table.resetRowSelection();
    } else {
      console.error(res.message);
    }
  };

  return (
    <div>
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
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
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
      {selectedRows.length === 1 && (
        <div className="mb-2 flex items-center gap-2 bg-muted p-2 rounded">
          <span>{selectedRows.length} selected</span>
          <div className="flex flex-row gap-x-2">
            <Button className="" variant="destructive">
              <Link href={`/task/${selectedTask.slug}`}>View Task</Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="max-w-[15rem] justify-start "
                >
                  Edit Task
                </Button>
              </DialogTrigger>
              <DialogContent className="min-h-[20rem] max-h-screen">
                <DialogHeader>
                  <DialogTitle>Edit Task:</DialogTitle>
                  <UpdatePost task={selectedTask} />
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="max-w-[15rem] justify-start text-red-400"
              onClick={() => handleDelete(selectedTask.id)}
            >
              Delete Task
            </Button>
          </div>
        </div>
      )}
      {selectedRows.length > 1 && (
        <div className="mb-2 flex items-center gap-2 bg-muted p-2 rounded">
          <span>{selectedRows.length} selected</span>
          <Button variant="destructive">Delete Selected</Button>
        </div>
      )}
    </div>
  );
}
