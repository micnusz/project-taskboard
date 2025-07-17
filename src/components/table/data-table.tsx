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
import React, { useActionState, useEffect, useState } from "react";
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
import { updateManyPosts } from "@/actions/actions";
import { Priority, Status, Type } from "../../../prisma/prisma";
import {
  ArrowDownUp,
  FileText,
  Library,
  LoaderCircle,
  PencilLine,
  Trash2,
  UserSearch,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from "../ui/select";
import { TaskActionState, TaskWithAuthor } from "@/lib/types";
import DataTablePagination from "./data-table-pagination";
import { useToastStore } from "@/lib/toast-store";
import ViewTask from "../ViewTask";
import DeleteTaskAlert from "../DeleteTaskAlert";
import TooltipWrapper from "../TooltipWrapper";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useDeleteTask } from "@/hook/useDeleteTask";
import { useDeleteManyTasks } from "@/hook/useDeleteManyTasks";

interface DataTableProps<TData extends TaskWithAuthor, TValue> {
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
export function DataTable<TData extends TaskWithAuthor, TValue>({
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
  const [status, setStatus] = useState<Status | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [type, setType] = useState<Type | "">("");
  const [open, setOpen] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

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

  //Delete hooks
  const { handleDelete } = useDeleteTask();
  const { handleDeleteMany } = useDeleteManyTasks();

  //Clear filters
  const handleClear = () => {
    setStatus("");
    setPriority("");
    setType("");
  };
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedTask = selectedRows[0]?.original;
  const selectedIds = selectedRows.map((row) => row.original.id);

  //Update status, priority, type
  useEffect(() => {
    if (state.success) {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      addToast({
        className: "bg-chart-1",
        title: `${state.message}`,
        description: `At ${new Date().toLocaleString()}`,
      });
      table.resetRowSelection();
      handleClear();
    } else if (!state.success && state.message) {
      const fieldErrors = state.errors
        ? Object.entries(state.errors)
            .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
            .join(" | ")
        : "";

      addToast({
        className: "bg-destructive",
        title: `Error: ${state.message}`,
        description: fieldErrors || `At ${new Date().toLocaleString()}`,
      });
    }
  }, [
    state.success,
    state.message,
    state.errors,
    queryClient,
    addToast,
    table,
  ]);

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
              const task = row.original;
              const author = task.authorId;

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
                  <ContextMenuContent className="max-w-[6rem]">
                    <ContextMenuLabel className="text-muted-foreground">
                      Menu
                    </ContextMenuLabel>
                    <ContextMenuSeparator />
                    <ContextMenuItem asChild>
                      {/* View Task */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-2 justify-start w-full"
                          >
                            View Task
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="min-h-[20rem] max-h-screen min-w-1/2">
                          <DialogHeader>
                            <DialogTitle className="text-muted-foreground text-sm">
                              View Task:
                            </DialogTitle>
                          </DialogHeader>
                          <ViewTask taskData={task} />
                        </DialogContent>
                      </Dialog>
                    </ContextMenuItem>
                    <ContextMenuItem asChild>
                      {/* View Author */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Link href={`/author/${author}`}>
                            <Button
                              variant="ghost"
                              className="p-2 justify-start w-full"
                            >
                              View Author
                            </Button>
                          </Link>
                        </DialogTrigger>
                      </Dialog>
                    </ContextMenuItem>
                    <ContextMenuItem asChild>
                      {/* Edit Task */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-2 justify-start w-full"
                          >
                            Edit Task
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="min-h-[20rem] max-h-screen">
                          <DialogHeader>
                            <DialogTitle className="text-muted-foreground text-sm">
                              Edit Task:
                            </DialogTitle>
                          </DialogHeader>
                          <UpdatePost task={task} />
                        </DialogContent>
                      </Dialog>
                    </ContextMenuItem>
                    <ContextMenuItem asChild>
                      {/* Delete Task */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <DeleteTaskAlert
                            onDelete={() => handleDelete(task.id)}
                          >
                            <Button
                              variant="ghost"
                              className="p-2 justify-start w-full text-red-500"
                            >
                              Delete Task
                            </Button>
                          </DeleteTaskAlert>
                        </DialogTrigger>
                      </Dialog>
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

      <div className="flex flex-col xl:flex-row py-4 gap-y-8">
        <div className="flex flex-col xl:flex-row ">
          {selectedRows.length === 1 ? (
            <div className="mb-2 flex  items-center ">
              <div className="flex flex-row gap-x-2 ">
                {/* Select count, reset selected */}
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
                {/* View Task */}
                <Dialog>
                  <TooltipWrapper title="View Details">
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <FileText className={`h-4 w-4 text-foreground`} />
                      </Button>
                    </DialogTrigger>
                  </TooltipWrapper>
                  <DialogContent className="min-h-[20rem] max-h-screen min-w-1/2">
                    <DialogHeader>
                      <DialogTitle className="text-muted-foreground text-sm">
                        View Details:
                      </DialogTitle>
                    </DialogHeader>
                    <ViewTask taskData={selectedTask} />
                  </DialogContent>
                </Dialog>

                {/* View Author */}
                <Dialog>
                  <TooltipWrapper title="View Author">
                    <DialogTrigger asChild>
                      <Link href={`/author/${selectedTask.authorId}`}>
                        <Button
                          variant="outline"
                          className="max-w-[15rem] justify-start "
                        >
                          <UserSearch />
                        </Button>
                      </Link>
                    </DialogTrigger>
                  </TooltipWrapper>
                </Dialog>

                {/* Edit Task */}
                <Dialog open={open} onOpenChange={setOpen}>
                  <TooltipWrapper title="Edit Task">
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <PencilLine className={`h-4 w-4 text-foreground`} />
                      </Button>
                    </DialogTrigger>
                  </TooltipWrapper>
                  <DialogContent className="min-h-[20rem] max-h-screen">
                    <DialogHeader>
                      <DialogTitle>Edit Task:</DialogTitle>
                      <UpdatePost
                        task={selectedTask}
                        onSuccess={() => setOpen(false)}
                      />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                {/* Delete Task */}
                <div>
                  <AlertDialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline">
                            <Trash2 className="text-foreground" />
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent className="text-sm">
                        Delete Task
                      </TooltipContent>
                    </Tooltip>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this task?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            onClick={() => handleDelete(selectedTask.id)}
                            variant="outline"
                            className="text-red-500"
                          >
                            Delete
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ) : selectedRows.length > 1 ? (
            <div className="mb-2 flex items-center ">
              <div className="flex flex-row gap-x-2 ">
                {/* Select count, reset selected */}
                <div className="flex flex-row items-center ">
                  <span className="text-sm ">
                    Selected: {selectedRows.length}
                  </span>
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
                        <Select
                          value={status}
                          onValueChange={(value) =>
                            setStatus(value as Status | "")
                          }
                        >
                          <TooltipWrapper title="Update Status">
                            <SelectTrigger withIcon={false}>
                              <LoaderCircle
                                className={`h-4 w-4 ${
                                  status
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </SelectTrigger>
                          </TooltipWrapper>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              <SelectSeparator />
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
                        <Select
                          value={type}
                          onValueChange={(value) => setType(value as Type | "")}
                        >
                          <TooltipWrapper title="Update Type">
                            <SelectTrigger withIcon={false}>
                              <Library
                                className={`h-4 w-4 ${
                                  type
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </SelectTrigger>
                          </TooltipWrapper>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Type</SelectLabel>
                              <SelectSeparator />
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
                        <Select
                          value={priority}
                          onValueChange={(value) =>
                            setPriority(value as Priority | "")
                          }
                        >
                          <TooltipWrapper title="Update Priority">
                            <SelectTrigger withIcon={false}>
                              <ArrowDownUp
                                className={`h-4 w-4 ${
                                  priority
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </SelectTrigger>
                          </TooltipWrapper>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Priority</SelectLabel>
                              <SelectSeparator />
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
                            variant="outline"
                            onClick={() => handleClear()}
                          >
                            Clear
                          </Button>
                        </div>
                      )}
                      {!isFiltered && (
                        <div>
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline">
                                    <Trash2 className="text-foreground" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent className="text-sm">
                                Delete Tasks
                              </TooltipContent>
                            </Tooltip>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to delete this task?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                  <Button
                                    onClick={() =>
                                      handleDeleteMany(selectedIds)
                                    }
                                    variant="outline"
                                    className="text-red-500"
                                  >
                                    Delete
                                  </Button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col justify-start xl:flex-row flex-1 xl:justify-end">
          <DataTablePagination {...pagination} />
        </div>
      </div>
    </div>
  );
}
