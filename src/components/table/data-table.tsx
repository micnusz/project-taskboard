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
import React, { useActionState, useEffect } from "react";
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
import { deletePost, updateManyPosts } from "@/actions/actions";
import { Priority, Status, Task, Type } from "../../../prisma/prisma";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TaskActionState } from "@/lib/types";
import DataTablePagination from "./data-table-pagination";

interface DataTableProps<TData extends Task, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (newPageIndex: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
  };
}
export function DataTable<TData extends Task, TValue>({
  columns,
  data,
  isLoading,
  pagination,
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
  const [status, setStatus] = React.useState<Status | "">("");
  const [priority, setPriority] = React.useState<Priority | "">("");
  const [type, setType] = React.useState<Type | "">("");

  const initialState: TaskActionState = {
    message: "",
    success: false,
    errors: {},
  };
  const [state, formAction, pending] = useActionState<
    TaskActionState,
    FormData
  >(updateManyPosts, initialState);

  const queryClient = useQueryClient();

  const handleClear = () => {
    setStatus("");
    setPriority("");
    setType("");
  };

  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      table.resetRowSelection();
      handleClear();
    }
  }, [state]);

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedTask = selectedRows[0]?.original;
  const selectedIds = selectedRows.map((row) => row.original.id);

  const handleDelete = async (id: string) => {
    const res = await deletePost(id);
    if (res.message === "Task deleted successfully!") {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      table.resetRowSelection();
    } else {
      console.error(res.message);
    }
  };

  const handleDeleteMany = async (ids: string[]) => {
    try {
      for (const id of ids) {
        const res = await deletePost(id);
        if (res.message !== "Task deleted successfully!") {
          console.error(`Failed to delete task ${id}:`, res.message);
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      table.resetRowSelection();
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  const isFiltered = status !== "" || priority !== "" || type !== "";

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
      <div className="flex flex-col xl:flex-row gap-x-2 py-2">
        <div className="flex flex-col xl:flex-row">
          {selectedRows.length === 1 && (
            <div className="mb-2 flex items-center ">
              {/* Select count, reset selected */}
              <div className="flex flex-row gap-x-2 ">
                <div className="flex flex-row items-center">
                  <span className="text-sm">
                    Selected: {selectedRows.length}
                  </span>{" "}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => table.resetRowSelection()}
                  >
                    <X />
                  </Button>
                </div>

                <Button variant="outline">
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
        </div>
        <div className="flex flex-col xl:flex-row">
          {selectedRows.length > 1 && (
            <div className="mb-2 flex items-center">
              {/* Select count, reset selected */}
              <div className="flex flex-row gap-x-2 ">
                <div className="flex flex-row items-center">
                  <span className="text-sm">
                    Selected: {selectedRows.length}
                  </span>{" "}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => table.resetRowSelection()}
                  >
                    <X />
                  </Button>
                </div>
                <div className="flex flex-row gap-x-2">
                  <form
                    action={formAction}
                    className="flex flex-row items-center gap-y-3"
                  >
                    {selectedIds.map((id) => (
                      <input key={id} type="hidden" name="ids" value={id} />
                    ))}
                    <div className="flex flex-row flex-wrap gap-x-2">
                      {/* STATUS */}
                      <div className="flex flex-col gap-y-1 ">
                        <Select value={status} onValueChange={setStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              <SelectItem value="TODO">Todo</SelectItem>
                              <SelectItem value="IN_PROGRESS">
                                In Progress
                              </SelectItem>
                              <SelectItem value="DONE">Done</SelectItem>
                              <SelectItem value="CANCELED">Canceled</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <input type="hidden" name="status" value={status} />
                      </div>
                      {/* TYPE */}
                      <div className="flex flex-col gap-y-1">
                        <Select value={type} onValueChange={setType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Type</SelectLabel>
                              <SelectItem value="BUG">Bug</SelectItem>
                              <SelectItem value="DOCUMENTATION">
                                Documentation
                              </SelectItem>
                              <SelectItem value="ENHANCEMENT">
                                Enhancement
                              </SelectItem>
                              <SelectItem value="FEATURE">Feature</SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <input type="hidden" name="type" value={type} />
                      </div>
                      {/* PRIORITY */}
                      <div className="flex flex-col gap-y-1 ">
                        <Select value={priority} onValueChange={setPriority}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Priority</SelectLabel>
                              <SelectItem value="HIGH">High</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="LOW">Low</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <input type="hidden" name="priority" value={priority} />
                      </div>

                      {isFiltered && (
                        <div className="flex flex-row gap-x-2">
                          <Button disabled={pending} variant="default">
                            Update
                          </Button>
                          {/* <p>{state.message}</p> */}
                          <Button
                            variant="destructive"
                            onClick={() => handleClear()}
                          >
                            Clear
                          </Button>
                        </div>
                      )}
                    </div>
                  </form>
                  {!isFiltered && (
                    <div>
                      <Button
                        variant="outline"
                        className="max-w-[15rem] text-red-400"
                        onClick={() => handleDeleteMany(selectedIds)}
                      >
                        Delete Tasks
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-start xl:flex-row flex-1 xl:justify-end">
          <DataTablePagination {...pagination} />
        </div>
      </div>
    </div>
  );
}
