"use client";
import { TaskWithAuthor } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "./actions";
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
import { useToastStore } from "@/lib/toast-store";
import ViewTask from "@/components/ViewTask";

export default function ActionsCell({ task }: { task: TaskWithAuthor }) {
  const addToast = useToastStore((state) => state.addToast);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const res = await deleteTask(task.id);
    if (res.message === "Task deleted successfully!") {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task-count"] });
      addToast({
        className: "bg-chart-1",
        title: "Task deleted successfully!",
        description: `At ${new Date().toLocaleString()}`,
      });
    } else {
      addToast({
        className: "bg-destructive",
        title: "Error: Task deletion failed!",
        description: `At ${new Date().toLocaleString()}`,
      });
    }
  };

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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-red-400 justify-start p-2"
                onClick={handleDelete}
              >
                Delete Task
              </Button>
            </DialogTrigger>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
