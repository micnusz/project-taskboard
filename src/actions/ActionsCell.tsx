"use client";
import { TaskWithAuthor } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdatePost from "@/components/FormUpdate";
import React from "react";
import ViewTask from "@/components/ViewTask";
import DeleteTaskAlert from "@/components/DeleteTaskAlert";
import { useDeleteTask } from "@/hook/useDeleteTask";

export default function ActionsCell({ task }: { task: TaskWithAuthor }) {
  const { handleDelete } = useDeleteTask();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col">
        <DropdownMenuLabel className="text-muted-foreground">
          Menu
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="p-2 justify-start">
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
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Link href={`/author/${task?.authorId}`}>
                <Button variant="ghost" className="justify-start p-2 w-full">
                  View Author
                </Button>
              </Link>
            </DialogTrigger>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="p-2 justify-start">
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
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {/* Delete Task */}
          <Dialog>
            <DialogTrigger asChild>
              <DeleteTaskAlert onDelete={() => handleDelete(task.id)}>
                <Button
                  variant="ghost"
                  className="justify-start p-2 w-full text-red-500"
                >
                  Delete Task
                </Button>
              </DeleteTaskAlert>
            </DialogTrigger>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
