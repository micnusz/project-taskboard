"use client";
import { TaskWithAuthor } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "./actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

export default function ActionsCell({ task }: { task: TaskWithAuthor }) {
  const addToast = useToastStore((state) => state.addToast);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
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
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href={`/task/${task.slug}`}>View Task</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault(); // Zapobiega zamknięciu menu
                  setIsDialogOpen(true);
                }}
              >
                Edit Task
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="min-h-[20rem] max-h-screen">
              <DialogHeader>
                <DialogTitle>Edit Task:</DialogTitle>
                <UpdatePost task={task} />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
          Delete Task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
